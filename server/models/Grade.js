const mongoose = require('mongoose');

const gradeItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['assignment', 'quiz', 'exam', 'project', 'participation'],
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemModel',
  },
  itemModel: {
    type: String,
    enum: ['Assignment', 'Quiz', 'Submission'],
    required: true,
  },
  title: String,
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPoints: {
    type: Number,
    required: true,
    min: 0,
  },
  weight: {
    type: Number,
    min: 0,
    max: 100,
  },
  percentage: Number,
  letterGrade: String,
  submittedAt: Date,
  gradedAt: Date,
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  feedback: String,
  isLate: Boolean,
  latePenalty: Number,
  attemptNumber: Number,
});

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    items: [gradeItemSchema],
    overall: {
      totalScore: {
        type: Number,
        default: 0,
      },
      totalPoints: {
        type: Number,
        default: 0,
      },
      percentage: {
        type: Number,
        default: 0,
      },
      letterGrade: {
        type: String,
        enum: ['A', 'B', 'C', 'D', 'F', 'I', 'W'],
      },
      gpa: {
        type: Number,
        min: 0,
        max: 4,
      },
      status: {
        type: String,
        enum: ['in-progress', 'completed', 'incomplete', 'withdrawn'],
        default: 'in-progress',
      },
    },
    attendance: {
      totalClasses: Number,
      attended: Number,
      percentage: Number,
    },
    participation: {
      score: Number,
      feedback: String,
    },
    extraCredit: [{
      title: String,
      points: Number,
      date: Date,
    }],
    comments: {
      type: String,
      maxlength: [2000, 'Comments cannot exceed 2000 characters'],
    },
    isFinalized: {
      type: Boolean,
      default: false,
    },
    finalizedAt: Date,
    finalizedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    gradeHistory: [{
      items: [gradeItemSchema],
      overall: {
        totalScore: Number,
        totalPoints: Number,
        percentage: Number,
        letterGrade: String,
      },
      updatedAt: Date,
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reason: String,
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate overall grade before saving
gradeSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    let totalScore = 0;
    let totalPoints = 0;
    let weightedScore = 0;
    let totalWeight = 0;

    this.items.forEach(item => {
      totalScore += item.score || 0;
      totalPoints += item.totalPoints || 0;
      
      if (item.weight) {
        weightedScore += (item.score / item.totalPoints) * item.weight;
        totalWeight += item.weight;
      }
    });

    // Use weighted average if weights are present, otherwise use simple average
    const percentage = totalWeight > 0 
      ? (weightedScore / totalWeight) * 100
      : totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;

    this.overall = {
      totalScore,
      totalPoints,
      percentage: Math.round(percentage * 100) / 100,
      letterGrade: this.calculateLetterGrade(percentage),
      gpa: this.calculateGPA(percentage),
    };
  }
  next();
});

// Calculate letter grade
gradeSchema.methods.calculateLetterGrade = function(percentage) {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

// Calculate GPA
gradeSchema.methods.calculateGPA = function(percentage) {
  if (percentage >= 90) return 4.0;
  if (percentage >= 80) return 3.0;
  if (percentage >= 70) return 2.0;
  if (percentage >= 60) return 1.0;
  return 0.0;
};

// Add item to grade
gradeSchema.methods.addItem = async function(itemData) {
  this.items.push(itemData);
  await this.save();
  return this;
};

// Update item
gradeSchema.methods.updateItem = async function(itemId, updateData) {
  const item = this.items.id(itemId);
  if (!item) throw new Error('Item not found');
  
  Object.assign(item, updateData);
  await this.save();
  return this;
};

// Finalize grade
gradeSchema.methods.finalize = async function(userId) {
  this.isFinalized = true;
  this.finalizedAt = new Date();
  this.finalizedBy = userId;
  await this.save();
  return this;
};

// Index for efficient querying
gradeSchema.index({ student: 1, course: 1, semester: 1, year: 1 }, { unique: true });
gradeSchema.index({ 'overall.status': 1 });
gradeSchema.index({ isFinalized: 1 });

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;