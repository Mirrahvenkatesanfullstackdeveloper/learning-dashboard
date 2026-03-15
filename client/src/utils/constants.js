export const ROLES = {
  COORDINATOR: 'coordinator',
  EDUCATOR: 'educator',
  LEARNER: 'learner',
};

export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

export const ASSIGNMENT_TYPES = {
  QUIZ: 'quiz',
  ESSAY: 'essay',
  PROJECT: 'project',
  EXAM: 'exam',
};

export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  LATE: 'late',
  GRADED: 'graded',
  RETURNED: 'returned',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const APP_NAME = 'Learning Dashboard';
export const APP_VERSION = '1.0.0';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    SETTINGS: '/users/settings',
  },
  COURSES: {
    BASE: '/courses',
    MATERIALS: '/courses/materials',
    ENROLL: '/courses/enroll',
  },
  ASSIGNMENTS: {
    BASE: '/assignments',
    SUBMISSIONS: '/assignments/submissions',
    GRADE: '/assignments/grade',
  },
  PAYMENTS: {
    BASE: '/payments',
    HISTORY: '/payments/history',
    INVOICE: '/payments/invoice',
  },
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_TIME: 'MMM dd, yyyy hh:mm a',
  API: 'yyyy-MM-dd',
  API_TIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
};

export const CURRENCY = {
  CODE: 'USD',
  SYMBOL: '$',
};