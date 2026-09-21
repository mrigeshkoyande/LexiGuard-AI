import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { UploadModal } from './components/UploadModal';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ComparePage } from './pages/ComparePage';
import { ActionBriefPage } from './pages/ActionBriefPage';

export type ViewMode = 'landing' | 'login' | 'register' | 'dashboard' | 'workspace' | 'compare' | 'action-brief';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Auto-redirect authenticated user on first load
  React.useEffect(() => {
    if (!loading) {
      if (user && (currentView === 'landing' || currentView === 'login' || currentView === 'register')) {
        setCurrentView('dashboard');
      } else if (!user && currentView !== 'landing' && currentView !== 'login' && currentView !== 'register') {
        setCurrentView('landing');
      }
    }
  }, [user, loading]);

  const handleNavigate = (view: string, docId?: string) => {
    if (docId) {
      setActiveDocId(docId);
    }
    setCurrentView(view as ViewMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadSuccess = (documentId: string) => {
    setActiveDocId(documentId);
    setCurrentView('workspace');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar
        currentView={currentView === 'workspace' || currentView === 'action-brief' ? 'workspace' : (currentView as any)}
        onNavigate={handleNavigate}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={handleNavigate}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {currentView === 'login' && <LoginPage onNavigate={handleNavigate} />}

        {currentView === 'register' && <RegisterPage onNavigate={handleNavigate} />}

        {currentView === 'dashboard' && (
          <DashboardPage
            onNavigate={handleNavigate}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {currentView === 'workspace' && activeDocId && (
          <WorkspacePage
            documentId={activeDocId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'compare' && (
          <ComparePage onNavigate={handleNavigate} />
        )}

        {currentView === 'action-brief' && activeDocId && (
          <ActionBriefPage
            documentId={activeDocId}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
