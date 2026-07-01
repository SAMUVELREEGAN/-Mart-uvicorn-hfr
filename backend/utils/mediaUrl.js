const path = require('path');
const fs = require('fs');

const uploadDir = () => path.join(__dirname, '..', process.env.UPLOAD_PATH || 'uploads');

const deleteUploadFile = (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') return;
  if (!fileUrl.startsWith('/uploads/')) return;
  const filename = path.basename(fileUrl);
  const filePath = path.join(uploadDir(), filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

module.exports = { deleteUploadFile, uploadDir };
