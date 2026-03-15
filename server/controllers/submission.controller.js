const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Grade = require('../models/Grade');
const Notification = require('../models/Notification');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private
exports.getSubmissions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { assignmentId, studentId, status, courseId } = req.query;

    // Build filter based on user role
    let filter = {};

    if (req.user.role === 'learner') {
      // Learners can only see their own submissions
      filter.student = req.user.id;
    } else if (req.user.role === 'educator') {
      // Educators see submissions from courses they teach
      const courses = await Course.find({ instructor: req.user.id });
      const courseIds = courses.map(c => c._id);
      filter.course = { $in: courseIds };
    }

    // Apply query filters
    if (assignmentId) filter.assignment = assignmentId;
    if (studentId && req.user.role !== 'learner') filter.student = studentId;
    if (status) filter.status = status;
    if (courseId) filter.course = courseId;

    const submissions = await Submission.find(filter)
      .populate('student', 'firstName lastName profilePicture email')
      .populate('assignment', 'title totalPoints')
      .populate('course', 'title code')
      .populate('grade.gradedBy', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort('-submittedAt');

    const total = await Submission.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: submissions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single submission
// @route   GET /api/submissions/:id
// @access  Private
exports.getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('student', 'firstName lastName profilePicture email')
      .populate('assignment', 'title description totalPoints rubric')
      .populate('course', 'title instructor')
      .populate('grade.gradedBy', 'firstName lastName')
      .populate('flags.raisedBy', 'firstName lastName')
      .populate('flags.resolvedBy', 'firstName lastName');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    // Check permission
    const isOwner = submission.student._id.toString() === req.user.id;
    const course = await Course.findById(submission.course);
    const isInstructor = course?.instructor?.toString() === req.user.id;
    const isCoordinator = req.user.role === 'coordinator';

    if (!isOwner && !isInstructor && !isCoordinator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this submission',
      });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create submission
// @route   POST /api/submissions
// @access  Private/Learner
exports.createSubmission = async (req, res, next) => {
  try {
    const { assignmentId, comments } = req.body;

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Check if user is enrolled in the course
    const course = await Course.findById(assignment.course);
    const isEnrolled = course.enrolledStudents.some(
      e => e.student.toString() === req.user.id
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in the course to submit',
      });
    }

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      assignment: assignmentId,
      student: req.user.id,
    });

    if (existingSubmission) {
      // Check if resubmission is allowed
      if (existingSubmission.attemptNumber >= assignment.attemptsAllowed) {
        return res.status(400).json({
          success: false,
          message: `Maximum attempts (${assignment.attemptsAllowed}) reached`,
        });
      }

      // Save to revision history before updating
      existingSubmission.revisionHistory.push({
        submittedAt: existingSubmission.submittedAt,
        files: existingSubmission.files,
        comments: existingSubmission.comments,
        attemptNumber: existingSubmission.attemptNumber,
      });

      existingSubmission.attemptNumber += 1;
      existingSubmission.status = 'submitted';
      existingSubmission.submittedAt = new Date();
      
      if (comments) existingSubmission.comments = comments;

      // Handle file uploads
      if (req.files && req.files.length > 0) {
        const files = [];
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'submissions',
          });
          files.push({
            filename: file.filename,
            originalName: file.originalname,
            url: result.secure_url,
            size: file.size,
            mimeType: file.mimetype,
          });
        }
        existingSubmission.files = files;
      }

      await existingSubmission.save();

      return res.status(200).json({
        success: true,
        message: 'Submission updated successfully',
        data: existingSubmission,
      });
    }

    // New submission
    const submissionData = {
      assignment: assignmentId,
      student: req.user.id,
      course: assignment.course,
      comments,
      attemptNumber: 1,
    };

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const files = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'submissions',
        });
        files.push({
          filename: file.filename,
          originalName: file.originalname,
          url: result.secure_url,
          size: file.size,
          mimeType: file.mimetype,
        });
      }
      submissionData.files = files;
    }

    const submission = await Submission.create(submissionData);

    // Notify instructor
    await Notification.notify(course.instructor, {
      type: 'assignment_submitted',
      title: 'New Assignment Submission',
      message: `${req.user.firstName} ${req.user.lastName} has submitted "${assignment.title}"`,
      data: {
        assignmentId: assignment._id,
        submissionId: submission._id,
        courseId: course._id,
      },
    });

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update submission
// @route   PUT /api/submissions/:id
// @access  Private/Learner
exports.updateSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    // Check ownership
    if (submission.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this submission',
      });
    }

    // Check if already graded
    if (submission.status === 'graded') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a graded submission',
      });
    }

    const { comments } = req.body;

    // Save to revision history
    submission.revisionHistory.push({
      submittedAt: submission.submittedAt,
      files: submission.files,
      comments: submission.comments,
      attemptNumber: submission.attemptNumber,
    });

    // Update fields
    if (comments) submission.comments = comments;
    submission.status = 'submitted';
    submission.submittedAt = new Date();

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      const files = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'submissions',
        });
        files.push({
          filename: file.filename,
          originalName: file.originalname,
          url: result.secure_url,
          size: file.size,
          mimeType: file.mimetype,
        });
      }
      submission.files = files;
    }

    await submission.save();

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private/Learner
exports.deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    // Check ownership
    if (submission.student.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this submission',
      });
    }

    // Check if already graded
    if (submission.status === 'graded' && req.user.role !== 'coordinator') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a graded submission',
      });
    }

    // Delete files from cloudinary
    if (submission.files && submission.files.length > 0) {
      for (const file of submission.files) {
        if (file.url) {
          const publicId = file.url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`submissions/${publicId}`);
        }
      }
    }

    await submission.remove();

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my submissions
// @route   GET /api/submissions/me
// @access  Private/Learner
exports.getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ student: req.user.id })
      .populate('assignment', 'title dueDate totalPoints')
      .populate('course', 'title')
      .sort('-submittedAt');

    // Group by status
    const grouped = {
      graded: submissions.filter(s => s.status === 'graded'),
      pending: submissions.filter(s => s.status === 'submitted'),
      late: submissions.filter(s => s.status === 'late'),
      draft: submissions.filter(s => s.status === 'draft'),
    };

    // Calculate statistics
    const stats = {
      total: submissions.length,
      graded: grouped.graded.length,
      pending: grouped.pending.length,
      late: grouped.late.length,
      averageGrade: grouped.graded.reduce((sum, s) => sum + (s.grade?.score || 0), 0) / grouped.graded.length || 0,
    };

    res.status(200).json({
      success: true,
      data: {
        submissions,
        grouped,
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Flag submission
// @route   POST /api/submissions/:id/flag
// @access  Private/Educator
exports.flagSubmission = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    submission.flags.push({
      type: 'plagiarism',
      description: reason,
      raisedBy: req.user.id,
    });

    submission.moderation.flaggedCount += 1;
    await submission.save();

    // Notify coordinator
    const coordinators = await User.find({ role: 'coordinator' });
    for (const coordinator of coordinators) {
      await Notification.notify(coordinator._id, {
        type: 'warning',
        title: 'Submission Flagged',
        message: `A submission has been flagged for: ${reason}`,
        data: {
          submissionId: submission._id,
          flaggedBy: req.user.id,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission flagged successfully',
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve flag
// @route   PUT /api/submissions/:id/resolve-flag/:flagId
// @access  Private/Coordinator
exports.resolveFlag = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    const flag = submission.flags.id(req.params.flagId);
    if (!flag) {
      return res.status(404).json({
        success: false,
        message: 'Flag not found',
      });
    }

    flag.resolved = true;
    flag.resolvedAt = new Date();
    flag.resolvedBy = req.user.id;

    submission.moderation.flaggedCount = Math.max(0, submission.moderation.flaggedCount - 1);
    await submission.save();

    res.status(200).json({
      success: true,
      message: 'Flag resolved successfully',
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};