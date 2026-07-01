import { useCallback, useEffect, useState } from 'react';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminToast, { useAdminToast } from '../components/AdminToast';
import ConfirmDialog from '../components/ConfirmDialog';
import { VENDOR_CONFIG_TABS } from './vendor-config/constants';
import { useVendorConfigData } from './vendor-config/useVendorConfigData';
import StepsPanel from './vendor-config/StepsPanel';
import StepBuilderPanel from './vendor-config/StepBuilderPanel';
import TermsPanel from './vendor-config/TermsPanel';
import PricingPanel from './vendor-config/PricingPanel';
import AllFieldsPanel from './vendor-config/AllFieldsPanel';
import ValidationPanel from './vendor-config/ValidationPanel';
import FieldOrderPanel from './vendor-config/FieldOrderPanel';
import MessagesPanel from './vendor-config/MessagesPanel';
import '../styles/admin.css';
import './VendorConfigPage.css';

export default function VendorConfigPage() {
  const [activeTab, setActiveTab] = useState('steps');
  const { toasts, dismiss, success, error } = useAdminToast();
  const toast = { success, error };
  const {
    steps, sections, fields, terms, plans, uiMessages, loading, refresh,
  } = useVendorConfigData();

  const [confirm, setConfirm] = useState(null);

  const onConfirm = useCallback((config) => {
    setConfirm(config);
  }, []);

  const handleConfirm = async () => {
    if (confirm?.onConfirm) await confirm.onConfirm();
    setConfirm(null);
  };

  if (loading) {
    return (
      <div className="vc-page">
        <AdminPageHeader title="Vendor Config" subtitle="Loading configuration..." />
        <p className="vc-loading">Loading vendor registration settings...</p>
      </div>
    );
  }

  const renderPanel = () => {
    const common = { onRefresh: refresh, toast, onConfirm };
    switch (activeTab) {
      case 'steps':
        return <StepsPanel steps={steps} {...common} />;
      case 'personal':
        return (
          <StepBuilderPanel
            stepKey="personal"
            title="Personal Details"
            description="Configure fields vendors fill in for personal and contact information."
            steps={steps}
            sections={sections}
            fields={fields}
            {...common}
          />
        );
      case 'business':
        return (
          <StepBuilderPanel
            stepKey="business"
            title="Business Details"
            description="Configure business profile, categories, and branding fields."
            steps={steps}
            sections={sections}
            fields={fields}
            {...common}
          />
        );
      case 'terms':
        return <TermsPanel terms={terms} {...common} />;
      case 'pricing':
        return <PricingPanel plans={plans} {...common} />;
      case 'fields':
        return <AllFieldsPanel steps={steps} sections={sections} fields={fields} {...common} />;
      case 'validation':
        return <ValidationPanel fields={fields} {...common} />;
      case 'order':
        return <FieldOrderPanel steps={steps} fields={fields} {...common} />;
      case 'messages':
        return <MessagesPanel uiMessages={uiMessages} {...common} />;
      default:
        return null;
    }
  };

  return (
    <div className="vc-page">
      <AdminPageHeader
        title="Vendor Config"
        subtitle="Manage vendor registration steps, forms, terms, pricing, and messages"
      />

      <nav className="vc-tabs" aria-label="Vendor configuration sections">
        {VENDOR_CONFIG_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`vc-tabs__btn ${activeTab === tab.key ? 'vc-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="vc-page__content">{renderPanel()}</div>

      <AdminToast toasts={toasts} onDismiss={dismiss} />
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        message={confirm?.message}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
