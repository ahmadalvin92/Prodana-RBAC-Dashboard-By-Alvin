const HttpError = require("../utils/httpError");

const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.user) {
    return next(new HttpError(401, "Authentication is required."));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new HttpError(403, "You do not have permission to access this resource."));
  }

  return next();
};

module.exports = authorizeRoles;
