import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  AlertTriangle,
  ExternalLink,
  Shield,
  Loader2,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';
import { DocumentSummary, QuestionResponse } from '@lexiguard/shared';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface AskLexiPageProps {
  documentId?: string;
  onNavigate: (view: string, docId?: string) => void;
}

export const AskLexiPage: React.FC<AskLexiPageProps> = ({ documentId, onNavigate }) => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>(documentId || '');
  const [messages, setMessages] = useState<QuestionResponse[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await api.listDocuments();
        setDocuments(res.documents);
        if (res.documents.length > 0 && !selectedDocId) {
          setSelectedDocId(res.documents[0].id);
        }
      } catch (err) {
        console.error('Failed to load documents for Q&A', err);
      }
    }
    loadDocs();
  }, [selectedDocId]);

  useEffect(() => {
    if (!selectedDocId) return;
    async function loadHistory() {
      try {
        const res = await api.getQnAHistory(selectedDocId);
        if (res.history && res.history.length > 0) {
          setMessages(res.history.reverse());
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error('Failed to load QnA history', err);
      }
    }
    loadHistory();
  }, [selectedDocId]);

  const handleSend = async (queryText?: string) => {
    const text = (queryText || input).trim();
    if (!text || !selectedDocId || loading) return;

    setInput('');
    setLoading(true);

    try {
      const response = await api.askQuestion(selectedDocId, text);
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
    'What is the monthly salary or payment amount?',
    'What is the exact termination notice period?',
    'What are the non-compete and IP ownership restrictions?',
    'What is the renewal date or late payment fee?',
    'Should I sign this agreement?'
  ];

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'SUPPORTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED IN DOCUMENT
          </span>
        );
      case 'PARTIALLY_SUPPORTED':
      case 'PARTIALLY SUPPORTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <HelpCircle className="w-3 h-3" /> PARTIALLY SUPPORTED
          </span>
        );
      case 'CONTRADICTORY_EVIDENCE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <AlertTriangle className="w-3 h-3" /> CONFLICTING PROVISIONS
          </span>
        );
      case 'INSUFFICIENT_EVIDENCE':
      case 'INSUFFICIENT EVIDENCE':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-500/15 text-zinc-300 border border-zinc-500/30">
            <FileText className="w-3 h-3" /> INSUFFICIENT EVIDENCE — ABSTAINED
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline text-3xl sm:text-4xl text-brand-warmwhite font-light">Ask Lexi</h1>
            <Badge variant="gold">Grounded Legal Assistant</Badge>
          </div>
          <p className="text-xs text-brand-sand/80 mt-1">
            Interrogate your uploaded agreements with natural language queries backed by verified clause evidence
          </p>
        </div>

        {/* Document Selector */}
        <div className="w-full sm:w-72">
          <label htmlFor="active-contract" className="block text-[10px] font-bold uppercase text-brand-gold tracking-wider mb-1">
            Active Contract
          </label>
          <select
            id="active-contract"
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="w-full px-3 py-2 bg-brand-midnight-card border border-brand-gold/30 rounded-xl text-xs text-brand-warmwhite focus:outline-none focus:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.originalFilename})
              </option>
            ))}
          </select>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Main Two-Column Q&A Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[560px]">
        {/* Left Column: Chat Stream (8 cols) */}
        <div className="lg:col-span-8 bg-brand-midnight-card/90 border border-brand-gold/25 rounded-2xl p-6 shadow-navy-deep flex flex-col justify-between backdrop-blur-md">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-5 max-h-[480px] pr-2">
            {messages.length === 0 ? (
              <div className="space-y-4 py-8 text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-brand-navy border border-brand-gold/30 text-brand-gold flex items-center justify-center mx-auto shadow-md">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline text-xl text-brand-warmwhite font-light">
                    Ask anything about &quot;{selectedDoc?.title || 'your contract'}&quot;
                  </h3>
                  <p className="text-xs text-brand-sand/80 mt-1">
                    Every answer is strictly grounded in candidate clauses with verified source citations. Lexi abstains if the terms are not in the document.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="space-y-3 text-xs">
                  {/* User Question */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] p-3.5 rounded-xl bg-brand-gold text-brand-midnight font-medium rounded-br-none shadow-md">
                      <p>{msg.question}</p>
                    </div>
                  </div>

                  {/* AI Response Card */}
                  <div className="flex justify-start">
                    <div
                      className={`max-w-[95%] w-full p-4 rounded-xl rounded-bl-none border shadow-md space-y-3 ${
                        msg.isDeclinedAdvice
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                          : 'bg-brand-navy-dark border-brand-gold/25 text-brand-warmwhite'
                      }`}
                    >
                      {/* Top Bar: Status Badge */}
                      <div className="flex items-center justify-between gap-2 border-b border-brand-gold/15 pb-2">
                        {getStatusBadge(msg.status || msg.supportStatus)}
                        {msg.isDeclinedAdvice && (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Legal Advice Refusal
                          </span>
                        )}
                      </div>

                      {/* Main Answer Content */}
                      <p className="whitespace-pre-wrap leading-relaxed text-xs">{msg.answer}</p>

                      {/* Limitation Box if present */}
                      {msg.limitation && (
                        <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-700/50 text-[11px] text-zinc-300">
                          <span className="font-bold text-zinc-400 block mb-0.5">DOCUMENT LIMITATION:</span>
                          <p>{msg.limitation}</p>
                        </div>
                      )}

                      {/* Next Step Box if present */}
                      {msg.nextStep && (
                        <div className="p-2.5 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-[11px] text-brand-gold-light">
                          <span className="font-bold text-brand-gold block mb-0.5">SUGGESTED REVIEW:</span>
                          <p>{msg.nextStep}</p>
                        </div>
                      )}

                      {/* Verified Evidence Excerpts */}
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="pt-2 border-t border-brand-gold/15 space-y-2">
                          <span className="text-[10px] text-brand-sand/70 font-mono uppercase font-bold tracking-wider block">
                            Verified Source Evidence:
                          </span>
                          <div className="space-y-2">
                            {msg.sources.map((s, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-2.5 rounded-lg bg-brand-midnight border border-brand-gold/20 flex flex-col gap-1.5"
                              >
                                <div className="flex items-center justify-between text-[10px] font-mono text-brand-gold">
                                  <span>
                                    {s.clauseTitle || `Clause ${s.clauseNumber || sIdx + 1}`} · Page {s.page}
                                  </span>
                                  <button
                                    onClick={() => selectedDocId && onNavigate('workspace', selectedDocId)}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-gold/15 hover:bg-brand-gold/30 text-brand-gold-light transition-colors"
                                  >
                                    <span>§ View Source</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                                <p className="text-[11px] text-brand-sand/90 italic line-clamp-3">
                                  &quot;{s.excerpt}&quot;
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="p-3.5 rounded-xl bg-brand-navy-dark border border-brand-gold/20 text-brand-gold flex items-center gap-2 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Retrieving document clauses & validating evidence...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="pt-4 border-t border-brand-gold/20 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about this contract (e.g. What is the notice period?)..."
              className="flex-1 px-4 py-3 bg-brand-midnight border border-brand-gold/25 rounded-xl text-xs text-brand-warmwhite placeholder:text-brand-sand/40 focus:outline-none focus:border-brand-gold"
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              variant="primary-gold"
              size="md"
              icon={<Send className="w-4 h-4" />}
            >
              Ask
            </Button>
          </form>
        </div>

        {/* Right Column: Evidence & Suggested Queries (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Suggested Prompts */}
          <div className="p-5 rounded-2xl bg-brand-midnight-card border border-brand-gold/20 shadow-navy-deep space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Suggested Inquiries
            </h3>
            <div className="space-y-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left text-xs p-3 rounded-xl bg-brand-navy-dark border border-brand-gold/15 hover:border-brand-gold/50 text-brand-sand hover:text-brand-warmwhite transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Grounding Transparency Info Box */}
          <div className="p-5 rounded-2xl bg-brand-navy-dark border border-brand-gold/20 space-y-2 text-xs text-brand-sand/80">
            <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Evidence-Grounded Legal Analysis
            </span>
            <p className="leading-relaxed">
              Lexi answers strictly using retrieved clauses from your uploaded document. If an answer cannot be verified in the contract text, Lexi explicitly abstains rather than speculating.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

