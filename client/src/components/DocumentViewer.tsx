import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  FileText,
  Layers,
  ZoomIn,
  ZoomOut,
  Printer,
  ExternalLink
} from 'lucide-react';
import { DocumentClause, DocumentSection } from '@lexiguard/shared';

interface DocumentViewerProps {
  title: string;
  sections: (DocumentSection & { clauses: DocumentClause[] })[];
  highlightedClauseId?: string | null;
  onSelectClause?: (clause: DocumentClause) => void;
  onOpenClauseDrawer?: (clause: DocumentClause) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  title,
  sections,
  highlightedClauseId,
  onSelectClause,
  onOpenClauseDrawer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const clauseRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Auto-scroll to highlighted clause when it changes
  useEffect(() => {
    if (highlightedClauseId) {
      const el = clauseRefs.current.get(highlightedClauseId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedClauseId]);

  const totalClauses = sections.reduce((acc, s) => acc + s.clauses.length, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-brand-midnight-card/90 border border-brand-gold/25 rounded-2xl overflow-hidden shadow-navy-deep backdrop-blur-md">
      {/* Viewer Header */}
      <div className="p-4 border-b border-brand-gold/20 bg-brand-navy-dark flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-xl bg-brand-gold/15 text-brand-gold border border-brand-gold/30 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-brand-warmwhite truncate" title={title}>
              {title}
            </h2>
            <p className="text-[11px] text-brand-sand/70 font-mono">
              {sections.length} Sections • {totalClauses} Clauses • 100% Traceable
            </p>
          </div>
        </div>

        {/* Toolbar: Search & Zoom */}
        <div className="flex items-center gap-2">
          {/* Search inside document */}
          <div className="relative w-40 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold" aria-hidden="true" />
            <input
              id="document-viewer-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter clauses..."
              aria-label="Filter clauses"
              className="w-full pl-8 pr-3 py-1.5 bg-brand-midnight border border-brand-gold/20 rounded-lg text-xs text-brand-warmwhite placeholder:text-brand-sand/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            />
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-brand-midnight p-1 rounded-lg border border-brand-gold/20 text-brand-sand">
            <button
              onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
              className="p-1 hover:text-brand-warmwhite transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 text-brand-gold">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
              className="p-1 hover:text-brand-warmwhite transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-sm"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Print button */}
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg bg-brand-midnight border border-brand-gold/20 text-brand-sand hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            title="Print Document"
            aria-label="Print Document"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-brand-midnight/40">
        <div style={{ fontSize: `${zoomLevel}%` }} className="space-y-6 transition-all duration-150">
          {sections.map((section, sIdx) => {
            const matchingClauses = section.clauses.filter(
              (c) =>
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.number.includes(searchTerm)
            );

            if (searchTerm && matchingClauses.length === 0) return null;

            return (
              <div key={section.id || sIdx} className="space-y-3">
                {/* Section Header */}
                <div className="flex items-center gap-2 pb-2 border-b border-brand-gold/15">
                  <Layers className="w-4 h-4 text-brand-gold" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-sand">
                    {section.title}
                  </h3>
                </div>

                {/* Clause Cards */}
                <div className="space-y-3">
                  {(searchTerm ? matchingClauses : section.clauses).map((clause) => {
                    const isHighlighted = highlightedClauseId === clause.id;

                    return (
                      <div
                        key={clause.id}
                        ref={(el) => {
                          if (el) clauseRefs.current.set(clause.id, el);
                          else clauseRefs.current.delete(clause.id);
                        }}
                        onClick={() => {
                          onSelectClause?.(clause);
                          onOpenClauseDrawer?.(clause);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectClause?.(clause);
                            onOpenClauseDrawer?.(clause);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`View details for clause ${clause.number}: ${clause.title}`}
                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer text-left relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                          isHighlighted
                            ? 'clause-active-pulse border-brand-gold shadow-lg ring-1 ring-brand-gold'
                            : 'bg-brand-midnight-card/80 border-brand-gold/15 hover:border-brand-gold/40 hover:bg-brand-navy-dark/70'
                        }`}
                      >
                        {/* Active Pin Accent */}
                        {isHighlighted && (
                          <div className="absolute -left-1 top-4 w-2 h-7 bg-brand-gold rounded-r-md shadow-md shadow-brand-gold/40" />
                        )}

                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-midnight text-brand-gold border border-brand-gold/30">
                              § {clause.number}
                            </span>
                            <h4 className="text-xs font-semibold text-brand-warmwhite group-hover:text-brand-gold-light transition-colors">
                              {clause.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-brand-sand/70 font-mono">
                              Page {clause.page || 1}
                            </span>
                            <ExternalLink className="w-3 h-3 text-brand-sand/40 group-hover:text-brand-gold transition-colors" />
                          </div>
                        </div>

                        <p className="text-xs text-brand-warmwhite/90 font-serif leading-relaxed whitespace-pre-wrap selection:bg-brand-gold selection:text-brand-midnight">
                          {clause.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
