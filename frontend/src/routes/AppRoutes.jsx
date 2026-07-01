import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import VendorLayout from '../layouts/VendorLayout';
import { ProtectedRoute } from './ProtectedRoute';

import Brand from '../pages/user/Brand';
import Home from '../pages/user/Home';
import Login from '../pages/user/Login';
import Signup from '../pages/user/Signup';
import ProductDetails from '../pages/user/ProductDetails';
import ServiceDetails from '../pages/user/ServiceDetails';
import Products from '../pages/user/Products';
import Services from '../pages/user/Services';
import Categories from '../pages/user/Categories';
import Search from '../pages/user/Search';
import Category from '../pages/user/Category';
import Profile from '../pages/user/Profile';
import UserDashboard from '../pages/user/UserDashboard';
import DashboardPlaceholder from '../pages/user/DashboardPlaceholder';
import Wishlist from '../pages/user/Wishlist';
import Orders from '../pages/user/Orders';
import Cart from '../pages/user/Cart';

import VendorLanding from '../pages/vendor/VendorLanding';
import BusinessTypeSelect from '../pages/vendor/BusinessTypeSelect';
import VendorOnboardAuth from '../pages/vendor/VendorOnboardAuth';
import VendorRegistration from '../pages/vendor/VendorRegistration';
import VendorPendingApproval from '../pages/vendor/VendorPendingApproval';
import VendorLogin from '../pages/vendor/VendorLogin';
import Dashboard from '../pages/vendor/Dashboard';
import VendorProducts from '../pages/vendor/Products';
import VendorServices from '../pages/vendor/Services';
import VendorReviews from '../pages/vendor/Reviews';
import VendorBrands from '../pages/vendor/Brands';
import VendorProfile from '../pages/vendor/Profile';

import CmsPage from '../pages/user/CmsPage';
import ErrorState from '../components/common/ErrorState';
import { useCmsContent } from '../contexts/CmsContext';

import AdminLayout from '../layouts/AdminLayout';
import { AdminProtectedRoute } from './AdminProtectedRoute';
import AdminLogin from '../admin/pages/Login';
import AdminDashboard from '../admin/pages/Dashboard';
import AdminProfile from '../admin/pages/Profile';
import HighlightCategoriesPage from '../admin/pages/HighlightCategoriesPage';
import TypedCategoriesPage from '../admin/pages/TypedCategoriesPage';
import SubcategoriesPage from '../admin/pages/SubcategoriesPage';
import VendorConfigPage from '../admin/pages/VendorConfigPage';
import VendorApplicationsPage from '../admin/pages/VendorApplicationsPage';
import AdminModuleRouter from '../admin/pages/ModuleRouter';

function NotFoundPage() {
  const cardConfig = useCmsContent('icons');
  return <ErrorState config={cardConfig.errorState?.notFound || { title: 'Not Found', message: 'Page not found' }} />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="admin/login" element={<AdminLogin />} />
      <Route
        path="admin"
        element={(
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        )}
      >
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="highlight-categories" element={<HighlightCategoriesPage />} />
        <Route path="product-categories" element={<TypedCategoriesPage categoryType="product" title="Product Categories" />} />
        <Route path="service-categories" element={<TypedCategoriesPage categoryType="service" title="Service Categories" />} />
        <Route path="subcategories" element={<SubcategoriesPage />} />
        <Route path="vendor-config" element={<VendorConfigPage />} />
        <Route path="vendor-applications" element={<VendorApplicationsPage />} />
        <Route path=":moduleKey" element={<AdminModuleRouter />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="products" element={<Products />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="services" element={<Services />} />
        <Route path="search" element={<Search />} />
        <Route path="category/:id" element={<Category />} />
        <Route path="brand/:id" element={<Brand />} />
        <Route path="categories" element={<Categories />} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="dashboard/payments" element={<ProtectedRoute><DashboardPlaceholder sectionId="payments" /></ProtectedRoute>} />
        <Route path="dashboard/activity" element={<ProtectedRoute><DashboardPlaceholder sectionId="activity" /></ProtectedRoute>} />
        <Route path="dashboard/notifications" element={<ProtectedRoute><DashboardPlaceholder sectionId="notifications" /></ProtectedRoute>} />
        <Route path="dashboard/addresses" element={<ProtectedRoute><DashboardPlaceholder sectionId="addresses" /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="bookings" element={<ProtectedRoute><CmsPage pageKey="bookings" /></ProtectedRoute>} />
        <Route path="start-business" element={<VendorLanding />} />
        <Route path="vendor/get-started" element={<BusinessTypeSelect />} />
        <Route path="vendor/auth" element={<VendorOnboardAuth />} />
        <Route path="vendor/login" element={<VendorLogin />} />
        <Route path="vendor/registration" element={<ProtectedRoute requireVendor><VendorRegistration /></ProtectedRoute>} />
        <Route path="vendor/pending-approval" element={<ProtectedRoute requireVendor><VendorPendingApproval /></ProtectedRoute>} />
        <Route path="contact" element={<CmsPage pageKey="contact" />} />
        <Route path="privacy" element={<CmsPage pageKey="privacy" />} />
        <Route path="terms" element={<CmsPage pageKey="terms" />} />
        <Route path="vendors" element={<CmsPage pageKey="vendors" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="vendor" element={<ProtectedRoute requireVendor requireApproved><VendorLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<VendorProducts />} />
        <Route path="services" element={<VendorServices />} />
        <Route path="reviews" element={<VendorReviews />} />
        <Route path="brands" element={<VendorBrands />} />
        <Route path="profile" element={<VendorProfile />} />
      </Route>
    </Routes>
  );
}
