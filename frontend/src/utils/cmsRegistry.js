let cmsValidations = { required: { message: 'This field is required' } };

export function setCmsValidations(rules) {
  cmsValidations = rules && Object.keys(rules).length ? rules : { required: { message: 'This field is required' } };
}

export function getCmsValidations() {
  return cmsValidations;
}
