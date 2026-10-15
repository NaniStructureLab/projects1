/**
 * AffiniProt - Main Application Component
 * Professional Scientific Dashboard UI
 * Colors: Navy #0F2D5B, Blue #2563EB, Purple #635BFF, Canvas #EEF4FF
 */

import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar.tsx';
import { PredictionView } from './components/PredictionView.tsx';
import { ResultsView } from './components/ResultsView.tsx';
import { ValidationView } from './components/ValidationView.tsx';
import { MethodologyView } from './components/MethodologyView.tsx';
import { AboutView } from './components/AboutView.tsx';
import { Footer } from './components/Footer.tsx';
import { PredictionPayload, BenchmarkComplexItem } from './types.ts';
import { ArrowRight, Dna, Activity, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('predict');
  const [currentResult, setCurrentResult] = useState<PredictionPayload | null>(null);

  const handlePredictionSuccess = (result: PredictionPayload) => {
    setCurrentResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetPrediction = () => {
    setCurrentResult(null);
  };

  const handleLoadBenchmarkComplex = (complex: BenchmarkComplexItem) => {
    setCurrentResult(null);
    setActiveTab('predict');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#EEF4FF] text-[#172B4D] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white relative overflow-x-hidden scientific-bg">
      {/* Decorative subtle molecular network pattern in background */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 molecular-watermark" 
        aria-hidden="true" 
      />

      {/* Decorative subtle top-right ambient glow */}
      <div 
        className="pointer-events-none absolute top-12 right-0 w-96 h-96 bg-gradient-to-b from-[#2563EB]/5 to-[#635BFF]/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      {/* Dark Navy Navigation */}
      <Navbar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />

      {/* Main Scientific Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 relative z-10">
        {/* Short, crisp scientific hero banner shown on predict tab when no active result */}
        {activeTab === 'predict' && !currentResult && (
          <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-white border border-[#D9E4F5] shadow-scientific relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1.5 z-10 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB] tracking-wide uppercase">
                <Dna className="w-4 h-4 text-[#2563EB]" />
                <span>Deep Learning Binding Affinity Engine</span>
                <span className="text-[#D9E4F5]">·</span>
                <span className="text-[#64748B] font-mono font-medium text-[11px]">BBA Reference Method</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F2D5B] tracking-tight">
                Predict Protein–Protein Interaction Strength (ΔG &amp; Kd)
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Estimate non-covalent binding free energy (ΔG in kcal/mol) and equilibrium dissociation constants (Kd) directly from amino acid sequences without requiring experimental 3D structures.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-xs z-10 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-[#64748B] uppercase tracking-wider block font-semibold">10-Fold Benchmark</span>
                <span className="font-bold text-[#0F2D5B] text-sm flex items-center gap-1 sm:justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                  <span>87.0% Accuracy</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('methodology')}
                className="px-3.5 py-2 bg-[#E8F1FF] hover:bg-[#D9E4F5] text-[#173B70] font-semibold rounded-xl border border-[#D9E4F5] transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              >
                <span>How It Works</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2563EB]" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'predict' && (
          <div>
            {currentResult ? (
              <ResultsView 
                result={currentResult} 
                onReset={handleResetPrediction}
                onOpenMethodology={() => setActiveTab('methodology')}
              />
            ) : (
              <PredictionView 
                onPredictionSuccess={handlePredictionSuccess}
                onOpenMethodology={() => setActiveTab('methodology')}
              />
            )}
          </div>
        )}

        {activeTab === 'validation' && (
          <ValidationView 
            onLoadBenchmarkComplex={handleLoadBenchmarkComplex}
          />
        )}

        {activeTab === 'methodology' && (
          <MethodologyView />
        )}

        {activeTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Footer */}
      <Footer onTabChange={setActiveTab} />
    </div>
  );
}
