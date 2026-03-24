const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendEmail } = require('../utils/sendEmail');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'  // Hardcoded - this will fix the error
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email',
      });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'learner',
    });

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    
    await sendEmail({
      email: user.email,
      subject: 'Please verify your email',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    createSendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses')
      .populate('teachingCourses')
      .populate('studyPlans');

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with this email',
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Send reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      html: `
        <h1>Password Reset</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to email',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired',
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired',
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update password
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user preferences
 * @route   PUT /api/auth/preferences
 * @access  Private
 */
exports.updatePreferences = async (req, res, next) => {
  try {
    const { language, theme, notifications } = req.body;

    // Find user and update preferences
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Update preferences
    user.preferences = {
      language: language || user.preferences?.language || 'en',
      theme: theme || user.preferences?.theme || 'light',
      notifications: {
        email: notifications?.email ?? user.preferences?.notifications?.email ?? true,
        push: notifications?.push ?? user.preferences?.notifications?.push ?? true,
        sms: notifications?.sms ?? user.preferences?.notifications?.sms ?? false,
      },
    };

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
};