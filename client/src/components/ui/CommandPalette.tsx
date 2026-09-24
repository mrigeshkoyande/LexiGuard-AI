import React, { useState, useEffect } from 'react';
import { Search, FileText, Scale, MessageSquare, Sparkles, X, Clock, Settings } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, docId?: string) => void;
  onOpenUpload: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenUpload
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'upload',
      title: 'Analyze New Document',
      category: 'Actions',
      icon: <FileText className="w-4 h-4 text-brand-gold" />,
      action: () => {
        onClose();
        onOpenUpload();
      }
    },
    {
      id: 'dashboard',
      title: 'Open Legal Command Center',
      category: 'Navigation',
      icon: <Sparkles className="w-4 h-4 text-brand-gold" />,
      action: () => {
        onClose();
        onNavigate('dashboard');
      }
    },
    {
      id: 'documents',
      title: 'Document Library & Folios',
      category: 'Navigation',
      icon: <FileText className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onClose();
        onNavigate('documents');
      }
    },
    {
      id: 'compare',
      title: 'Compare Two Documents (Clause Diff)',
      category: 'Navigation',
      icon: <Scale className="w-4 h-4 text-amber-400" />,
      action: () => {
        onClose();
        onNavigate('compare');
      }
    },
    {
      id: 'ask',
      title: 'Ask Lexi (Grounded Q&A)',
      category: 'AI Workspace',
      icon: <MessageSquare className="w-4 h-4 text-brand-gold" />,
      action: () => {
        onClose();
        onNavigate('ask');
      }
    },
    {
      id: 'deadlines',
      title: 'View Upcoming Deadlines & Timelines',
      category: 'Navigation',
      icon: <Clock className="w-4 h-4 text-rose-400" />,
      action: () => {
        onClose();
        onNavigate('deadlines');
      }
    },
    {
      id: 'settings',
      title: 'Account & Workspace Settings',
      category: 'Preferences',
      icon: <Settings className="w-4 h-4 text-slate-400" />,
      action: () => {
        onClose();
        onNavigate('settings');
      }
    }
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-brand-midnight/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div className="w-full max-w-xl bg-brand-midnight-card border border-brand-gold/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-brand-gold/20 gap-3">
          <Search className="w-5 h-5 text-brand-gold" aria-hidden="true" />
          <input
            id="command-palette-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search documents (e.g. Compare, Ask, Upload)..."
            aria-label="Search command palette"
            className="flex-1 bg-transparent text-sm text-brand-warmwhite placeholder:text-brand-sand/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm px-1"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <button 
            onClick={onClose} 
            aria-label="Close command palette"
            className="text-brand-sand hover:text-white p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-brand-sand/60">
              No matching commands or actions found.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-brand-navy/60 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-midnight border border-brand-gold/20 group-hover:border-brand-gold/40">
                    {item.icon}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-brand-warmwhite">{item.title}</h5>
                    <span className="text-[10px] text-brand-sand/60 uppercase tracking-wider font-medium">{item.category}</span>
                  </div>
                </div>
                <span className="text-[10px] text-brand-gold font-mono opacity-0 group-hover:opacity-100 transition-opacity">Select ↵</span>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-brand-midnight/90 border-t border-brand-gold/15 flex justify-between items-center text-[11px] text-brand-sand/60">
          <span>Navigate with <kbd className="px-1.5 py-0.5 rounded bg-brand-navy border border-brand-gold/20 font-mono text-[9px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-brand-navy border border-brand-gold/20 font-mono text-[9px]">↓</kbd></span>
          <span>Close with <kbd className="px-1.5 py-0.5 rounded bg-brand-navy border border-brand-gold/20 font-mono text-[9px]">ESC</kbd></span>
        </div>
      </div>
    </div>
  );
};
