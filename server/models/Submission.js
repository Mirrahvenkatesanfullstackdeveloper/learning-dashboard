const mongoose = require('mongoose');

const submissionFileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  path: String,
  url: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment is required'],
    },
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
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'late', 'graded', 'returned', 'resubmitted'],
      default: 'submitted',
    },
    files: [submissionFileSchema],
    comments: {
      type: String,
      maxlength: [2000, 'Comments cannot exceed 2000 characters'],
    },
    grade: {
      score: {
        type: Number,
        min: 0,
      },
      totalPoints: {
        type: Number,
        min: 0,
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100,
      },
      letterGrade: String,
      feedback: {
        type: String,
        maxlength: [5000, 'Feedback cannot exceed 5000 characters'],
      },
      gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      gradedAt: Date,
      rubricScores: {
        type: Map,
        of: Number,
      },
      isPassing: Boolean,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    latePenalty: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    timeSpent: {
      type: Number, // in minutes
      min: 0,
    },
    ipAddress: String,
    userAgent: String,
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    plagiarismScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    flags: [{
      type: {
        type: String,
        enum: ['plagiarism', 'late', 'incomplete', 'wrong-format'],
      },
      description: String,
      raisedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      resolved: {
        type: Boolean,
        default: false,
      },
      resolvedAt: Date,
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    }],
    revisionHistory: [{
      submittedAt: Date,
      files: [submissionFileSchema],
      comments: String,
      attemptNumber: Number,
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Check if submission is late
submissionSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('submittedAt')) {
    const Assignment = mongoose.model('Assignment');
    const assignment = await Assignment.findById(this.assignment);
    
    if (assignment && this.submittedAt > assignment.dueDate) {
      this.isLate = true;
      this.status = 'late';
      this.latePenalty = assignment.latePenalty || 0;
    }
  }
  next();
});

// Calculate grade percentage when score is set
submissionSchema.pre('save', function (next) {
  if (this.grade && this.grade.score && this.grade.totalPoints) {
    this.grade.percentage = (this.grade.score / this.grade.totalPoints) * 100;
    
    // Calculate letter grade
    const percentage = this.grade.percentage;
    if (percentage >= 90) this.grade.letterGrade = 'A';
    else if (percentage >= 80) this.grade.letterGrade = 'B';
    else if (percentage >= 70) this.grade.letterGrade = 'C';
    else if (percentage >= 60) this.grade.letterGrade = 'D';
    else this.grade.letterGrade = 'F';
    
    // Check if passing
    const Assignment = mongoose.model('Assignment');
    if (this.assignment) {
      Assignment.findById(this.assignment).then(assignment => {
        if (assignment) {
          this.grade.isPassing = percentage >= (assignment.passingPoints / assignment.totalPoints * 100);
        }
      });
    }
  }
  next();
});

// Update assignment statistics after grading
submissionSchema.post('save', async function () {
  if (this.grade && this.grade.gradedAt) {
    const Assignment = mongoose.model('Assignment');
    const assignment = await Assignment.findById(this.assignment);
    if (assignment) {
      await assignment.updateStatistics();
    }
  }
});

// Index for efficient querying
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });
submissionSchema.index({ status: 1 });
submissionSchema.index({ submittedAt: -1 });
submissionSchema.index({ 'grade.gradedAt': -1 });

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;