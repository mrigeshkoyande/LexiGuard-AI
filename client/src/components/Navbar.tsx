import React from 'react';
import {
  Shield,
  FileText,
  GitCompare,
  LogOut,
  Sparkles,
  MessageSquare,
  Clock,
  Search,
  Sun,
  Moon,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentView?: string;
  onNavigate?: (view: any, docId?: string) => void;
  onOpenUpload?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenUpload,
  onOpenCommandPalette,
  onOpenNotifications,
  unreadCount = 3
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-brand-midnight/90 backdrop-blur-xl border-b border-slate-200 dark:border-brand-gold/20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate?.(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-xl p-1"
          aria-label="Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-gold via-brand-gold-light to-brand-navy p-0.5 shadow-md shadow-brand-gold/15 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-brand-midnight rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-gold" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl font-bold text-slate-900 dark:text-white tracking-wide">
                LexiGuard
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold-dark dark:text-brand-gold-light border border-brand-gold/30 uppercase tracking-widest font-mono">
                AI
              </span>
            </div>
            <p className="text-[9px] text-slate-500 dark:text-brand-sand/70 font-mono uppercase tracking-wider">
              Legal Intelligence
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        {user ? (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-brand-navy-dark/90 p-1 rounded-xl border border-slate-200 dark:border-brand-gold/20">
            <button
              onClick={() => onNavigate?.('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                currentView === 'dashboard'
                  ? 'bg-brand-gold text-white dark:text-brand-midnight font-bold shadow-sm'
                  : 'text-slate-600 dark:text-brand-sand hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-brand-navy/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </button>
            <button
              onClick={() => onNavigate?.('documents')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                currentView === 'documents'
                  ? 'bg-brand-gold text-white dark:text-brand-midnight font-bold shadow-sm'
                  : 'text-slate-600 dark:text-brand-sand hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-brand-navy/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Library</span>
            </button>
            <button
              onClick={() => onNavigate?.('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                currentView === 'compare'
                  ? 'bg-brand-gold text-white dark:text-brand-midnight font-bold shadow-sm'
                  : 'text-slate-600 dark:text-brand-sand hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-brand-navy/60'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>
            <button
              onClick={() => onNavigate?.('ask')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                currentView === 'ask'
                  ? 'bg-brand-gold text-white dark:text-brand-midnight font-bold shadow-sm'
                  : 'text-slate-600 dark:text-brand-sand hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-brand-navy/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Lexi</span>
            </button>
            <button
              onClick={() => onNavigate?.('deadlines')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                currentView === 'deadlines'
                  ? 'bg-brand-gold text-white dark:text-brand-midnight font-bold shadow-sm'
                  : 'text-slate-600 dark:text-brand-sand hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-brand-navy/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Deadlines</span>
            </button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-600 dark:text-brand-sand font-medium">
            <button onClick={() => onNavigate?.('features')} className="hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm px-1">Features</button>
            <button onClick={() => onNavigate?.('how-it-works')} className="hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm px-1">How It Works</button>
            <button onClick={() => onNavigate?.('solutions')} className="hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm px-1">Solutions</button>
            <button onClick={() => onNavigate?.('about')} className="hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm px-1">About</button>
          </nav>
        )}

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Command Palette Button */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              title="Global Search & Commands (⌘K)"
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-brand-navy-dark/90 border border-slate-200 dark:border-brand-gold/20 text-slate-700 dark:text-brand-sand hover:text-brand-gold text-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-brand-gold" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-brand-midnight rounded border border-slate-300 dark:border-brand-gold/20 text-slate-500 dark:text-brand-sand/70">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Theme Toggler (Dark / Light) */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={theme === 'dark' ? 'Switch to Editorial Light Mode' : 'Switch to Midnight Dark Mode'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-brand-navy-dark/90 hover:bg-slate-200 dark:hover:bg-brand-navy border border-slate-200 dark:border-brand-gold/20 text-brand-gold transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-brand-navy transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Notification Center & Warning Signs Toggler */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              aria-label="Open notifications"
              title="Compliance, Warnings & Deadlines Hub"
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-brand-navy-dark/90 hover:bg-slate-200 dark:hover:bg-brand-navy border border-slate-200 dark:border-brand-gold/20 text-slate-700 dark:text-brand-sand hover:text-brand-gold transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <Bell className="w-4 h-4 text-brand-gold" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {user ? (
            <>
              {onOpenUpload && (
                <button
                  onClick={onOpenUpload}
                  className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-white dark:text-brand-midnight text-xs font-bold uppercase tracking-wider shadow-md shadow-brand-gold/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Analyze</span>
                </button>
              )}

              <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2 border-l border-slate-200 dark:border-brand-gold/20">
                <button
                  onClick={() => onNavigate?.('settings')}
                  className="hidden sm:flex flex-col text-right hover:opacity-80 transition-opacity"
                >
                  <span className="text-xs font-semibold text-slate-900 dark:text-brand-warmwhite">{user.name}</span>
                  <span className="text-[10px] text-brand-gold flex items-center gap-1 justify-end font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified
                  </span>
                </button>
                <button
                  onClick={logout}
                  aria-label="Sign Out"
                  title="Sign Out"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-brand-navy-dark hover:bg-slate-200 dark:hover:bg-brand-navy text-slate-600 dark:text-brand-sand hover:text-rose-400 border border-slate-200 dark:border-brand-gold/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate?.('login')}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-brand-sand hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate?.('register')}
                className="px-3.5 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-white dark:text-brand-midnight text-xs font-bold uppercase tracking-wider shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
