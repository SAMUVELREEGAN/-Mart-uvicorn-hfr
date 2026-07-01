import { useCmsContent } from '../../contexts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormBuilder from '../../components/forms/FormBuilder';
import Tabs from '../../components/common/Tabs';
import { useAuth } from '../../contexts/AuthContext';
import { saveCredentials } from '../../utils/credentials';
import { getVendorPostAuthPath } from '../../utils/vendorRedirect';
import '../user/Auth.css';
import './VendorOnboardAuth.css';

export default function VendorOnboardAuth() {
  const formsConfig = useCmsContent('forms');
  const sidebarConfig = useCmsContent('sidebar');
  const [activeTab, setActiveTab] = useState('login');
  const { loginUser, signupUser, enableVendorFromUser, isVendor, vendor, pendingBusinessType, user } = useAuth();
  const navigate = useNavigate();
  const onboarding = sidebarConfig.onboarding;
  const authConfig = onboarding.auth;
  const redirectTo = authConfig.redirectAfterAuth || onboarding.routes.registration || '/vendor/registration';

  useEffect(() => {
    if (!pendingBusinessType) {
      navigate(onboarding.routes.businessType, { replace: true });
      return;
    }
    if (isVendor) {
      navigate(getVendorPostAuthPath(vendor), { replace: true });
      return;
    }
    if (user) {
      enableVendorFromUser()
        .then((v) => navigate(getVendorPostAuthPath(v), { replace: true }))
        .catch((err) => {
          console.error(err);
          alert(err.response?.data?.message || 'Failed to enable vendor account');
        });
    }
  }, [pendingBusinessType, isVendor, vendor, user, navigate, redirectTo, onboarding.routes, enableVendorFromUser]);

  const completeOnboarding = async (account) => {
    const v = await enableVendorFromUser(account);
    navigate(getVendorPostAuthPath(v));
  };

  const handleLogin = async (values) => {
    const account = await loginUser(values.email, values.password);
    saveCredentials(values.email, values.password);
    await completeOnboarding(account);
  };

  const handleSignup = async (values) => {
    const account = await signupUser(values);
    await completeOnboarding(account);
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
