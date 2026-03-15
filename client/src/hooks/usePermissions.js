import { useAuth } from './useAuth';

// Permission definitions
export const PERMISSIONS = {
  // Course permissions
  VIEW_COURSES: 'view_courses',
  CREATE_COURSE: 'create_course',
  EDIT_COURSE: 'edit_course',
  DELETE_COURSE: 'delete_course',
  PUBLISH_COURSE: 'publish_course',
  ENROLL_COURSE: 'enroll_course',

  // Assignment permissions
  VIEW_ASSIGNMENTS: 'view_assignments',
  CREATE_ASSIGNMENT: 'create_assignment',
  EDIT_ASSIGNMENT: 'edit_assignment',
  DELETE_ASSIGNMENT: 'delete_assignment',
  SUBMIT_ASSIGNMENT: 'submit_assignment',
  GRADE_ASSIGNMENT: 'grade_assignment',

  // User permissions
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user',
  MANAGE_ROLES: 'manage_roles',

  // Study plan permissions
  VIEW_STUDY_PLANS: 'view_study_plans',
  CREATE_STUDY_PLAN: 'create_study_plan',
  EDIT_STUDY_PLAN: 'edit_study_plan',
  DELETE_STUDY_PLAN: 'delete_study_plan',
  SHARE_STUDY_PLAN: 'share_study_plan',

  // Payment permissions
  VIEW_PAYMENTS: 'view_payments',
  PROCESS_PAYMENT: 'process_payment',
  REFUND_PAYMENT: 'refund_payment',
  VIEW_INVOICES: 'view_invoices',

  // Report permissions
  VIEW_REPORTS: 'view_reports',
  EXPORT_DATA: 'export_data',
  VIEW_ANALYTICS: 'view_analytics',

  // Discussion permissions
  VIEW_DISCUSSIONS: 'view_discussions',
  CREATE_DISCUSSION: 'create_discussion',
  EDIT_DISCUSSION: 'edit_discussion',
  DELETE_DISCUSSION: 'delete_discussion',
  MODERATE_DISCUSSION: 'moderate_discussion',

  // System permissions
  VIEW_SETTINGS: 'view_settings',
  EDIT_SETTINGS: 'edit_settings',
  VIEW_LOGS: 'view_logs',
  MANAGE_SYSTEM: 'manage_system',
};

// Role-based permission mappings
const ROLE_PERMISSIONS = {
  coordinator: [
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.CREATE_COURSE,
    PERMISSIONS.EDIT_COURSE,
    PERMISSIONS.DELETE_COURSE,
    PERMISSIONS.PUBLISH_COURSE,
    PERMISSIONS.VIEW_ASSIGNMENTS,
    PERMISSIONS.CREATE_ASSIGNMENT,
    PERMISSIONS.EDIT_ASSIGNMENT,
    PERMISSIONS.DELETE_ASSIGNMENT,
    PERMISSIONS.GRADE_ASSIGNMENT,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.EDIT_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.VIEW_STUDY_PLANS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.REFUND_PAYMENT,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_DISCUSSIONS,
    PERMISSIONS.MODERATE_DISCUSSION,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.EDIT_SETTINGS,
    PERMISSIONS.VIEW_LOGS,
    PERMISSIONS.MANAGE_SYSTEM,
  ],
  educator: [
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.CREATE_COURSE,
    PERMISSIONS.EDIT_COURSE,
    PERMISSIONS.VIEW_ASSIGNMENTS,
    PERMISSIONS.CREATE_ASSIGNMENT,
    PERMISSIONS.EDIT_ASSIGNMENT,
    PERMISSIONS.GRADE_ASSIGNMENT,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_STUDY_PLANS,
    PERMISSIONS.CREATE_STUDY_PLAN,
    PERMISSIONS.EDIT_STUDY_PLAN,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_DISCUSSIONS,
    PERMISSIONS.CREATE_DISCUSSION,
    PERMISSIONS.EDIT_DISCUSSION,
    PERMISSIONS.MODERATE_DISCUSSION,
  ],
  learner: [
    PERMISSIONS.VIEW_COURSES,
    PERMISSIONS.ENROLL_COURSE,
    PERMISSIONS.VIEW_ASSIGNMENTS,
    PERMISSIONS.SUBMIT_ASSIGNMENT,
    PERMISSIONS.VIEW_STUDY_PLANS,
    PERMISSIONS.CREATE_STUDY_PLAN,
    PERMISSIONS.EDIT_STUDY_PLAN,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.PROCESS_PAYMENT,
    PERMISSIONS.VIEW_INVOICES,
    PERMISSIONS.VIEW_DISCUSSIONS,
    PERMISSIONS.CREATE_DISCUSSION,
    PERMISSIONS.EDIT_DISCUSSION,
  ],
};

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'coordinator') return true; // Coordinators have all permissions
    return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  const can = (action, resource) => {
    // Specific resource-based permissions
    const permissionMap = {
      view: {
        course: PERMISSIONS.VIEW_COURSES,
        assignment: PERMISSIONS.VIEW_ASSIGNMENTS,
        user: PERMISSIONS.VIEW_USERS,
        'study-plan': PERMISSIONS.VIEW_STUDY_PLANS,
        payment: PERMISSIONS.VIEW_PAYMENTS,
        report: PERMISSIONS.VIEW_REPORTS,
        discussion: PERMISSIONS.VIEW_DISCUSSIONS,
      },
      create: {
        course: PERMISSIONS.CREATE_COURSE,
        assignment: PERMISSIONS.CREATE_ASSIGNMENT,
        user: PERMISSIONS.CREATE_USER,
        'study-plan': PERMISSIONS.CREATE_STUDY_PLAN,
        discussion: PERMISSIONS.CREATE_DISCUSSION,
      },
      edit: {
        course: PERMISSIONS.EDIT_COURSE,
        assignment: PERMISSIONS.EDIT_ASSIGNMENT,
        user: PERMISSIONS.EDIT_USER,
        'study-plan': PERMISSIONS.EDIT_STUDY_PLAN,
        discussion: PERMISSIONS.EDIT_DISCUSSION,
      },
      delete: {
        course: PERMISSIONS.DELETE_COURSE,
        assignment: PERMISSIONS.DELETE_ASSIGNMENT,
        user: PERMISSIONS.DELETE_USER,
        'study-plan': PERMISSIONS.DELETE_STUDY_PLAN,
        discussion: PERMISSIONS.DELETE_DISCUSSION,
      },
    };

    const requiredPermission = permissionMap[action]?.[resource];
    return requiredPermission ? hasPermission(requiredPermission) : false;
  };

  const isOwner = (resource, userId) => {
    // Check if user is the owner of a resource
    return user?.id === userId;
  };

  const canAccess = (resource, ownerId) => {
    // Check if user can access a resource (either owner or has permission)
    return isOwner(resource, ownerId) || hasPermission(`view_${resource}s`);
  };

  const canModify = (resource, ownerId) => {
    // Check if user can modify a resource (owner or has edit permission)
    return isOwner(resource, ownerId) || hasPermission(`edit_${resource}s`) || user?.role === 'coordinator';
  };

  const getUserRole = () => {
    return user?.role;
  };

  const isCoordinator = () => {
    return user?.role === 'coordinator';
  };

  const isEducator = () => {
    return user?.role === 'educator';
  };

  const isLearner = () => {
    return user?.role === 'learner';
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can,
    isOwner,
    canAccess,
    canModify,
    getUserRole,
    isCoordinator,
    isEducator,
    isLearner,
    userRole: user?.role,
  };
};