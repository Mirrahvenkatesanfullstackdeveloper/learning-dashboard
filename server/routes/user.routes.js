const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

// All routes require authentication and coordinator role
router.use(protect);
router.use(authorize('coordinator'));

// User routes
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;