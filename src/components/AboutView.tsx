/**
 * AffiniProt - About, Applications, Pros & Cons View Component
 * Professional Scientific Dashboard Interface
 * Colors: Navy #0F2D5B, Blue #2563EB, Green #059669, Amber #D97706, Border #D9E4F5
 * Designed by Dharshini U Msc Bioinformatics
 */

import React from 'react';
import { 
  Info, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Dna, 
  Target, 
  Sparkles,
  Zap,
  FlaskConical,
  Award,
  BookOpen,
  FileCode2,
  Scale
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 13. Page Header */}
      <div className="pb-3 border-b border-[#D9E4F5]">
        <h1 className="text-2xl font-bold text-[#0F2D5B] tracking-tight flex items-center gap-2.5">
          <Info className="w-6 h-6 text-[#2563EB]" />
          <span>About AffiniProt</span>
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          System overview, intended computational research scope, applications, advantages, and limitations.
        </p>
      </div>

      {/* 1. Tool Overview & Scope */}
      <div className="p-5 sm:p-6 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific space-y-3">
        <h2 className="text-sm font-bold text-[#0F2D5B] flex items-center gap-2">
          <Dna className="w-4 h-4 text-[#2563EB]" />
          <span>What AffiniProt Does</span>
        </h2>
        <p className="text-xs text-[#172B4D] leading-relaxed">
          <strong>AffiniProt</strong> is a specialized bioinformatics prediction platform designed to calculate the non-covalent binding affinity of protein–protein complexes directly from primary amino acid sequences. It quantifies interaction thermodynamics through Gibbs free energy change (<strong>ΔG</strong> in kcal/mol) and the equilibrium dissociation constant (<strong>Kd</strong> in molarity).
        </p>
        <p className="text-xs text-[#64748B] leading-relaxed">
          The engine computes over 80 biophysical sequence descriptors—including electrostatic net charge at physiological pH 7.4, Kyte-Doolittle hydropathy indices, amino acid composition, and predicted accessible surface areas—feeding them into functional-class deep neural regression networks trained on curated structural benchmarks.
        </p>
      </div>

      {/* Supported Input Types & Intended Research Use */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific space-y-2.5">
          <h2 className="text-xs font-bold text-[#0F2D5B] uppercase tracking-wider flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-[#2563EB]" />
            <span>Supported Input Types</span>
          </h2>
          <ul className="space-y-1.5 text-xs text-[#64748B]">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
              <span><strong>FASTA Sequences:</strong> Standard IUPAC single-letter amino acid code with optional header line (<code className="text-[#173B70] bg-[#E8F1FF] px-1 py-0.5 rounded">&gt;ProteinID</code>).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
              <span><strong>File Formats:</strong> Text uploads (.fasta, .fa, .txt, .seq) up to 2 MB per interacting partner.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
              <span><strong>Interaction Categories:</strong> Enzyme-Inhibitor, Antibody-Antigen, G-Protein complexes, Receptor-Ligand, Structural, and Miscellaneous.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific space-y-2.5">
          <h2 className="text-xs font-bold text-[#0F2D5B] uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#2563EB]" />
            <span>Intended Research Use</span>
          </h2>
          <ul className="space-y-1.5 text-xs text-[#64748B]">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
              <span><strong>In Silico Screening:</strong> Rapid ranking and triage of thousands of protein candidate pairings prior to wet-lab synthesis.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
              <span><strong>Rational Protein Engineering:</strong> Assessing the impact of amino acid mutations on complex stability.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
              <span><strong>Academic Education:</strong> Demonstrating fundamental thermodynamic principles in computational biology.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 2. Applications in Bioinformatics & Medicine */}
      <div className="p-5 sm:p-6 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0F2D5B] flex items-center gap-2">
            <Target className="w-4 h-4 text-[#2563EB]" />
            <span>Biomedical &amp; Bioinformatics Applications</span>
          </h2>
          <span className="text-[11px] font-mono text-[#2563EB] font-medium bg-[#E8F1FF] px-2 py-0.5 rounded">
            Therapeutic &amp; Structural Biology
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-[#F8FAFC] border border-[#D9E4F5] rounded-xl space-y-1.5">
            <span className="font-bold text-xs text-[#0F2D5B] flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Biologic &amp; Antibody Lead Optimization</span>
            </span>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Screen recombinant monoclonal antibodies, nanobodies, and scFvs against viral antigens and oncology targets to prioritize top binder variants before cell culture production.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAFC] border border-[#D9E4F5] rounded-xl space-y-1.5">
            <span className="font-bold text-xs text-[#0F2D5B] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Protease Inhibitor Design</span>
            </span>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Optimize proteinaceous enzyme inhibitors (e.g. serpins, cystatins, canonical protease inhibitors) by predicting single-point and combinatorial mutations that enhance sub-nanomolar affinity.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAFC] border border-[#D9E4F5] rounded-xl space-y-1.5">
            <span className="font-bold text-xs text-[#0F2D5B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#635BFF] shrink-0" />
              <span>Interactome &amp; Signaling Network Filtering</span>
            </span>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Differentiate high-affinity, biologically obligate complexes from transient, low-affinity interactome background noise detected by high-throughput yeast two-hybrid experiments.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAFC] border border-[#D9E4F5] rounded-xl space-y-1.5">
            <span className="font-bold text-xs text-[#0F2D5B] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#059669] shrink-0" />
              <span>De Novo Computational Protein Design</span>
            </span>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Rank sequences generated by deep learning generative tools (such as RFdiffusion and ProteinMPNN) for predicted thermodynamic favorability under standard assay conditions.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Pros and Cons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pros Card */}
        <div className="p-5 sm:p-6 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#DDF7EC] text-[#059669] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#0F2D5B] uppercase tracking-wider">Method Advantages (Pros)</h3>
              <p className="text-[10px] text-[#64748B]">Key strengths of sequence-derived deep learning</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-[#172B4D] pt-1">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-1.5 shrink-0" />
              <span><strong>No 3D Coordinates Needed:</strong> Operates entirely from primary sequences, bypassing crystal structure or Cryo-EM requirements.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-1.5 shrink-0" />
              <span><strong>Sub-Millisecond Inference:</strong> Rapid prediction enables high-throughput in silico library screening at negligible computational cost.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-1.5 shrink-0" />
              <span><strong>87% Benchmark Accuracy:</strong> High fidelity in distinguishing tight binders (ΔG ≤ -10 kcal/mol) validated against 903 experimental complexes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-1.5 shrink-0" />
              <span><strong>Rigorous Physical Units:</strong> Delivers true Gibbs free energy (ΔG in kcal/mol) and molar Kd values rather than arbitrary confidence rankings.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-1.5 shrink-0" />
              <span><strong>Class-Specific Tuning:</strong> Tailors descriptor weighting to distinct interface geometries (enzymes, antibodies, receptors).</span>
            </li>
          </ul>
        </div>

        {/* Cons Card */}
        <div className="p-5 sm:p-6 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#0F2D5B] uppercase tracking-wider">Limitations &amp; Constraints (Cons)</h3>
              <p className="text-[10px] text-[#64748B]">Important considerations for scientific interpretation</p>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-[#172B4D] pt-1">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
              <span><strong>No Atomic Coordinates:</strong> Does not generate 3D spatial docking poses or replace full-atom molecular dynamics (MD) simulations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
              <span><strong>Class Specification Dependence:</strong> Selecting an incorrect complex category can lead to sub-optimal descriptor weighting.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
              <span><strong>Intrinsically Disordered Proteins:</strong> Lower prediction confidence for highly flexible, unstructured peptide regions lacking a globular fold.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
              <span><strong>Post-Translational Modifications:</strong> Glycosylation, phosphorylation, and non-canonical residues are not accounted for in FASTA strings.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
              <span><strong>Metal Ions &amp; Cofactors:</strong> Interfacial coordination ions (e.g. Zn²⁺, Mg²⁺, heme) are not modeled explicitly.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Distinction Between Computational Predictions and Experimental Assays */}
      <div className="p-5 bg-[#E8F1FF] border border-[#BFDBFE] rounded-2xl text-xs space-y-2">
        <h2 className="font-bold text-[#0F2D5B] flex items-center gap-2 text-sm">
          <Scale className="w-4 h-4 text-[#2563EB]" />
          <span>Distinction: Computational Estimation vs. Experimental Assays</span>
        </h2>
        <p className="text-[#173B70] leading-relaxed">
          AffiniProt generates sequence-derived statistical predictions based on empirical correlations in structural databases. These estimates serve to guide experimental prioritization and hypothesis generation. They do not replace definitive biophysical wet-lab measurements such as Isothermal Titration Calorimetry (ITC), Surface Plasmon Resonance (SPR), or Biolayer Interferometry (BLI).
        </p>
      </div>

      {/* Scientific Reference & Attribution Banner */}
      <div className="p-5 bg-[#F4F7FC] border border-[#D9E4F5] rounded-2xl text-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#0F2D5B] flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#2563EB]" />
            <span>Scientific Reference</span>
          </span>
        </div>
        <blockquote className="text-[#172B4D] italic bg-white p-3.5 rounded-xl border border-[#D9E4F5] leading-relaxed text-xs">
          Nikam, R., Yugandhar, K., and Gromiha, M. M. (2023). &quot;Deep learning-based method for predicting and classifying the binding affinity of protein-protein complexes.&quot; <em>Biochimica et Biophysica Acta (BBA) - Proteins and Proteomics</em>, 1871(6), 140948.
        </blockquote>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px]">
          <a
            href="https://doi.org/10.1016/j.bbapap.2023.140948"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563EB] hover:underline flex items-center gap-1 font-medium"
          >
            <span>DOI: 10.1016/j.bbapap.2023.140948</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
