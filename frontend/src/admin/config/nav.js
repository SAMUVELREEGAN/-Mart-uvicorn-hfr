export const adminNavGroups = [
  {
    title: 'Overview',
    items: [
      { key: 'dashboard', title: 'Dashboard', path: '/admin', end: true, icon: 'dashboard' },
    ],
  },
  {
    title: 'Users & Vendors',
    items: [
      { key: 'users', title: 'Users', path: '/admin/users', icon: 'users' },
      { key: 'vendors', title: 'Vendors', path: '/admin/vendors', icon: 'vendors' },
      { key: 'vendor-applications', title: 'Vendor Applications', path: '/admin/vendor-applications', icon: 'vendorApplications', isPage: true },
    ],
  },
  {
    title: 'Vendor Config',
    items: [
      { key: 'vendor-config', title: 'Registration Config', path: '/admin/vendor-config', icon: 'vendorConfig', isPage: true },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { key: 'product-categories', title: 'Product Categories', path: '/admin/product-categories', icon: 'categories', isPage: true },
      { key: 'service-categories', title: 'Service Categories', path: '/admin/service-categories', icon: 'categories', isPage: true },
      { key: 'subcategories', title: 'Sub Categories', path: '/admin/subcategories', icon: 'subcategories', isPage: true },
      { key: 'brands', title: 'Brands', path: '/admin/brands', icon: 'brands' },
      { key: 'highlight-categories', title: 'Highlight Categories', path: '/admin/highlight-categories', icon: 'highlights', isPage: true },
    ],
  },
  {
    title: 'Operations',
    items: [
      { key: 'orders', title: 'Orders', path: '/admin/orders', icon: 'orders' },
      { key: 'bookings', title: 'Bookings', path: '/admin/bookings', icon: 'bookings' },
      { key: 'reviews', title: 'Reviews', path: '/admin/reviews', icon: 'reviews' },
    ],
  },
  {
    title: 'Frontend CMS',
    isCms: true,
    items: [
      { key: 'banners', title: 'Banners & Promos', path: '/admin/banners', icon: 'banners', cmsGroup: 'media' },
      { key: 'home-sections', title: 'Homepage Sections', path: '/admin/home-sections', icon: 'sections', cmsGroup: 'homepage' },
      { key: 'faqs', title: 'FAQ Content', path: '/admin/faqs', icon: 'faq', cmsGroup: 'content' },
      { key: 'settings', title: 'Site Settings', path: '/admin/settings', icon: 'settings', cmsGroup: 'config' },
    ],
  },
  {
    title: 'Account',
    items: [
      { key: 'profile', title: 'Profile', path: '/admin/profile', isPage: true, icon: 'profile' },
    ],
  },
];

export const moduleKeys = adminNavGroups
  .flatMap((g) => g.items)
  .filter((item) => !item.isPage && item.key !== 'dashboard')
  .map((item) => item.key);
