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
import Search from '../pages/user/Search';
import Category from '../pages/user/Category';
import Profile from '../pages/user/Profile';
import UserDashboard from '../pages/user/UserDashboard';
import DashboardPlaceholder from '../pages/user/DashboardPlaceholder';
import Wishlist from '../pages/user/Wishlist';
import Orders from '../pages/user/Orders';

import VendorLanding from '../pages/vendor/VendorLanding';
import BusinessTypeSelect from '../pages/vendor/BusinessTypeSelect';
import VendorOnboardAuth from '../pages/vendor/VendorOnboardAuth';
import VendorLogin from '../pages/vendor/VendorLogin';
import Dashboard from '../pages/vendor/Dashboard';
import VendorProducts from '../pages/vendor/Products';
import VendorServices from '../pages/vendor/Services';
import VendorReviews from '../pages/vendor/Reviews';
import VendorBrands from '../pages/vendor/Brands';
import VendorProfile from '../pages/vendor/Profile';

import ErrorState from '../components/common/ErrorState';
import cardConfig from '../json/icons.json';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="search" element={<Search />} />
        <Route path="category/:id" element={<Category />} />
        <Route path="brand/:id" element={<Brand />} />
        <Route path="categories" element={<Search />} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="dashboard/payments" element={<ProtectedRoute><DashboardPlaceholder sectionId="payments" /></ProtectedRoute>} />
        <Route path="dashboard/activity" element={<ProtectedRoute><DashboardPlaceholder sectionId="activity" /></ProtectedRoute>} />
        <Route path="dashboard/notifications" element={<ProtectedRoute><DashboardPlaceholder sectionId="notifications" /></ProtectedRoute>} />
        <Route path="dashboard/addresses" element={<ProtectedRoute><DashboardPlaceholder sectionId="addresses" /></ProtectedRoute>} />
        <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="bookings" element={<ProtectedRoute><div className="page-placeholder"><h1>Bookings</h1><p>Your service bookings will appear here.</p></div></ProtectedRoute>} />
        <Route path="start-business" element={<VendorLanding />} />
        <Route path="vendor/get-started" element={<BusinessTypeSelect />} />
        <Route path="vendor/auth" element={<VendorOnboardAuth />} />
        <Route path="vendor/login" element={<VendorLogin />} />
        <Route path="contact" element={<div className="page-placeholder"><h1>Contact Us</h1><p>Get in touch with our support team.</p></div>} />
        <Route path="privacy" element={<div className="page-placeholder"><h1>Privacy Policy</h1><p>Your privacy matters to us.</p></div>} />
        <Route path="terms" element={<div className="page-placeholder"><h1>Terms of Service</h1><p>Please read our terms carefully.</p></div>} />
        <Route path="vendors" element={<div className="page-placeholder"><h1>Vendors</h1><p>Browse all registered vendors.</p></div>} />
        <Route path="*" element={<ErrorState config={cardConfig.errorState.notFound} />} />
      </Route>

      <Route path="vendor" element={<ProtectedRoute requireVendor><VendorLayout /></ProtectedRoute>}>
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
