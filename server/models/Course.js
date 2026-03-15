const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true,
  },
  description: String,
  order: {
    type: Number,
    required: true,
  },
  content: [
    {
      type: {
        type: String,
        enum: ['video', 'document', 'quiz', 'assignment', 'link'],
        required: true,
      },
      title: String,
      description: String,
      url: String,
      duration: Number, // in minutes
      isRequired: {
        type: Boolean,
        default: true,
      },
    },
  ],
  estimatedTime: Number, // in minutes
  isPublished: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'FULL STACK DEVELOPER'],
      trim: true,
      maxlength: [200, 'A Full Stack Developer Course teaches you how to build complete web applications from start to finish. In this course, you will learn both front-end and back-end development. The front-end focuses on creating attractive and responsive user interfaces using HTML, CSS, JavaScript, React.js, and Tailwind CSS. The back-end covers server-side development using Node.js, Express.js, and MongoDB to manage data and application logic too'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      enum: [
        'programming',
        'design',
        'business',
        'marketing',
        'data-science',
        'ai-ml',
        'cloud-computing',
        'cybersecurity',
        'other',
      ],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    language: {
      type: String,
      default: 'en',
    },
    thumbnail: {
      type: String,
      default: 'default-course.jpg',
    },
    coverImage: String,
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coordinators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    modules: [moduleSchema],
    totalModules: {
      type: Number,
      default: 0,
    },
    totalDuration: {
      type: Number,
      default: 0, // in minutes
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountedPrice: {
      type: Number,
      min: [0, 'Discounted price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    enrolledStudents: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
        completedModules: [
          {
            type: mongoose.Schema.Types.ObjectId,
          },
        ],
        progress: {
          type: Number,
          default: 0,
          min: 0,
          max: 100,
        },
        completedAt: Date,
        certificateIssued: {
          type: Boolean,
          default: false,
        },
      },
    ],
    totalEnrollments: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    prerequisites: [String],
    learningObjectives: [String],
    requirements: [String],
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    startDate: Date,
    endDate: Date,
    certificateTemplate: String,
    resources: [
      {
        title: String,
        type: {
          type: String,
          enum: ['pdf', 'video', 'link', 'file'],
        },
        url: String,
      },
    ],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for assignments
courseSchema.virtual('assignments', {
  ref: 'Assignment',
  localField: '_id',
  foreignField: 'course',
});

// Virtual for discussions
courseSchema.virtual('discussions', {
  ref: 'Discussion',
  localField: '_id',
  foreignField: 'course',
});

// Create slug before saving - UPDATED (removed next)
courseSchema.pre('save', function() {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

// Update total modules and duration before saving - UPDATED (removed next)
courseSchema.pre('save', function() {
  if (this.modules) {
    this.totalModules = this.modules.length;
    this.totalDuration = this.modules.reduce(
      (total, module) => total + (module.estimatedTime || 0),
      0
    );
  }
});

// Index for search
courseSchema.index({ 
  title: 'text', 
  description: 'text', 
  shortDescription: 'text',
  category: 'text',
  tags: 'text' 
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;