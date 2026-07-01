const path = require('path');
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');
const { uploadDir } = require('../utils/mediaUrl');

exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return error(res, 'No file uploaded', 400);
  }
  const url = `/uploads/${req.file.filename}`;
  return success(res, { url, filename: req.file.filename }, 'File uploaded', 201);
});

exports.deleteImage = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  if (!filename || filename.includes('..')) {
    return error(res, 'Invalid filename', 400);
  }
  const filePath = path.join(uploadDir(), filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  return success(res, null, 'File deleted');
});
