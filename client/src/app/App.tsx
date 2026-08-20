import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LoadingStudio } from '@/components/ui/StudioStates';

const LandingPage = lazy(() =>
  import('@/features/landing/LandingPage').then((m) => ({ default: m.LandingPage })),
);
const BookingPage = lazy(() =>
  import('@/features/booking/BookingPage').then((m) => ({ default: m.BookingPage })),
);
const AdminApp = lazy(() => import('@/features/admin/AdminApp').then((m) => ({ default: m.AdminApp })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingStudio label="Loading workshop" />}>
                <LandingPage />
              </Suspense>
            }
          />
          <Route
            path="/book"
            element={
              <Suspense fallback={<LoadingStudio label="Preparing checkout" />}>
                <BookingPage />
              </Suspense>
            }
          />
          <Route
            path="/book/:code"
            element={
              <Suspense fallback={<LoadingStudio label="Preparing checkout" />}>
                <BookingPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<LoadingStudio label="Opening studio" />}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="top-center" />
    </QueryClientProvider>
  );
}
