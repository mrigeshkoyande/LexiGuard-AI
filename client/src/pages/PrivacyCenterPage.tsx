import React from 'react';
import { Shield, Lock, EyeOff, Server, FileCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface PrivacyCenterPageProps {
  onNavigate: (view: string) => void;
}

export const PrivacyCenterPage: React.FC<PrivacyCenterPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Top Back Navigation */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-lexi-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexi-gold/10 border border-lexi-gold/30 text-lexi-gold text-xs font-serif italic">
            <Shield className="w-3.5 h-3.5" />
            Institutional Trust & Data Sovereignty
          </div>
          <h1 className="font-serif text-4xl font-bold text-white tracking-tight leading-tight">
            Zero-Retention AI Privacy & Security Standard
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
            LexiGuard AI is architected specifically for confidential legal review, cross-border M&A negotiations, and proprietary corporate agreements.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-lexi-gold flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Zero Model Training Policy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your uploaded contracts, clauses, and prompt queries are never used to train, fine-tune, or calibrate any public or private foundational models.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">AES-256 & TLS 1.3 Encryption</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All data in transit is encrypted using TLS 1.3 with forward secrecy. At rest, documents and extracted clause embeddings are protected by AES-256 vault encryption.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Air-Gapped & On-Premise Ready</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise instances can be deployed within your private VPC or air-gapped data center with local neural LLM weights and zero outbound telemetry.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-white">Deterministic Clause Audits</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every AI synthesis links bidirectionally to exact clause character ranges and page numbers, eliminating hallucinations and enabling forensic human-in-the-loop review.
            </p>
          </div>
        </div>

        {/* Deep Dive Article Section */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-white">Contractual Compliance Guarantees</h2>
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-lexi-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Instant Data Purge:</strong> When you delete a document from your library, all associated clause segments, risk findings, and vector embeddings are irrevocably purged from active storage and cache.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-lexi-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Attorney-Client Privilege Preservation:</strong> System prompts and query logs are isolated strictly to authenticated session contexts, preventing inadvertent disclosure of attorney work product.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-lexi-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">GDPR & CCPA Compliant:</strong> Full data portability with 1-click JSON and structured PDF export, plus granular right-to-be-forgotten execution.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-6">
          <span className="text-xs text-slate-500 font-mono">LEXIGUARD SECURITY AUDIT: PASSED (SOC-2 TYPE II)</span>
          <Button variant="primary-gold" size="sm" onClick={() => onNavigate('dashboard')}>
            Return to Workspace
          </Button>
        </div>
      </div>
    </div>
  );
};
