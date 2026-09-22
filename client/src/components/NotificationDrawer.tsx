import React, { useState } from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle2,
  ExternalLink,
  Trash2,
  CheckCheck,
  Info
} from 'lucide-react';
import { LEGAL_DISCLAIMER } from '@lexiguard/shared';

export interface NotificationItem {
  id: string;
  type: 'warning' | 'disclaimer' | 'deadline' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  docId?: string;
  clauseId?: string;
  severity?: 'critical' | 'high' | 'medium' | 'info';
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: string, docId?: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'warning' | 'disclaimer' | 'deadline'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-disclaimer-1',
      type: 'disclaimer',
      title: 'Statutory AI Legal Information Notice',
      message: LEGAL_DISCLAIMER,
      timestamp: 'Active Session',
      read: false,
      severity: 'info'
    },
    {
      id: 'notif-warn-1',
      type: 'warning',
      title: 'High-Risk Indemnity Flag Detected',
      message: 'Uncapped unilateral indemnification and broad IP indemnity carve-outs identified in analyzed agreement.',
      timestamp: '10m ago',
      read: false,
      severity: 'critical',
      docId: 'doc-1',
      clauseId: 'sec-2-clause-1'
    },
    {
      id: 'notif-deadline-1',
      type: 'deadline',
      title: 'Auto-Renewal Notice Cutoff Window',
      message: 'Written notice window expires in 24 days to prevent automatic 12-month extension on Master Services Agreement.',
      timestamp: '1h ago',
      read: false,
      severity: 'high',
      docId: 'doc-1'
    },
    {
      id: 'notif-sec-1',
      type: 'security',
      title: 'Zero-Retention Session Vault Active',
      message: 'Stateless API isolation enabled. Document memory buffer will be purged post-session with AES-256 forward secrecy.',
      timestamp: 'System',
      read: true,
      severity: 'info'
    }
  ]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-brand-midnight-card border-l border-brand-gold/25 shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left">
          {/* Header */}
          <div className="p-5 border-b border-brand-gold/20 bg-slate-50 dark:bg-brand-midnight/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-brand-gold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Compliance & Alert Hub</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30 text-[10px] font-mono font-bold">
                      {unreadCount} New
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-brand-sand/70">
                  Consolidated legal warnings, disclaimers, and deadlines
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar & Quick Actions */}
          <div className="px-5 py-3 bg-slate-100/70 dark:bg-brand-midnight/50 border-b border-brand-gold/15 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
              {[
                { id: 'all', label: 'All' },
                { id: 'warning', label: 'Warnings' },
                { id: 'disclaimer', label: 'Disclaimers' },
                { id: 'deadline', label: 'Deadlines' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    activeFilter === tab.id
                      ? 'bg-brand-gold text-white dark:text-slate-950 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-brand-sand/70 hover:bg-slate-200 dark:hover:bg-brand-navy/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="p-1.5 text-slate-500 dark:text-brand-sand/70 hover:text-brand-gold transition-colors text-xs flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  title="Clear all alerts"
                  className="p-1.5 text-slate-500 dark:text-brand-sand/70 hover:text-rose-400 transition-colors text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-brand-midnight border border-brand-gold/20 flex items-center justify-center mx-auto text-slate-400 dark:text-brand-sand/50">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="font-serif text-sm font-bold text-slate-800 dark:text-white">Workspace Clean & Clear</h4>
                <p className="text-xs text-slate-500 dark:text-brand-sand/60 max-w-xs mx-auto">
                  No active warnings, unresolved disclaimers, or critical cutoffs pending your attention.
                </p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-4 rounded-xl border transition-all relative ${
                    item.read
                      ? 'bg-slate-50 dark:bg-brand-midnight/60 border-slate-200 dark:border-brand-gold/15 opacity-85'
                      : 'bg-white dark:bg-brand-midnight border-brand-gold/40 shadow-md ring-1 ring-brand-gold/20'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      {item.type === 'warning' ? (
                        <div className="p-1 rounded bg-rose-500/10 text-rose-500 border border-rose-500/30">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      ) : item.type === 'disclaimer' ? (
                        <div className="p-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/30">
                          <Info className="w-3.5 h-3.5" />
                        </div>
                      ) : item.type === 'deadline' ? (
                        <div className="p-1 rounded bg-blue-500/10 text-blue-500 border border-blue-500/30">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                          <Shield className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-slate-400 dark:text-brand-sand/60 font-mono">
                        {item.timestamp}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(item.id);
                        }}
                        className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-brand-sand/85 leading-relaxed font-sans mt-1">
                    {item.message}
                  </p>

                  {/* Context Actions */}
                  {item.docId && onNavigate && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-brand-gold/10 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          onNavigate('workspace', item.docId);
                        }}
                        className="text-[11px] text-brand-gold hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>Open Document Workspace</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      {item.clauseId && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-brand-navy border border-slate-200 dark:border-brand-gold/20 text-[10px] font-mono text-slate-500 dark:text-brand-gold">
                          § {item.clauseId}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Note */}
          <div className="p-4 bg-slate-50 dark:bg-brand-midnight/90 border-t border-brand-gold/15 text-center">
            <span className="text-[10px] text-slate-500 dark:text-brand-sand/60 font-mono block">
              LexiGuard AI Sentinel Engine Active • 0 Unresolved Breaches
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
