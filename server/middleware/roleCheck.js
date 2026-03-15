const { permissions } = require('../config/auth');

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

exports.checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (!permissions[permission] || !permissions[permission].includes(userRole)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

// Check if user is the owner of the resource
exports.isOwner = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({
          status: 'error',
          message: 'Resource not found',
        });
      }

      // Check if user is owner or has coordinator role
      const isOwner = resource.userId?.toString() === req.user.id ||
                     resource.instructor?.toString() === req.user.id ||
                     resource.createdBy?.toString() === req.user.id;

      if (isOwner || req.user.role === 'coordinator') {
        req.resource = resource;
        return next();
      }

      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this resource',
      });
    } catch (error) {
      next(error);
    }
  };
};