import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { MotionConfig } from 'framer-motion'
import ErrorBoundary from '@/components/ErrorBoundary'
import RouteErrorBoundary from '@/components/RouteErrorBoundary'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ThemeProvider } from '@/components/ThemeProvider'
import { TopProgressBar } from '@/components/TopProgressBar'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAnalyticsTracking } from '@/hooks/useAnalyticsTracking'
import { useVisitorTracking } from '@/hooks/useVisitorTracking'
import { Toaster } from '@/components/ui/sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const LandingHomePage = lazy(() => import('./pages/LandingHomePage').then((m) => ({ default: m.LandingHomePage })))
const ServicesPage = lazy(() => import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })))
const PricingPage = lazy(() => import('./pages/PricingPage').then((m) => ({ default: m.PricingPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })))
const BlogPage = lazy(() => import('./pages/BlogPage').then((m) => ({ default: m.BlogPage })))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })))

const GetStartedPage = lazy(() => import('./pages/GetStartedPage').then((m) => ({ default: m.GetStartedPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const SignupPage = lazy(() => import('./pages/SignupPage').then((m) => ({ default: m.SignupPage })))
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage').then((m) => ({ default: m.AuthCallbackPage })))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const ClientProfitDashboardPage = lazy(() => import('./pages/ClientProfitDashboardPage').then((m) => ({ default: m.ClientProfitDashboardPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const NewPostPage = lazy(() => import('./pages/NewPostPage').then((m) => ({ default: m.NewPostPage })))
const VisitorDashboard = lazy(() => import('./pages/admin/VisitorDashboard').then((m) => ({ default: m.VisitorDashboard })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

function wrap(element) {
  return <RouteErrorBoundary>{element}</RouteErrorBoundary>
}

function AppShell() {
  useAnalyticsTracking()
  useVisitorTracking()

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <TopProgressBar />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-[#101010] focus:px-4 focus:py-2 focus:text-[#00d992]"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center text-[var(--text-3)]" role="status" aria-busy="true">
              Loading…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={wrap(<LandingHomePage />)} />
            <Route path="/services" element={wrap(<ServicesPage />)} />
            <Route path="/pricing" element={wrap(<PricingPage />)} />
            <Route path="/about" element={wrap(<AboutPage />)} />
            <Route path="/contact" element={wrap(<ContactPage />)} />
            <Route path="/blog" element={wrap(<BlogPage />)} />
            {/* Static blog paths before :slug so `/blog/new` is not captured as a slug */}
            <Route path="/blog/new" element={wrap(<ProtectedRoute><NewPostPage /></ProtectedRoute>)} />
            <Route path="/blog/:slug/edit" element={wrap(<ProtectedRoute><NewPostPage /></ProtectedRoute>)} />
            <Route path="/blog/:slug" element={wrap(<BlogPostPage />)} />

            <Route path="/get-started" element={wrap(<GetStartedPage />)} />
            <Route path="/login" element={wrap(<LoginPage />)} />
            <Route path="/signup" element={wrap(<SignupPage />)} />
            <Route path="/forgot-password" element={wrap(<ForgotPasswordPage />)} />
            <Route path="/reset-password" element={wrap(<ResetPasswordPage />)} />
            <Route path="/auth/callback" element={wrap(<AuthCallbackPage />)} />
            <Route path="/dashboard" element={wrap(<ProtectedRoute><DashboardPage /></ProtectedRoute>)} />
            <Route
              path="/client-profit-dashboard"
              element={wrap(<ProtectedRoute><ClientProfitDashboardPage /></ProtectedRoute>)}
            />
            <Route path="/profile" element={wrap(<ProtectedRoute><ProfilePage /></ProtectedRoute>)} />
            <Route path="/admin/visitors" element={wrap(<ProtectedRoute requireAdmin><VisitorDashboard /></ProtectedRoute>)} />
            <Route path="*" element={wrap(<NotFoundPage />)} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Toaster position="top-right" richColors closeButton duration={4000} theme="system" />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <MotionConfig reducedMotion="user">
          <ThemeProvider>
            <AuthProvider>
              <Router>
                <AppShell />
              </Router>
            </AuthProvider>
          </ThemeProvider>
        </MotionConfig>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
