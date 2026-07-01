import { getCmsValidations } from './cmsRegistry';

export function validateField(key, value, allValues = {}) {
  const validations = getCmsValidations();
  const rules = validations[key];
  const errors = [];

  if (rules) {
    if (rules.minLength && value && value.length < rules.minLength) {
      errors.push(rules.message);
    }
    if (rules.pattern && value && !new RegExp(rules.pattern).test(value)) {
      errors.push(rules.message);
    }
    if (rules.min !== undefined && value !== '' && Number(value) < rules.min) {
      errors.push(rules.message);
    }
    if (rules.match && value !== allValues[rules.match]) {
      errors.push(rules.message);
    }
  }

  return errors;
}

export function validateForm(fields, values) {
  const validations = getCmsValidations();
  const errors = {};
  fields.forEach((field) => {
    const fieldErrors = [];
    if (field.required && (!values[field.key] || values[field.key] === '')) {
      fieldErrors.push(validations.required?.message || 'This field is required');
    }
    const ruleErrors = validateField(field.key, values[field.key], values);
    if (ruleErrors.length) fieldErrors.push(...ruleErrors);
    if (fieldErrors.length) errors[field.key] = fieldErrors[0];
  });
  return errors;
}

export function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function formatPrice(price, prefix = '$') {
  return `${prefix}${Number(price).toFixed(2)}`;
}

export function parseList(value) {
  if (!value) return [];
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

export function parseSpecifications(value) {
  if (!value) return {};
  const specs = {};
  value.split('\n').forEach((line) => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) specs[key.trim()] = rest.join(':').trim();
  });
  return specs;
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getAverageRating(reviews) {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
