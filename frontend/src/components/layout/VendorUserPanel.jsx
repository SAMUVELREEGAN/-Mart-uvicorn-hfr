import { Link, useNavigate } from 'react-router-dom';
import headerConfig from '../../json/header.json';
import formsConfig from '../../json/forms.json';
import { Icon } from '../../utils/iconResolver';
import { useAuth } from '../../contexts/AuthContext';
import { getSavedCredentials, saveCredentials } from '../../utils/credentials';
import FormBuilder from '../forms/FormBuilder';
import Button from '../common/Button';
import './VendorUserPanel.css';

export default function VendorUserPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { loginUser, isAuthenticated, user } = useAuth();
  const config = headerConfig.vendorPopup;
  const saved = getSavedCredentials();
  const initialValues = saved ? { email: saved.email, password: saved.password } : {};

  const handleSubmit = (values) => {
    loginUser(values.email, values.password);
    saveCredentials(values.email, values.password);
    onClose();
    navigate(headerConfig.actions.vendor.path);
  };

  const handleContinueAuthenticated = () => {
    onClose();
    navigate(headerConfig.actions.vendor.path);
  };

  return (
    <>
      <div
        className={`vendor-panel-overlay ${isOpen ? 'vendor-panel-overlay--visible' : ''}`}
        onClick={onClose}
      />
      <aside className={`vendor-panel ${isOpen ? 'vendor-panel--open' : ''}`}>
        <div className="vendor-panel__header">
          <h2 className="vendor-panel__title">{config.title}</h2>
          <button type="button" className="vendor-panel__close" onClick={onClose} aria-label="Close">
            <Icon name={config.closeIcon} />
          </button>
        </div>
        <div className="vendor-panel__body">
          <p className="vendor-panel__subtitle">{config.subtitle}</p>

          {isAuthenticated && user ? (
            <div className="vendor-panel__authenticated">
              <div className="vendor-panel__user">
                <Icon name="FaUserCircle" className="vendor-panel__avatar" />
                <div>
                  <strong>{user.name || user.email}</strong>
                  <span>{user.email}</span>
                </div>
              </div>
              <Button
                label={config.continueButton.label}
                icon={config.continueButton.icon}
                variant="primary"
                fullWidth
                onClick={handleContinueAuthenticated}
              />
            </div>
          ) : (
            <>
              <FormBuilder
                fields={formsConfig.userLogin}
                onSubmit={handleSubmit}
                submitKey={config.continueButton.submitKey}
                initialValues={initialValues}
              />
              <Link to={config.skipLink.path} className="vendor-panel__skip" onClick={onClose}>
                {config.skipLink.label}
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
