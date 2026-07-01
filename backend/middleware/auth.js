const jwt = require('jsonwebtoken');
const { error } = require('../utils/apiResponse');

const authenticate = (roles = []) => (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return error(res, 'Unauthorized', 401);
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (roles.length && !roles.includes(decoded.role) && !roles.includes(decoded.type)) {
      return error(res, 'Forbidden', 403);
    }
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Access token expired', 401);
    }
    return error(res, 'Invalid token', 401);
  }
};

const authenticateAdmin = authenticate(['admin']);
const authenticateVendor = authenticate(['vendor', 'admin']);
const authenticateUser = authenticate(['user', 'vendor', 'admin']);

module.exports = {
  authenticate,
  authenticateAdmin,
  authenticateVendor,
  authenticateUser,
};
