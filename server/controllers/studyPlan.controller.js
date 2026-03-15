const StudyPlan = require('../models/StudyPlan');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

// @desc    Get all study plans
// @route   GET /api/study-plans
// @access  Private
exports.getStudyPlans = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, priority, goal, search, public: isPublic } = req.query;

    // Build filter
    let filter = {};

    if (req.user.role === 'learner') {
      // Learners see their own plans and public plans
      filter.$or = [
        { user: req.user.id },
        { isPublic: true },
      ];
    } else {
      // Educators/coordinators can see all plans
      if (req.query.userId) filter.user = req.query.userId;
    }

    // Apply filters
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (goal && goal !== 'all') filter.goal = goal;
    if (isPublic === 'true') filter.isPublic = true;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const studyPlans = await StudyPlan.find(filter)
      .populate('user', 'firstName lastName profilePicture')
      .populate('courses.course', 'title thumbnail')
      .populate('sharedWith.user', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await StudyPlan.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: studyPlans.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: studyPlans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single study plan
// @route   GET /api/study-plans/:id
// @access  Private
exports.getStudyPlan = async (req, res, next) => {
  try {
    const studyPlan = await StudyPlan.findById(req.params.id)
      .populate('user', 'firstName lastName profilePicture bio')
      .populate('courses.course', 'title description thumbnail duration level')
      .populate('sharedWith.user', 'firstName lastName profilePicture')
      .populate('notes.user', 'firstName lastName');

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
      });
    }

    // Check permission
    const isOwner = studyPlan.user._id.toString() === req.user.id;
    const isShared = studyPlan.sharedWith.some(
      s => s.user._id.toString() === req.user.id
    );
    const isPublic = studyPlan.isPublic;
    const isCoordinator = req.user.role === 'coordinator';

    if (!isOwner && !isShared && !isPublic && !isCoordinator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this study plan',
      });
    }

    // Increment views if not owner
    if (!isOwner) {
      studyPlan.views += 1;
      await studyPlan.save();
    }

    res.status(200).json({
      success: true,
      data: studyPlan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create study plan
// @route   POST /api/study-plans
// @access  Private
exports.createStudyPlan = async (req, res, next) => {
  try {
    const studyPlanData = req.body;
    studyPlanData.user = req.user.id;

    // Validate courses if provided
    if (studyPlanData.courses && studyPlanData.courses.length > 0) {
      for (let i = 0; i < studyPlanData.courses.length; i++) {
        const course = await Course.findById(studyPlanData.courses[i].course);
        if (!course) {
          return res.status(400).json({
            success: false,
            message: `Course not found at index ${i}`,
          });
        }
        studyPlanData.courses[i].order = i + 1;
      }
    }

    const studyPlan = await StudyPlan.create(studyPlanData);

    // Add study plan to user
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { studyPlans: studyPlan._id },
    });

    res.status(201).json({
      success: true,
      data: studyPlan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update study plan
// @route   PUT /api/study-plans/:id
// @access  Private
exports.updateStudyPlan = async (req, res, next) => {
  try {
    let studyPlan = await StudyPlan.findById(req.params.id);

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
      });
    }

    // Check permission
    const isOwner = studyPlan.user.toString() === req.user.id;
    const hasEditPermission = studyPlan.sharedWith.some(
      s => s.user.toString() === req.user.id && s.permission === 'edit'
    );
    const isCoordinator = req.user.role === 'coordinator';

    if (!isOwner && !hasEditPermission && !isCoordinator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this study plan',
      });
    }

    const updates = req.body;

    studyPlan = await StudyPlan.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: studyPlan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete study plan
// @route   DELETE /api/study-plans/:id
// @access  Private
exports.deleteStudyPlan = async (req, res, next) => {
  try {
    const studyPlan = await StudyPlan.findById(req.params.id);

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
      });
    }

    // Check permission
    if (studyPlan.user.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this study plan',
      });
    }

    await studyPlan.remove();

    // Remove from user's study plans
    await User.findByIdAndUpdate(studyPlan.user, {
      $pull: { studyPlans: studyPlan._id },
    });

    res.status(200).json({
      success: true,
      message: 'Study plan deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course progress in study plan
// @route   PUT /api/study-plans/:id/courses/:courseId
// @access  Private
exports.updateCourseProgress = async (req, res, next) => {
  try {
    const { completed, notes } = req.body;
    const studyPlan = await StudyPlan.findById(req.params.id);

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
      });
    }

    // Check permission
    if (studyPlan.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this study plan',
      });
    }

    const courseEntry = studyPlan.courses.find(
      c => c.course.toString() === req.params.courseId
    );

    if (!courseEntry) {
      return res.status(404).json({
        success: false,
        message: 'Course not found in study plan',
      });
    }

    if (completed !== undefined) {
      courseEntry.completed = completed;
      if (completed) {
        courseEntry.completedAt = new Date();
      } else {
        courseEntry.completedAt = null;
      }
    }

    if (notes !== undefined) {
      courseEntry.notes = notes;
    }

    await studyPlan.save();

    // Check if milestone completed
    const allCoursesCompleted = studyPlan.courses.every(c => c.completed);
    if (allCoursesCompleted) {
      studyPlan.status = 'completed';
      studyPlan.completedAt = new Date();
      await studyPlan.save();

      await Notification.notify(req.user.id, {
        type: 'success',
        title: 'Study Plan Completed! 🎉',
        message: `Congratulations! You've completed your study plan: ${studyPlan.title}`,
        data: { studyPlanId: studyPlan._id },
      });
    }

    res.status(200).json({
      success: true,
      data: studyPlan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add note to study plan
// @route   POST /api/study-plans/:id/notes
// @access  Private
exports.addNote = async (req, res, next) => {
  try {
    const { content } = req.body;
    const studyPlan = await StudyPlan.findById(req.params.id);

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
      });
    }

    // Check permission
    const isOwner = studyPlan.user.toString() === req.user.id;
    const hasEditPermission = studyPlan.sharedWith.some(
      s => s.user.toString() === req.user.id && s.permission === 'edit'
    );

    if (!isOwner && !hasEditPermission) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add notes to this study plan',
      });
    }

    studyPlan.notes.push({
      content,
      user: req.user.id,
    });

    await studyPlan.save();

    res.status(201).json({
      success: true,
      data: studyPlan.notes[studyPlan.notes.length - 1],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Share study plan
// @route   POST /api/study-plans/:id/share
// @access  Private
exports.shareStudyPlan = async (req, res, next) => {
  try {
    const { userId, permission = 'view' } = req.body;
    const studyPlan = await StudyPlan.findById(req.params.id);

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
      });
    }

    // Check permission (only owner can share)
    if (studyPlan.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the owner can share this study plan',
      });
    }

    // Check if already shared
    const existingShare = studyPlan.sharedWith.find(
      s => s.user.toString() === userId
    );

    if (existingShare) {
      existingShare.permission = permission;
    } else {
      studyPlan.sharedWith.push({ user: userId, permission });
    }

    await studyPlan.save();

    // Notify user
    await Notification.notify(userId, {
      type: 'info',
      title: 'Study Plan Shared',
      message: `${req.user.firstName} ${req.user.lastName} shared a study plan with you: ${studyPlan.title}`,
      data: { studyPlanId: studyPlan._id },
    });

    res.status(200).json({
      success: true,
      data: studyPlan,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark
// @route   POST /api/study-plans/:id/bookmark
// @access  Private
exports.toggleBookmark = async (req, res, next) => {
  try {
    const studyPlan = await StudyPlan.findById(req.params.id);

    if (!studyPlan) {
      return res.status(404).json({
        success: false,
        message: 'Study plan not found',
      });
    }

    const bookmarkIndex = studyPlan.bookmarks.findIndex(
      b => b.toString() === req.user.id
    );

    if (bookmarkIndex === -1) {
      studyPlan.bookmarks.push(req.user.id);
      studyPlan.bookmarkCount += 1;
    } else {
      studyPlan.bookmarks.splice(bookmarkIndex, 1);
      studyPlan.bookmarkCount -= 1;
    }

    await studyPlan.save();

    res.status(200).json({
      success: true,
      data: {
        bookmarked: bookmarkIndex === -1,
        count: studyPlan.bookmarkCount,
      },
    });
  } catch (error) {
    next(error);
  }
};