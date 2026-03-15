const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize'); // Use authorize instead of checkRole
const {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getSubmissions,
  gradeSubmission,
  getUpcomingDeadlines
} = require('../controllers/assignment.controller');

// Public routes (if any)
// router.get('/public', somePublicFunction);

// All routes below this require authentication
router.use(protect);

// Routes for all authenticated users
router.get('/upcoming', getUpcomingDeadlines);
router.get('/', getAssignments);
router.get('/:id', getAssignment);

// Routes for educators and coordinators only
router.post('/', authorize('educator', 'coordinator'), createAssignment);
router.put('/:id', authorize('educator', 'coordinator'), updateAssignment);
router.delete('/:id', authorize('coordinator'), deleteAssignment);
router.get('/:id/submissions', authorize('educator', 'coordinator'), getSubmissions);
router.post('/:id/grade/:submissionId', authorize('educator', 'coordinator'), gradeSubmission);

module.exports = router;