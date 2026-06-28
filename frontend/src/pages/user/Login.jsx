import { Link, useNavigate } from 'react-router-dom';
import formsConfig from '../../json/forms.json';
import FormBuilder from '../../components/forms/FormBuilder';
import { useAuth } from '../../contexts/AuthContext';
import { saveCredentials } from '../../utils/credentials';
import './Auth.css';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const authConfig = formsConfig.auth.login;

  const handleSubmit = (values) => {
    loginUser(values.email, values.password);
    saveCredentials(values.email, values.password);
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">{authConfig.title}</h1>
        <p className="auth-page__subtitle">{authConfig.subtitle}</p>
        <FormBuilder fields={formsConfig.userLogin} onSubmit={handleSubmit} submitKey="login" />
        <p className="auth-page__footer">
          {authConfig.footerText} <Link to={authConfig.footerLink.path}>{authConfig.footerLink.label}</Link>
        </p>
      </div>
    </div>
  );
}
