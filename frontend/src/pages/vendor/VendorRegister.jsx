import { Link, useNavigate } from 'react-router-dom';
import formsConfig from '../../json/forms.json';
import FormBuilder from '../../components/forms/FormBuilder';
import { useAuth } from '../../contexts/AuthContext';
import '../user/Auth.css';

export default function VendorRegister() {
  const { registerVendor } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    registerVendor(values);
    navigate('/vendor/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-page__card auth-page__card--wide">
        <h1 className="auth-page__title">Start Your Business</h1>
        <p className="auth-page__subtitle">Register as a vendor on MartPlace</p>
        <FormBuilder fields={formsConfig.vendorRegister} onSubmit={handleSubmit} submitKey="vendorRegister" />
        <p className="auth-page__footer">
          Already registered? <Link to="/vendor/login">Vendor Login</Link>
        </p>
      </div>
    </div>
  );
}
