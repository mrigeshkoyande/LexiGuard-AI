import React from 'react';
import { Shield, FileText, GitCompare, LogOut, Sparkles, MessageSquare, Clock, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DisclaimerBanner } from './DisclaimerBanner';

interface NavbarProps {
  currentView?: string;
  onNavigate?: (view: any, docId?: string) => void;
  onOpenUpload?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenUpload,
  onOpenCommandPalette
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-brand-midnight/90 backdrop-blur-xl border-b border-brand-gold/20">
      <DisclaimerBanner compact />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate?.(user ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-gold via-brand-gold-light to-brand-navy-light p-0.5 shadow-md shadow-brand-gold/15 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-brand-midnight rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-gold" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-headline text-xl text-white font-light tracking-wide">LexiGuard</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold-light border border-brand-gold/30 uppercase tracking-widest">
                AI
              </span>
            </div>
            <p className="text-[9px] text-brand-sand/70 font-mono uppercase tracking-wider">
              Legal Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        {user ? (
          <nav className="hidden lg:flex items-center gap-1 bg-brand-navy-dark/90 p-1 rounded-xl border border-brand-gold/20">
            <button
              onClick={() => onNavigate?.('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'dashboard'
                  ? 'bg-brand-gold text-brand-midnight font-semibold shadow-sm'
                  : 'text-brand-sand hover:text-white hover:bg-brand-navy/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </button>
            <button
              onClick={() => onNavigate?.('documents')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'documents'
                  ? 'bg-brand-gold text-brand-midnight font-semibold shadow-sm'
                  : 'text-brand-sand hover:text-white hover:bg-brand-navy/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Library</span>
            </button>
            <button
              onClick={() => onNavigate?.('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'compare'
                  ? 'bg-brand-gold text-brand-midnight font-semibold shadow-sm'
                  : 'text-brand-sand hover:text-white hover:bg-brand-navy/60'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>
            <button
              onClick={() => onNavigate?.('ask')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'ask'
                  ? 'bg-brand-gold text-brand-midnight font-semibold shadow-sm'
                  : 'text-brand-sand hover:text-white hover:bg-brand-navy/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Lexi</span>
            </button>
            <button
              onClick={() => onNavigate?.('deadlines')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentView === 'deadlines'
                  ? 'bg-brand-gold text-brand-midnight font-semibold shadow-sm'
                  : 'text-brand-sand hover:text-white hover:bg-brand-navy/60'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Deadlines</span>
            </button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-xs text-brand-sand font-medium">
            <button onClick={() => onNavigate?.('features')} className="hover:text-brand-warmwhite transition-colors">Features</button>
            <button onClick={() => onNavigate?.('how-it-works')} className="hover:text-brand-warmwhite transition-colors">How It Works</button>
            <button onClick={() => onNavigate?.('solutions')} className="hover:text-brand-warmwhite transition-colors">Solutions</button>
            <button onClick={() => onNavigate?.('about')} className="hover:text-brand-warmwhite transition-colors">About</button>
          </nav>
        )}

        {/* Right Side: Command Palette Launcher & User Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Command Palette Button */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              title="Global Search & Commands (⌘K)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-navy-dark/90 border border-brand-gold/20 text-brand-sand hover:text-white text-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-brand-gold" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-brand-midnight rounded border border-brand-gold/20 text-brand-sand/70">
                ⌘K
              </kbd>
            </button>
          )}

          {user ? (
            <>
              {onOpenUpload && (
                <button
                  onClick={onOpenUpload}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-midnight text-xs font-semibold uppercase tracking-wider shadow-md shadow-brand-gold/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Analyze</span>
                </button>
              )}

              <div className="flex items-center gap-3 pl-2 border-l border-brand-gold/20">
                <button
                  onClick={() => onNavigate?.('settings')}
                  className="hidden sm:flex flex-col text-right hover:opacity-80 transition-opacity"
                >
                  <span className="text-xs font-semibold text-brand-warmwhite">{user.name}</span>
                  <span className="text-[10px] text-brand-gold flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified Workspace
                  </span>
                </button>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-brand-navy-dark hover:bg-brand-navy text-brand-sand hover:text-rose-400 border border-brand-gold/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate?.('login')}
                className="px-4 py-2 rounded-xl text-xs font-medium text-brand-sand hover:text-white hover:bg-brand-navy/60 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate?.('register')}
                className="px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-midnight text-xs font-semibold uppercase tracking-wider shadow-md transition-all"
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
