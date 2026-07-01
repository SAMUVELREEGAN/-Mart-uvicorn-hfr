const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

export function resolveMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export function isUploadedMedia(value) {
  return Boolean(value && (value.startsWith('/uploads') || value.startsWith('http')));
}

export function uploadFilenameFromUrl(url) {
  if (!url || !url.includes('/uploads/')) return null;
  return url.split('/uploads/').pop().split('?')[0];
}
