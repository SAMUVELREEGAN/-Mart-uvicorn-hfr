import { useEffect, useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminAlert from '../components/AdminAlert';
import AdminButton from '../components/AdminButton';
import FormSection from '../components/FormSection';
import '../styles/admin.css';

export default function AdminProfile() {
  const { admin, updateProfile } = useAdmin();
  const [form, setForm] = useState({
    name: '', email: '', currentPassword: '', password: '', confirmPassword: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (admin) setForm((prev) => ({ ...prev, name: admin.name || '', email: admin.email || '' }));
  }, [admin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) {
        payload.password = form.password;
        payload.currentPassword = form.currentPassword;
      }
      await updateProfile(payload);
      setMessage('Profile updated successfully');
      setForm((prev) => ({ ...prev, currentPassword: '', password: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Profile" subtitle="Manage your admin account settings" />
      {message && <AdminAlert type="success">{message}</AdminAlert>}
      {error && <AdminAlert type="error">{error}</AdminAlert>}
      <form onSubmit={handleSubmit}>
        <FormSection title="Account Information" description="Your display name and login email">
          <div className="adm-field-grid adm-field-grid--2">
            <div className="adm-field">
              <label htmlFor="name" className="adm-field__label">Name</label>
              <input id="name" className="adm-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="adm-field">
              <label htmlFor="email" className="adm-field__label">Email</label>
              <input id="email" className="adm-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
        </FormSection>
        <FormSection title="Change Password" description="Leave blank to keep your current password" collapsible defaultOpen={false}>
          <div className="adm-field-grid adm-field-grid--1">
            <div className="adm-field">
              <label htmlFor="currentPassword" className="adm-field__label">Current Password</label>
              <input id="currentPassword" className="adm-input" type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
            </div>
            <div className="adm-field">
              <label htmlFor="password" className="adm-field__label">New Password</label>
              <input id="password" className="adm-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="adm-field">
              <label htmlFor="confirmPassword" className="adm-field__label">Confirm New Password</label>
              <input id="confirmPassword" className="adm-input" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
            </div>
          </div>
        </FormSection>
        <div className="adm-form-actions">
          <AdminButton type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</AdminButton>
        </div>
      </form>
    </div>
  );
}
