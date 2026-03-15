const { body, validationResult } = require('express-validator');

// Validation rules
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  };
};

// Auth validations
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Course validations
const courseValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('code').notEmpty().withMessage('Course code is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('startDate').isDate().withMessage('Valid start date is required'),
  body('endDate').isDate().withMessage('Valid end date is required'),
];

// Assignment validations
const assignmentValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').isIn(['assignment', 'quiz', 'task']).withMessage('Invalid type'),
  body('dueDate').isDate().withMessage('Valid due date is required'),
  body('totalPoints').isNumeric().withMessage('Total points must be a number'),
];

// Payment validation
const paymentValidation = [
  body('courseId').notEmpty().withMessage('Course ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('paymentMethod').isIn(['card', 'bank', 'qr']).withMessage('Invalid payment method'),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  courseValidation,
  assignmentValidation,
  paymentValidation,
};