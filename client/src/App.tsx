import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/layout/Footer';
import { UploadModal } from './components/UploadModal';
import { CommandPalette } from './components/ui/CommandPalette';
import { NotificationDrawer } from './components/NotificationDrawer';

import { Suspense } from 'react';

// Pages - Lazy loaded for efficiency
const LandingPage = React.lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const DocumentLibraryPage = React.lazy(() => import('./pages/DocumentLibraryPage').then(m => ({ default: m.DocumentLibraryPage })));
const WorkspacePage = React.lazy(() => import('./pages/WorkspacePage').then(m => ({ default: m.WorkspacePage })));
const ComparePage = React.lazy(() => import('./pages/ComparePage').then(m => ({ default: m.ComparePage })));
const ActionBriefPage = React.lazy(() => import('./pages/ActionBriefPage').then(m => ({ default: m.ActionBriefPage })));
const LawyerPrepPage = React.lazy(() => import('./pages/LawyerPrepPage').then(m => ({ default: m.LawyerPrepPage })));
const TimelinePage = React.lazy(() => import('./pages/TimelinePage').then(m => ({ default: m.TimelinePage })));
const InsightsPage = React.lazy(() => import('./pages/InsightsPage').then(m => ({ default: m.InsightsPage })));
const AskLexiPage = React.lazy(() => import('./pages/AskLexiPage').then(m => ({ default: m.AskLexiPage })));
const DeadlinesPage = React.lazy(() => import('./pages/DeadlinesPage').then(m => ({ default: m.DeadlinesPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const PrivacyCenterPage = React.lazy(() => import('./pages/PrivacyCenterPage').then(m => ({ default: m.PrivacyCenterPage })));
const HelpCenterPage = React.lazy(() => import('./pages/HelpCenterPage').then(m => ({ default: m.HelpCenterPage })));
const FeaturesPage = React.lazy(() => import('./pages/FeaturesPage').then(m => ({ default: m.FeaturesPage })));
const HowItWorksPage = React.lazy(() => import('./pages/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const SolutionsPage = React.lazy(() => import('./pages/SolutionsPage').then(m => ({ default: m.SolutionsPage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));

const LoadingFallback = () => (
  <div className="min-h-screen bg-brand-cream dark:bg-slate-950 flex flex-col items-center justify-center text-brand-gold gap-4" role="status" aria-live="polite">
    <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" aria-hidden="true" />
    <span className="font-serif italic text-xs tracking-widest text-slate-600 dark:text-slate-400">
      INITIALIZING LEXIGUARD SECURE VAULT...
    </span>
    <span className="sr-only">Loading LexiGuard AI...</span>
  </div>
);

export type ViewMode =
  | 'landing'
  | 'features'
  | 'how-it-works'
  | 'solutions'
  | 'about'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'documents'
  | 'workspace'
  | 'compare'
  | 'action-brief'
  | 'lawyer-prep'
  | 'timeline'
  | 'insights'
  | 'ask'
  | 'deadlines'
  | 'settings'
  | 'privacy'
  | 'help';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Auto-redirect authenticated user on initial load
  useEffect(() => {
    if (!loading) {
      const publicViews = ['landing', 'features', 'how-it-works', 'solutions', 'about', 'login', 'register', 'privacy', 'help'];
      if (user && (currentView === 'landing' || currentView === 'login' || currentView === 'register')) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentView('dashboard');
      } else if (!user && !publicViews.includes(currentView)) {
        setCurrentView('landing');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const handleNavigate = (view: string, docId?: string) => {
    if (docId) {
      setActiveDocId(docId);
    }
    setCurrentView(view as ViewMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global Keyboard Shortcuts (⌘K / Ctrl+K for command palette, Ctrl+/ for Ask Lexi)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        handleNavigate('ask');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUploadSuccess = (documentId: string) => {
    setActiveDocId(documentId);
    setCurrentView('workspace');
  };

  if (loading) {
    return <LoadingFallback />;
  }

  // Determine if this is full workspace (no standard footer needed to preserve 60/40 viewport)
  const isFullWorkspace = currentView === 'workspace';

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-brand-gold/30 selection:text-brand-gold-dark dark:selection:text-amber-200 transition-colors duration-200">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        unreadCount={3}
      />

      <main className="flex-1 flex flex-col">
        <Suspense fallback={<LoadingFallback />}>
          {currentView === 'landing' && (
            <LandingPage
              onNavigate={handleNavigate}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {currentView === 'features' && <FeaturesPage onNavigate={handleNavigate} />}
          {currentView === 'how-it-works' && <HowItWorksPage onNavigate={handleNavigate} />}
          {currentView === 'solutions' && <SolutionsPage onNavigate={handleNavigate} />}
          {currentView === 'about' && <AboutPage onNavigate={handleNavigate} />}

          {currentView === 'login' && <LoginPage onNavigate={handleNavigate} />}
          {currentView === 'register' && <RegisterPage onNavigate={handleNavigate} />}

          {currentView === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          )}

          {currentView === 'documents' && (
            <DocumentLibraryPage
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

          {currentView === 'lawyer-prep' && activeDocId && (
            <LawyerPrepPage
              documentId={activeDocId}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'timeline' && activeDocId && (
            <TimelinePage
              documentId={activeDocId}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'insights' && (
            <InsightsPage
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'ask' && (
            <AskLexiPage
              documentId={activeDocId || undefined}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'deadlines' && (
            <DeadlinesPage onNavigate={handleNavigate} />
          )}

          {currentView === 'settings' && (
            <SettingsPage onNavigate={handleNavigate} />
          )}

          {currentView === 'privacy' && (
            <PrivacyCenterPage onNavigate={handleNavigate} />
          )}

          {currentView === 'help' && (
            <HelpCenterPage onNavigate={handleNavigate} />
          )}
        </Suspense>
      </main>

      {!isFullWorkspace && <Footer onNavigate={handleNavigate} />}

      {/* Global Modals & Drawers */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
        onOpenUpload={() => setIsUploadOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
