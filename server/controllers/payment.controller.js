const Payment = require('../models/Payment');
const Course = require('../models/Course');
const User = require('../models/User');

exports.processPayment = async (req, res, next) => {
  try {
    const {
      courseId,
      paymentMethod,
      amount,
      billingAddress,
      couponCode,
    } = req.body;

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found',
      });
    }

    // Check if already enrolled
    const isEnrolled = course.enrolledStudents.some(
      s => s.student.toString() === req.user.id
    );
    if (isEnrolled) {
      return res.status(400).json({
        status: 'error',
        message: 'Already enrolled in this course',
      });
    }

    // Calculate price with discount
    let finalPrice = course.discountedPrice || course.price;
    
    // Apply coupon if provided (simplified)
    if (couponCode === 'SAVE10') {
      finalPrice = finalPrice * 0.9; // 10% off
    }

    // Simulate payment processing
    const paymentSuccess = Math.random() > 0.1; // 90% success rate

    if (!paymentSuccess) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment processing failed. Please try again.',
      });
    }

    // Create payment record
    const payment = await Payment.create({
      user: req.user.id,
      course: courseId,
      amount: finalPrice,
      paymentMethod,
      status: 'completed',
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substring(7)}`,
      paymentDetails: {
        // Simulated payment details
        cardLastFour: paymentMethod === 'credit_card' ? '4242' : undefined,
        cardBrand: 'Visa',
      },
      billingAddress,
      items: [{
        type: 'course',
        itemId: courseId,
        name: course.title,
        price: finalPrice,
      }],
      subtotal: finalPrice,
      total: finalPrice,
      couponCode,
      completedAt: new Date(),
    });

    // Enroll user in course
    course.enrolledStudents.push({
      student: req.user.id,
      enrolledAt: new Date(),
      progress: 0,
    });
    course.totalEnrollments += 1;
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { enrolledCourses: courseId },
    });

    res.status(201).json({
      status: 'success',
      message: 'Payment processed successfully',
      payment,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentHistory = async (req, res, next) => {
  try {
    const query = req.user.role === 'coordinator' 
      ? {} 
      : { user: req.user.id };

    const payments = await Payment.find(query)
      .populate('user', 'firstName lastName email')
      .populate('course', 'title')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentDetails = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('course', 'title description thumbnail');

    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found',
      });
    }

    // Check authorization
    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'coordinator') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this payment',
      });
    }

    res.status(200).json({
      status: 'success',
      payment,
    });
  } catch (error) {
    next(error);
  }
};

exports.refundPayment = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found',
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Only completed payments can be refunded',
      });
    }

    // Simulate refund processing
    payment.status = 'refunded';
    payment.refundReason = reason;
    payment.refundedAt = new Date();
    await payment.save();

    // Remove course enrollment if applicable
    if (payment.course) {
      await Course.findByIdAndUpdate(payment.course, {
        $pull: { enrolledStudents: { student: payment.user } },
        $inc: { totalEnrollments: -1 },
      });

      await User.findByIdAndUpdate(payment.user, {
        $pull: { enrolledCourses: payment.course },
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment refunded successfully',
      payment,
    });
  } catch (error) {
    next(error);
  }
};