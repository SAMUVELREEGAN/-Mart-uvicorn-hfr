export const VENDOR_CONFIG_TABS = [
  { key: 'steps', label: 'Registration Steps' },
  { key: 'personal', label: 'Personal Details' },
  { key: 'business', label: 'Business Details' },
  { key: 'terms', label: 'Terms & Conditions' },
  { key: 'pricing', label: 'Pricing Plans' },
  { key: 'fields', label: 'Form Fields' },
  { key: 'validation', label: 'Field Validation' },
  { key: 'order', label: 'Field Order' },
  { key: 'messages', label: 'Screen Messages' },
];

export const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'select', label: 'Dropdown' },
  { value: 'multiselect', label: 'Multi Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'file', label: 'File Upload' },
  { value: 'image', label: 'Image Upload' },
];

export const OPTIONS_KEYS = [
  { value: '', label: 'None (manual options)' },
  { value: 'productCategories', label: 'Product Categories' },
  { value: 'serviceCategories', label: 'Service Categories' },
];

export const BUSINESS_TYPE_VALUES = [
  { value: 'product', label: 'Product' },
  { value: 'service', label: 'Service' },
  { value: 'both', label: 'Both' },
];

export const emptyField = (stepKey = '', sectionId = '') => ({
  stepKey,
  sectionId: sectionId || '',
  name: '',
  label: '',
  type: 'text',
  placeholder: '',
  helpText: '',
  required: false,
  defaultValue: '',
  optionsKey: '',
  options: [],
  validation: {},
  showWhen: null,
  sortOrder: 0,
  status: 'active',
});

export const emptyStep = () => ({
  key: '',
  title: '',
  subtitle: '',
  stepType: 'form',
  termsType: '',
  sortOrder: 0,
  status: 'active',
});

export const emptySection = (stepKey = '') => ({
  stepKey,
  title: '',
  description: '',
  sortOrder: 0,
  status: 'active',
});

export const emptyTerms = () => ({
  type: 'business',
  title: '',
  content: '',
  acceptanceLabel: 'I have read and accept the terms and conditions',
  sortOrder: 0,
  status: 'active',
});

export const emptyPlan = () => ({
  key: '',
  name: '',
  price: 0,
  priceLabel: '',
  description: '',
  features: [],
  highlighted: false,
  sortOrder: 0,
  status: 'active',
});

export const defaultUiMessages = () => ({
  pageTitle: 'Vendor Registration',
  pageSubtitle: 'Complete your profile to start selling on MartPlace',
  stepProgress: 'Step {current} of {total}',
  loading: 'Loading registration form...',
  error: 'Failed to load registration configuration',
  backLabel: 'Back',
  nextLabel: 'Continue',
  submitLabel: 'Submit Application',
  termsScrollHint: 'Please read the full terms before accepting',
  pricingSelectLabel: 'Select a plan to continue',
  pricingFreeLabel: 'Free',
  pricingPerMonthLabel: '/month',
  pricingFeaturesTitle: 'Includes',
  pendingTitle: 'Waiting for Admin Approval',
  pendingMessage: 'Your vendor application has been submitted successfully. Our team will review your details and notify you once your account is approved.',
  pendingStatusLabel: 'Status: Pending Approval',
  rejectedTitle: 'Application Rejected',
  rejectedMessage: 'Your vendor application was not approved. Please review the feedback and resubmit your application.',
  rejectedResubmitLabel: 'Update Application',
});

export function parseUiFromApi(raw) {
  let ui = raw;
  if (typeof raw === 'string') {
    try { ui = JSON.parse(raw); } catch { ui = {}; }
  }
  const defaults = defaultUiMessages();
  const buttons = ui.buttons || {};
  const pending = ui.pendingApproval || {};
  const rejected = ui.rejected || {};
  const pricing = ui.pricing || {};
  const terms = ui.terms || {};
  return {
    pageTitle: ui.pageTitle || defaults.pageTitle,
    pageSubtitle: ui.pageSubtitle || defaults.pageSubtitle,
    stepProgress: ui.stepProgress || defaults.stepProgress,
    loading: ui.loading || defaults.loading,
    error: ui.error || defaults.error,
    backLabel: buttons.back?.label || defaults.backLabel,
    nextLabel: buttons.next?.label || defaults.nextLabel,
    submitLabel: buttons.submit?.label || defaults.submitLabel,
    termsScrollHint: terms.scrollHint || defaults.termsScrollHint,
    pricingSelectLabel: pricing.selectLabel || defaults.pricingSelectLabel,
    pricingFreeLabel: pricing.freeLabel || defaults.pricingFreeLabel,
    pricingPerMonthLabel: pricing.perMonthLabel || defaults.pricingPerMonthLabel,
    pricingFeaturesTitle: pricing.featuresTitle || defaults.pricingFeaturesTitle,
    pendingTitle: pending.title || defaults.pendingTitle,
    pendingMessage: pending.message || defaults.pendingMessage,
    pendingStatusLabel: pending.statusLabel || defaults.pendingStatusLabel,
    rejectedTitle: rejected.title || defaults.rejectedTitle,
    rejectedMessage: rejected.message || defaults.rejectedMessage,
    rejectedResubmitLabel: rejected.resubmitLabel || defaults.rejectedResubmitLabel,
  };
}

export function buildUiPayload(form) {
  return {
    pageTitle: form.pageTitle,
    pageSubtitle: form.pageSubtitle,
    stepProgress: form.stepProgress,
    loading: form.loading,
    error: form.error,
    buttons: {
      back: { label: form.backLabel, icon: 'FaArrowLeft' },
      next: { label: form.nextLabel, icon: 'FaArrowRight' },
      submit: { label: form.submitLabel, icon: 'FaPaperPlane' },
      save: { label: form.nextLabel, icon: 'FaSave' },
    },
    terms: { scrollHint: form.termsScrollHint },
    pricing: {
      selectLabel: form.pricingSelectLabel,
      freeLabel: form.pricingFreeLabel,
      perMonthLabel: form.pricingPerMonthLabel,
      featuresTitle: form.pricingFeaturesTitle,
    },
    pendingApproval: {
      title: form.pendingTitle,
      message: form.pendingMessage,
      icon: 'FaClock',
      statusLabel: form.pendingStatusLabel,
    },
    rejected: {
      title: form.rejectedTitle,
      message: form.rejectedMessage,
      icon: 'FaTimesCircle',
      resubmitLabel: form.rejectedResubmitLabel,
    },
  };
}

export function fieldToEditorState(field) {
  const validation = field.validation || {};
  const showWhen = field.showWhen || {};
  return {
    ...field,
    sectionId: field.sectionId || '',
    options: field.options?.length ? field.options : [],
    validatePattern: validation.pattern || '',
    validateMinLength: validation.minLength || '',
    validateMessage: validation.message || '',
    validateRequiredMessage: validation.requiredMessage || '',
    showWhenField: showWhen.field || '',
    showWhenValues: showWhen.values || [],
  };
}

export function editorStateToField(state) {
  const validation = {};
  if (state.validatePattern) validation.pattern = state.validatePattern;
  if (state.validateMinLength) validation.minLength = Number(state.validateMinLength);
  if (state.validateMessage) validation.message = state.validateMessage;
  if (state.validateRequiredMessage) validation.requiredMessage = state.validateRequiredMessage;

  let showWhen = null;
  if (state.showWhenField && state.showWhenValues?.length) {
    showWhen = { field: state.showWhenField, values: state.showWhenValues };
  }

  return {
    stepKey: state.stepKey,
    sectionId: state.sectionId ? Number(state.sectionId) : null,
    name: state.name,
    label: state.label,
    type: state.type,
    placeholder: state.placeholder || '',
    helpText: state.helpText || '',
    required: !!state.required,
    defaultValue: state.defaultValue || '',
    optionsKey: state.optionsKey || '',
    options: state.options || [],
    validation,
    showWhen,
    sortOrder: state.sortOrder ?? 0,
    status: state.status || 'active',
  };
}
