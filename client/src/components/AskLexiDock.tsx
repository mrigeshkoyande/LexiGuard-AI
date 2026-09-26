import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Shield,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';
import { QuestionResponse } from '@lexiguard/shared';
import { api } from '../services/api';

interface AskLexiDockProps {
  documentId: string;
  onSelectClauseId: (clauseId: string) => void;
}

export const AskLexiDock: React.FC<AskLexiDockProps> = ({ documentId, onSelectClauseId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<QuestionResponse[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await api.getQnAHistory(documentId);
        if (res.history && res.history.length > 0) {
          setMessages(res.history.reverse());
        }
      } catch (err) {
        console.error('Failed to load QnA history', err);
      }
    }
    loadHistory();
  }, [documentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const text = (queryText || input).trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);

    try {
      const response = await api.askQuestion(documentId, text);
      setMessages((prev) => [...prev, response]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          question: text,
          answer: `Error: ${err instanceof Error ? err.message : 'Failed to process question'}`,
          status: 'INSUFFICIENT_EVIDENCE',
          supportStatus: 'INSUFFICIENT_EVIDENCE',
          sources: [],
          sourceClauseIds: [],
          confidence: 0,
          isDeclinedAdvice: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'What is the salary and bonus compensation?',
    'What is the probation period length?',
    'What are the termination notice rules?',
    'What are the non-compete and IP restrictions?',
    'Should I sign this agreement?' // tests deterministic safety refusal
  ];

  return (
    <div
      className={`fixed bottom-4 right-4 z-30 w-full max-w-md bg-brand-midnight-card border border-brand-gold/40 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden flex flex-col backdrop-blur-xl ${
        isOpen ? 'h-[520px]' : 'h-14'
      }`}
    >
      {/* Dock Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label="Toggle Ask Lexi Dock"
        className="p-3.5 bg-brand-navy-dark border-b border-brand-gold/20 flex items-center justify-between cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-brand-warmwhite tracking-wide">Ask Lexi</h4>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-gold/15 text-brand-gold-light border border-brand-gold/30 uppercase font-mono">
                Grounded Q&A
              </span>
            </div>
            <p className="text-[10px] text-brand-sand/70">Evidence-grounded contract assistant</p>
          </div>
        </div>

        <div className="p-1 rounded-lg text-brand-sand hover:text-white" aria-hidden="true">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </div>

      {/* Dock Body */}
      {isOpen && (
        <div className="flex-1 flex flex-col min-h-0 bg-brand-midnight/70">
          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-brand-navy-dark/80 border border-brand-gold/20 text-xs text-brand-sand/90 leading-relaxed">
                  <p className="font-semibold text-brand-gold mb-1 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Hi, I&apos;m Lexi!
                  </p>
                  <p>
                    Ask any question about this agreement. Answers are strictly grounded in candidate clauses with verified source citations. Lexi abstains if the terms are not in the document.
                  </p>
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-gold pt-1">
                  Suggested Queries:
                </p>

                <div className="space-y-1.5">
                  {sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      aria-label={`Ask: ${q}`}
                      className="w-full text-left text-xs p-2.5 rounded-lg bg-brand-midnight border border-brand-gold/15 hover:border-brand-gold/50 text-brand-sand hover:text-brand-warmwhite transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="space-y-2 text-xs">
                  {/* User Query */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] p-3 rounded-xl bg-brand-gold text-brand-midnight font-medium rounded-br-none shadow-md">
                      <p>{msg.question}</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div
                      className={`max-w-[95%] w-full p-3.5 rounded-xl rounded-bl-none border shadow-md space-y-2.5 ${
                        msg.isDeclinedAdvice
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                          : 'bg-brand-navy-dark border-brand-gold/20 text-brand-warmwhite'
                      }`}
                    >
                      {/* Status header */}
                      <div className="flex items-center justify-between text-[10px] pb-1 border-b border-brand-gold/10">
                        {msg.status === 'SUPPORTED' || msg.supportStatus === 'SUPPORTED' ? (
                          <span className="text-emerald-300 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Grounded in Document
                          </span>
                        ) : msg.status === 'CONTRADICTORY_EVIDENCE' || msg.supportStatus === 'CONTRADICTORY_EVIDENCE' ? (
                          <span className="text-purple-300 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Conflicting Clauses
                          </span>
                        ) : msg.status === 'PARTIALLY_SUPPORTED' || msg.supportStatus === 'PARTIALLY_SUPPORTED' || msg.supportStatus === 'PARTIALLY SUPPORTED' ? (
                          <span className="text-amber-300 font-bold flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" /> Partial Evidence
                          </span>
                        ) : (
                          <span className="text-zinc-400 font-bold flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Insufficient Evidence
                          </span>
                        )}
                        {msg.isDeclinedAdvice && (
                          <span className="text-amber-400 font-bold">Advice Refused</span>
                        )}
                      </div>

                      <p className="whitespace-pre-wrap leading-relaxed text-xs">{msg.answer}</p>

                      {/* Limitation if present */}
                      {msg.limitation && (
                        <div className="p-2 rounded bg-zinc-900/60 text-[10px] text-zinc-300 border border-zinc-800">
                          <span className="font-bold text-zinc-400">LIMITATION: </span>
                          {msg.limitation}
                        </div>
                      )}

                      {/* Source Clause Reference Badges */}
                      {msg.sources && msg.sources.length > 0 ? (
                        <div className="pt-2 border-t border-brand-gold/15 space-y-1.5">
                          <span className="text-[10px] text-brand-sand/70 font-mono block">CITED EVIDENCE:</span>
                          {msg.sources.map((s, sIdx) => (
                            <div key={sIdx} className="p-2 rounded bg-brand-midnight border border-brand-gold/15 text-[10px]">
                              <div className="flex items-center justify-between text-brand-gold font-mono mb-1">
                                <span>{s.clauseTitle || `Clause ${s.clauseNumber || sIdx + 1}`} · P.{s.page}</span>
                                <button
                                  type="button"
                                  onClick={() => onSelectClauseId(s.sourceClauseId)}
                                  aria-label={`View source for ${s.clauseTitle || 'Clause'}`}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-gold/15 hover:bg-brand-gold/30 text-brand-gold-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                                >
                                  <span>View</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                              </div>
                              <p className="text-brand-sand/80 italic line-clamp-2">&quot;{s.excerpt}&quot;</p>
                            </div>
                          ))}
                        </div>
                      ) : msg.sourceClauseIds && msg.sourceClauseIds.length > 0 ? (
                        <div className="pt-2 border-t border-brand-gold/15 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-brand-sand/70 font-medium">Sources:</span>
                          {msg.sourceClauseIds.map((clauseId) => (
                            <button
                              key={clauseId}
                              type="button"
                              onClick={() => onSelectClauseId(clauseId)}
                              aria-label="View source clause"
                              className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold-light border border-brand-gold/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                            >
                              <span>§ View Clause</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl bg-brand-navy-dark border border-brand-gold/20 text-brand-gold flex items-center gap-2 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching clauses and formulating grounded answer...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Dock Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-brand-navy-dark border-t border-brand-gold/20 flex items-center gap-2"
          >
            <input
              id="ask-lexi-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about this contract..."
              aria-label="Ask Lexi a question"
              className="flex-1 px-3 py-2 bg-brand-midnight border border-brand-gold/20 rounded-xl text-xs text-brand-warmwhite placeholder:text-brand-sand/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send query"
              className={`p-2 rounded-xl text-brand-midnight font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                input.trim() && !loading
                  ? 'bg-brand-gold hover:bg-brand-gold-light cursor-pointer shadow-md'
                  : 'bg-brand-navy text-brand-sand/40 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

