export function isFieldVisible(field, values) {
  if (!field.showWhen) return true;
  const current = values[field.showWhen.field];
  return field.showWhen.values?.includes(current);
}

export function validateDynamicFields(fields, values) {
  const errors = {};
  fields.forEach((field) => {
    if (!isFieldVisible(field, values)) return;
    const value = values[field.name];
    if (field.required && (value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length))) {
      errors[field.name] = field.validation?.requiredMessage || 'This field is required';
      return;
    }
    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(String(value))) {
        errors[field.name] = field.validation.message || 'Invalid value';
      }
    }
    if (field.validation?.minLength && value && String(value).length < field.validation.minLength) {
      errors[field.name] = field.validation.message || `Minimum ${field.validation.minLength} characters`;
    }
  });
  return errors;
}

export function buildInitialValues(fields, vendor = {}) {
  const merged = { ...vendor.registrationData };
  fields.forEach((field) => {
    if (merged[field.name] === undefined && field.defaultValue) {
      merged[field.name] = field.defaultValue;
    }
    if (merged[field.name] === undefined && vendor[field.name] !== undefined) {
      merged[field.name] = vendor[field.name];
    }
  });
  if (vendor.email && !merged.email) merged.email = vendor.email;
  if (vendor.ownerName && !merged.fullName) merged.fullName = vendor.ownerName;
  if (vendor.phone && !merged.mobile) merged.mobile = vendor.phone;
  if (vendor.businessName && !merged.businessName) merged.businessName = vendor.businessName;
  return merged;
}
