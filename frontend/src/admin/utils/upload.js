import adminApi, { getApiBaseUrl } from '../../services/adminApi';
import { resolveMediaUrl, uploadFilenameFromUrl } from '../../utils/mediaUrl';

export async function uploadAdminFile(file) {
  const fd = new FormData();
  fd.append('image', file);
  const { data } = await adminApi.post('/admin/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.url;
}

export async function deleteAdminFile(url) {
  const filename = uploadFilenameFromUrl(url);
  if (!filename) return;
  try {
    await adminApi.delete(`/admin/upload/${filename}`);
  } catch {
    /* file may already be gone */
  }
}

export function previewUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return resolveMediaUrl(path);
}

export { getApiBaseUrl };
