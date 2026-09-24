import React, { useState } from 'react';
import { Settings, Shield, Cpu, User, Bell, Check, Save, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

interface SettingsPageProps {
  onNavigate: (view: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'security' | 'notifications'>('ai');
  const [aiModel, setAiModel] = useState('gemini-1.5-pro');
  const [riskTolerance, setRiskTolerance] = useState('strict');
  const [clauseConfidenceThreshold, setClauseConfidenceThreshold] = useState(85);
  const [zeroRetention, setZeroRetention] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lexi-gold/10 border border-lexi-gold/30 text-lexi-gold text-xs font-serif italic mb-2">
              <Settings className="w-3.5 h-3.5" />
              Workspace Preferences & AI Controls
            </div>
            <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
              Institutional Settings
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Configure your neural legal model providers, source-citation sensitivity, and security vaults.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedNotice && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono animate-fade-in">
                <Check className="w-4 h-4" /> Preferences Synchronized
              </span>
            )}
            <Button
              variant="primary-gold"
              size="sm"
              onClick={handleSave}
              icon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {[
            { id: 'ai', label: 'AI & Inference Engine', icon: Cpu },
            { id: 'security', label: 'Security & Zero-Retention', icon: Shield },
            { id: 'general', label: 'Organization & Profile', icon: User },
            { id: 'notifications', label: 'Notice Window Alerts', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  active
                    ? 'bg-lexi-gold/15 text-lexi-gold border border-lexi-gold/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'ai' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary LLM Selection */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-lexi-gold text-sm font-semibold">
                  <Sparkles className="w-4 h-4" /> Primary Legal Intelligence Provider
                </div>
                <p className="text-xs text-slate-400">
                  Select the underlying foundational model for semantic clause parsing and forensic risk scoring.
                </p>

                  <div role="radiogroup" aria-label="AI Model" className="space-y-3 pt-2">
                    {[
                      {
                        id: 'gemini-1.5-pro',
                        title: 'Google Gemini 1.5 Pro (Recommended)',
                        desc: '2M Token context window. Unmatched multi-page cross-contract reasoning.',
                        badge: 'Production Default',
                      },
                      {
                        id: 'claude-3-5-sonnet',
                        title: 'Anthropic Claude 3.5 Sonnet',
                        desc: 'High legal drafting precision and nuanced redlining suggestions.',
                        badge: 'Supported',
                      },
                      {
                        id: 'local-llama-legal',
                        title: 'Self-Hosted Llama-3 70B Legal (Air-Gapped)',
                        desc: 'Zero-egress on-premise inference for classified defense or banking documents.',
                        badge: 'Enterprise',
                      },
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        role="radio"
                        aria-checked={aiModel === m.id}
                        onClick={() => setAiModel(m.id)}
                        className={`block w-full text-left p-4 rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-lexi-gold ${
                          aiModel === m.id
                            ? 'bg-slate-950 border-lexi-gold/60 shadow-lg shadow-lexi-gold/10'
                            : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-xs font-bold text-white">{m.title}</div>
                            <div className="text-[11px] text-slate-400 mt-1">{m.desc}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-slate-900 border border-slate-700 text-slate-300">
                            {m.badge}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
              </div>

              {/* Sensitivity and Confidence Sliders */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <div className="text-sm font-semibold text-white mb-1">Clause Extraction Confidence Threshold</div>
                  <p className="text-xs text-slate-400 mb-4">
                    Findings below this statistical confidence limit will be flagged as ambiguous for attorney confirmation.
                  </p>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={60}
                      max={98}
                      value={clauseConfidenceThreshold}
                      onChange={(e) => setClauseConfidenceThreshold(Number(e.target.value))}
                      className="w-full accent-lexi-gold"
                    />
                    <span className="font-mono text-xs font-bold text-lexi-gold shrink-0">
                      {clauseConfidenceThreshold}%
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-sm font-semibold text-white mb-1">Risk Severity Scoring Profile</div>
                  <p className="text-xs text-slate-400 mb-3">
                    Adjust how aggressively ambiguous indemnities, uncapped liabilities, and non-standard arbitration clauses are elevated.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'conservative', label: 'Conservative' },
                      { id: 'strict', label: 'Strict (Default)' },
                      { id: 'aggressive', label: 'Aggressive' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRiskTolerance(opt.id)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                          riskTolerance === opt.id
                            ? 'bg-lexi-gold text-slate-950 font-bold'
                            : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">Bidirectional Source Verification</div>
                      <div className="text-[11px] text-slate-400">Strictly enforce clause id highlighting on every click.</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                      Always Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-lexi-gold/15 border border-lexi-gold/40 text-lexi-gold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">Zero-Retention Confidentiality Protocol</h3>
                  <p className="text-xs text-slate-400">Your documents are never used for model training or retained post-session.</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-white">Enforce Zero-Retention AI Telemetry</div>
                    <div className="text-[11px] text-slate-400">Instructs inference endpoints to purge token context immediately after analysis generation.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={zeroRetention}
                    onChange={(e) => setZeroRetention(e.target.checked)}
                    className="w-4 h-4 accent-lexi-gold rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-white">Client-Side AES-256 Vault Encryption</div>
                    <div className="text-[11px] text-slate-400">Encrypts document body text locally before persisting to SQLite storage.</div>
                  </div>
                  <span className="text-[10px] font-mono text-lexi-gold uppercase tracking-wider font-bold">
                    Enabled
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-200">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">User & Legal Entity Profile</h3>
                  <p className="text-xs text-slate-400">Manage credentials and default signatory information.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label htmlFor="settings-full-name" className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                  <input
                    id="settings-full-name"
                    type="text"
                    defaultValue={user?.name || 'Legal Analyst'}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus-visible:border-lexi-gold focus-visible:ring-2 focus-visible:ring-lexi-gold"
                  />
                </div>
                <div>
                  <label htmlFor="settings-email" className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                  <input
                    id="settings-email"
                    type="email"
                    disabled
                    defaultValue={user?.email || 'counsel@institution.com'}
                    className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-slate-800 text-slate-400 rounded-xl text-xs cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">Notice Window & Renewal Dispatch</h3>
                  <p className="text-xs text-slate-400">Configure automated notifications for impending contractual deadlines.</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label htmlFor="daily-digest" className="flex items-center justify-between p-4 bg-slate-950/80 rounded-xl border border-slate-800 cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-white">Daily Digest of Expiring Contracts (&lt; 30 Days)</div>
                    <div className="text-[11px] text-slate-400">Receive morning summaries of critical auto-renewal opt-out deadlines.</div>
                  </div>
                  <input
                    id="daily-digest"
                    aria-label="Daily Digest of Expiring Contracts"
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-lexi-gold rounded focus-visible:ring-2 focus-visible:ring-lexi-gold focus:outline-none"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
