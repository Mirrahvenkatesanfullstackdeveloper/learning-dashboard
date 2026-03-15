const User = require('../models/User');
const Course = require('../models/Course');
const StudyPlan = require('../models/StudyPlan');
const Grade = require('../models/Grade');
const Notification = require('../models/Notification');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../utils/sendEmail');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Coordinator
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { role, status, search } = req.query;

    // Build filter
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .populate('enrolledCourses', 'title')
      .populate('teachingCourses', 'title')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses')
      .populate('teachingCourses')
      .populate('studyPlans');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get additional stats
    const stats = {
      totalCourses: user.enrolledCourses.length,
      completedCourses: await Grade.countDocuments({ 
        student: user._id, 
        'overall.status': 'completed' 
      }),
      averageGrade: await this.getAverageGrade(user._id),
      studyStreak: await this.calculateStudyStreak(user._id),
      achievements: await this.getUserAchievements(user._id),
    };

    res.status(200).json({
      success: true,
      data: { ...user.toObject(), stats },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Coordinator
exports.createUser = async (req, res, next) => {
  try {
    const { email, password, ...userData } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      ...userData,
    });

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send welcome email
    await sendEmail({
      email: user.email,
      subject: 'Welcome to Learning Dashboard',
      template: 'welcome',
      data: {
        name: `${user.firstName} ${user.lastName}`,
        loginUrl: `${process.env.CLIENT_URL}/login`,
      },
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res, next) => {
  try {
    const updates = req.body;
    
    // Remove sensitive fields
    delete updates.password;
    delete updates.emailVerificationToken;
    delete updates.passwordResetToken;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Create notification
    await Notification.notify(user._id, {
      type: 'info',
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated.',
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Coordinator
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user has active enrollments
    if (user.enrolledCourses.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with active course enrollments',
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Coordinator
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    // Send notification
    await Notification.notify(user._id, {
      type: user.isActive ? 'success' : 'warning',
      title: user.isActive ? 'Account Activated' : 'Account Deactivated',
      message: user.isActive 
        ? 'Your account has been activated. You can now log in.'
        : 'Your account has been deactivated. Please contact support for more information.',
    });

    res.status(200).json({
      success: true,
      data: { isActive: user.isActive },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Coordinator
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['coordinator', 'educator', 'learner'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Send notification
    await Notification.notify(user._id, {
      type: 'info',
      title: 'Role Updated',
      message: `Your account role has been updated to ${role}.`,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile/me
// @access  Private
exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'enrolledCourses',
        populate: { path: 'instructor', select: 'firstName lastName' },
      })
      .populate('teachingCourses')
      .populate('studyPlans');

    // Get recent activity
    const recentActivity = await this.getUserActivity(user._id);

    // Get achievements
    const achievements = await this.getUserAchievements(user._id);

    // Get notifications
    const notifications = await Notification.find({ 
      recipient: user._id,
      status: 'unread',
    }).sort('-createdAt').limit(5);

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        recentActivity,
        achievements,
        notifications: {
          count: notifications.length,
          items: notifications,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update my profile
// @route   PUT /api/users/profile/me
// @access  Private
exports.updateMyProfile = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'firstName',
      'lastName',
      'phoneNumber',
      'bio',
      'profilePicture',
      'address',
      'education',
      'skills',
      'preferences',
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user enrollments
// @route   GET /api/users/:id/enrollments
// @access  Private
exports.getUserEnrollments = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;

    const courses = await Course.find({ 'enrolledStudents.student': userId })
      .populate('instructor', 'firstName lastName')
      .select('title description thumbnail price level enrolledStudents');

    // Add progress for each course
    const enrollments = courses.map(course => {
      const enrollment = course.enrolledStudents.find(
        e => e.student.toString() === userId.toString()
      );
      return {
        ...course.toObject(),
        progress: enrollment?.progress || 0,
        enrolledAt: enrollment?.enrolledAt,
        completedAt: enrollment?.completedAt,
      };
    });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user study plans
// @route   GET /api/users/:id/study-plans
// @access  Private
exports.getUserStudyPlans = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;

    const studyPlans = await StudyPlan.find({ user: userId })
      .populate('courses.course', 'title thumbnail')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: studyPlans.length,
      data: studyPlans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user grades
// @route   GET /api/users/:id/grades
// @access  Private
exports.getUserGrades = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;

    const grades = await Grade.find({ student: userId })
      .populate('course', 'title code')
      .sort('-createdAt');

    // Calculate overall GPA
    const totalGPA = grades.reduce((sum, g) => sum + (g.overall?.gpa || 0), 0);
    const averageGPA = grades.length > 0 ? totalGPA / grades.length : 0;

    res.status(200).json({
      success: true,
      data: {
        grades,
        summary: {
          totalCourses: grades.length,
          averageGPA: averageGPA.toFixed(2),
          completedCourses: grades.filter(g => g.overall?.status === 'completed').length,
          inProgress: grades.filter(g => g.overall?.status === 'in-progress').length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper: Calculate average grade
exports.getAverageGrade = async (userId) => {
  const grades = await Grade.find({ student: userId });
  if (grades.length === 0) return 0;
  
  const total = grades.reduce((sum, g) => sum + (g.overall?.percentage || 0), 0);
  return Math.round(total / grades.length);
};

// Helper: Calculate study streak
exports.calculateStudyStreak = async (userId) => {
  // This would track daily logins and activity
  // Simplified version
  const user = await User.findById(userId);
  if (!user || !user.lastLogin) return 0;
  
  const daysSinceLastLogin = Math.floor(
    (new Date() - new Date(user.lastLogin)) / (1000 * 60 * 60 * 24)
  );
  
  return daysSinceLastLogin <= 1 ? 1 : 0;
};

// Helper: Get user achievements
exports.getUserAchievements = async (userId) => {
  // This would fetch from an achievements model
  // Placeholder implementation
  const achievements = [];
  
  const grades = await Grade.find({ student: userId });
  if (grades.length >= 5) {
    achievements.push({
      id: 'course_master',
      title: 'Course Master',
      description: 'Completed 5 courses',
      icon: '🎓',
      date: new Date(),
    });
  }
  
  const averageGrade = await exports.getAverageGrade(userId);
  if (averageGrade >= 90) {
    achievements.push({
      id: 'top_performer',
      title: 'Top Performer',
      description: 'Maintained 90%+ average',
      icon: '⭐',
      date: new Date(),
    });
  }
  
  return achievements;
};

// Helper: Get user activity
exports.getUserActivity = async (userId) => {
  // Combine activities from different sources
  const activities = [];
  
  // Recent grades
  const recentGrades = await Grade.find({ student: userId })
    .sort('-createdAt')
    .limit(3);
  recentGrades.forEach(grade => {
    activities.push({
      type: 'grade',
      title: `Received grade for ${grade.course?.title || 'course'}`,
      date: grade.createdAt,
      data: grade,
    });
  });
  
  // Recent study plans
  const recentPlans = await StudyPlan.find({ user: userId })
    .sort('-createdAt')
    .limit(3);
  recentPlans.forEach(plan => {
    activities.push({
      type: 'study_plan',
      title: `Updated study plan: ${plan.title}`,
      date: plan.updatedAt,
      data: plan,
    });
  });
  
  // Sort by date
  return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
};