import CategoryDetailsTemplate1 from './templates/CategoryDetailsTemplate1';
import CategoryDetailsTemplate2 from './templates/CategoryDetailsTemplate2';
import CategoryDetailsTemplate3 from './templates/CategoryDetailsTemplate3';
import CategoryDetailsTemplate4 from './templates/CategoryDetailsTemplate4';
import CategoryDetailsTemplate5 from './templates/CategoryDetailsTemplate5';

export const CATEGORY_DETAILS_TEMPLATE_OPTIONS = [
  { value: 'template1', label: 'Template 1 (Default)' },
  { value: 'template2', label: 'Template 2 (Modern Grid)' },
  { value: 'template3', label: 'Template 3 (Card-Based)' },
  { value: 'template4', label: 'Template 4 (Image-Focused)' },
  { value: 'template5', label: 'Template 5 (Premium Marketplace)' },
];

export const CATEGORY_DETAILS_TEMPLATES = {
  template1: CategoryDetailsTemplate1,
  template2: CategoryDetailsTemplate2,
  template3: CategoryDetailsTemplate3,
  template4: CategoryDetailsTemplate4,
  template5: CategoryDetailsTemplate5,
};

export function resolveCategoryDetailsTemplate(templateKey) {
  return CATEGORY_DETAILS_TEMPLATES[templateKey] || CategoryDetailsTemplate1;
}
