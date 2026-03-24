require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// Trust proxy - required for Render/Heroku deployment
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://nexalearningdashboard.netlify.app',
  'https://learning-dashboard-sandy.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean); // Remove any undefined values

// CORS configuration - Allow multiple frontends
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging - use 'combined' in production for more details
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route (doesn't need DB)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start server
console.log('⏳ Connecting to MongoDB...');
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Import routes AFTER database is connected
    const authRoutes = require('./routes/auth.routes');
    const userRoutes = require('./routes/user.routes');
    const courseRoutes = require('./routes/course.routes');
    const assignmentRoutes = require('./routes/assignment.routes');
    const submissionRoutes = require('./routes/submission.routes');
    const gradeRoutes = require('./routes/grade.routes');
    const studyPlanRoutes = require('./routes/studyPlan.routes');
    const paymentRoutes = require('./routes/payment.routes');
    const notificationRoutes = require('./routes/notification.routes');
    const discussionRoutes = require('./routes/discussion.routes');
    const analyticsRoutes = require('./routes/analytics.routes');
    
    // Use routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/assignments', assignmentRoutes);
    app.use('/api/submissions', submissionRoutes);
    app.use('/api/grades', gradeRoutes);
    app.use('/api/study-plans', studyPlanRoutes);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/discussions', discussionRoutes);
    app.use('/api/analytics', analyticsRoutes);
    
    // Error handler (must be after routes)
    const { errorHandler } = require('./middleware/errorHandler');
    app.use(errorHandler);
    
    // 404 handler - catch all unhandled routes
    app.use((req, res) => {
      res.status(404).json({ 
        status: 'error', 
        message: 'Route not found' 
      });
    });
    
    // Start server - listen on all network interfaces (required for deployment)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Allowed frontends: ${allowedOrigins.join(', ')}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('💥 UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});