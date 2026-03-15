const Discussion = require('../models/Discussion');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

// @desc    Get all discussions
// @route   GET /api/discussions
// @access  Private
exports.getDiscussions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { 
      courseId, 
      assignmentId, 
      type, 
      category, 
      search,
      pinned,
      resolved 
    } = req.query;

    // Build filter
    let filter = {};

    if (courseId) filter.course = courseId;
    if (assignmentId) filter.assignment = assignmentId;
    if (type && type !== 'all') filter.type = type;
    if (category && category !== 'all') filter.category = category;
    if (pinned === 'true') filter.isPinned = true;
    if (resolved === 'true') filter.isResolved = true;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const discussions = await Discussion.find(filter)
      .populate('author', 'firstName lastName profilePicture')
      .populate('lastCommentBy', 'firstName lastName')
      .populate('resolvedBy', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort({ isPinned: -1, lastActivity: -1 });

    const total = await Discussion.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: discussions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: discussions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single discussion
// @route   GET /api/discussions/:id
// @access  Private
exports.getDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('author', 'firstName lastName profilePicture')
      .populate('lastCommentBy', 'firstName lastName')
      .populate('resolvedBy', 'firstName lastName')
      .populate('likes.user', 'firstName lastName')
      .populate('bookmarks.user', 'firstName lastName')
      .populate('mentions.user', 'firstName lastName')
      .populate('moderation.approvedBy', 'firstName lastName')
      .populate('moderation.flags.user', 'firstName lastName');

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    // Get comments
    const comments = await Comment.find({ discussion: discussion._id })
      .populate('author', 'firstName lastName profilePicture')
      .populate('likes.user', 'firstNameLastName')
      .populate('mentions.user', 'firstName lastName')
      .populate('markedAsBestBy', 'firstName lastName')
      .sort('createdAt');

    // Increment view count
    await discussion.incrementViews();

    res.status(200).json({
      success: true,
      data: {
        ...discussion.toObject(),
        comments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create discussion
// @route   POST /api/discussions
// @access  Private
exports.createDiscussion = async (req, res, next) => {
  try {
    const discussionData = req.body;
    discussionData.author = req.user.id;

    // Extract mentions from content
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    const mentions = [];
    while ((match = mentionRegex.exec(discussionData.content)) !== null) {
      mentions.push({ user: match[2] });
    }
    discussionData.mentions = mentions;

    const discussion = await Discussion.create(discussionData);

    // Notify mentions
    for (const mention of mentions) {
      await Notification.notify(mention.user, {
        type: 'mention',
        title: 'You were mentioned',
        message: `${req.user.firstName} ${req.user.lastName} mentioned you in a discussion`,
        data: {
          discussionId: discussion._id,
          authorId: req.user.id,
        },
      });
    }

    res.status(201).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update discussion
// @route   PUT /api/discussions/:id
// @access  Private
exports.updateDiscussion = async (req, res, next) => {
  try {
    let discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    // Check permission
    if (discussion.author.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this discussion',
      });
    }

    discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete discussion
// @route   DELETE /api/discussions/:id
// @access  Private
exports.deleteDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    // Check permission
    if (discussion.author.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this discussion',
      });
    }

    // Delete all comments
    await Comment.deleteMany({ discussion: discussion._id });

    await discussion.remove();

    res.status(200).json({
      success: true,
      message: 'Discussion deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on discussion
// @route   POST /api/discussions/:id/like
// @access  Private
exports.toggleLike = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    await discussion.toggleLike(req.user.id);

    // Notify author if liked
    if (discussion.author.toString() !== req.user.id) {
      const likeIndex = discussion.likes.findIndex(
        l => l.user.toString() === req.user.id
      );
      
      if (likeIndex !== -1) {
        await Notification.notify(discussion.author, {
          type: 'like',
          title: 'Someone liked your post',
          message: `${req.user.firstName} ${req.user.lastName} liked your discussion`,
          data: {
            discussionId: discussion._id,
            userId: req.user.id,
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        liked: discussion.isLikedBy(req.user.id),
        count: discussion.likeCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark
// @route   POST /api/discussions/:id/bookmark
// @access  Private
exports.toggleBookmark = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    await discussion.toggleBookmark(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        bookmarked: discussion.isBookmarkedBy(req.user.id),
        count: discussion.bookmarkCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Pin discussion
// @route   PUT /api/discussions/:id/pin
// @access  Private/Educator
exports.pinDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    discussion.isPinned = !discussion.isPinned;
    await discussion.save();

    res.status(200).json({
      success: true,
      data: { isPinned: discussion.isPinned },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lock discussion
// @route   PUT /api/discussions/:id/lock
// @access  Private/Educator
exports.lockDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    discussion.isLocked = !discussion.isLocked;
    await discussion.save();

    res.status(200).json({
      success: true,
      data: { isLocked: discussion.isLocked },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark as resolved
// @route   PUT /api/discussions/:id/resolve
// @access  Private
exports.resolveDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    discussion.isResolved = true;
    discussion.resolvedBy = req.user.id;
    discussion.resolvedAt = new Date();
    await discussion.save();

    res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report discussion
// @route   POST /api/discussions/:id/report
// @access  Private
exports.reportDiscussion = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found',
      });
    }

    discussion.moderation.flags.push({
      user: req.user.id,
      reason,
    });
    discussion.moderation.flaggedCount += 1;
    await discussion.save();

    // Notify coordinators
    const coordinators = await User.find({ role: 'coordinator' });
    for (const coordinator of coordinators) {
      await Notification.notify(coordinator._id, {
        type: 'warning',
        title: 'Discussion Reported',
        message: `A discussion has been reported for: ${reason}`,
        data: {
          discussionId: discussion._id,
          reportedBy: req.user.id,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Discussion reported successfully',
    });
  } catch (error) {
    next(error);
  }
};