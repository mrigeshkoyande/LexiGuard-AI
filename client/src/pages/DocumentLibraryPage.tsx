import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Plus,
  Trash2,
  ArrowRight,
  RefreshCw,
  LayoutGrid,
  List as ListIcon,
  Sparkles
} from 'lucide-react';
import { DocumentSummary } from '@lexiguard/shared';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

interface DocumentLibraryPageProps {
  onNavigate: (view: string, docId?: string) => void;
  onOpenUpload: () => void;
}

export const DocumentLibraryPage: React.FC<DocumentLibraryPageProps> = ({ onNavigate, onOpenUpload }) => {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.listDocuments();
      setDocuments(res.documents);
    } catch (err) {
      console.error('Failed to load library', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDocuments();
  }, []);

  const handleDelete = async (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this document from your library?')) {
      return;
    }
    try {
      setDeletingId(docId);
      await api.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err: unknown) {
      alert(`Delete failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesQuery =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.documentType && doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.analysisSummary && doc.analysisSummary.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'All' ||
      (categoryFilter === 'Employment' && doc.documentType?.includes('Employment')) ||
      (categoryFilter === 'NDA' && doc.documentType?.includes('NDA')) ||
      (categoryFilter === 'Lease' && doc.documentType?.includes('Lease')) ||
      (categoryFilter === 'Service' && doc.documentType?.includes('Service'));

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl sm:text-4xl text-brand-warmwhite font-light">Document Folios & Library</h1>
          <p className="text-xs text-brand-sand/80 mt-1">
            Search, manage, and inspect all indexed legal agreements across your workspace
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onOpenUpload}
            variant="primary-gold"
            size="md"
            icon={<Plus className="w-4 h-4" />}
          >
            Upload Document
          </Button>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-brand-midnight-card border border-brand-gold/20 flex flex-col md:flex-row gap-4 items-center justify-between shadow-navy-deep">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-brand-gold absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            id="library-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contracts by title, keyword, or document type..."
            aria-label="Search documents"
            className="w-full bg-brand-navy-dark border border-brand-gold/20 rounded-lg pl-10 pr-4 py-2 text-xs text-brand-warmwhite placeholder:text-brand-sand/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['All', 'Employment', 'NDA', 'Lease', 'Service'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                categoryFilter === cat
                  ? 'bg-brand-gold text-brand-midnight font-semibold'
                  : 'bg-brand-navy text-brand-sand hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-brand-navy-dark p-1 rounded-lg border border-brand-gold/20 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            className={`p-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${viewMode === 'grid' ? 'bg-brand-gold/20 text-brand-gold' : 'text-brand-sand hover:text-white'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            aria-label="List view"
            className={`p-1.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${viewMode === 'list' ? 'bg-brand-gold/20 text-brand-gold' : 'text-brand-sand hover:text-white'}`}
            title="List View"
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Documents Render */}
      {loading ? (
        <div className="p-16 text-center text-brand-sand text-xs bg-brand-midnight-card rounded-2xl border border-brand-gold/20">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-gold" />
          <span>Searching document repository...</span>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-brand-midnight-card/80 border border-brand-gold/20 space-y-4">
          <FileText className="w-10 h-10 text-brand-gold/40 mx-auto" />
          <h3 className="font-headline text-xl text-brand-warmwhite">No matching documents found</h3>
          <p className="text-xs text-brand-sand/70 max-w-sm mx-auto">Try clearing search keywords or upload a new agreement.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onNavigate('workspace', doc.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate('workspace', doc.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Open document ${doc.title}`}
              className="p-5 rounded-xl bg-brand-midnight-card border border-brand-gold/20 hover:border-brand-gold shadow-lg hover:shadow-gold-subtle transition-all duration-200 cursor-pointer flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold text-left"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-brand-navy text-brand-gold border border-brand-gold/25">
                    <FileText className="w-5 h-5" />
                  </div>
                  <Badge variant="status" status={(doc.status === 'ERROR' || doc.status === 'ANALYZED' || doc.status === 'PENDING') ? doc.status : 'PENDING'}>{doc.status}</Badge>
                </div>
                <h3 className="text-sm font-semibold text-brand-warmwhite group-hover:text-brand-gold-light transition-colors line-clamp-1">
                  {doc.title}
                </h3>
                <p className="text-[11px] text-brand-sand/70 mt-0.5">
                  {doc.documentType || 'Legal Contract'} • {doc.pageCount} Page(s)
                </p>
                <p className="text-xs text-brand-sand/80 mt-2.5 line-clamp-2 leading-relaxed">
                  {doc.analysisSummary || 'Analysis and findings ready.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-gold/15 flex items-center justify-between text-xs">
                <span className="text-brand-gold font-mono text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {doc.findingCount || 0} Findings
                </span>
                <span className="text-brand-gold group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-brand-midnight-card rounded-xl border border-brand-gold/20 overflow-hidden shadow-navy-deep">
          <table className="w-full text-left text-xs text-brand-sand">
            <thead className="bg-brand-navy-dark text-[10px] uppercase font-bold text-brand-gold tracking-wider border-b border-brand-gold/20">
              <tr>
                <th className="p-4">Document Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Pages</th>
                <th className="p-4">Findings</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gold/10">
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => onNavigate('workspace', doc.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onNavigate('workspace', doc.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open document ${doc.title}`}
                  className="hover:bg-brand-navy/40 cursor-pointer transition-colors focus:outline-none focus-visible:bg-brand-navy/60"
                >
                  <td className="p-4 font-semibold text-brand-warmwhite flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-gold shrink-0" />
                    <span className="line-clamp-1">{doc.title}</span>
                  </td>
                  <td className="p-4">{doc.documentType || 'Legal Agreement'}</td>
                  <td className="p-4 font-mono">{doc.pageCount}</td>
                  <td className="p-4 font-mono text-brand-gold">{doc.findingCount || 0}</td>
                  <td className="p-4">
                    <Badge variant="status" status={(doc.status === 'ERROR' || doc.status === 'ANALYZED' || doc.status === 'PENDING') ? doc.status : 'PENDING'}>{doc.status}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => handleDelete(e, doc.id)}
                      disabled={deletingId === doc.id}
                      aria-label={`Delete document ${doc.title}`}
                      className="p-1.5 text-brand-sand hover:text-rose-400 disabled:opacity-40 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
