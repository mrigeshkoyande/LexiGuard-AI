import React, { useEffect, useRef, useState } from 'react';
import { Search, FileText, Layers } from 'lucide-react';
import { DocumentClause, DocumentSection } from '@lexiguard/shared';

interface DocumentViewerProps {
  title: string;
  sections: (DocumentSection & { clauses: DocumentClause[] })[];
  highlightedClauseId?: string | null;
  onSelectClause?: (clause: DocumentClause) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  title,
  sections,
  highlightedClauseId,
  onSelectClause
}) => {
  const [searchTerm, setSearchTerm] = useState('');
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

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white truncate" title={title}>
              {title}
            </h2>
            <p className="text-[11px] text-slate-400">
              {sections.length} Sections • {totalClauses} Clauses
            </p>
          </div>
        </div>

        {/* Search inside document */}
        <div className="relative w-48 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clauses..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Document Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
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
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
                <Layers className="w-4 h-4 text-cyan-400/80" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
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
                      onClick={() => onSelectClause?.(clause)}
                      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer text-left relative ${
                        isHighlighted
                          ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-500/30'
                          : 'bg-slate-950/40 border-slate-850 hover:border-slate-700 hover:bg-slate-900/40'
                      }`}
                    >
                      {/* Active Indicator Pin */}
                      {isHighlighted && (
                        <div className="absolute -left-1 top-4 w-2 h-6 bg-cyan-400 rounded-r-md shadow-sm shadow-cyan-400" />
                      )}

                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                            § {clause.number}
                          </span>
                          <h4 className="text-xs font-semibold text-slate-100">
                            {clause.title}
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Page {clause.page || 1}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-serif leading-relaxed whitespace-pre-wrap selection:bg-cyan-600/30">
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
  );
};
