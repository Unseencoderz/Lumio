import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LandingPage } from '@/pages/LandingPage';
import { AboutPage } from '@/pages/AboutPage';
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { AnalyzePage } from '@/pages/AnalyzePage';
import { HistoryPage } from '@/pages/HistoryPage';
import { Header } from '@/components/Header';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Main app layout with unified header
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={
          <AppLayout>
            <LandingPage />
          </AppLayout>
        } />
        <Route path="/about" element={
          <AppLayout>
            <AboutPage />
          </AppLayout>
        } />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <HomePage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/analyze" element={
          <ProtectedRoute>
            <AppLayout>
              <AnalyzePage />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/history" element={
          <ProtectedRoute>
            <AppLayout>
              <HistoryPage />
            </AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;