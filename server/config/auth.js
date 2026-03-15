module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    cookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN || 7,
  },
  bcrypt: {
    saltRounds: 10,
  },
  roles: {
    COORDINATOR: 'coordinator',
    EDUCATOR: 'educator',
    LEARNER: 'learner',
  },
  permissions: {
    // Course permissions
    CREATE_COURSE: ['coordinator', 'educator'],
    EDIT_COURSE: ['coordinator', 'educator'],
    DELETE_COURSE: ['coordinator'],
    VIEW_COURSES: ['coordinator', 'educator', 'learner'],
    ENROLL_COURSES: ['learner'],

    // Assignment permissions
    CREATE_ASSIGNMENT: ['coordinator', 'educator'],
    EDIT_ASSIGNMENT: ['coordinator', 'educator'],
    DELETE_ASSIGNMENT: ['coordinator'],
    SUBMIT_ASSIGNMENT: ['learner'],
    GRADE_ASSIGNMENT: ['coordinator', 'educator'],

    // User permissions
    MANAGE_USERS: ['coordinator'],
    VIEW_USERS: ['coordinator', 'educator'],

    // Study plan permissions
    CREATE_STUDY_PLAN: ['coordinator', 'educator', 'learner'],
    EDIT_STUDY_PLAN: ['coordinator', 'educator', 'learner'],
    DELETE_STUDY_PLAN: ['coordinator'],

    // Payment permissions
    VIEW_PAYMENTS: ['coordinator', 'learner'],
    PROCESS_PAYMENT: ['learner'],

    // Report permissions
    VIEW_REPORTS: ['coordinator', 'educator'],
    EXPORT_DATA: ['coordinator', 'educator'],
  },
};