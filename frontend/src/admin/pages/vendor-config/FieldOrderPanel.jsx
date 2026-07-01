import AdminCard from '../../components/AdminCard';
import SortableList from '../../components/SortableList';
import { reorderFields } from './api';

export default function FieldOrderPanel({ steps, fields, onRefresh, toast }) {
  const handleReorder = async (stepKey, next) => {
    await reorderFields(next.map((f, i) => ({ ...f, sortOrder: i })));
    toast.success(`Order updated for ${stepKey} fields`);
    onRefresh();
  };

  return (
    <div className="vc-panel">
      <div className="vc-panel-toolbar">
        <div>
          <h2>Field Order</h2>
          <p className="vc-panel-desc">Drag and drop to reorder fields within each registration step</p>
        </div>
      </div>

      {steps.filter((s) => s.stepType === 'form').map((step) => {
        const stepFields = fields
          .filter((f) => f.stepKey === step.key)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        if (!stepFields.length) return null;
        return (
          <AdminCard key={step.key} className="vc-mb">
            <h3 className="vc-order-step-title">{step.title}</h3>
            <SortableList
              items={stepFields}
              onReorder={(next) => handleReorder(step.key, next)}
              renderItem={(field) => (
                <div className="vc-order-item">
                  <strong>{field.label}</strong>
                  <span className="vc-field-card__meta">{field.name} · {field.type}{field.required ? ' · required' : ''}</span>
                </div>
              )}
            />
          </AdminCard>
        );
      })}
    </div>
  );
}
