import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2
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
    'What is the salary and bonus compensation?',
    'What is the probation period length?',
    'What are the termination notice rules?',
    'What are the non-compete and IP restrictions?',
    'Should I sign this agreement?' // tests safe refusal
  ];

  return (
    <div
      className={`fixed bottom-4 right-4 z-30 w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden flex flex-col ${
        isOpen ? 'h-[500px]' : 'h-14'
      }`}
    >
      {/* Dock Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white tracking-wide">Ask Lexi</h4>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Grounded Q&A
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Strictly answers from uploaded document</p>
          </div>
        </div>

        <button className="p-1 rounded-lg text-slate-400 hover:text-white">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Dock Body */}
      {isOpen && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-950/60">
          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <p className="font-semibold text-cyan-400 mb-1">Hi, I'm Lexi!</p>
                  <p>
                    Ask me any question about this document. Every answer is strictly grounded in the document text and cites the exact source clauses.
                  </p>
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 pt-1">
                  Try asking:
                </p>

                <div className="space-y-1.5">
                  {sampleQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="w-full text-left text-xs p-2 rounded-lg bg-slate-900/60 hover:bg-slate-850 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors"
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
                    <div className="max-w-[85%] p-3 rounded-xl bg-cyan-600 text-white rounded-br-none shadow-md">
                      <p className="font-medium">{msg.question}</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div
                      className={`max-w-[90%] p-3.5 rounded-xl rounded-bl-none border shadow-md space-y-2 ${
                        msg.isDeclinedAdvice
                          ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                          : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}
                    >
                      {msg.isDeclinedAdvice && (
                        <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Legal Advice Request Declined</span>
                        </div>
                      )}

                      <p className="whitespace-pre-wrap leading-relaxed">{msg.answer}</p>

                      {/* Source Clause Reference Badges */}
                      {msg.sourceClauseIds && msg.sourceClauseIds.length > 0 && (
                        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-medium">Sources:</span>
                          {msg.sourceClauseIds.map((clauseId) => (
                            <button
                              key={clauseId}
                              type="button"
                              onClick={() => onSelectClauseId(clauseId)}
                              className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-colors"
                            >
                              <span>§ View Clause</span>
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
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 flex items-center gap-2 text-xs">
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
            className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about this contract..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`p-2 rounded-xl text-white transition-all ${
                input.trim() && !loading
                  ? 'bg-cyan-600 hover:bg-cyan-500 cursor-pointer shadow-md shadow-cyan-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
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
