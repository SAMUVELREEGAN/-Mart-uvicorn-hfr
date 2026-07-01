import { useEffect, useState } from 'react';
import AdminCard from '../../components/AdminCard';
import AdminButton from '../../components/AdminButton';
import FormSection from '../../components/FormSection';
import { saveUiMessages } from './api';

export default function MessagesPanel({ uiMessages, onRefresh, toast }) {
  const [form, setForm] = useState(uiMessages);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(uiMessages);
  }, [uiMessages]);

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveUiMessages(form);
      toast.success('Screen messages saved');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save messages');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="vc-panel">
      <div className="vc-panel-toolbar">
        <div>
          <h2>Screen Messages</h2>
          <p className="vc-panel-desc">Labels and messages shown during vendor registration and approval</p>
        </div>
        <AdminButton label={saving ? 'Saving...' : 'Save Messages'} icon="save" onClick={handleSave} disabled={saving} />
      </div>

      <div className="vc-panel__grid vc-panel__grid--2">
        <AdminCard>
          <FormSection title="Registration Page" description="Main registration wizard text">
            <div className="adm-field-grid adm-field-grid--2">
              <div className="adm-field adm-field--full">
                <label className="adm-field__label">Page Title</label>
                <input className="adm-input" value={form.pageTitle} onChange={(e) => set({ pageTitle: e.target.value })} />
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-field__label">Page Subtitle</label>
                <input className="adm-input" value={form.pageSubtitle} onChange={(e) => set({ pageSubtitle: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Step Progress Label</label>
                <input className="adm-input" value={form.stepProgress} onChange={(e) => set({ stepProgress: e.target.value })} />
                <span className="adm-field__hint">Use {'{current}'} and {'{total}'} placeholders</span>
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Loading Message</label>
                <input className="adm-input" value={form.loading} onChange={(e) => set({ loading: e.target.value })} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Navigation Buttons" description="Back, continue, and submit button labels">
            <div className="adm-field-grid adm-field-grid--2">
              <div className="adm-field">
                <label className="adm-field__label">Back Button</label>
                <input className="adm-input" value={form.backLabel} onChange={(e) => set({ backLabel: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Continue Button</label>
                <input className="adm-input" value={form.nextLabel} onChange={(e) => set({ nextLabel: e.target.value })} />
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-field__label">Submit Button</label>
                <input className="adm-input" value={form.submitLabel} onChange={(e) => set({ submitLabel: e.target.value })} />
              </div>
            </div>
          </FormSection>
        </AdminCard>

        <AdminCard>
          <FormSection title="Pricing Step Labels" description="Text on the plan selection step">
            <div className="adm-field-grid adm-field-grid--2">
              <div className="adm-field adm-field--full">
                <label className="adm-field__label">Select Plan Label</label>
                <input className="adm-input" value={form.pricingSelectLabel} onChange={(e) => set({ pricingSelectLabel: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Free Label</label>
                <input className="adm-input" value={form.pricingFreeLabel} onChange={(e) => set({ pricingFreeLabel: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Per Month Suffix</label>
                <input className="adm-input" value={form.pricingPerMonthLabel} onChange={(e) => set({ pricingPerMonthLabel: e.target.value })} />
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-field__label">Features Section Title</label>
                <input className="adm-input" value={form.pricingFeaturesTitle} onChange={(e) => set({ pricingFeaturesTitle: e.target.value })} />
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-field__label">Terms Scroll Hint</label>
                <input className="adm-input" value={form.termsScrollHint} onChange={(e) => set({ termsScrollHint: e.target.value })} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Pending Approval Screen" description="Shown after vendor submits registration">
            <div className="adm-field-grid adm-field-grid--1">
              <div className="adm-field">
                <label className="adm-field__label">Title</label>
                <input className="adm-input" value={form.pendingTitle} onChange={(e) => set({ pendingTitle: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Message</label>
                <textarea className="adm-input adm-input--textarea" rows={3} value={form.pendingMessage} onChange={(e) => set({ pendingMessage: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Status Label</label>
                <input className="adm-input" value={form.pendingStatusLabel} onChange={(e) => set({ pendingStatusLabel: e.target.value })} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Rejected Application Screen" description="Shown when admin rejects a vendor">
            <div className="adm-field-grid adm-field-grid--1">
              <div className="adm-field">
                <label className="adm-field__label">Title</label>
                <input className="adm-input" value={form.rejectedTitle} onChange={(e) => set({ rejectedTitle: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Message</label>
                <textarea className="adm-input adm-input--textarea" rows={3} value={form.rejectedMessage} onChange={(e) => set({ rejectedMessage: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Resubmit Button Label</label>
                <input className="adm-input" value={form.rejectedResubmitLabel} onChange={(e) => set({ rejectedResubmitLabel: e.target.value })} />
              </div>
            </div>
          </FormSection>
        </AdminCard>
      </div>
    </div>
  );
}
