const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Discussion title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Discussion content is required'],
      maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
    },
    studyPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudyPlan',
    },
    type: {
      type: String,
      enum: [
        'general',
        'question',
        'announcement',
        'resource',
        'idea',
        'help',
        'feedback',
      ],
      default: 'general',
    },
    category: {
      type: String,
      enum: [
        'course',
        'assignment',
        'study-group',
        'technical',
        'career',
        'social',
      ],
      default: 'course',
    },
    tags: [String],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    isAnnouncement: {
      type: Boolean,
      default: false,
    },
    isFAQ: {
      type: Boolean,
      default: false,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: Date,
    views: {
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
    bookmarks: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      bookmarkedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    bookmarkCount: {
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
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    lastCommentAt: Date,
    lastCommentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    settings: {
      allowComments: {
        type: Boolean,
        default: true,
      },
      allowLikes: {
        type: Boolean,
        default: true,
      },
      allowAttachments: {
        type: Boolean,
        default: true,
      },
      requireApproval: {
        type: Boolean,
        default: false,
      },
      notifyMentions: {
        type: Boolean,
        default: true,
      },
    },
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for comments
discussionSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'discussion',
  options: { sort: { createdAt: 1 } },
});

// Increment view count
discussionSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
  return this;
};

// Toggle like
discussionSchema.methods.toggleLike = async function(userId) {
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

// Toggle bookmark
discussionSchema.methods.toggleBookmark = async function(userId) {
  const bookmarkIndex = this.bookmarks.findIndex(b => b.user.toString() === userId.toString());
  
  if (bookmarkIndex === -1) {
    this.bookmarks.push({ user: userId });
    this.bookmarkCount += 1;
  } else {
    this.bookmarks.splice(bookmarkIndex, 1);
    this.bookmarkCount -= 1;
  }
  
  await this.save();
  return this;
};

// Check if user liked
discussionSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(l => l.user.toString() === userId.toString());
};

// Check if user bookmarked
discussionSchema.methods.isBookmarkedBy = function(userId) {
  return this.bookmarks.some(b => b.user.toString() === userId.toString());
};

// Update last activity
discussionSchema.methods.updateLastActivity = async function(userId) {
  this.lastActivity = new Date();
  this.lastCommentAt = new Date();
  this.lastCommentBy = userId;
  this.commentCount = await mongoose.model('Comment').countDocuments({ discussion: this._id });
  await this.save();
};

// Index for search
discussionSchema.index({ 
  title: 'text', 
  content: 'text', 
  tags: 'text',
});

// Index for efficient querying
discussionSchema.index({ course: 1, isPinned: -1, lastActivity: -1 });
discussionSchema.index({ author: 1, createdAt: -1 });
discussionSchema.index({ type: 1, createdAt: -1 });
discussionSchema.index({ isPinned: -1, lastActivity: -1 });

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;