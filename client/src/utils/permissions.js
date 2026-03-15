// Permission constants
export const PERMISSIONS = {
  // User permissions
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  USER_MANAGE_ROLES: 'user:manage_roles',

  // Course permissions
  COURSE_VIEW: 'course:view',
  COURSE_CREATE: 'course:create',
  COURSE_EDIT: 'course:edit',
  COURSE_DELETE: 'course:delete',
  COURSE_PUBLISH: 'course:publish',
  COURSE_ENROLL: 'course:enroll',

  // Assignment permissions
  ASSIGNMENT_VIEW: 'assignment:view',
  ASSIGNMENT_CREATE: 'assignment:create',
  ASSIGNMENT_EDIT: 'assignment:edit',
  ASSIGNMENT_DELETE: 'assignment:delete',
  ASSIGNMENT_SUBMIT: 'assignment:submit',
  ASSIGNMENT_GRADE: 'assignment:grade',

  // Study Plan permissions
  STUDY_PLAN_VIEW: 'study_plan:view',
  STUDY_PLAN_CREATE: 'study_plan:create',
  STUDY_PLAN_EDIT: 'study_plan:edit',
  STUDY_PLAN_DELETE: 'study_plan:delete',
  STUDY_PLAN_SHARE: 'study_plan:share',

  // Payment permissions
  PAYMENT_VIEW: 'payment:view',
  PAYMENT_PROCESS: 'payment:process',
  PAYMENT_REFUND: 'payment:refund',
  PAYMENT_EXPORT: 'payment:export',

  // Report permissions
  REPORT_VIEW: 'report:view',
  REPORT_EXPORT: 'report:export',
  REPORT_SCHEDULE: 'report:schedule',

  // Discussion permissions
  DISCUSSION_VIEW: 'discussion:view',
  DISCUSSION_CREATE: 'discussion:create',
  DISCUSSION_EDIT: 'discussion:edit',
  DISCUSSION_DELETE: 'discussion:delete',
  DISCUSSION_MODERATE: 'discussion:moderate',

  // System permissions
  SYSTEM_SETTINGS_VIEW: 'system:settings_view',
  SYSTEM_SETTINGS_EDIT: 'system:settings_edit',
  SYSTEM_LOGS_VIEW: 'system:logs_view',
  SYSTEM_BACKUP: 'system:backup',
};

// Role-based permission sets
export const ROLE_PERMISSIONS = {
  coordinator: [
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.USER_MANAGE_ROLES,
    PERMISSIONS.COURSE_VIEW,
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_EDIT,
    PERMISSIONS.COURSE_DELETE,
    PERMISSIONS.COURSE_PUBLISH,
    PERMISSIONS.ASSIGNMENT_VIEW,
    PERMISSIONS.ASSIGNMENT_CREATE,
    PERMISSIONS.ASSIGNMENT_EDIT,
    PERMISSIONS.ASSIGNMENT_DELETE,
    PERMISSIONS.ASSIGNMENT_GRADE,
    PERMISSIONS.STUDY_PLAN_VIEW,
    PERMISSIONS.PAYMENT_VIEW,
    PERMISSIONS.PAYMENT_REFUND,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.REPORT_SCHEDULE,
    PERMISSIONS.DISCUSSION_VIEW,
    PERMISSIONS.DISCUSSION_MODERATE,
    PERMISSIONS.SYSTEM_SETTINGS_VIEW,
    PERMISSIONS.SYSTEM_SETTINGS_EDIT,
    PERMISSIONS.SYSTEM_LOGS_VIEW,
    PERMISSIONS.SYSTEM_BACKUP,
  ],
  educator: [
    PERMISSIONS.COURSE_VIEW,
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_EDIT,
    PERMISSIONS.ASSIGNMENT_VIEW,
    PERMISSIONS.ASSIGNMENT_CREATE,
    PERMISSIONS.ASSIGNMENT_EDIT,
    PERMISSIONS.ASSIGNMENT_GRADE,
    PERMISSIONS.STUDY_PLAN_VIEW,
    PERMISSIONS.STUDY_PLAN_CREATE,
    PERMISSIONS.STUDY_PLAN_EDIT,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.DISCUSSION_VIEW,
    PERMISSIONS.DISCUSSION_CREATE,
    PERMISSIONS.DISCUSSION_EDIT,
    PERMISSIONS.DISCUSSION_MODERATE,
  ],
  learner: [
    PERMISSIONS.COURSE_VIEW,
    PERMISSIONS.COURSE_ENROLL,
    PERMISSIONS.ASSIGNMENT_VIEW,
    PERMISSIONS.ASSIGNMENT_SUBMIT,
    PERMISSIONS.STUDY_PLAN_VIEW,
    PERMISSIONS.STUDY_PLAN_CREATE,
    PERMISSIONS.STUDY_PLAN_EDIT,
    PERMISSIONS.PAYMENT_VIEW,
    PERMISSIONS.PAYMENT_PROCESS,
    PERMISSIONS.DISCUSSION_VIEW,
    PERMISSIONS.DISCUSSION_CREATE,
    PERMISSIONS.DISCUSSION_EDIT,
  ],
};

/**
 * Check if user has permission
 * @param {object} user - User object
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;
  if (user.role === 'coordinator') return true;
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
};

/**
 * Check if user has any of the permissions
 * @param {object} user - User object
 * @param {Array} permissions - List of permissions
 * @returns {boolean} - True if user has any permission
 */
export const hasAnyPermission = (user, permissions) => {
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if user has all permissions
 * @param {object} user - User object
 * @param {Array} permissions - List of permissions
 * @returns {boolean} - True if user has all permissions
 */
export const hasAllPermissions = (user, permissions) => {
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Get user's permissions
 * @param {object} user - User object
 * @returns {Array} - List of permissions
 */
export const getUserPermissions = (user) => {
  if (!user) return [];
  return ROLE_PERMISSIONS[user.role] || [];
};

/**
 * Check if user can access resource
 * @param {object} user - User object
 * @param {string} resourceType - Type of resource
 * @param {string} action - Action to perform
 * @param {object} resource - Resource object
 * @returns {boolean} - True if user can access
 */
export const canAccessResource = (user, resourceType, action, resource = null) => {
  if (!user) return false;
  if (user.role === 'coordinator') return true;

  // Map actions to permissions
  const permissionMap = {
    view: {
      course: PERMISSIONS.COURSE_VIEW,
      assignment: PERMISSIONS.ASSIGNMENT_VIEW,
      user: PERMISSIONS.USER_VIEW,
      'study-plan': PERMISSIONS.STUDY_PLAN_VIEW,
      payment: PERMISSIONS.PAYMENT_VIEW,
      report: PERMISSIONS.REPORT_VIEW,
      discussion: PERMISSIONS.DISCUSSION_VIEW,
    },
    create: {
      course: PERMISSIONS.COURSE_CREATE,
      assignment: PERMISSIONS.ASSIGNMENT_CREATE,
      user: PERMISSIONS.USER_CREATE,
      'study-plan': PERMISSIONS.STUDY_PLAN_CREATE,
      discussion: PERMISSIONS.DISCUSSION_CREATE,
    },
    edit: {
      course: PERMISSIONS.COURSE_EDIT,
      assignment: PERMISSIONS.ASSIGNMENT_EDIT,
      user: PERMISSIONS.USER_EDIT,
      'study-plan': PERMISSIONS.STUDY_PLAN_EDIT,
      discussion: PERMISSIONS.DISCUSSION_EDIT,
    },
    delete: {
      course: PERMISSIONS.COURSE_DELETE,
      assignment: PERMISSIONS.ASSIGNMENT_DELETE,
      user: PERMISSIONS.USER_DELETE,
      'study-plan': PERMISSIONS.STUDY_PLAN_DELETE,
      discussion: PERMISSIONS.DISCUSSION_DELETE,
    },
  };

  const requiredPermission = permissionMap[action]?.[resourceType];
  if (!requiredPermission) return false;

  // Check if user has the permission
  if (!hasPermission(user, requiredPermission)) return false;

  // For edit/delete actions on specific resources, check ownership
  if (resource && (action === 'edit' || action === 'delete')) {
    const isOwner = resource.userId === user.id || 
                   resource.author === user.id ||
                   resource.student === user.id ||
                   resource.instructor === user.id;
    
    return isOwner;
  }

  return true;
};

/**
 * Filter resources by user permissions
 * @param {Array} resources - List of resources
 * @param {object} user - User object
 * @param {string} action - Action to perform
 * @returns {Array} - Filtered resources
 */
export const filterByPermission = (resources, user, action = 'view') => {
  if (!user) return [];
  if (user.role === 'coordinator') return resources;

  return resources.filter(resource => {
    // Check if user can view the resource type
    const permissionMap = {
      view: PERMISSIONS.COURSE_VIEW,
      edit: PERMISSIONS.COURSE_EDIT,
      delete: PERMISSIONS.COURSE_DELETE,
    };

    const requiredPermission = permissionMap[action];
    if (!hasPermission(user, requiredPermission)) return false;

    // For edit/delete, check ownership
    if (action !== 'view') {
      return resource.userId === user.id || 
             resource.author === user.id ||
             resource.student === user.id ||
             resource.instructor === user.id;
    }

    return true;
  });
};

/**
 * Get role display name
 * @param {string} role - Role key
 * @returns {string} - Display name
 */
export const getRoleDisplayName = (role) => {
  const roles = {
    coordinator: 'Coordinator',
    educator: 'Educator',
    learner: 'Learner',
  };
  return roles[role] || role;
};

/**
 * Get role color
 * @param {string} role - Role key
 * @returns {string} - Color hex
 */
export const getRoleColor = (role) => {
  const colors = {
    coordinator: '#F56565',
    educator: '#F8B042',
    learner: '#667EEA',
  };
  return colors[role] || '#718096';
};

/**
 * Get role icon
 * @param {string} role - Role key
 * @returns {string} - Icon name
 */
export const getRoleIcon = (role) => {
  const icons = {
    coordinator: '👑',
    educator: '📚',
    learner: '🎓',
  };
  return icons[role] || '👤';
};

/**
 * Check if role can perform action
 * @param {string} role - Role
 * @param {string} action - Action
 * @param {string} resource - Resource type
 * @returns {boolean} - True if role can perform action
 */
export const canRolePerformAction = (role, action, resource) => {
  const user = { role };
  const permissionMap = {
    view: `${resource}:view`,
    create: `${resource}:create`,
    edit: `${resource}:edit`,
    delete: `${resource}:delete`,
  };

  const permission = permissionMap[action];
  return hasPermission(user, permission);
};

// Export all permissions as a single object
export default {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getUserPermissions,
  canAccessResource,
  filterByPermission,
  getRoleDisplayName,
  getRoleColor,
  getRoleIcon,
  canRolePerformAction,
};