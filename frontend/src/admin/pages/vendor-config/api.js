import adminApi from '../../../services/adminApi';
import { buildUiPayload, editorStateToField } from './constants';

export async function saveStep(item, editing) {
  if (editing) {
    await adminApi.put(`/admin/vendor-reg-steps/${editing.id}`, item);
  } else {
    await adminApi.post('/admin/vendor-reg-steps', item);
  }
}

export async function deleteStep(id) {
  await adminApi.delete(`/admin/vendor-reg-steps/${id}`);
}

export async function reorderSteps(items) {
  await adminApi.patch('/admin/vendor-reg-steps/reorder', {
    items: items.map((item, i) => ({ id: item.id, sortOrder: i })),
  });
}

export async function saveSection(item, editing) {
  if (editing) {
    await adminApi.put(`/admin/vendor-form-sections/${editing.id}`, item);
  } else {
    await adminApi.post('/admin/vendor-form-sections', item);
  }
}

export async function deleteSection(id) {
  await adminApi.delete(`/admin/vendor-form-sections/${id}`);
}

export async function saveField(editorState, editing) {
  const payload = editorStateToField(editorState);
  if (editing) {
    await adminApi.put(`/admin/vendor-form-fields/${editing.id}`, payload);
  } else {
    await adminApi.post('/admin/vendor-form-fields', payload);
  }
}

export async function deleteField(id) {
  await adminApi.delete(`/admin/vendor-form-fields/${id}`);
}

export async function toggleFieldStatus(id, status) {
  await adminApi.put(`/admin/vendor-form-fields/${id}`, { status });
}

export async function reorderFields(items) {
  await adminApi.patch('/admin/vendor-form-fields/reorder', {
    items: items.map((item, i) => ({ id: item.id, sortOrder: i })),
  });
}

export async function saveTerms(item, editing) {
  if (editing) {
    await adminApi.put(`/admin/vendor-terms/${editing.id}`, item);
  } else {
    await adminApi.post('/admin/vendor-terms', item);
  }
}

export async function deleteTerms(id) {
  await adminApi.delete(`/admin/vendor-terms/${id}`);
}

export async function savePlan(item, editing) {
  const payload = {
    ...item,
    features: Array.isArray(item.features)
      ? item.features
      : String(item.features || '').split('\n').map((s) => s.trim()).filter(Boolean),
  };
  if (editing) {
    await adminApi.put(`/admin/vendor-pricing-plans/${editing.id}`, payload);
  } else {
    await adminApi.post('/admin/vendor-pricing-plans', payload);
  }
}

export async function deletePlan(id) {
  await adminApi.delete(`/admin/vendor-pricing-plans/${id}`);
}

export async function reorderPlans(items) {
  await adminApi.patch('/admin/vendor-pricing-plans/reorder', {
    items: items.map((item, i) => ({ id: item.id, sortOrder: i })),
  });
}

export async function saveUiMessages(form) {
  await adminApi.put('/admin/vendor-config/ui', { value: buildUiPayload(form) });
}
