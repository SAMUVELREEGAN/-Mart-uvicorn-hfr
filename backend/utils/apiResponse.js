const formatDoc = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  const { _id, __v, password, passwordHash, refreshToken, ...rest } = obj;
  if (rest.id === undefined && _id) rest.id = _id;
  return rest;
};

const formatDocs = (docs) => docs.map((d) => formatDoc(d));

const success = (res, data = null, message = 'Success', statusCode = 200, meta = null) => {
  const payload = { success: true, message, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

const error = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

module.exports = { formatDoc, formatDocs, success, error };
