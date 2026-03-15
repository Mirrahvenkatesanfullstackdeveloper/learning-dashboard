const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  updateProgress,
  getCourseMaterials,
  getCourseAnalytics,
} = require('../controllers/course.controller');

// Public routes (no authentication needed)
router.get('/', getCourses);
router.get('/:id', getCourse);

// All routes below this require authentication
router.use(protect);

// Routes for learners
router.post('/:id/enroll', authorize('learner'), enrollCourse);
router.put('/:id/progress', authorize('learner'), updateProgress);
router.get('/:id/materials', authorize('learner', 'educator', 'coordinator'), getCourseMaterials);

// Routes for educators and coordinators
router.post('/', authorize('educator', 'coordinator'), createCourse);
router.put('/:id', authorize('educator', 'coordinator'), updateCourse);
router.delete('/:id', authorize('coordinator'), deleteCourse);
router.get('/:id/analytics', authorize('educator', 'coordinator'), getCourseAnalytics);

module.exports = router;