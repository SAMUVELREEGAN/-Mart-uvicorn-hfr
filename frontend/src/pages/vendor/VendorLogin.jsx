import { useCmsContent } from '../../contexts';
import { Link, useNavigate } from 'react-router-dom';
import FormBuilder from '../../components/forms/FormBuilder';
import { useAuth } from '../../contexts/AuthContext';
import { getVendorPostAuthPath } from '../../utils/vendorRedirect';
import '../user/Auth.css';

export default function VendorLogin() {
  const formsConfig = useCmsContent('forms');
  const { loginVendor } = useAuth();
  const authConfig = formsConfig.auth.vendorLogin;

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const v = await loginVendor(values.email, values.password);
      navigate(getVendorPostAuthPath(v));
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
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
