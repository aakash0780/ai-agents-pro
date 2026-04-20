import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { FloatingCTA } from './components/FloatingCTA'
import { StickyCTA } from './components/StickyCTA'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './components/ThemeProvider'
import { ProtectedRoute } from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import { Toaster } from './components/ui/sonner'
import './App.css'

const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })),
)
const ServicesPage = lazy(() =>
  import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })),
)
const PricingPage = lazy(() =>
  import('./pages/PricingPage').then((m) => ({ default: m.PricingPage })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const SignupPage = lazy(() =>
  import('./pages/SignupPage').then((m) => ({ default: m.SignupPage })),
)
const AuthCallbackPage = lazy(() =>
  import('./pages/AuthCallbackPage').then((m) => ({ default: m.AuthCallbackPage })),
)
const ForgotPasswordPage = lazy(() =>
  import('./pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })),
)
const ResetPasswordPage = lazy(() =>
  import('./pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })),
)
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)
const BlogPage = lazy(() =>
  import('./pages/BlogPage').then((m) => ({ default: m.BlogPage })),
)
const BlogPostPage = lazy(() =>
  import('./pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })),
)
const NewPostPage = lazy(() =>
  import('./pages/NewPostPage').then((m) => ({ default: m.NewPostPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
)

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground font-['Inter',system-ui,sans-serif]">
              <Header />
              <main id="main-content" tabIndex={-1}>
                <Suspense
                  fallback={
                    <div
                      className="min-h-[50vh] flex items-center justify-center text-muted-foreground"
                      role="status"
                      aria-live="polite"
                      aria-busy="true"
                    >
                      Loading…
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/auth/callback" element={<AuthCallbackPage />} />
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/new" element={<ProtectedRoute><NewPostPage /></ProtectedRoute>} />
                    <Route path="/blog/:slug/edit" element={<ProtectedRoute><NewPostPage /></ProtectedRoute>} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <FloatingCTA />
              <StickyCTA />
              <Toaster
                position="top-right"
                richColors
                closeButton
                duration={4000}
                theme="system"
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
