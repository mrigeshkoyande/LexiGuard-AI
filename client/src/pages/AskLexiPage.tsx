import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  AlertTriangle,
  ExternalLink,
  Shield,
  Loader2
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
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          question: text,
          answer: `Error: ${err.message || 'Failed to process question'}`,
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
    'What are my key obligations and payment terms?',
    'What happens if either party terminates without cause?',
    'What are the non-compete, confidentiality, and IP ownership rules?',
    'What deadlines or renewal notice windows apply?',
    'Should I sign this agreement?'
  ];

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-headline text-3xl sm:text-4xl text-brand-warmwhite font-light">Ask Lexi</h1>
            <Badge variant="gold">Grounded Q&A</Badge>
          </div>
          <p className="text-xs text-brand-sand/80 mt-1">
            Interrogate your uploaded agreements with natural language queries backed by verified clause evidence
          </p>
        </div>

        {/* Document Selector */}
        <div className="w-full sm:w-72">
          <label className="block text-[10px] font-bold uppercase text-brand-gold tracking-wider mb-1">
            Active Contract
          </label>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="w-full px-3 py-2 bg-brand-midnight-card border border-brand-gold/30 rounded-xl text-xs text-brand-warmwhite focus:outline-none focus:border-brand-gold"
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
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[460px] pr-2">
            {messages.length === 0 ? (
              <div className="space-y-4 py-8 text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-brand-navy border border-brand-gold/30 text-brand-gold flex items-center justify-center mx-auto shadow-md">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-headline text-xl text-brand-warmwhite font-light">
                    Ask anything about "{selectedDoc?.title || 'your contract'}"
                  </h3>
                  <p className="text-xs text-brand-sand/80 mt-1">
                    Every answer is strictly grounded in candidate clauses with verified source citations.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="space-y-2 text-xs">
                  {/* User Question */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] p-3.5 rounded-xl bg-brand-gold text-brand-midnight font-medium rounded-br-none shadow-md">
                      <p>{msg.question}</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div
                      className={`max-w-[90%] p-4 rounded-xl rounded-bl-none border shadow-md space-y-2.5 ${
                        msg.isDeclinedAdvice
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                          : 'bg-brand-navy-dark border-brand-gold/25 text-brand-warmwhite'
                      }`}
                    >
                      {msg.isDeclinedAdvice && (
                        <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Legal Advice Request Declined</span>
                        </div>
                      )}

                      <p className="whitespace-pre-wrap leading-relaxed text-xs">{msg.answer}</p>

                      {/* Source Citations */}
                      {msg.sourceClauseIds && msg.sourceClauseIds.length > 0 && (
                        <div className="pt-2 border-t border-brand-gold/15 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] text-brand-sand/70 font-mono">Verified Evidence:</span>
                          {msg.sourceClauseIds.map((clauseId) => (
                            <button
                              key={clauseId}
                              onClick={() => selectedDocId && onNavigate('workspace', selectedDocId)}
                              className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold-light border border-brand-gold/30 transition-colors"
                            >
                              <span>§ View in Workspace</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          ))}
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
                  <span>Searching document text & formulating grounded response...</span>
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
              <Shield className="w-3.5 h-3.5" /> Zero Hallucination Guarantee
            </span>
            <p className="leading-relaxed">
              Lexi answers strictly using indexed clauses from your uploaded document. If an answer cannot be verified in the contract text, Lexi safely declines to speculate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
