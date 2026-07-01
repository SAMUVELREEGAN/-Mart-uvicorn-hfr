const { error } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    return error(res, err.message, 422);
  }
  if (err.code === 11000) {
    return error(res, 'Duplicate entry', 409);
  }
  if (err.message === 'Invalid refresh token') {
    return error(res, err.message, 401);
  }
  return error(res, err.message || 'Internal server error', err.statusCode || 500);
};

module.exports = errorHandler;
