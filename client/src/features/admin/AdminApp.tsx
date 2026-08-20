import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AdminLayout } from './components/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CollectionPage } from './pages/CollectionPage';
import { SingletonPage } from './pages/SingletonPage';
import { LoadingStudio } from '@/components/ui/StudioStates';

function Guard({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAuth();
  if (loading) return <LoadingStudio label="Checking studio access" />;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}

export function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          path="*"
          element={
            <Guard>
              <AdminLayout />
            </Guard>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="hero" element={<SingletonPage path="hero" title="Hero" />} />
          <Route path="site-settings" element={<SingletonPage path="site-settings" title="Site settings" />} />
          <Route path="seo" element={<SingletonPage path="seo" title="SEO" />} />
          <Route path="workshops" element={<CollectionPage path="workshops" title="Workshops" />} />
          <Route path="curriculum" element={<CollectionPage path="curriculum" title="Curriculum" />} />
          <Route path="sections" element={<CollectionPage path="sections" title="Sections" />} />
          <Route path="features" element={<CollectionPage path="features" title="Features" />} />
          <Route path="bonuses" element={<CollectionPage path="bonuses" title="Bonuses" />} />
          <Route path="testimonials" element={<CollectionPage path="testimonials" title="Testimonials" />} />
          <Route path="faqs" element={<CollectionPage path="faqs" title="FAQ" />} />
          <Route path="speakers" element={<CollectionPage path="speakers" title="Speakers" />} />
          <Route path="gallery" element={<CollectionPage path="gallery" title="Gallery" />} />
          <Route path="contacts" element={<CollectionPage path="contacts" title="Contacts" />} />
          <Route path="registrations" element={<CollectionPage path="registrations" title="Registrations" readOnly />} />
          <Route path="payments" element={<CollectionPage path="payments" title="Payments" readOnly />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
