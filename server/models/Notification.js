const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
      index: true,
    },
    type: {
      type: String,
      enum: [
        'assignment_created',
        'assignment_due',
        'assignment_graded',
        'assignment_submitted',
        'course_enrolled',
        'course_completed',
        'course_updated',
        'discussion_reply',
        'comment_added',
        'achievement_unlocked',
        'payment_received',
        'payment_failed',
        'refund_processed',
        'certificate_issued',
        'study_plan_reminder',
        'milestone_reached',
        'system_announcement',
        'warning',
        'info',
        'success',
        'error',
      ],
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    data: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    actions: [{
      label: String,
      url: String,
      action: String,
      data: Map,
    }],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'archived', 'dismissed'],
      default: 'unread',
      index: true,
    },
    readAt: Date,
    archivedAt: Date,
    expiresAt: Date,
    category: {
      type: String,
      enum: ['learning', 'academic', 'payment', 'system', 'social'],
      default: 'system',
    },
    icon: String,
    color: String,
    link: String,
    image: String,
    isPush: {
      type: Boolean,
      default: false,
    },
    isEmail: {
      type: Boolean,
      default: false,
    },
    isSMS: {
      type: Boolean,
      default: false,
    },
    sentAt: Date,
    deliveredAt: Date,
    readBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      readAt: Date,
      device: String,
      ip: String,
    }],
    groupId: String, // For grouping related notifications
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-expire old notifications
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // 30 days

// Mark as read
notificationSchema.methods.markAsRead = async function(userId, deviceInfo = {}) {
  this.status = 'read';
  this.readAt = new Date();
  
  this.readBy.push({
    user: userId,
    readAt: new Date(),
    device: deviceInfo.device,
    ip: deviceInfo.ip,
  });
  
  await this.save();
  return this;
};

// Mark as archived
notificationSchema.methods.archive = async function() {
  this.status = 'archived';
  this.archivedAt = new Date();
  await this.save();
  return this;
};

// Send push notification
notificationSchema.methods.sendPush = async function() {
  this.isPush = true;
  this.sentAt = new Date();
  // Implementation would depend on push notification service
  await this.save();
  return this;
};

// Send email
notificationSchema.methods.sendEmail = async function() {
  this.isEmail = true;
  this.sentAt = new Date();
  // Implementation would depend on email service
  await this.save();
  return this;
};

// Static method to create and send notification
notificationSchema.statics.notify = async function(recipientId, data) {
  const notification = await this.create({
    recipient: recipientId,
    ...data,
  });
  
  // Trigger push/email based on user preferences
  const User = mongoose.model('User');
  const user = await User.findById(recipientId);
  
  if (user?.preferences?.notifications?.push) {
    await notification.sendPush();
  }
  
  if (user?.preferences?.notifications?.email && data.isEmail !== false) {
    await notification.sendEmail();
  }
  
  return notification;
};

// Get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    recipient: userId,
    status: 'unread',
  });
};

// Mark all as read
notificationSchema.statics.markAllAsRead = async function(userId) {
  await this.updateMany(
    { recipient: userId, status: 'unread' },
    { 
      status: 'read',
      readAt: new Date(),
    }
  );
};

// Index for efficient querying
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;