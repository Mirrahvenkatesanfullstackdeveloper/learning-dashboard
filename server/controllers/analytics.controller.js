const User = require('../models/User');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Grade = require('../models/Grade');
const Payment = require('../models/Payment');

// @desc    Get platform overview analytics
// @route   GET /api/analytics/overview
// @access  Private/Coordinator
exports.getOverview = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    const newUsers = await User.countDocuments(dateFilter);
    
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    // Course statistics
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Course.aggregate([
      { $group: { _id: null, total: { $sum: '$totalEnrollments' } } },
    ]);

    // Assignment statistics
    const totalAssignments = await Assignment.countDocuments();
    const pendingSubmissions = await Submission.countDocuments({ 
      status: { $in: ['submitted', 'late'] } 
    });
    const gradedSubmissions = await Submission.countDocuments({ status: 'graded' });

    // Revenue statistics
    const revenue = await Payment.aggregate([
      { $match: { status: 'completed', ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Recent activity
    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('firstName lastName email createdAt');

    const recentCourses = await Course.find()
      .sort('-createdAt')
      .limit(5)
      .select('title instructor createdAt');

    const recentSubmissions = await Submission.find()
      .populate('student', 'firstName lastName')
      .populate('assignment', 'title')
      .sort('-submittedAt')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          new: newUsers,
          byRole: usersByRole,
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          enrollments: totalEnrollments[0]?.total || 0,
        },
        assignments: {
          total: totalAssignments,
          pending: pendingSubmissions,
          graded: gradedSubmissions,
        },
        revenue: {
          total: revenue[0]?.total || 0,
        },
        recent: {
          users: recentUsers,
          courses: recentCourses,
          submissions: recentSubmissions,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private/Coordinator
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;

    // User growth over time
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      { $limit: 30 },
    ]);

    // User engagement
    const engagement = await User.aggregate([
      {
        $group: {
          _id: null,
          avgLastLogin: { $avg: '$lastLogin' },
          totalLogins: { $sum: 1 },
        },
      },
    ]);

    // User retention (simplified - users who logged in last 30 days vs total)
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({ lastLogin: { $gte: last30Days } });
    const totalUsers = await User.countDocuments();
    const retentionRate = (activeUsers / totalUsers) * 100;

    res.status(200).json({
      success: true,
      data: {
        growth: userGrowth,
        engagement: engagement[0] || {},
        retention: {
          active: activeUsers,
          total: totalUsers,
          rate: retentionRate.toFixed(2),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course analytics
// @route   GET /api/analytics/courses
// @access  Private/Coordinator
exports.getCourseAnalytics = async (req, res, next) => {
  try {
    // Top performing courses
    const topCourses = await Course.find()
      .sort('-totalEnrollments')
      .limit(5)
      .select('title totalEnrollments averageRating');

    // Course completion rates
    const completionRates = await Course.aggregate([
      {
        $project: {
          title: 1,
          totalEnrollments: 1,
          completedCount: {
            $size: {
              $filter: {
                input: '$enrolledStudents',
                as: 'student',
                cond: { $ne: ['$$student.completedAt', null] },
              },
            },
          },
        },
      },
      {
        $project: {
          title: 1,
          totalEnrollments: 1,
          completedCount: 1,
          completionRate: {
            $multiply: [
              { $divide: ['$completedCount', '$totalEnrollments'] },
              100,
            ],
          },
        },
      },
      { $sort: { completionRate: -1 } },
    ]);

    // Category distribution
    const categoryDistribution = await Course.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Level distribution
    const levelDistribution = await Course.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        topCourses,
        completionRates,
        categoryDistribution,
        levelDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private/Coordinator
exports.getRevenueAnalytics = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;

    // Revenue over time
    const revenueOverTime = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      { $limit: 30 },
    ]);

    // Revenue by payment method
    const byMethod = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$paymentMethod', total: { $sum: '$amount' } } },
    ]);

    // Revenue by course category
    const byCategory = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo',
        },
      },
      { $unwind: '$courseInfo' },
      {
        $group: {
          _id: '$courseInfo.category',
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Monthly recurring revenue (simplified)
    const mrr = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 1 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overTime: revenueOverTime,
        byMethod,
        byCategory,
        mrr: mrr[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get performance analytics
// @route   GET /api/analytics/performance
// @access  Private/Coordinator
exports.getPerformanceAnalytics = async (req, res, next) => {
  try {
    // Average grades by course
    const avgGrades = await Grade.aggregate([
      { $match: { isFinalized: true } },
      {
        $group: {
          _id: '$course',
          avgPercentage: { $avg: '$overall.percentage' },
          avgGPA: { $avg: '$overall.gpa' },
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      { $unwind: '$course' },
      {
        $project: {
          courseTitle: '$course.title',
          avgPercentage: 1,
          avgGPA: 1,
        },
      },
    ]);

    // Grade distribution
    const gradeDistribution = await Grade.aggregate([
      { $match: { isFinalized: true } },
      {
        $group: {
          _id: '$overall.letterGrade',
          count: { $sum: 1 },
        },
      },
    ]);

    // Assignment submission rates
    const submissionRates = await Assignment.aggregate([
      {
        $lookup: {
          from: 'submissions',
          localField: '_id',
          foreignField: 'assignment',
          as: 'subs',
        },
      },
      {
        $project: {
          title: 1,
          totalSubmissions: { $size: '$subs' },
          gradedSubmissions: {
            $size: {
              $filter: {
                input: '$subs',
                as: 'sub',
                cond: { $eq: ['$$sub.status', 'graded'] },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        averageGrades: avgGrades,
        gradeDistribution,
        submissionRates,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get export data
// @route   POST /api/analytics/export
// @access  Private/Coordinator
exports.exportData = async (req, res, next) => {
  try {
    const { dataTypes, startDate, endDate, format = 'json' } = req.body;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const exportData = {};

    // Fetch requested data types
    if (dataTypes.includes('users')) {
      exportData.users = await User.find(dateFilter)
        .select('-password')
        .lean();
    }

    if (dataTypes.includes('courses')) {
      exportData.courses = await Course.find(dateFilter)
        .populate('instructor', 'firstName lastName email')
        .lean();
    }

    if (dataTypes.includes('assignments')) {
      exportData.assignments = await Assignment.find(dateFilter)
        .populate('course', 'title')
        .lean();
    }

    if (dataTypes.includes('submissions')) {
      exportData.submissions = await Submission.find(dateFilter)
        .populate('student', 'firstName lastName email')
        .populate('assignment', 'title')
        .lean();
    }

    if (dataTypes.includes('payments')) {
      exportData.payments = await Payment.find({
        ...dateFilter,
        status: 'completed',
      })
        .populate('user', 'firstName lastName email')
        .populate('course', 'title')
        .lean();
    }

    // Format based on request
    if (format === 'json') {
      res.json({
        success: true,
        data: exportData,
      });
    } else if (format === 'csv') {
      // Convert to CSV format
      const csvData = this.convertToCSV(exportData);
      res.header('Content-Type', 'text/csv');
      res.attachment(`export-${Date.now()}.csv`);
      res.send(csvData);
    }
  } catch (error) {
    next(error);
  }
};

// Helper: Convert to CSV
convertToCSV = (data) => {
  // Implementation would convert nested objects to CSV
  // This is a simplified placeholder
  return JSON.stringify(data);
};