import React from 'react';
import { Shield, Github } from 'lucide-react';
import { LEGAL_DISCLAIMER } from '@lexiguard/shared';

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-brand-midnight border-t border-brand-gold/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-xs text-brand-sand">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-brand-gold/15">
        {/* Brand Summary */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-brand-gold" />
            </div>
            <span className="font-headline text-xl text-white font-light">LexiGuard AI</span>
          </div>
          <p className="text-xs text-brand-sand/70 max-w-sm leading-relaxed">
            AI-powered legal intelligence workspace built for 100% clause-level source traceability, grounded Q&A, and pre-signing clarity.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://github.com/mrigeshkoyande/LexiGuard-AI.git"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-brand-navy-dark border border-brand-gold/20 text-brand-sand hover:text-brand-gold transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <span className="text-[10px] font-mono text-brand-gold/80 px-2 py-1 rounded bg-brand-gold/10 border border-brand-gold/20">
              v1.0 Production
            </span>
          </div>
        </div>

        {/* Product Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
          <ul className="space-y-2">
            <li><button onClick={() => onNavigate?.('features')} className="hover:text-brand-gold transition-colors">Features</button></li>
            <li><button onClick={() => onNavigate?.('how-it-works')} className="hover:text-brand-gold transition-colors">How It Works</button></li>
            <li><button onClick={() => onNavigate?.('solutions')} className="hover:text-brand-gold transition-colors">Solutions</button></li>
            <li><button onClick={() => onNavigate?.('compare')} className="hover:text-brand-gold transition-colors">Version Diffing</button></li>
            <li><button onClick={() => onNavigate?.('ask')} className="hover:text-brand-gold transition-colors">Ask Lexi AI</button></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2">
            <li><button onClick={() => onNavigate?.('help')} className="hover:text-brand-gold transition-colors">Help Center & FAQ</button></li>
            <li><button onClick={() => onNavigate?.('privacy')} className="hover:text-brand-gold transition-colors">Privacy & Security</button></li>
            <li><button onClick={() => onNavigate?.('deadlines')} className="hover:text-brand-gold transition-colors">Deadlines Agenda</button></li>
            <li><button onClick={() => onNavigate?.('insights')} className="hover:text-brand-gold transition-colors">Portfolio Analytics</button></li>
          </ul>
        </div>

        {/* Company & Legal */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Company</h4>
          <ul className="space-y-2">
            <li><button onClick={() => onNavigate?.('about')} className="hover:text-brand-gold transition-colors">About Mission</button></li>
            <li><button onClick={() => onNavigate?.('privacy')} className="hover:text-brand-gold transition-colors">Data Sovereignty</button></li>
            <li><button onClick={() => onNavigate?.('help')} className="hover:text-brand-gold transition-colors">Support</button></li>
          </ul>
        </div>
      </div>

      {/* Legal Disclaimer Block */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-[11px] text-brand-sand/60 max-w-3xl leading-relaxed">
          <strong className="text-brand-gold">Legal Notice:</strong> {LEGAL_DISCLAIMER}
        </p>
        <p className="text-[11px] text-brand-sand/50 whitespace-nowrap">
          © {new Date().getFullYear()} LexiGuard AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
