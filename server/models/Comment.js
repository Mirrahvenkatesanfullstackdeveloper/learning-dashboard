const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      maxlength: [5000, 'Comment cannot exceed 5000 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    discussion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discussion',
      required: [true, 'Discussion is required'],
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    replies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    }],
    replyCount: {
      type: Number,
      default: 0,
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      likedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    likeCount: {
      type: Number,
      default: 0,
    },
    attachments: [{
      filename: String,
      originalName: String,
      url: String,
      size: Number,
      mimeType: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    mentions: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      notified: {
        type: Boolean,
        default: false,
      },
    }],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editHistory: [{
      content: String,
      editedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isBestAnswer: {
      type: Boolean,
      default: false,
    },
    markedAsBestBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    markedAsBestAt: Date,
    moderation: {
      isApproved: {
        type: Boolean,
        default: true,
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      approvedAt: Date,
      flaggedCount: {
        type: Number,
        default: 0,
      },
      flags: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        reason: String,
        flaggedAt: {
          type: Date,
          default: Date.now,
        },
      }],
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Update discussion activity when comment is created
commentSchema.post('save', async function() {
  const Discussion = mongoose.model('Discussion');
  await Discussion.findByIdAndUpdate(this.discussion, {
    lastActivity: new Date(),
    lastCommentAt: new Date(),
    lastCommentBy: this.author,
    $inc: { commentCount: 1 },
  });
  
  // Handle mentions
  if (this.mentions && this.mentions.length > 0) {
    const Notification = mongoose.model('Notification');
    for (const mention of this.mentions) {
      await Notification.notify(mention.user, {
        type: 'mention',
        title: 'You were mentioned in a comment',
        message: `${this.author.firstName} ${this.author.lastName} mentioned you in a comment`,
        data: {
          discussionId: this.discussion,
          commentId: this._id,
          authorId: this.author,
        },
      });
    }
  }
});

// Update reply count for parent comment
commentSchema.post('save', async function() {
  if (this.parentComment) {
    await Comment.findByIdAndUpdate(this.parentComment, {
      $inc: { replyCount: 1 },
      $push: { replies: this._id },
    });
  }
});

// Toggle like
commentSchema.methods.toggleLike = async function(userId) {
  const likeIndex = this.likes.findIndex(l => l.user.toString() === userId.toString());
  
  if (likeIndex === -1) {
    this.likes.push({ user: userId });
    this.likeCount += 1;
  } else {
    this.likes.splice(likeIndex, 1);
    this.likeCount -= 1;
  }
  
  await this.save();
  return this;
};

// Edit comment
commentSchema.methods.edit = async function(newContent, userId) {
  this.editHistory.push({
    content: this.content,
    editedAt: new Date(),
  });
  
  this.content = newContent;
  this.isEdited = true;
  
  await this.save();
  return this;
};

// Mark as best answer
commentSchema.methods.markAsBestAnswer = async function(userId) {
  this.isBestAnswer = true;
  this.markedAsBestBy = userId;
  this.markedAsBestAt = new Date();
  
  await this.save();
  
  // Update discussion
  const Discussion = mongoose.model('Discussion');
  await Discussion.findByIdAndUpdate(this.discussion, {
    isResolved: true,
    resolvedBy: userId,
    resolvedAt: new Date(),
  });
  
  return this;
};

// Check if user liked
commentSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(l => l.user.toString() === userId.toString());
};

// Get reply count
commentSchema.virtual('totalReplies').get(function() {
  return this.replies ? this.replies.length : 0;
});

// Index for efficient querying
commentSchema.index({ discussion: 1, createdAt: 1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ isBestAnswer: 1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;