import { Link, useNavigate } from 'react-router-dom';
import formsConfig from '../../json/forms.json';
import FormBuilder from '../../components/forms/FormBuilder';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

export default function Signup() {
  const { signupUser } = useAuth();
  const navigate = useNavigate();
  const authConfig = formsConfig.auth.signup;

  const handleSubmit = (values) => {
    signupUser(values);
    navigate('/');
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
