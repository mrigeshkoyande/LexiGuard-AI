import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { api } from '../services/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (documentId: string) => void;
}

type Stage = 'idle' | 'uploading' | 'extracting' | 'analyzing' | 'complete' | 'error';

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'txt'].includes(ext || '')) {
      setErrorMessage('Unsupported file format. Please upload a .pdf, .docx, or .txt document.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('File exceeds the 10MB limit.');
      return;
    }
    setErrorMessage(null);
    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setErrorMessage(null);
      setStage('uploading');

      const formData = new FormData();
      formData.append('document', file);
      formData.append('title', title || file.name);

      // Simulate stage transition progression as backend processes
      const extractTimer = setTimeout(() => setStage('extracting'), 600);
      const analyzeTimer = setTimeout(() => setStage('analyzing'), 1400);

      const res = await api.uploadDocument(formData);

      clearTimeout(extractTimer);
      clearTimeout(analyzeTimer);

      setStage('complete');
      setTimeout(() => {
        onSuccess(res.document.id);
        handleClose();
      }, 700);
    } catch (err: any) {
      setStage('error');
      setErrorMessage(err.message || 'Upload failed. Please try again.');
    }
  };

  const handleClose = () => {
    if (stage !== 'uploading' && stage !== 'extracting' && stage !== 'analyzing') {
      setFile(null);
      setTitle('');
      setStage('idle');
      setErrorMessage(null);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-title" className="text-base font-semibold text-white">Analyze Legal Document</h3>
              <p className="text-xs text-slate-400">PDF, DOCX, or TXT up to 10MB</p>
            </div>
          </div>
          {stage === 'idle' || stage === 'error' ? (
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          ) : null}
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          {stage === 'idle' || stage === 'error' ? (
            <>
              {/* Dropzone */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload document area"
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-950/20'
                    : file
                    ? 'border-slate-700 bg-slate-850/40'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/50 hover:bg-slate-950/80'
                }`}
              >
                <input
                  id="document-upload"
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  aria-hidden="true"
                  tabIndex={-1}
                />

                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-200 truncate max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(file.size / 1024).toFixed(1)} KB • Ready to extract
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-12 h-12 rounded-full bg-slate-800/80 text-cyan-400 flex items-center justify-center mx-auto mb-3 border border-slate-700">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-200">
                      Drag & drop your contract or <span className="text-cyan-400 underline">browse</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PDF, DOCX, and TXT agreements
                    </p>
                  </div>
                )}
              </div>

              {/* Title input */}
              <div>
                <label htmlFor="document-title" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Document Title (Optional)
                </label>
                <input
                  id="document-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer Employment Contract"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus-visible:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500 transition-colors"
                />
              </div>

              {/* Error display */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Upload CTA */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!file}
                  onClick={handleUpload}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    file
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start AI Extraction</span>
                </button>
              </div>
            </>
          ) : (
            /* Processing Stages */
            <div className="py-6 space-y-6" aria-live="polite">
              <div className="flex flex-col items-center justify-center text-center">
                {stage === 'complete' ? (
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3 animate-in zoom-in-75">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3">
                    <Loader2 className="w-7 h-7 animate-spin" />
                  </div>
                )}

                <h4 className="text-base font-semibold text-white">
                  {stage === 'uploading' && 'Uploading Document...'}
                  {stage === 'extracting' && 'Parsing Clauses & Sections...'}
                  {stage === 'analyzing' && 'Generating Grounded Insights...'}
                  {stage === 'complete' && 'Analysis Complete!'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  {stage === 'uploading' && 'Verifying file signatures and transferring securely to disk.'}
                  {stage === 'extracting' && 'Identifying clause boundaries, numbers, and page offsets.'}
                  {stage === 'analyzing' && 'Extracting compensation, obligations, notice periods, and restrictive covenants.'}
                  {stage === 'complete' && 'Opening split-screen analysis workspace...'}
                </p>
              </div>

              {/* Progress Steps Indicator */}
              <div className="space-y-2.5 max-w-xs mx-auto text-xs">
                <div className={`flex items-center gap-2.5 ${stage !== 'uploading' ? 'text-emerald-400 font-medium' : 'text-cyan-400'}`}>
                  {stage !== 'uploading' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                  <span>1. File Signature Validation</span>
                </div>
                <div className={`flex items-center gap-2.5 ${stage === 'analyzing' || stage === 'complete' ? 'text-emerald-400 font-medium' : stage === 'extracting' ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {stage === 'analyzing' || stage === 'complete' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : stage === 'extracting' ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
                  <span>2. Structural Clause Decomposition</span>
                </div>
                <div className={`flex items-center gap-2.5 ${stage === 'complete' ? 'text-emerald-400 font-medium' : stage === 'analyzing' ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {stage === 'complete' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : stage === 'analyzing' ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <div className="w-4 h-4 rounded-full border border-slate-700" />}
                  <span>3. Grounded Legal Analysis & Source Linking</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
