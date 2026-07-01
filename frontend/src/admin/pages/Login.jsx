import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import AdminAlert from '../components/AdminAlert';
import AdminButton from '../components/AdminButton';
import FormSection from '../components/FormSection';
import '../styles/admin.css';

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="adm-login-page">
      <form className="adm-login-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="adm-login-card__subtitle">Sign in to the MartPlace admin console</p>
        {error && <AdminAlert type="error">{error}</AdminAlert>}
        <div className="adm-field">
          <label htmlFor="email" className="adm-field__label">Email address</label>
          <input id="email" className="adm-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        </div>
        <div className="adm-field">
          <label htmlFor="password" className="adm-field__label">Password</label>
          <input id="password" className="adm-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </div>
        <AdminButton type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</AdminButton>
      </form>
    </div>
  );
}
