const mongoose = require('mongoose');

const rubricSchema = new mongoose.Schema({
  criteria: {
    type: String,
    required: true,
  },
  description: String,
  weight: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  levels: [
    {
      name: {
        type: String,
        enum: ['excellent', 'good', 'satisfactory', 'needs-improvement', 'poor'],
      },
      points: Number,
      description: String,
    },
  ],
});

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Assignment description is required'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
    },
    type: {
      type: String,
      enum: ['quiz', 'essay', 'project', 'exam', 'homework'],
      required: true,
    },
    totalPoints: {
      type: Number,
      required: true,
      min: 0,
    },
    passingPoints: {
      type: Number,
      min: 0,
    },
    rubric: [rubricSchema],
    instructions: {
      type: String,
      required: true,
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        size: Number,
      },
    ],
    allowedFileTypes: [String],
    maxFileSize: {
      type: Number,
      default: 10485760, // 10MB
    },
    dueDate: {
      type: Date,
      required: true,
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    availableUntil: {
      type: Date,
    },
    allowLateSubmissions: {
      type: Boolean,
      default: false,
    },
    latePenalty: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    timeLimit: Number, // in minutes, for timed assignments
    attemptsAllowed: {
      type: Number,
      default: 1,
    },
    isGroupAssignment: {
      type: Boolean,
      default: false,
    },
    maxGroupSize: Number,
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    statistics: {
      totalSubmissions: {
        type: Number,
        default: 0,
      },
      averageScore: {
        type: Number,
        default: 0,
      },
      highestScore: {
        type: Number,
        default: 0,
      },
      lowestScore: {
        type: Number,
        default: 0,
      },
      passRate: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for submissions
assignmentSchema.virtual('submissions', {
  ref: 'Submission',
  localField: '_id',
  foreignField: 'assignment',
});

// Update statistics when submission is graded
assignmentSchema.methods.updateStatistics = async function () {
  const Submission = mongoose.model('Submission');
  
  const submissions = await Submission.find({ assignment: this._id, isGraded: true });
  
  if (submissions.length > 0) {
    const scores = submissions.map(s => s.grade.score);
    const passedCount = submissions.filter(s => s.grade.score >= this.passingPoints).length;
    
    this.statistics = {
      totalSubmissions: submissions.length,
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      passRate: (passedCount / submissions.length) * 100,
    };
    
    await this.save();
  }
};

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;