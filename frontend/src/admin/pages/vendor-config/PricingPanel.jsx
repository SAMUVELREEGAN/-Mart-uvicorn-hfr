import { useState } from 'react';
import AdminCard from '../../components/AdminCard';
import AdminButton from '../../components/AdminButton';
import FormSection from '../../components/FormSection';
import SortableList from '../../components/SortableList';
import { emptyPlan } from './constants';
import { deletePlan, reorderPlans, savePlan } from './api';

export default function PricingPanel({ plans, onRefresh, toast, onConfirm }) {
  const [form, setForm] = useState(emptyPlan());
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyPlan(), sortOrder: plans.length });
    setShowForm(true);
  };

  const openEdit = (plan) => {
    setEditing(plan);
    setForm({ ...plan, features: plan.features || [] });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.key?.trim() || !form.name?.trim()) {
      toast.error('Plan key and name are required');
      return;
    }
    setSaving(true);
    try {
      await savePlan(form, editing);
      toast.success(editing ? 'Plan updated' : 'Plan created');
      setShowForm(false);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (plan) => {
    onConfirm({
      title: 'Delete pricing plan?',
      message: `Remove "${plan.name}" from vendor registration?`,
      onConfirm: async () => {
        await deletePlan(plan.id);
        toast.success('Plan deleted');
        onRefresh();
      },
    });
  };

  const handleReorder = async (next) => {
    await reorderPlans(next);
    toast.success('Plan order updated');
    onRefresh();
  };

  return (
    <div className="vc-panel">
      <div className="vc-panel-toolbar">
        <div>
          <h2>Pricing Plans</h2>
          <p className="vc-panel-desc">Configure plans shown in the final registration step (UI only, no payments)</p>
        </div>
        <AdminButton label="Add Plan" icon="add" onClick={openCreate} />
      </div>

      <AdminCard className="vc-mb">
        <SortableList
          items={plans}
          onReorder={handleReorder}
          renderItem={(plan) => (
            <div className="vc-plan-row">
              <div>
                <strong>{plan.name}</strong>
                <span className="vc-field-card__meta">{plan.key} · {plan.priceLabel || (plan.price === 0 ? 'Free' : `$${plan.price}`)}</span>
                {plan.highlighted && <span className="vc-badge vc-badge--highlight">Highlighted</span>}
              </div>
              <div className="vc-field-card__actions">
                <AdminButton label="Edit" icon="edit" size="sm" variant="secondary" title="Edit plan" onClick={() => openEdit(plan)} />
                <AdminButton label="Delete" icon="delete" size="sm" variant="danger" title="Delete plan" onClick={() => handleDelete(plan)} />
              </div>
            </div>
          )}
        />
      </AdminCard>

      {showForm && (
        <AdminCard>
          <FormSection title={editing ? 'Edit Plan' : 'New Plan'} description="Plan details and feature list">
            <div className="adm-field-grid adm-field-grid--2">
              <div className="adm-field">
                <label className="adm-field__label">Plan Key</label>
                <input className="adm-input" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} disabled={!!editing} />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Plan Name</label>
                <input className="adm-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Price (number)</label>
                <input className="adm-input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div className="adm-field">
                <label className="adm-field__label">Price Label</label>
                <input className="adm-input" value={form.priceLabel || ''} onChange={(e) => setForm({ ...form, priceLabel: e.target.value })} placeholder="e.g. Free or $29/month" />
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-field__label">Description</label>
                <textarea className="adm-input adm-input--textarea" rows={2} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="adm-field adm-field--full">
                <label className="adm-field__label">Features</label>
                <textarea
                  className="adm-input adm-input--textarea"
                  rows={5}
                  value={(form.features || []).join('\n')}
                  onChange={(e) => setForm({ ...form, features: e.target.value.split('\n') })}
                  placeholder="One feature per line"
                />
                <span className="adm-field__hint">Enter each feature on a new line</span>
              </div>
            </div>
            <label className="vc-toggle vc-mb">
              <input type="checkbox" checked={!!form.highlighted} onChange={(e) => setForm({ ...form, highlighted: e.target.checked })} />
              <span>Highlight this plan (recommended badge)</span>
            </label>
            <div className="vc-panel-toolbar vc-panel-toolbar--footer">
              <AdminButton label="Cancel" icon="cancel" variant="ghost" onClick={() => setShowForm(false)} />
              <AdminButton label={saving ? 'Saving...' : 'Save Plan'} icon="save" onClick={handleSave} disabled={saving} />
            </div>
          </FormSection>
        </AdminCard>
      )}
    </div>
  );
}
