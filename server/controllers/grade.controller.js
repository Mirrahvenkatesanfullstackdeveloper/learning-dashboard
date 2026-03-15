const Grade = require('../models/Grade');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

// @desc    Get all grades
// @route   GET /api/grades
// @access  Private
exports.getGrades = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { courseId, studentId, semester, year, status } = req.query;

    // Build filter based on user role
    let filter = {};

    if (req.user.role === 'learner') {
      // Learners can only see their own grades
      filter.student = req.user.id;
    } else if (req.user.role === 'educator') {
      // Educators see grades from courses they teach
      const courses = await Course.find({ instructor: req.user.id });
      const courseIds = courses.map(c => c._id);
      filter.course = { $in: courseIds };
    }

    // Apply query filters
    if (courseId) filter.course = courseId;
    if (studentId && req.user.role !== 'learner') filter.student = studentId;
    if (semester) filter.semester = semester;
    if (year) filter.year = year;
    if (status) filter['overall.status'] = status;

    const grades = await Grade.find(filter)
      .populate('student', 'firstName lastName profilePicture email')
      .populate('course', 'title code credits')
      .populate('items.gradedBy', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await Grade.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: grades.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: grades,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single grade
// @route   GET /api/grades/:id
// @access  Private
exports.getGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('student', 'firstName lastName profilePicture email')
      .populate('course', 'title code credits instructor')
      .populate('items.gradedBy', 'firstName lastName')
      .populate('finalizedBy', 'firstName lastName');

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade record not found',
      });
    }

    // Check permission
    const isOwner = grade.student._id.toString() === req.user.id;
    const course = await Course.findById(grade.course);
    const isInstructor = course?.instructor?.toString() === req.user.id;
    const isCoordinator = req.user.role === 'coordinator';

    if (!isOwner && !isInstructor && !isCoordinator) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this grade',
      });
    }

    res.status(200).json({
      success: true,
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create grade record
// @route   POST /api/grades
// @access  Private/Educator
exports.createGrade = async (req, res, next) => {
  try {
    const { studentId, courseId, semester, year } = req.body;

    // Check if grade already exists
    const existingGrade = await Grade.findOne({
      student: studentId,
      course: courseId,
      semester,
      year,
    });

    if (existingGrade) {
      return res.status(400).json({
        success: false,
        message: 'Grade record already exists for this student and course',
      });
    }

    // Verify course access
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create grades for this course',
      });
    }

    const grade = await Grade.create({
      student: studentId,
      course: courseId,
      semester,
      year,
      items: [],
    });

    res.status(201).json({
      success: true,
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update grade
// @route   PUT /api/grades/:id
// @access  Private/Educator
exports.updateGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade record not found',
      });
    }

    // Check permission
    const course = await Course.findById(grade.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this grade',
      });
    }

    // Check if finalized
    if (grade.isFinalized) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a finalized grade',
      });
    }

    const updates = req.body;

    // Save to history
    grade.gradeHistory.push({
      items: grade.items,
      overall: grade.overall,
      updatedAt: new Date(),
      updatedBy: req.user.id,
      reason: updates.reason || 'Manual update',
    });

    // Update fields
    if (updates.items) grade.items = updates.items;
    if (updates.attendance) grade.attendance = updates.attendance;
    if (updates.participation) grade.participation = updates.participation;
    if (updates.extraCredit) grade.extraCredit = updates.extraCredit;
    if (updates.comments) grade.comments = updates.comments;

    await grade.save();

    res.status(200).json({
      success: true,
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add grade item
// @route   POST /api/grades/:id/items
// @access  Private/Educator
exports.addGradeItem = async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade record not found',
      });
    }

    // Check permission
    const course = await Course.findById(grade.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this grade',
      });
    }

    const itemData = req.body;

    // If item is from a submission, get submission data
    if (itemData.type === 'assignment' && itemData.itemId) {
      const submission = await Submission.findById(itemData.itemId);
      if (submission && submission.grade) {
        itemData.score = submission.grade.score;
        itemData.totalPoints = submission.grade.totalPoints;
        itemData.gradedAt = submission.grade.gradedAt;
        itemData.gradedBy = submission.grade.gradedBy;
        itemData.feedback = submission.grade.feedback;
      }
    }

    grade.items.push(itemData);
    await grade.save();

    res.status(200).json({
      success: true,
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update grade item
// @route   PUT /api/grades/:id/items/:itemId
// @access  Private/Educator
exports.updateGradeItem = async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade record not found',
      });
    }

    // Check permission
    const course = await Course.findById(grade.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this grade',
      });
    }

    const item = grade.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Grade item not found',
      });
    }

    Object.assign(item, req.body);
    await grade.save();

    res.status(200).json({
      success: true,
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete grade item
// @route   DELETE /api/grades/:id/items/:itemId
// @access  Private/Educator
exports.deleteGradeItem = async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade record not found',
      });
    }

    // Check permission
    const course = await Course.findById(grade.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this grade',
      });
    }

    grade.items.id(req.params.itemId).remove();
    await grade.save();

    res.status(200).json({
      success: true,
      message: 'Grade item removed',
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Finalize grade
// @route   PUT /api/grades/:id/finalize
// @access  Private/Educator
exports.finalizeGrade = async (req, res, next) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade record not found',
      });
    }

    // Check permission
    const course = await Course.findById(grade.course);
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to finalize this grade',
      });
    }

    await grade.finalize(req.user.id);

    // Notify student
    await Notification.notify(grade.student, {
      type: 'grade_finalized',
      title: 'Grade Finalized',
      message: `Your final grade for ${course.title} is now available.`,
      data: {
        gradeId: grade._id,
        courseId: course._id,
      },
    });

    res.status(200).json({
      success: true,
      data: grade,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get grade analytics
// @route   GET /api/grades/analytics/:courseId
// @access  Private/Educator
exports.getGradeAnalytics = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const grades = await Grade.find({ 
      course: courseId,
      isFinalized: true,
    }).populate('student', 'firstName lastName');

    if (grades.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          message: 'No finalized grades found',
        },
      });
    }

    // Calculate statistics
    const percentages = grades.map(g => g.overall.percentage);
    const letterGrades = grades.map(g => g.overall.letterGrade);

    const distribution = {};
    letterGrades.forEach(grade => {
      distribution[grade] = (distribution[grade] || 0) + 1;
    });

    const stats = {
      total: grades.length,
      average: percentages.reduce((a, b) => a + b, 0) / percentages.length,
      median: this.calculateMedian(percentages),
      highest: Math.max(...percentages),
      lowest: Math.min(...percentages),
      distribution,
      gradePoints: grades.map(g => ({
        student: `${g.student.firstName} ${g.student.lastName}`,
        percentage: g.overall.percentage,
        letterGrade: g.overall.letterGrade,
        gpa: g.overall.gpa,
      })),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate median
calculateMedian = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
};