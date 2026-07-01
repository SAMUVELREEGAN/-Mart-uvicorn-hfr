import header from '../json/header.json';
import footer from '../json/footer.json';
import hero from '../json/hero.json';
import catalog from '../json/catalog.json';
import forms from '../json/forms.json';
import buttons from '../json/buttons.json';
import icons from '../json/icons.json';
import dashboards from '../json/dashboards.json';
import sidebar from '../json/sidebar.json';
import categories from '../json/categories.json';
import locations from '../json/locations.json';
import brands from '../json/brands.json';
import theme from '../json/theme.json';
import validations from '../json/validations.json';

const defaultPages = {
  contact: { title: 'Contact Us', description: 'Get in touch with our support team.' },
  privacy: { title: 'Privacy Policy', description: 'Your privacy matters to us.' },
  terms: { title: 'Terms of Service', description: 'Please read our terms carefully.' },
  vendors: { title: 'Vendors', description: 'Browse all registered vendors.' },
  bookings: { title: 'Bookings', description: 'Your service bookings will appear here.' },
};

export const cmsFallbacks = {
  header,
  footer,
  hero,
  catalog,
  forms,
  buttons,
  icons,
  dashboards,
  sidebar,
  categories,
  locations,
  brands,
  theme,
  validations,
  pages: defaultPages,
  vendor: {
    vendor: hero.vendor || {},
    startBusiness: hero.startBusiness || {},
    vendorLanding: hero.vendorLanding || {},
  },
};

export function getCmsFallback(key) {
  return cmsFallbacks[key] || {};
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Merge API CMS content over local fallbacks so new keys stay available. */
export function deepMergeCms(base, override) {
  if (!isPlainObject(base)) return override ?? base;
  if (!isPlainObject(override)) return base;
  const result = { ...base };
  Object.keys(override).forEach((key) => {
    const baseVal = base[key];
    const overrideVal = override[key];
    if (isPlainObject(baseVal) && isPlainObject(overrideVal)) {
      result[key] = deepMergeCms(baseVal, overrideVal);
    } else if (overrideVal !== undefined) {
      result[key] = overrideVal;
    }
  });
  return result;
}
