/**
 * AffiniProt - Prediction Input View Component
 * Clean, modern, professional bioinformatics input interface
 * Palette: Navy #0F2D5B, Blue #2563EB, Purple #635BFF, Border #D9E4F5
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ArrowLeftRight, 
  RotateCcw, 
  AlertCircle, 
  Sliders, 
  CheckCircle2,
  Atom,
  Loader2,
  Sparkles,
  Layers
} from 'lucide-react';
import { FunctionalClassId, PredictionPayload } from '../types.ts';
import { SequenceInputCard } from './SequenceInputCard.tsx';
import { FUNCTIONAL_CLASSES } from '../server/featureRegistry.ts';
import { VERIFIED_BENCHMARK_COMPLEXES } from '../server/benchmarkData.ts';

interface PredictionViewProps {
  onPredictionSuccess: (result: PredictionPayload) => void;
  onOpenMethodology: () => void;
}

export const PredictionView: React.FC<PredictionViewProps> = ({
  onPredictionSuccess,
  onOpenMethodology
}) => {
  const [fastaA, setFastaA] = useState<string>('');
  const [fastaB, setFastaB] = useState<string>('');
  const [functionalClass, setFunctionalClass] = useState<FunctionalClassId>('enzyme_inhibitor');
  const [identifier, setIdentifier] = useState<string>('');
  const [userNotes, setUserNotes] = useState<string>('');
  const [temperatureK, setTemperatureK] = useState<number>(298.15);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Validation state
  const [validationA, setValidationA] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    length: number;
    id: string;
  }>({ isValid: false, errors: [], warnings: [], length: 0, id: '' });

  const [validationB, setValidationB] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    length: number;
    id: string;
  }>({ isValid: false, errors: [], warnings: [], length: 0, id: '' });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Client-side quick validation on input change
  useEffect(() => {
    // Validate A
    const trimmedA = fastaA.trim();
    if (!trimmedA) {
      setValidationA({ isValid: false, errors: [], warnings: [], length: 0, id: '' });
    } else {
      const lines = trimmedA.split('\n');
      const headerLine = lines.find(l => l.startsWith('>'));
      const id = headerLine ? headerLine.substring(1).trim().split(/\s+/)[0] : 'Protein_A';
      const seqOnly = lines.filter(l => !l.startsWith('>')).join('').replace(/\s+/g, '').toUpperCase();
      const invalidChars = seqOnly.replace(/[ACDEFGHIKLMNPQRSTVWYBZJUXO\*\-]/gi, '');
      const isDna = seqOnly.length > 20 && (seqOnly.match(/[ACGTU]/gi) || []).length / seqOnly.length > 0.88;

      const errors: string[] = [];
      const warnings: string[] = [];
      if (isDna) errors.push('Sequence appears to be DNA/RNA nucleotides instead of amino acids.');
      if (invalidChars.length > 0) errors.push(`Invalid non-amino acid characters: ${Array.from(new Set(invalidChars)).join(', ')}.`);
      if (seqOnly.length > 0 && seqOnly.length < 5) errors.push('Sequence is shorter than minimum 5 residues.');

      setValidationA({
        isValid: errors.length === 0 && seqOnly.length >= 5,
        errors,
        warnings,
        length: seqOnly.length,
        id
      });
    }

    // Validate B
    const trimmedB = fastaB.trim();
    if (!trimmedB) {
      setValidationB({ isValid: false, errors: [], warnings: [], length: 0, id: '' });
    } else {
      const lines = trimmedB.split('\n');
      const headerLine = lines.find(l => l.startsWith('>'));
      const id = headerLine ? headerLine.substring(1).trim().split(/\s+/)[0] : 'Protein_B';
      const seqOnly = lines.filter(l => !l.startsWith('>')).join('').replace(/\s+/g, '').toUpperCase();
      const invalidChars = seqOnly.replace(/[ACDEFGHIKLMNPQRSTVWYBZJUXO\*\-]/gi, '');
      const isDna = seqOnly.length > 20 && (seqOnly.match(/[ACGTU]/gi) || []).length / seqOnly.length > 0.88;

      const errors: string[] = [];
      const warnings: string[] = [];
      if (isDna) errors.push('Sequence appears to be DNA/RNA nucleotides instead of amino acids.');
      if (invalidChars.length > 0) errors.push(`Invalid non-amino acid characters: ${Array.from(new Set(invalidChars)).join(', ')}.`);
      if (seqOnly.length > 0 && seqOnly.length < 5) errors.push('Sequence is shorter than minimum 5 residues.');

      setValidationB({
        isValid: errors.length === 0 && seqOnly.length >= 5,
        errors,
        warnings,
        length: seqOnly.length,
        id
      });
    }
  }, [fastaA, fastaB]);

  const handleLoadPreset = (index: number) => {
    const preset = VERIFIED_BENCHMARK_COMPLEXES[index] || VERIFIED_BENCHMARK_COMPLEXES[0];
    setFastaA(preset.fastaA);
    setFastaB(preset.fastaB);
    setFunctionalClass(preset.functionalClass);
    setIdentifier(preset.name);
    setUserNotes(`Experimental ΔG = ${preset.experimentalDeltaG} kcal/mol (${preset.experimentalKdText})`);
    setSubmitError(null);
  };

  const handleSwapProteins = () => {
    const temp = fastaA;
    setFastaA(fastaB);
    setFastaB(temp);
  };

  const handleClearAll = () => {
    setFastaA('');
    setFastaB('');
    setIdentifier('');
    setUserNotes('');
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validationA.isValid || !validationB.isValid) {
      setSubmitError('Please provide valid protein sequences for both interactors before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fastaA,
          fastaB,
          functionalClass,
          identifier: identifier.trim() || undefined,
          userNotes: userNotes.trim() || undefined,
          temperatureK
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Prediction calculation failed. Please check sequence inputs.');
      }

      onPredictionSuccess(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error occurred while connecting to prediction engine.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = validationA.isValid && validationB.isValid && !isSubmitting;

  return (
    <div className="space-y-6">
      {/* Benchmark Presets Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          <span className="text-xs font-bold text-[#0F2D5B]">Benchmark Presets:</span>
          <span className="text-xs text-[#64748B] hidden sm:inline">Load verified experimental complex</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleLoadPreset(0)}
            className="px-2.5 py-1 text-xs bg-[#F4F7FC] hover:bg-[#E8F1FF] text-[#172B4D] hover:text-[#2563EB] border border-[#D9E4F5] rounded-lg transition-colors cursor-pointer"
            title="1CHO: Chymotrypsin + Inhibitor"
          >
            Enzyme (1CHO)
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset(2)}
            className="px-2.5 py-1 text-xs bg-[#F4F7FC] hover:bg-[#E8F1FF] text-[#172B4D] hover:text-[#2563EB] border border-[#D9E4F5] rounded-lg transition-colors cursor-pointer"
            title="1BVK: HyHEL-10 Antibody + Lysozyme"
          >
            Antibody (1BVK)
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset(5)}
            className="px-2.5 py-1 text-xs bg-[#F4F7FC] hover:bg-[#E8F1FF] text-[#172B4D] hover:text-[#2563EB] border border-[#D9E4F5] rounded-lg transition-colors cursor-pointer"
            title="1WQ1: Ras GTPase + PI3K"
          >
            G-Protein (1WQ1)
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset(7)}
            className="px-2.5 py-1 text-xs bg-[#F4F7FC] hover:bg-[#E8F1FF] text-[#172B4D] hover:text-[#2563EB] border border-[#D9E4F5] rounded-lg transition-colors cursor-pointer"
            title="1IAR: IL-4 + Receptor"
          >
            Receptor (1IAR)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Sequence Inputs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SequenceInputCard
            label="Protein A Sequence"
            value={fastaA}
            onChange={setFastaA}
            onLoadExample={() => handleLoadPreset(0)}
            exampleTitle="Chymotrypsin A"
            roleHint="First interacting chain (enzyme, antibody, receptor)"
            validationStatus={validationA}
          />

          <SequenceInputCard
            label="Protein B Sequence"
            value={fastaB}
            onChange={setFastaB}
            onLoadExample={() => handleLoadPreset(0)}
            exampleTitle="Inhibitor B"
            roleHint="Second interacting partner (inhibitor, antigen, ligand)"
            validationStatus={validationB}
          />
        </div>

        {/* Swap / Clear toolbar */}
        <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSwapProteins}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F4F7FC] border border-[#D9E4F5] rounded-lg text-[#172B4D] hover:text-[#2563EB] transition-colors cursor-pointer shadow-2xs"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Swap A and B</span>
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FEF2F2] border border-[#D9E4F5] rounded-lg text-[#172B4D] hover:text-[#DC2626] transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Clear</span>
            </button>
          </div>

          <div className="font-mono text-[#0F2D5B] text-xs">
            Combined Residues: <strong className="text-[#2563EB] font-bold">{validationA.length + validationB.length}</strong> aa
          </div>
        </div>

        {/* Functional Class Selector */}
        <div className="p-5 bg-white border border-[#D9E4F5] rounded-2xl space-y-3.5 shadow-scientific">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0F2D5B] flex items-center gap-2">
              <Atom className="w-4 h-4 text-[#2563EB]" />
              <span>Complex Functional Class</span>
            </label>
            <button
              type="button"
              onClick={onOpenMethodology}
              className="text-xs text-[#2563EB] hover:text-[#173B70] hover:underline cursor-pointer font-medium"
            >
              Learn about class architectures →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(FUNCTIONAL_CLASSES).map((fc) => {
              const isSelected = functionalClass === fc.id;
              return (
                <div
                  key={fc.id}
                  onClick={() => setFunctionalClass(fc.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#E8F1FF] border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-xs'
                      : 'bg-white border-[#D9E4F5] hover:border-[#BFDBFE] hover:bg-[#F4F7FC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold text-xs ${isSelected ? 'text-[#0F2D5B]' : 'text-[#172B4D]'}`}>
                      {fc.name}
                    </span>
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      isSelected 
                        ? 'bg-[#2563EB] text-white' 
                        : 'bg-[#F4F7FC] text-[#173B70] border border-[#D9E4F5]'
                    }`}>
                      {fc.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1.5 line-clamp-2 leading-relaxed">
                    {fc.shortDescription}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Settings Collapsible */}
        <div className="p-4 bg-white border border-[#D9E4F5] rounded-2xl space-y-2.5 shadow-scientific">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#173B70] hover:text-[#0F2D5B] cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{showAdvanced ? 'Hide Optional Settings' : 'Add Name / Assay Conditions (Optional)'}</span>
            </button>
            <span className="text-[11px] text-[#64748B] font-mono">Assay Standard: {temperatureK} K (25 °C)</span>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3 border-t border-[#D9E4F5]">
              <div>
                <label className="block text-xs font-medium text-[#172B4D] mb-1">
                  Complex Name
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. Trypsin-BPTI"
                  className="w-full px-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#D9E4F5] rounded-lg text-[#172B4D] placeholder-[#64748B]/60 focus:outline-hidden focus:bg-white focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172B4D] mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. Wild-type complex"
                  className="w-full px-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#D9E4F5] rounded-lg text-[#172B4D] placeholder-[#64748B]/60 focus:outline-hidden focus:bg-white focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#172B4D] mb-1">
                  Temperature (K)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={temperatureK}
                  onChange={(e) => setTemperatureK(parseFloat(e.target.value) || 298.15)}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-[#F8FAFC] border border-[#D9E4F5] rounded-lg text-[#172B4D] placeholder-[#64748B]/60 focus:outline-hidden focus:bg-white focus:border-[#2563EB]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submission Error Banner */}
        {submitError && (
          <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs text-[#DC2626] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <p className="leading-relaxed">{submitError}</p>
          </div>
        )}

        {/* Submit Button & Status Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="text-xs text-[#64748B]">
            {!validationA.isValid || !validationB.isValid ? (
              <span className="text-[#D97706] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Provide two valid protein sequences (≥ 5 residues) to calculate affinity.</span>
              </span>
            ) : (
              <span className="text-[#059669] flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>Sequences validated. Ready to predict binding parameters.</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-md ${
              isFormValid
                ? 'bg-gradient-to-r from-[#2563EB] to-[#635BFF] hover:from-[#1D4ED8] hover:to-[#4F46E5] text-white cursor-pointer active:scale-98 shadow-blue-500/20'
                : 'bg-[#D9E4F5] text-[#64748B] cursor-not-allowed border border-[#D9E4F5]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Calculating Binding Affinity...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Predict Binding Affinity</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
