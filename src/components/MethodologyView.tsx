/**
 * AffiniProt - Methodology View Component ("How It Works")
 * Professional Scientific Dashboard Interface
 * Colors: Navy #0F2D5B, Blue #2563EB, Purple #635BFF, Canvas #EEF4FF, Border #D9E4F5
 */

import React from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Layers, 
  Cpu, 
  Dna, 
  ShieldCheck,
  Atom,
  ChevronRight,
  Calculator,
  Activity
} from 'lucide-react';
import { FUNCTIONAL_CLASSES } from '../server/featureRegistry.ts';

export const MethodologyView: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Protein Sequences',
      subtitle: 'FASTA Input',
      icon: Dna,
      description: 'Accepts primary amino acid sequences of both interacting chains in standard IUPAC FASTA format.',
      badge: 'Chains A & B'
    },
    {
      num: '02',
      title: 'Input Validation',
      subtitle: 'Residue Verification',
      icon: ShieldCheck,
      description: 'Checks sequence validity, strips non-peptide characters, verifies 20 canonical amino acids, and evaluates chain lengths.',
      badge: '20 Amino Acids'
    },
    {
      num: '03',
      title: 'Feature Extraction',
      subtitle: '80+ Descriptors',
      icon: Layers,
      description: 'Extracts sequence composition, electrostatic net charge at pH 7.4, hydropathy, and predicted solvent accessible surface area.',
      badge: 'Physicochemical'
    },
    {
      num: '04',
      title: 'Prediction Model',
      subtitle: 'Deep Neural Network',
      icon: Cpu,
      description: 'Standardizes descriptors and executes functional-class deep neural regression trained on curated structural benchmarks.',
      badge: 'Class-Specific DL'
    },
    {
      num: '05',
      title: 'Affinity Results',
      subtitle: 'ΔG & Kd Output',
      icon: Activity,
      description: 'Calculates binding free energy (ΔG kcal/mol), converts to dissociation constant (Kd), and reports affinity classification.',
      badge: 'ΔG, Kd, Category'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 12. Page Header */}
      <div className="pb-3 border-b border-[#D9E4F5] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2D5B] tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[#2563EB]" />
            <span>How AffiniProt Works</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            End-to-end computational pipeline transforming primary protein sequences into quantitative thermodynamic binding affinities.
          </p>
        </div>

        <span className="text-xs font-semibold text-[#0F2D5B] bg-[#E8F1FF] border border-[#BFDBFE] px-3 py-1 rounded-full">
          Deep Learning Pipeline
        </span>
      </div>

      {/* Horizontal Process Diagram on Desktop / Vertical on Mobile */}
      <div className="p-5 sm:p-6 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific">
        <h2 className="text-xs font-bold text-[#0F2D5B] uppercase tracking-wider mb-4">
          Prediction Workflow Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="relative flex flex-col justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#D9E4F5] hover:border-[#BFDBFE] hover:bg-[#F4F7FC] transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-[#2563EB] bg-[#E8F1FF] px-1.5 py-0.5 rounded">
                      {step.num}
                    </span>
                    <Icon className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold text-xs text-[#0F2D5B]">{step.title}</h3>
                  <span className="text-[10px] text-[#635BFF] font-medium block mt-0.5">{step.subtitle}</span>
                  <p className="text-[11px] text-[#64748B] mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#D9E4F5] text-[10px] text-[#173B70] font-medium">
                  {step.badge}
                </div>

                {/* Subtle arrow connector indicator for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-white border border-[#D9E4F5] items-center justify-center text-[#2563EB] shadow-2xs">
                    <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Thermodynamic Formulation Panel */}
      <div className="p-5 sm:p-6 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific space-y-3.5">
        <h2 className="text-sm font-bold text-[#0F2D5B] flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#2563EB]" />
          <span>Thermodynamic Formulation of Binding Affinity</span>
        </h2>
        <p className="text-xs text-[#64748B] leading-relaxed">
          In biochemical thermodynamics, the non-covalent binding strength between two proteins at equilibrium is mathematically characterized by the Gibbs free energy change (<strong>ΔG</strong>) and the equilibrium dissociation constant (<strong>Kd</strong>):
        </p>

        <div className="p-4 bg-[#E8F1FF] border border-[#BFDBFE] rounded-xl text-center font-mono text-xs sm:text-sm text-[#0F2D5B] my-2">
          <span className="font-bold">ΔG = R · T · ln(Kd)</span>
          <span className="mx-3 text-[#2563EB]">⟺</span>
          <span className="font-bold">Kd = exp(ΔG / (R · T))</span>
          <p className="text-[11px] text-[#64748B] font-sans mt-1">
            Where R = 1.9872 cal/(mol·K) and T = 298.15 K (standard assay condition: 25 °C).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1">
          <div className="p-4 bg-[#F4F7FC] border border-[#D9E4F5] rounded-xl">
            <h3 className="font-bold text-[#0F2D5B] mb-1">Physical Significance of ΔG (kcal/mol)</h3>
            <p className="text-[#64748B] leading-relaxed text-[11px]">
              Spontaneous complex formation is characterized by a negative ΔG. More negative values reflect favorable thermodynamic equilibrium driven by electrostatic complementarity, hydrogen bonding, and hydrophobic desolvation.
            </p>
          </div>
          <div className="p-4 bg-[#F4F7FC] border border-[#D9E4F5] rounded-xl">
            <h3 className="font-bold text-[#0F2D5B] mb-1">Physical Significance of Kd (Molar)</h3>
            <p className="text-[#64748B] leading-relaxed text-[11px]">
              Kd represents the free ligand concentration at which 50% of binding sites are saturated. Smaller Kd values (nanomolar or picomolar) correspond to tighter, higher-affinity binding complexes.
            </p>
          </div>
        </div>
      </div>

      {/* The 6 Functional Classes */}
      <div className="p-5 sm:p-6 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific space-y-3.5">
        <div>
          <h2 className="text-sm font-bold text-[#0F2D5B] flex items-center gap-2">
            <Atom className="w-4 h-4 text-[#2563EB]" />
            <span>Class-Specific Deep Neural Architecture</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Different biological interfaces exhibit distinct biophysical characteristics. AffiniProt employs dedicated neural network weights tailored to each functional interaction type:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {Object.values(FUNCTIONAL_CLASSES).map(fc => (
            <div key={fc.id} className="p-3.5 bg-[#F8FAFC] border border-[#D9E4F5] rounded-xl hover:border-[#BFDBFE] transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-[#0F2D5B]">{fc.name}</span>
                <span className="font-mono text-[10px] text-[#2563EB] bg-[#E8F1FF] border border-[#BFDBFE] px-1.5 py-0.5 rounded font-medium">
                  {fc.code}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed mt-1">
                {fc.shortDescription}
              </p>
              <div className="mt-2.5 pt-1.5 border-t border-[#D9E4F5] text-[10px] text-[#173B70] font-mono">
                Typical range: {fc.typicalAffinityRange}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Citation Card */}
      <div className="p-5 bg-[#F4F7FC] border border-[#D9E4F5] rounded-2xl text-xs space-y-2.5">
        <span className="font-bold text-[#0F2D5B]">Published Scientific Reference:</span>
        <blockquote className="text-[#172B4D] italic bg-white p-3.5 rounded-xl border border-[#D9E4F5] leading-relaxed text-xs">
          Nikam, R., Yugandhar, K., and Gromiha, M. M. (2023). &quot;Deep learning-based method for predicting and classifying the binding affinity of protein-protein complexes.&quot; <em>Biochimica et Biophysica Acta (BBA) - Proteins and Proteomics</em>, 1871(6), 140948.
        </blockquote>
        <div className="flex items-center gap-3 pt-1 text-[11px]">
          <a
            href="https://doi.org/10.1016/j.bbapap.2023.140948"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563EB] hover:underline flex items-center gap-1.5 font-medium"
          >
            <span>Access publication on ScienceDirect (DOI: 10.1016/j.bbapap.2023.140948)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
