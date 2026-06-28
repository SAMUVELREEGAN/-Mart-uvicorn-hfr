import { BrandProvider } from './BrandContext';
import { AuthProvider } from './AuthContext';
import { LocationProvider } from './LocationContext';
import { CategoryProvider } from './CategoryContext';
import { ProductProvider } from './ProductContext';
import { ServiceProvider } from './ServiceContext';
import { VendorProvider } from './VendorContext';
import { ReviewProvider } from './ReviewContext';
import { ThemeProvider } from './ThemeContext';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrandProvider>
        <LocationProvider>
          <CategoryProvider>
            <ProductProvider>
              <ServiceProvider>
                <VendorProvider>
                  <ReviewProvider>
                    {children}
                  </ReviewProvider>
                </VendorProvider>
              </ServiceProvider>
            </ProductProvider>
          </CategoryProvider>
        </LocationProvider>
        </BrandProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export { useBrands } from './BrandContext';
export { useAuth } from './AuthContext';
export { useProducts } from './ProductContext';
export { useServices } from './ServiceContext';
export { useVendor } from './VendorContext';
export { useCategories } from './CategoryContext';
export { useLocation } from './LocationContext';
export { useReviews } from './ReviewContext';
export { useTheme } from './ThemeContext';
