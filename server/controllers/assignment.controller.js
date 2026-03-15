const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const Notification = require('../models/Notification');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
exports.getAssignments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { 
      courseId, 
      type, 
      status, 
      search,
      upcoming 
    } = req.query;

    // Build filter based on user role
    let filter = {};

    if (req.user.role === 'learner') {
      // Learners see assignments from their enrolled courses
      const user = await User.findById(req.user.id).populate('enrolledCourses');
      const courseIds = user.enrolledCourses.map(c => c._id);
      filter.course = { $in: courseIds };
    } else if (req.user.role === 'educator') {
      // Educators see assignments from courses they teach
      const courses = await Course.find({ instructor: req.user.id });
      filter.course = { $in: courses.map(c => c._id) };
    }

    // Apply filters
    if (courseId) filter.course = courseId;
    if (type && type !== 'all') filter.type = type;
    
    if (status === 'active') {
      filter.dueDate = { $gte: new Date() };
    } else if (status === 'past') {
      filter.dueDate = { $lt: new Date() };
    }

    if (upcoming) {
      filter.dueDate = {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const assignments = await Assignment.find(filter)
      .populate('course', 'title code')
      .populate('createdBy', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    // Get submission status for learners
    if (req.user.role === 'learner') {
      const submissions = await Submission.find({
        assignment: { $in: assignments.map(a => a._id) },
        student: req.user.id,
      });

      const assignmentsWithStatus = assignments.map(assignment => {
        const submission = submissions.find(
          s => s.assignment.toString() === assignment._id.toString()
        );
        return {
          ...assignment.toObject(),
          submission: submission ? {
            status: submission.status,
            submittedAt: submission.submittedAt,
            grade: submission.grade,
          } : null,
        };
      });
      
      return res.status(200).json({
        success: true,
        count: assignmentsWithStatus.length,
        data: assignmentsWithStatus,
      });
    }

    const total = await Assignment.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: assignments.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('course', 'title instructor')
      .populate('createdBy', 'firstName lastName')
      .populate('gradedBy', 'firstName lastName');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Check if user has access
    const course = await Course.findById(assignment.course);
    const isEnrolled = course.enrolledStudents.some(
      e => e.student.toString() === req.user.id
    );
    const isInstructor = course.instructor.toString() === req.user.id;
    const isCoordinator = req.user.role === 'coordinator';

    if (!isEnrolled && !isInstructor && !isCoordinator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this assignment',
      });
    }

    // Get user's submission if learner
    let userSubmission = null;
    if (req.user.role === 'learner') {
      userSubmission = await Submission.findOne({
        assignment: assignment._id,
        student: req.user.id,
      });
    }

    // Get all submissions if educator
    let submissions = null;
    if (isInstructor || isCoordinator) {
      submissions = await Submission.find({ assignment: assignment._id })
        .populate('student', 'firstName lastName profilePicture')
        .sort('-submittedAt');
    }

    res.status(200).json({
      success: true,
      data: {
        ...assignment.toObject(),
        userSubmission,
        submissions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private/Educator
exports.createAssignment = async (req, res, next) => {
  try {
    const assignmentData = req.body;

    // Verify course ownership
    const course = await Course.findById(assignmentData.course);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create assignments for this course',
      });
    }

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      const attachments = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'assignments/attachments',
        });
        attachments.push({
          name: file.originalname,
          url: result.secure_url,
          type: file.mimetype,
          size: file.size,
        });
      }
      assignmentData.attachments = attachments;
    }

    assignmentData.createdBy = req.user.id;

    const assignment = await Assignment.create(assignmentData);

    // Notify enrolled students
    for (const enrollment of course.enrolledStudents) {
      await Notification.notify(enrollment.student, {
        type: 'assignment_created',
        title: 'New Assignment Posted',
        message: `A new assignment "${assignment.title}" has been posted in ${course.title}`,
        data: { 
          assignmentId: assignment._id,
          courseId: course._id,
        },
      });
    }

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private/Educator
exports.updateAssignment = async (req, res, next) => {
  try {
    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Check permission
    const course = await Course.findById(assignment.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this assignment',
      });
    }

    const updates = req.body;

    // Handle new attachments
    if (req.files && req.files.length > 0) {
      const attachments = [...(assignment.attachments || [])];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'assignments/attachments',
        });
        attachments.push({
          name: file.originalname,
          url: result.secure_url,
          type: file.mimetype,
          size: file.size,
        });
      }
      updates.attachments = attachments;
    }

    assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    // Notify students of update
    if (updates.dueDate || updates.instructions) {
      const course = await Course.findById(assignment.course);
      for (const enrollment of course.enrolledStudents) {
        await Notification.notify(enrollment.student, {
          type: 'assignment_updated',
          title: 'Assignment Updated',
          message: `The assignment "${assignment.title}" has been updated`,
          data: { 
            assignmentId: assignment._id,
            courseId: course._id,
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Coordinator
exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Check if there are submissions
    const submissionCount = await Submission.countDocuments({ assignment: assignment._id });
    if (submissionCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete assignment with existing submissions',
      });
    }

    // Delete attachments
    if (assignment.attachments && assignment.attachments.length > 0) {
      for (const attachment of assignment.attachments) {
        if (attachment.url) {
          const publicId = attachment.url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`assignments/attachments/${publicId}`);
        }
      }
    }

    await assignment.remove();

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get assignment submissions
// @route   GET /api/assignments/:id/submissions
// @access  Private/Educator
exports.getSubmissions = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found',
      });
    }

    // Check permission
    const course = await Course.findById(assignment.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view submissions',
      });
    }

    const submissions = await Submission.find({ assignment: assignment._id })
      .populate('student', 'firstName lastName profilePicture email')
      .sort('-submittedAt');

    // Calculate statistics
    const stats = {
      total: submissions.length,
      submitted: submissions.filter(s => s.status === 'submitted').length,
      graded: submissions.filter(s => s.status === 'graded').length,
      late: submissions.filter(s => s.isLate).length,
      averageScore: submissions
        .filter(s => s.grade?.score)
        .reduce((sum, s) => sum + s.grade.score, 0) / submissions.length || 0,
    };

    res.status(200).json({
      success: true,
      data: {
        assignment,
        submissions,
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grade submission
// @route   POST /api/assignments/:id/grade/:submissionId
// @access  Private/Educator
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { score, feedback, rubricScores } = req.body;

    const submission = await Submission.findById(submissionId)
      .populate('assignment')
      .populate('student');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    // Check permission
    const course = await Course.findById(submission.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to grade this submission',
      });
    }

    // Update submission with grade
    submission.grade = {
      score,
      totalPoints: submission.assignment.totalPoints,
      feedback,
      rubricScores,
      gradedBy: req.user.id,
      gradedAt: new Date(),
    };
    submission.status = 'graded';
    await submission.save();

    // Notify student
    await Notification.notify(submission.student._id, {
      type: 'assignment_graded',
      title: 'Assignment Graded',
      message: `Your submission for "${submission.assignment.title}" has been graded. Score: ${score}/${submission.assignment.totalPoints}`,
      data: { 
        assignmentId: submission.assignment._id,
        submissionId: submission._id,
      },
    });

    // Update assignment statistics
    await submission.assignment.updateStatistics();

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming deadlines
// @route   GET /api/assignments/upcoming
// @access  Private
exports.getUpcomingDeadlines = async (req, res, next) => {
  try {
    let assignments = [];

    if (req.user.role === 'learner') {
      // Get assignments from enrolled courses
      const user = await User.findById(req.user.id).populate('enrolledCourses');
      const courseIds = user.enrolledCourses.map(c => c._id);

      assignments = await Assignment.find({
        course: { $in: courseIds },
        dueDate: { $gte: new Date() },
      })
        .populate('course', 'title')
        .sort('dueDate')
        .limit(5);

      // Get submission status
      const submissions = await Submission.find({
        assignment: { $in: assignments.map(a => a._id) },
        student: req.user.id,
      });

      assignments = assignments.map(assignment => {
        const submission = submissions.find(
          s => s.assignment.toString() === assignment._id.toString()
        );
        return {
          ...assignment.toObject(),
          submitted: !!submission,
          submissionStatus: submission?.status,
        };
      });
    } else {
      // Educators see assignments they need to grade
      const courses = await Course.find({ instructor: req.user.id });
      const courseIds = courses.map(c => c._id);

      const pendingSubmissions = await Submission.aggregate([
        {
          $match: {
            course: { $in: courseIds },
            status: { $in: ['submitted', 'late'] },
          },
        },
        {
          $group: {
            _id: '$assignment',
            count: { $sum: 1 },
          },
        },
      ]);

      assignments = await Assignment.find({
        _id: { $in: pendingSubmissions.map(p => p._id) },
      })
        .populate('course', 'title')
        .sort('dueDate');

      assignments = assignments.map(assignment => {
        const pending = pendingSubmissions.find(
          p => p._id.toString() === assignment._id.toString()
        );
        return {
          ...assignment.toObject(),
          pendingGrading: pending?.count || 0,
        };
      });
    }

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};