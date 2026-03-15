/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Password validation
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with strength and errors
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  let strength = 'weak';
  if (errors.length === 0) {
    if (password.length >= 12) {
      strength = 'strong';
    } else if (password.length >= 10) {
      strength = 'medium';
    } else {
      strength = 'good';
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

/**
 * Phone number validation
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * URL validation
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Date validation
 * @param {string} date - Date string to validate
 * @param {string} format - Expected format (default: 'YYYY-MM-DD')
 * @returns {boolean} - True if valid
 */
export const isValidDate = (date, format = 'YYYY-MM-DD') => {
  const parsed = new Date(date);
  return parsed instanceof Date && !isNaN(parsed);
};

/**
 * Credit card validation
 * @param {string} cardNumber - Credit card number
 * @returns {object} - Validation result with card type
 */
export const validateCreditCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  // Luhn algorithm
  let sum = 0;
  let alternate = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + 1;
      }
    }
    
    sum += digit;
    alternate = !alternate;
  }
  
  const isValid = sum % 10 === 0;
  
  // Detect card type
  let type = 'unknown';
  if (/^4/.test(cleaned)) {
    type = 'visa';
  } else if (/^5[1-5]/.test(cleaned)) {
    type = 'mastercard';
  } else if (/^3[47]/.test(cleaned)) {
    type = 'amex';
  } else if (/^6(?:011|5)/.test(cleaned)) {
    type = 'discover';
  }
  
  return { isValid, type };
};

/**
 * Form validation helper
 * @param {object} values - Form values
 * @param {object} rules - Validation rules
 * @returns {object} - Errors object
 */
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
    }
    
    if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
      errors[field] = `${field} must be at least ${fieldRules.minLength} characters`;
    }
    
    if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
      errors[field] = `${field} cannot exceed ${fieldRules.maxLength} characters`;
    }
    
    if (fieldRules.pattern && value && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || `${field} is invalid`;
    }
    
    if (fieldRules.match && value !== values[fieldRules.match]) {
      errors[field] = `${field} must match ${fieldRules.match}`;
    }
    
    if (fieldRules.custom) {
      const customError = fieldRules.custom(value, values);
      if (customError) {
        errors[field] = customError;
      }
    }
  });
  
  return errors;
};

/**
 * File validation
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {object} - Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    minSize = 0,
  } = options;
  
  const errors = [];
  
  if (file.size > maxSize) {
    errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB`);
  }
  
  if (file.size < minSize) {
    errors.push(`File size is less than ${minSize / 1024}KB`);
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Course validation
 * @param {object} course - Course object
 * @returns {object} - Validation result
 */
export const validateCourse = (course) => {
  const errors = {};
  
  if (!course.title || course.title.trim() === '') {
    errors.title = 'Course title is required';
  }
  
  if (!course.description || course.description.trim() === '') {
    errors.description = 'Course description is required';
  }
  
  if (!course.category) {
    errors.category = 'Category is required';
  }
  
  if (!course.level) {
    errors.level = 'Level is required';
  }
  
  if (course.price === undefined || course.price < 0) {
    errors.price = 'Price must be a non-negative number';
  }
  
  if (course.modules && course.modules.length > 0) {
    course.modules.forEach((module, index) => {
      if (!module.title) {
        errors[`modules[${index}].title`] = `Module ${index + 1} title is required`;
      }
    });
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Assignment validation
 * @param {object} assignment - Assignment object
 * @returns {object} - Validation result
 */
export const validateAssignment = (assignment) => {
  const errors = {};
  
  if (!assignment.title || assignment.title.trim() === '') {
    errors.title = 'Assignment title is required';
  }
  
  if (!assignment.description || assignment.description.trim() === '') {
    errors.description = 'Assignment description is required';
  }
  
  if (!assignment.courseId) {
    errors.courseId = 'Course is required';
  }
  
  if (!assignment.type) {
    errors.type = 'Assignment type is required';
  }
  
  if (!assignment.totalPoints || assignment.totalPoints <= 0) {
    errors.totalPoints = 'Total points must be greater than 0';
  }
  
  if (!assignment.dueDate) {
    errors.dueDate = 'Due date is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};