const Course = require('../models/Course');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Grade = require('../models/Grade');
const Notification = require('../models/Notification');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { 
      category, 
      level, 
      price, 
      search, 
      sort = '-createdAt',
      instructor 
    } = req.query;

    // Build filter
    const filter = { isPublished: true };
    if (category && category !== 'all') filter.category = category;
    if (level && level !== 'all') filter.level = level;
    if (instructor) filter.instructor = instructor;

    // Price filter
    if (price === 'free') filter.price = 0;
    if (price === 'paid') filter.price = { $gt: 0 };

    // Search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'firstName lastName profilePicture')
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName profilePicture bio')
      .populate('coordinators', 'firstName lastName')
      .populate({
        path: 'enrolledStudents.student',
        select: 'firstName lastName profilePicture',
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Increment views
    course.views = (course.views || 0) + 1;
    await course.save();

    // Get related courses
    const relatedCourses = await Course.find({
      _id: { $ne: course._id },
      category: course.category,
      isPublished: true,
    })
      .limit(4)
      .select('title thumbnail price level averageRating totalEnrollments');

    // Get assignments for this course
    const assignments = await Assignment.find({ course: course._id })
      .select('title dueDate totalPoints type');

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        assignments,
        relatedCourses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Educator
exports.createCourse = async (req, res, next) => {
  try {
    const courseData = req.body;

    // Handle thumbnail upload
    if (req.files && req.files.thumbnail) {
      const result = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath, {
        folder: 'courses/thumbnails',
      });
      courseData.thumbnail = result.secure_url;
    }

    // Handle cover image upload
    if (req.files && req.files.coverImage) {
      const result = await cloudinary.uploader.upload(req.files.coverImage.tempFilePath, {
        folder: 'courses/covers',
      });
      courseData.coverImage = result.secure_url;
    }

    // Set instructor
    courseData.instructor = req.user.id;

    const course = await Course.create(courseData);

    // Add course to instructor's teaching courses
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { teachingCourses: course._id },
    });

    // Notify coordinators
    const coordinators = await User.find({ role: 'coordinator' });
    for (const coordinator of coordinators) {
      await Notification.notify(coordinator._id, {
        type: 'course_created',
        title: 'New Course Created',
        message: `${req.user.firstName} ${req.user.lastName} created a new course: ${course.title}`,
        data: { courseId: course._id },
      });
    }

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Educator
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check permission
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
    }

    const updates = req.body;

    // Handle file uploads
    if (req.files) {
      if (req.files.thumbnail) {
        // Delete old thumbnail if exists
        if (course.thumbnail) {
          const publicId = course.thumbnail.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`courses/thumbnails/${publicId}`);
        }
        
        const result = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath, {
          folder: 'courses/thumbnails',
        });
        updates.thumbnail = result.secure_url;
      }

      if (req.files.coverImage) {
        if (course.coverImage) {
          const publicId = course.coverImage.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`courses/covers/${publicId}`);
        }
        
        const result = await cloudinary.uploader.upload(req.files.coverImage.tempFilePath, {
          folder: 'courses/covers',
        });
        updates.coverImage = result.secure_url;
      }
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    // Notify enrolled students
    if (updates.isPublished !== undefined || updates.modules) {
      for (const enrollment of course.enrolledStudents) {
        await Notification.notify(enrollment.student, {
          type: 'course_updated',
          title: 'Course Updated',
          message: `The course "${course.title}" has been updated. Check out the new content!`,
          data: { courseId: course._id },
        });
      }
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Coordinator
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if course has enrolled students
    if (course.enrolledStudents.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete course with enrolled students',
      });
    }

    // Delete associated files
    if (course.thumbnail) {
      const publicId = course.thumbnail.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`courses/thumbnails/${publicId}`);
    }
    if (course.coverImage) {
      const publicId = course.coverImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`courses/covers/${publicId}`);
    }

    await course.remove();

    // Remove from instructors' teaching courses
    await User.updateMany(
      { teachingCourses: course._id },
      { $pull: { teachingCourses: course._id } }
    );

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private/Learner
exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if already enrolled
    const isEnrolled = course.enrolledStudents.some(
      e => e.student.toString() === req.user.id
    );

    if (isEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course',
      });
    }

    // Add student to course
    course.enrolledStudents.push({
      student: req.user.id,
      enrolledAt: new Date(),
      progress: 0,
    });
    course.totalEnrollments += 1;
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { enrolledCourses: course._id },
    });

    // Create grade record
    await Grade.create({
      student: req.user.id,
      course: course._id,
      semester: new Date().getFullYear() + '-' + (new Date().getMonth() < 6 ? 'S1' : 'S2'),
      year: new Date().getFullYear(),
      items: [],
    });

    // Send notification
    await Notification.notify(req.user.id, {
      type: 'course_enrolled',
      title: 'Enrollment Successful',
      message: `You have successfully enrolled in ${course.title}`,
      data: { courseId: course._id },
    });

    // Notify instructor
    await Notification.notify(course.instructor, {
      type: 'new_enrollment',
      title: 'New Student Enrolled',
      message: `A new student has enrolled in your course: ${course.title}`,
      data: { 
        courseId: course._id,
        studentId: req.user.id,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course progress
// @route   PUT /api/courses/:id/progress
// @access  Private/Learner
exports.updateProgress = async (req, res, next) => {
  try {
    const { progress, moduleId, lessonId } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Find student enrollment
    const enrollment = course.enrolledStudents.find(
      e => e.student.toString() === req.user.id
    );

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Not enrolled in this course',
      });
    }

    // Update progress
    enrollment.progress = progress;
    
    // Add completed module
    if (moduleId && !enrollment.completedModules.includes(moduleId)) {
      enrollment.completedModules.push(moduleId);
    }

    // Check if course completed
    if (progress === 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
      
      // Update grade status
      await Grade.findOneAndUpdate(
        { student: req.user.id, course: course._id },
        { 'overall.status': 'completed' }
      );

      // Award certificate (simplified)
      await Notification.notify(req.user.id, {
        type: 'course_completed',
        title: 'Congratulations! 🎉',
        message: `You have successfully completed ${course.title}. Your certificate is ready.`,
        data: { 
          courseId: course._id,
          certificateUrl: `/certificates/${course._id}`,
        },
      });
    }

    await course.save();

    res.status(200).json({
      success: true,
      data: {
        progress: enrollment.progress,
        completedModules: enrollment.completedModules,
        completedAt: enrollment.completedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course materials
// @route   GET /api/courses/:id/materials
// @access  Private
exports.getCourseMaterials = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .select('title modules resources');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if user has access
    const isEnrolled = course.enrolledStudents?.some(
      e => e.student.toString() === req.user.id
    );

    const isInstructor = course.instructor?.toString() === req.user.id;
    const isCoordinator = req.user.role === 'coordinator';

    if (!isEnrolled && !isInstructor && !isCoordinator) {
      return res.status(403).json({
        success: false,
        message: 'Not enrolled in this course',
      });
    }

    // Organize materials
    const materials = {
      lectures: [],
      documents: [],
      links: [],
    };

    course.modules?.forEach(module => {
      module.content?.forEach(content => {
        const material = {
          ...content.toObject(),
          module: module.title,
          moduleId: module._id,
        };

        if (content.type === 'video') {
          materials.lectures.push(material);
        } else if (content.type === 'document') {
          materials.documents.push(material);
        } else if (content.type === 'link') {
          materials.links.push(material);
        }
      });
    });

    // Add course resources
    course.resources?.forEach(resource => {
      if (resource.type === 'link') {
        materials.links.push(resource);
      } else {
        materials.documents.push(resource);
      }
    });

    res.status(200).json({
      success: true,
      data: materials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course analytics
// @route   GET /api/courses/:id/analytics
// @access  Private/Educator
exports.getCourseAnalytics = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('enrolledStudents.student', 'firstName lastName')
      .populate('assignments');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check permission
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics',
      });
    }

    // Calculate statistics
    const totalStudents = course.enrolledStudents.length;
    const completedStudents = course.enrolledStudents.filter(e => e.completedAt).length;
    const averageProgress = course.enrolledStudents.reduce(
      (sum, e) => sum + e.progress, 0
    ) / totalStudents || 0;

    // Module completion stats
    const moduleStats = course.modules?.map(module => {
      const completed = course.enrolledStudents.filter(e =>
        e.completedModules.includes(module._id)
      ).length;
      return {
        moduleId: module._id,
        title: module.title,
        completed,
        total: totalStudents,
        completionRate: totalStudents ? (completed / totalStudents) * 100 : 0,
      };
    });

    // Assignment stats (would need to query submissions)
    const assignments = await Assignment.find({ course: course._id });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalStudents,
          completedStudents,
          completionRate: totalStudents ? (completedStudents / totalStudents) * 100 : 0,
          averageProgress,
          activeStudents: course.enrolledStudents.filter(e => e.progress > 0 && e.progress < 100).length,
        },
        moduleStats,
        assignments: assignments.map(a => ({
          id: a._id,
          title: a.title,
          dueDate: a.dueDate,
          submissions: a.statistics?.totalSubmissions || 0,
          averageScore: a.statistics?.averageScore || 0,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};