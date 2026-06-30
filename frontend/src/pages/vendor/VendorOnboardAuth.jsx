import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sidebarConfig from '../../json/sidebar.json';
import formsConfig from '../../json/forms.json';
import FormBuilder from '../../components/forms/FormBuilder';
import Tabs from '../../components/common/Tabs';
import { useAuth } from '../../contexts/AuthContext';
import { saveCredentials } from '../../utils/credentials';
import '../user/Auth.css';
import './VendorOnboardAuth.css';

export default function VendorOnboardAuth() {
  const [activeTab, setActiveTab] = useState('login');
  const { loginUser, signupUser, enableVendorFromUser, isVendor, pendingBusinessType, user } = useAuth();
  const navigate = useNavigate();
  const onboarding = sidebarConfig.onboarding;
  const authConfig = onboarding.auth;
  const redirectTo = authConfig.redirectAfterAuth || onboarding.routes.dashboard;

  useEffect(() => {
    if (!pendingBusinessType) {
      navigate(onboarding.routes.businessType, { replace: true });
      return;
    }
    if (isVendor) {
      navigate(redirectTo, { replace: true });
      return;
    }
    if (user) {
      enableVendorFromUser(user);
      navigate(redirectTo, { replace: true });
    }
  }, [pendingBusinessType, isVendor, user, navigate, redirectTo, onboarding.routes, enableVendorFromUser]);

  const completeOnboarding = (account) => {
    enableVendorFromUser(account);
    navigate(redirectTo);
  };

  const handleLogin = (values) => {
    const account = loginUser(values.email, values.password);
    saveCredentials(values.email, values.password);
    completeOnboarding(account);
  };

  const handleSignup = (values) => {
    const account = signupUser(values);
    completeOnboarding(account);
  };

  if (!pendingBusinessType || isVendor) {
    return null;
  }

  if (user) {
    return null;
  }

  const tabs = authConfig.tabs.map((tab) => ({
    ...tab,
    content:
      tab.key === 'login' ? (
        <FormBuilder
          fields={formsConfig.userLogin}
          onSubmit={handleLogin}
          submitKey="login"
        />
      ) : (
        <FormBuilder
          fields={formsConfig.userSignup}
          onSubmit={handleSignup}
          submitKey="signup"
        />
      ),
  }));

  return (
    <div className="auth-page vendor-onboard-auth">
      <div className="auth-page__card vendor-onboard-auth__card">
        <h1 className="auth-page__title">{authConfig.title}</h1>
        <p className="auth-page__subtitle">{authConfig.subtitle}</p>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  );
}
