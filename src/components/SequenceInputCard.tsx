/**
 * AffiniProt - Sequence Input Card Component
 * Accessible FASTA editor with live alphabet validation, file upload,
 * and clean residue metrics. Professional scientific styling.
 */

import React, { useRef } from 'react';
import { Upload, Trash2, CheckCircle2, AlertTriangle, AlertCircle, FileText, Sparkles } from 'lucide-react';

interface SequenceInputCardProps {
  label: string; // 'Protein A' or 'Protein B'
  value: string;
  onChange: (val: string) => void;
  onLoadExample: () => void;
  exampleTitle?: string;
  roleHint: string;
  validationStatus: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    length: number;
    id: string;
  };
}

export const SequenceInputCard: React.FC<SequenceInputCardProps> = ({
  label,
  value,
  onChange,
  onLoadExample,
  exampleTitle = 'Load Example',
  roleHint,
  validationStatus
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File exceeds 2 MB limit for FASTA sequences.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChange(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const hasContent = value.trim().length > 0;

  return (
    <div className="flex flex-col bg-white border border-[#D9E4F5] rounded-2xl overflow-hidden shadow-scientific shadow-scientific-hover">
      {/* Card Header Bar */}
      <div className="px-4 py-3 bg-[#F4F7FC] border-b border-[#D9E4F5] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] ring-4 ring-[#E8F1FF]" />
          <div>
            <h2 className="text-sm font-bold text-[#172B4D] tracking-tight">{label}</h2>
            <p className="text-[11px] text-[#64748B]">{roleHint}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onLoadExample}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#2563EB] hover:text-[#173B70] bg-[#E8F1FF] hover:bg-[#D9E4F5] border border-[#D9E4F5] rounded-lg transition-colors cursor-pointer"
            title={`Load benchmark example: ${exampleTitle}`}
          >
            <Sparkles className="w-3 h-3 text-[#2563EB]" />
            <span>Example</span>
          </button>

          <label className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#172B4D] hover:text-[#0F2D5B] bg-white hover:bg-[#F4F7FC] border border-[#D9E4F5] rounded-lg cursor-pointer transition-colors shadow-2xs">
            <Upload className="w-3 h-3 text-[#64748B]" />
            <span>Upload</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".fasta,.fa,.txt,.seq"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {hasContent && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-[#64748B] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer"
              title="Clear sequence input"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative p-4 flex-1 flex flex-col bg-white">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`>ProteinIdentifier\nMKVLQEPTCVSDYMSISTCEWKMNGPTNCSTELRLLYQLVF...`}
          rows={7}
          spellCheck={false}
          className="w-full h-44 p-3.5 font-mono text-xs leading-relaxed bg-[#F8FAFC] border border-[#D9E4F5] rounded-xl text-[#172B4D] placeholder-[#64748B]/60 focus:outline-hidden focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#E8F1FF] transition-all resize-y"
        />

        {/* Live Status Footer */}
        <div className="mt-3 pt-2.5 border-t border-[#D9E4F5] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {!hasContent ? (
              <span className="text-[#64748B] flex items-center gap-1 text-[11px]">
                <FileText className="w-3.5 h-3.5 text-[#64748B]/70" />
                <span>Paste FASTA or raw amino acid sequence</span>
              </span>
            ) : validationStatus.isValid ? (
              <span className="text-[#059669] flex items-center gap-1.5 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>Valid Protein Sequence</span>
                {validationStatus.id && (
                  <span className="text-[#173B70] font-mono font-medium">({validationStatus.id})</span>
                )}
              </span>
            ) : (
              <span className="text-[#DC2626] flex items-center gap-1.5 font-semibold text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Invalid Sequence</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[#172B4D] text-[11px] font-mono">
            <span className="text-[#64748B]">Length:</span>
            <strong className="text-[#0F2D5B] font-bold text-xs">{validationStatus.length}</strong>
            <span className="text-[#64748B]">residues</span>
          </div>
        </div>

        {/* Errors & Warnings Callouts */}
        {validationStatus.errors.length > 0 && (
          <div className="mt-2.5 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[11px] text-[#DC2626] flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#DC2626] mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              {validationStatus.errors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </div>
          </div>
        )}

        {validationStatus.warnings.length > 0 && (
          <div className="mt-2.5 p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl text-[11px] text-[#D97706] flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              {validationStatus.warnings.map((warn, i) => (
                <p key={i}>{warn}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
