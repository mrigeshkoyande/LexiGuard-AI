import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Loader2,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface TimelinePageProps {
  documentId: string;
  onNavigate: (view: string, docId?: string) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({ documentId, onNavigate }) => {
  const [docData, setDocData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.getDocument(documentId);
        setDocData(res.document);
      } catch (err) {
        console.error('Failed to load document for timeline', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [documentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center text-xs text-brand-sand space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-gold" />
          <p className="font-headline text-lg text-brand-warmwhite font-light">Building chronological contractual timeline...</p>
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

  const timelineEvents = [
    {
      stage: 'Commencement',
      title: 'Effective Date & Execution',
      dateInfo: 'Day 1 / Signing Date',
      description: 'Mutual execution of agreement terms and binding commencement of duties.',
      type: 'start'
    },
    {
      stage: 'Initial Milestone',
      title: 'Probation / Ramp-up Period',
      dateInfo: 'Within First 90 Days',
      description: 'Initial performance assessment and service delivery evaluation window.',
      type: 'milestone'
    },
    {
      stage: 'Critical Action Window',
      title: 'Auto-Renewal Notice Deadline',
      dateInfo: '90 Days Prior to Expiration',
      description: 'Mandatory written notice required to prevent automatic contract extension for 12 months.',
      type: 'critical'
    },
    {
      stage: 'Term Conclusion',
      title: 'Contract Expiration & Post-Term Obligations',
      dateInfo: 'End of Initial Term',
      description: 'Return of confidential materials, final compensation reconciliation, and ongoing IP assignments.',
      type: 'end'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                Contract Chronology & Timeline
              </h1>
              <Badge variant="gold">Visual Milestones</Badge>
            </div>
            <p className="text-xs text-brand-sand/80 mt-0.5">{docData.title}</p>
          </div>
        </div>

        <Button
          onClick={() => onNavigate('workspace', documentId)}
          variant="outline-gold"
          size="sm"
          icon={<FileText className="w-4 h-4" />}
        >
          Open in Workspace
        </Button>
      </div>

      <DisclaimerBanner />

      {/* Visual Timeline Stream */}
      <div className="p-8 rounded-2xl bg-brand-midnight-card border border-brand-gold/25 shadow-navy-deep space-y-8">
        <div className="border-b border-brand-gold/20 pb-4">
          <h2 className="font-headline text-xl text-brand-warmwhite font-light">
            Chronological Lifecycle of Agreement
          </h2>
          <p className="text-xs text-brand-sand/80 mt-1">
            Track notice windows, critical milestones, and contractual expirations extracted from your agreement.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-brand-gold before:via-brand-gold-light before:to-brand-navy">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="relative space-y-2">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[35px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  evt.type === 'critical'
                    ? 'bg-amber-400 border-amber-300 shadow-lg shadow-amber-400/30 text-brand-midnight'
                    : 'bg-brand-midnight border-brand-gold text-brand-gold'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>

              {/* Event Card */}
              <div className="p-5 rounded-xl bg-brand-midnight border border-brand-gold/20 hover:border-brand-gold/50 transition-colors shadow-md space-y-2">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider">
                      {evt.stage}
                    </span>
                    <h4 className="text-sm font-semibold text-brand-warmwhite">{evt.title}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-gold-light px-2.5 py-0.5 rounded bg-brand-navy border border-brand-gold/20">
                    {evt.dateInfo}
                  </span>
                </div>
                <p className="text-xs text-brand-sand/85 leading-relaxed">{evt.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
