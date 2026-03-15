const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const StudyPlan = require('../models/StudyPlan');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await StudyPlan.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        firstName: 'John',
        lastName: 'Coordinator',
        email: 'coordinator@example.com',
        password: 'password123',
        role: 'coordinator',
        isEmailVerified: true,
        bio: 'Experienced education coordinator with 10+ years in e-learning',
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
      },
      {
        firstName: 'Jane',
        lastName: 'Educator',
        email: 'educator@example.com',
        password: 'password123',
        role: 'educator',
        isEmailVerified: true,
        bio: 'Passionate educator specializing in web development',
        profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      {
        firstName: 'Bob',
        lastName: 'Learner',
        email: 'learner@example.com',
        password: 'password123',
        role: 'learner',
        isEmailVerified: true,
        bio: 'Eager to learn full-stack development',
        profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      {
        firstName: 'Alice',
        lastName: 'Student',
        email: 'student@example.com',
        password: 'password123',
        role: 'learner',
        isEmailVerified: true,
        bio: 'Computer science student',
        profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
    ]);

    console.log('✅ Created users');

    // Create courses
    const courses = await Course.create([
      {
        title: 'Full Stack Web Development Bootcamp',
        shortDescription: 'Learn MERN stack from scratch',
        description: 'Comprehensive course covering React, Node.js, MongoDB, and Express',
        category: 'programming',
        level: 'beginner',
        instructor: users[1]._id, // Jane Educator
        price: 499.99,
        discountedPrice: 399.99,
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        totalDuration: 4800, // 80 hours
        modules: [
          {
            title: 'Introduction to Web Development',
            description: 'Basic concepts and setup',
            order: 1,
            content: [
              {
                type: 'video',
                title: 'Course Overview',
                url: 'https://example.com/video1',
                duration: 30,
              },
              {
                type: 'document',
                title: 'Setup Guide',
                url: 'https://example.com/doc1',
              },
            ],
            estimatedTime: 120,
          },
          {
            title: 'React Fundamentals',
            description: 'Learn React basics',
            order: 2,
            content: [
              {
                type: 'video',
                title: 'Components and Props',
                url: 'https://example.com/video2',
                duration: 45,
              },
              {
                type: 'assignment',
                title: 'Build a Todo App',
                url: 'https://example.com/assignment1',
              },
            ],
            estimatedTime: 180,
          },
        ],
        enrolledStudents: [
          {
            student: users[2]._id, // Bob Learner
            enrolledAt: new Date(),
            progress: 35,
          },
          {
            student: users[3]._id, // Alice Student
            enrolledAt: new Date(),
            progress: 15,
          },
        ],
        totalEnrollments: 2,
        averageRating: 4.5,
        totalRatings: 10,
        isPublished: true,
        isFeatured: true,
      },
      {
        title: 'Advanced React Patterns',
        shortDescription: 'Master advanced React concepts',
        description: 'Deep dive into hooks, context, performance optimization',
        category: 'programming',
        level: 'advanced',
        instructor: users[1]._id,
        price: 299.99,
        discountedPrice: 249.99,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
        totalDuration: 1800, // 30 hours
        enrolledStudents: [
          {
            student: users[2]._id,
            enrolledAt: new Date(),
            progress: 0,
          },
        ],
        totalEnrollments: 1,
        averageRating: 5,
        totalRatings: 5,
        isPublished: true,
      },
    ]);

    console.log('✅ Created courses');

    // Create assignments
    const assignments = await Assignment.create([
      {
        title: 'React Todo App Assignment',
        description: 'Build a fully functional todo application with React',
        course: courses[0]._id,
        type: 'project',
        totalPoints: 100,
        passingPoints: 70,
        instructions: 'Create a todo app with add, delete, and edit functionality',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        availableFrom: new Date(),
        createdBy: users[1]._id,
        rubric: [
          {
            criteria: 'Functionality',
            description: 'All features work as expected',
            weight: 40,
            levels: [
              { name: 'excellent', points: 40, description: 'All features working perfectly' },
              { name: 'good', points: 30, description: 'Most features working' },
              { name: 'satisfactory', points: 20, description: 'Basic features working' },
            ],
          },
          {
            criteria: 'Code Quality',
            description: 'Code is clean and well-organized',
            weight: 30,
            levels: [
              { name: 'excellent', points: 30, description: 'Excellent code structure' },
              { name: 'good', points: 22, description: 'Good code organization' },
              { name: 'satisfactory', points: 15, description: 'Acceptable code quality' },
            ],
          },
        ],
      },
      {
        title: 'Database Design Quiz',
        description: 'Test your knowledge of database normalization',
        course: courses[0]._id,
        type: 'quiz',
        totalPoints: 50,
        passingPoints: 35,
        instructions: 'Answer the following questions about database design',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        availableFrom: new Date(),
        createdBy: users[1]._id,
      },
    ]);

    console.log('✅ Created assignments');

    // Create study plans - FIXED VERSION
    const studyPlans = await StudyPlan.create([
      {
        title: 'My Learning Path - Full Stack Developer',
        description: 'Personalized study plan to become a full stack developer',
        user: users[2]._id, // Bob Learner
        goal: 'become-developer', // Required field
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now - CORRECT field name
        courses: [
          { course: courses[0]._id, order: 1 },
          { course: courses[1]._id, order: 2 }
        ],
        weeklyHours: 15,
        isActive: true,
        progress: 15,
        isPublic: true,
        tags: ['web-development', 'full-stack', 'career'],
        difficulty: 'intermediate'
      },
    ]);

    console.log('✅ Created study plans');

    // Update users with enrolled courses
    await User.findByIdAndUpdate(users[2]._id, {
      $addToSet: { enrolledCourses: { $each: [courses[0]._id, courses[1]._id] } },
    });
    await User.findByIdAndUpdate(users[3]._id, {
      $addToSet: { enrolledCourses: courses[0]._id },
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Accounts:');
    console.log('👑 Coordinator - coordinator@example.com / password123');
    console.log('👩‍🏫 Educator - educator@example.com / password123');
    console.log('🎓 Learner - learner@example.com / password123');
    console.log('\n📊 Sample Data Created:');
    console.log(`📚 ${courses.length} courses`);
    console.log(`📝 ${assignments.length} assignments`);
    console.log(`📋 ${studyPlans.length} study plan`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('📦 Connected to MongoDB');
      seedDatabase();
    })
    .catch(err => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;