const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Milestone title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  targetDate: {
    type: Date,
    required: [true, 'Target date is required'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: Date,
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
});

const studyPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Study plan title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    goal: {
      type: String,
      required: [true, 'Learning goal is required'],
      enum: [
        'become-developer',
        'learn-language',
        'get-certified',
        'career-change',
        'skill-upgrade',
        'personal-interest',
        'other',
      ],
    },
    customGoal: String,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    courses: [{
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
      order: Number,
      completed: {
        type: Boolean,
        default: false,
      },
      completedAt: Date,
      notes: String,
    }],
    milestones: [milestoneSchema],
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now,
    },
    targetDate: {
      type: Date,
      required: [true, 'Target completion date is required'],
    },
    completedAt: Date,
    weeklyHours: {
      type: Number,
      required: [true, 'Weekly hours commitment is required'],
      min: [1, 'Minimum 1 hour per week'],
      max: [168, 'Maximum hours exceeded'],
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed', 'abandoned', 'archived'],
      default: 'active',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    bookmarks: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    reminders: [{
      type: {
        type: String,
        enum: ['daily', 'weekly', 'milestone'],
      },
      time: String,
      enabled: {
        type: Boolean,
        default: true,
      },
    }],
    notes: [{
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    sharedWith: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      permission: {
        type: String,
        enum: ['view', 'edit'],
        default: 'view',
      },
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate progress before saving - UPDATED (removed next)
studyPlanSchema.pre('save', function() {
  if (this.courses && this.courses.length > 0) {
    const completedCourses = this.courses.filter(c => c.completed).length;
    this.progress = Math.round((completedCourses / this.courses.length) * 100);
    
    // Calculate total hours from courses
    if (this.isModified('courses')) {
      // This would need to be populated or calculated differently in production
      this.totalHours = this.courses.length * 10; // Placeholder
    }
  }

  // Check if all milestones are completed
  if (this.milestones && this.milestones.length > 0) {
    const allMilestonesCompleted = this.milestones.every(m => m.completed);
    if (allMilestonesCompleted && this.status === 'active') {
      this.status = 'completed';
      this.completedAt = new Date();
    }
  }
});

// Virtual for time remaining
studyPlanSchema.virtual('timeRemaining').get(function () {
  const now = new Date();
  const target = new Date(this.targetDate);
  const diff = target - now;
  
  if (diff < 0) return 'Overdue';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  
  if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} remaining`;
  }
  return `${days} day${days > 1 ? 's' : ''} remaining`;
});

// Virtual for recommended daily hours
studyPlanSchema.virtual('recommendedDailyHours').get(function () {
  const remainingDays = Math.ceil((new Date(this.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (remainingDays <= 0) return 0;
  
  const remainingHours = this.totalHours - (this.progress / 100 * this.totalHours);
  return Math.ceil((remainingHours / remainingDays) * 10) / 10;
});

// Index for search
studyPlanSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text',
  'user.firstName': 'text',
  'user.lastName': 'text',
});

const StudyPlan = mongoose.model('StudyPlan', studyPlanSchema);

module.exports = StudyPlan;