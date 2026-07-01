import { useCmsContent } from '../../contexts';
import { Link, useNavigate } from 'react-router-dom';
import FormBuilder from '../../components/forms/FormBuilder';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

export default function Signup() {
  const formsConfig = useCmsContent('forms');
  const dashboardsConfig = useCmsContent('dashboards');
  const { signupUser } = useAuth();
  const navigate = useNavigate();
  const authConfig = formsConfig.auth.signup;
  const dashboardHome = dashboardsConfig.user.routes.home;

  const handleSubmit = async (values) => {
    try {
      await signupUser(values);
      navigate(dashboardHome);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">{authConfig.title}</h1>
        <p className="auth-page__subtitle">{authConfig.subtitle}</p>
        <FormBuilder fields={formsConfig.userSignup} onSubmit={handleSubmit} submitKey="signup" />
        <p className="auth-page__footer">
          {authConfig.footerText} <Link to={authConfig.footerLink.path}>{authConfig.footerLink.label}</Link>
        </p>
      </div>
    </div>
  );
}
