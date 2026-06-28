import { Link, useNavigate } from 'react-router-dom';
import formsConfig from '../../json/forms.json';
import FormBuilder from '../../components/forms/FormBuilder';
import { useAuth } from '../../contexts/AuthContext';
import '../user/Auth.css';

export default function VendorLogin() {
  const { loginVendor } = useAuth();
  const navigate = useNavigate();
  const authConfig = formsConfig.auth.vendorLogin;

  const handleSubmit = (values) => {
    loginVendor(values.email, values.password);
    navigate('/vendor/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">{authConfig.title}</h1>
        <p className="auth-page__subtitle">{authConfig.subtitle}</p>
        <FormBuilder fields={formsConfig.vendorLogin} onSubmit={handleSubmit} submitKey="vendorLogin" />
        <p className="auth-page__footer">
          {authConfig.footerText} <Link to={authConfig.footerLink.path}>{authConfig.footerLink.label}</Link>
        </p>
      </div>
    </div>
  );
}
