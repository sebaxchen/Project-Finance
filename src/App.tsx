import { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { PropertiesPage } from './pages/PropertiesPage';
import { SimulationsPage } from './pages/SimulationsPage';
import { SupportPage } from './pages/SupportPage';
import { ReclamacionesPage } from './pages/ReclamacionesPage';
import { PremiumPage } from './pages/PremiumPage';
import { DocumentacionPage } from './pages/DocumentacionPage';
import { CapacitacionPage } from './pages/CapacitacionPage';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAuth, setShowAuth] = useState(false);
  const prevUserRef = useRef<typeof user>(null);

  // Detectar cuando el usuario cierra sesión y resetear showAuth
  useEffect(() => {
    // Si el usuario pasó de estar autenticado a no estarlo (cerró sesión)
    if (prevUserRef.current !== null && !user && !loading) {
      setShowAuth(false); // Mostrar landing page en lugar de auth page
    }
    prevUserRef.current = user;
  }, [user, loading]);

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si no hay usuario, mostrar landing page o auth page según el estado
  if (!user) {
    if (showAuth) {
      return <AuthPage onBackToLanding={() => setShowAuth(false)} />;
    }
    return <LandingPage onNavigateToAuth={() => setShowAuth(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'clients':
        return <ClientsPage />;
      case 'properties':
        return <PropertiesPage />;
      case 'simulations':
        return <SimulationsPage />;
      case 'support':
        return <SupportPage />;
      case 'reclamaciones':
        return <ReclamacionesPage />;
      case 'premium':
        return <PremiumPage />;
      case 'documentacion':
        return <DocumentacionPage />;
      case 'capacitacion':
        return <CapacitacionPage onNavigate={setCurrentPage} />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="ml-64 flex-1 flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto w-full p-8">{renderPage()}</div>
        <Footer onNavigate={setCurrentPage} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
