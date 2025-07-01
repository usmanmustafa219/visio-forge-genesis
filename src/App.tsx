
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Generate from '@/pages/Generate';
import Credits from '@/pages/Credits';
import PaymentSuccess from '@/pages/PaymentSuccess';
import Gallery from '@/pages/Gallery';
import Samples from '@/pages/Samples';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import './App.css';

const queryClient = new QueryClient();

// This is the main application component that sets up the routing and context providers.
// It includes the header, footer, and main content area where different pages are rendered based on
// the current route. The application uses React Router for navigation and TanStack Query for data fetching.
// The AuthProvider wraps the application to provide authentication context, and ProtectedRoute
// is used to protect certain routes that require authentication. The Toaster component is used for displaying notifications.
// The application is styled with Tailwind CSS and has a gradient background.

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/samples" element={<Samples />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/generate"
                  element={
                    <ProtectedRoute>
                      <Generate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/credits"
                  element={
                    <ProtectedRoute>
                      <Credits />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gallery"
                  element={
                    <ProtectedRoute>
                      <Gallery />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
