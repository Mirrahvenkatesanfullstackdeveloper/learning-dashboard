const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/roleCheck');
const {
  processPayment,
  getPaymentHistory,
  getPaymentDetails,
  refundPayment,
} = require('../controllers/payment.controller');

router.use(protect);

router.post('/process', processPayment);
router.get('/history', getPaymentHistory);
router.get('/:id', getPaymentDetails);
router.post('/:id/refund', restrictTo('coordinator'), refundPayment);

module.exports = router;