const STORAGE_KEY = 'mart_saved_credentials';

export function getSavedCredentials() {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function saveCredentials(email, password) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }));
}
