const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentDetails: {
      cardLastFour: String,
      cardBrand: String,
      paypalEmail: String,
      bankName: String,
      accountLastFour: String,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    items: [
      {
        type: {
          type: String,
          enum: ['course', 'subscription', 'certificate'],
        },
        itemId: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    subtotal: Number,
    tax: Number,
    discount: Number,
    total: Number,
    couponCode: String,
    invoiceNumber: {
      type: String,
      unique: true,
    },
    notes: String,
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    refundReason: String,
    refundedAt: Date,
    completedAt: Date,
    failedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate invoice number before saving
paymentSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV-${year}${month}-${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

// Calculate totals before saving
paymentSchema.pre('save', function (next) {
  if (!this.total) {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.total = this.subtotal + (this.tax || 0) - (this.discount || 0);
  }
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;