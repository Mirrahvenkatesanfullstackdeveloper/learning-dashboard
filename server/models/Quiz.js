const mongoose = require('mongoose');

const questionOptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Option text is required'],
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
  order: Number,
  feedback: String, // Feedback for this specific option
});

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
  },
  type: {
    type: String,
    enum: [
      'multiple-choice',
      'true-false',
      'short-answer',
      'essay',
      'matching',
      'fill-blank',
      'code',
    ],
    required: [true, 'Question type is required'],
  },
  points: {
    type: Number,
    required: [true, 'Points are required'],
    min: [0, 'Points cannot be negative'],
  },
  options: [questionOptionSchema],
  correctAnswer: mongoose.Schema.Types.Mixed, // For simple answer types
  matchingPairs: [{
    left: String,
    right: String,
  }],
  blanks: [{
    position: Number,
    correctAnswer: String,
  }],
  codeTemplate: String,
  codeLanguage: String,
  testCases: [{
    input: String,
    expectedOutput: String,
    weight: Number,
  }],
  explanation: {
    type: String,
    maxlength: [2000, 'Explanation cannot exceed 2000 characters'],
  },
  hints: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  timeLimit: Number, // in seconds
  tags: [String],
  order: Number,
  required: {
    type: Boolean,
    default: true,
  },
  partialCredit: {
    type: Boolean,
    default: false,
  },
});

const quizSettingsSchema = new mongoose.Schema({
  timeLimit: Number, // in minutes
  attemptsAllowed: {
    type: Number,
    default: 1,
  },
  shuffleQuestions: {
    type: Boolean,
    default: false,
  },
  shuffleOptions: {
    type: Boolean,
    default: false,
  },
  showAnswers: {
    type: Boolean,
    default: false,
  },
  showCorrectAnswers: {
    type: String,
    enum: ['immediately', 'after_submission', 'never'],
    default: 'after_submission',
  },
  showFeedback: {
    type: Boolean,
    default: true,
  },
  passingScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 70,
  },
  allowReview: {
    type: Boolean,
    default: true,
  },
  proctoring: {
    enabled: {
      type: Boolean,
      default: false,
    },
    webcam: Boolean,
    screenShare: Boolean,
    lockdown: Boolean,
  },
  randomizeQuestions: {
    type: Boolean,
    default: false,
  },
  questionsPerPage: {
    type: Number,
    default: 1,
  },
  allowNavigation: {
    type: Boolean,
    default: true,
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Quiz description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    instructions: {
      type: String,
      maxlength: [2000, 'Instructions cannot exceed 2000 characters'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    questions: [questionSchema],
    settings: {
      type: quizSettingsSchema,
      default: () => ({}),
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    estimatedTime: Number, // in minutes
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    category: {
      type: String,
      enum: ['practice', 'graded', 'survey', 'diagnostic'],
      default: 'graded',
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    availableFrom: {
      type: Date,
      default: Date.now,
    },
    availableUntil: Date,
    dueDate: Date,
    statistics: {
      timesTaken: {
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
      averageTime: Number,
      passRate: {
        type: Number,
        default: 0,
      },
      questionStats: [{
        questionId: mongoose.Schema.Types.ObjectId,
        timesCorrect: Number,
        timesIncorrect: Number,
        averageTime: Number,
      }],
    },
    version: {
      type: Number,
      default: 1,
    },
    previousVersions: [{
      version: Number,
      questions: [questionSchema],
      modifiedAt: Date,
      modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate totals before saving
quizSchema.pre('save', function (next) {
  if (this.questions && this.questions.length > 0) {
    this.totalQuestions = this.questions.length;
    this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 0), 0);
    
    // Calculate estimated time (1 min per question average)
    this.estimatedTime = this.totalQuestions;
  }
  next();
});

// Virtual for attempts
quizSchema.virtual('attempts', {
  ref: 'QuizAttempt',
  localField: '_id',
  foreignField: 'quiz',
});

// Index for search
quizSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text',
  category: 'text',
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;