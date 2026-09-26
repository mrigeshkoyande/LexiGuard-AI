import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Printer,
  Clock,
  AlertTriangle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface LawyerPrepPageProps {
  documentId: string;
  onNavigate: (view: string, docId?: string) => void;
}

export const LawyerPrepPage: React.FC<LawyerPrepPageProps> = ({ documentId, onNavigate }) => {
  const [docData, setDocData] = useState<{ title?: string, pageCount?: number, documentType?: string, analysis?: { summary?: string, findings?: Array<{ category: string, title: string, sourceClauseId: string, pageNumber: number, explanation: string, whyItMatters: string }> } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [customNotes, setCustomNotes] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.getDocument(documentId);
        setDocData(res.document as { title?: string, pageCount?: number, documentType?: string, analysis?: { summary?: string, findings?: Array<{ category: string, title: string, sourceClauseId: string, pageNumber: number, explanation: string, whyItMatters: string }> } });
      } catch (err) {
        console.error('Failed to load doc for lawyer prep', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [documentId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center text-xs text-brand-sand space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-gold" />
          <p className="font-headline text-lg text-brand-warmwhite">Synthesizing consultation brief for legal counsel...</p>
        </div>
      </div>
    );
  }

  if (!docData) {
    return (
      <div className="p-12 text-center text-xs text-brand-sand space-y-3 max-w-md mx-auto">
        <p>Document not found.</p>
        <Button onClick={() => onNavigate('dashboard')} variant="primary-gold" size="sm">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const findings = docData.analysis?.findings || [];
  const reviewAreas = findings.filter((f: { category: string }) => f.category === 'potentialConcerns');
  const deadlines = findings.filter((f: { category: string }) => f.category === 'deadlines');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('workspace', documentId)}
            className="p-2 rounded-xl bg-brand-navy-dark hover:bg-brand-navy text-brand-sand hover:text-white border border-brand-gold/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-2xl sm:text-3xl font-light text-brand-warmwhite">
                Lawyer Consultation Brief
              </h1>
              <Badge variant="gold">Structured Preparation</Badge>
            </div>
            <p className="text-xs text-brand-sand/80 mt-0.5">{docData.title}</p>
          </div>
        </div>

        <Button
          onClick={handlePrint}
          variant="primary-gold"
          size="sm"
          icon={<Printer className="w-4 h-4" />}
        >
          Print Consultation Dossier
        </Button>
      </div>

      <DisclaimerBanner />

      {/* Printable Consultation Dossier Card */}
      <div className="p-8 rounded-2xl bg-brand-midnight-card border border-brand-gold/25 shadow-navy-deep space-y-8 print-card">
        {/* Dossier Header */}
        <div className="border-b border-brand-gold/20 pb-6 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block">
                Executive Legal Dossier
              </span>
              <h2 className="font-headline text-3xl text-brand-warmwhite font-light mt-1">
                {docData.title}
              </h2>
            </div>
            <div className="text-right text-xs text-brand-sand/70 font-mono">
              <p>Type: {docData.documentType || 'Contract'}</p>
              <p>Pages: {docData.pageCount}</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <p className="text-xs text-brand-sand/90 font-serif leading-relaxed mt-2">
            {docData.analysis?.summary || 'Pre-consultation briefing outlining key clauses, liabilities, and strategic questions.'}
          </p>
        </div>

        {/* 1. Critical Review Points for Counsel */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>1. Potential Risk Areas & Restrictive Covenants</span>
          </h3>
          <div className="space-y-3">
            {reviewAreas.length === 0 ? (
              <p className="text-xs text-brand-sand/60 italic">No high-risk clauses flagged.</p>
            ) : (
              reviewAreas.map((item, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-brand-midnight border border-brand-gold/20 space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-semibold text-brand-warmwhite">{item.title}</h4>
                    <span className="text-[10px] font-mono text-brand-gold">Clause ID: {item.sourceClauseId} (Page {item.pageNumber || 1})</span>
                  </div>
                  <p className="text-xs text-brand-sand/80">{item.explanation}</p>
                  <p className="text-[11px] text-amber-300 font-medium pt-1">
                    <strong>Counsel Attention:</strong> {item.whyItMatters}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Key Deadlines & Notice Periods */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-gold" />
            <span>2. Time-Sensitive Windows & Notice Deadlines</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deadlines.map((item, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-brand-midnight border border-brand-gold/20 space-y-1">
                <h5 className="text-xs font-semibold text-brand-warmwhite">{item.title}</h5>
                <p className="text-[11px] text-brand-sand/80">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Strategic Questions to Ask Your Attorney */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>3. Recommended Inquiries for Your Attorney</span>
          </h3>
          <ul className="space-y-2 pl-4 list-disc text-xs text-brand-sand/90 font-sans">
            <li>Are the non-compete and intellectual property scope boundaries enforceable in our governing jurisdiction?</li>
            <li>Should we request reciprocal indemnification carve-outs for client gross negligence?</li>
            <li>Is the 90-day non-renewal notice window aligned with standard market practices for this industry?</li>
            <li>What penalties or cure periods apply in the event of an inadvertent breach?</li>
          </ul>
        </div>

        {/* 4. Personal Notes & Consultation Agenda */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            4. Personal Consultation Notes
          </h3>
          <textarea
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Add personal talking points or questions for your legal counsel meeting..."
            rows={4}
            className="w-full p-3.5 bg-brand-midnight border border-brand-gold/25 rounded-xl text-xs text-brand-warmwhite placeholder:text-brand-sand/40 focus:outline-none focus:border-brand-gold leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
