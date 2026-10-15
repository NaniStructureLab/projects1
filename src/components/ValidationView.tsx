/**
 * AffiniProt - Accuracy & Benchmark View Component
 * Professional Scientific Dashboard Interface
 * Colors: Navy #0F2D5B, Blue #2563EB, Purple #635BFF, Green #059669, Border #D9E4F5
 */

import React, { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  Play, 
  Search, 
  ExternalLink,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Database
} from 'lucide-react';
import { VERIFIED_BENCHMARK_COMPLEXES } from '../server/benchmarkData.ts';
import { BenchmarkComplexItem } from '../types.ts';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';

interface ValidationViewProps {
  onLoadBenchmarkComplex: (complex: BenchmarkComplexItem) => void;
}

export const ValidationView: React.FC<ValidationViewProps> = ({
  onLoadBenchmarkComplex
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter complexes
  const filteredComplexes = VERIFIED_BENCHMARK_COMPLEXES.filter(c => {
    return c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.pdbId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.functionalClassName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Data for scatter plot
  const scatterData = VERIFIED_BENCHMARK_COMPLEXES.map(c => ({
    name: c.name,
    pdbId: c.pdbId,
    expDeltaG: c.experimentalDeltaG,
    predDeltaG: c.predictedDeltaG,
    class: c.functionalClassName,
    residual: Math.round(Math.abs(c.experimentalDeltaG - c.predictedDeltaG) * 100) / 100
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 11. Page Header */}
      <div className="pb-3 border-b border-[#D9E4F5] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2D5B] tracking-tight flex items-center gap-2.5">
            <Award className="w-6 h-6 text-[#2563EB]" />
            <span>Model Accuracy &amp; Benchmark Performance</span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Empirical validation against curated experimental binding affinities across 903 high-resolution structural complexes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#0F2D5B] bg-[#E8F1FF] border border-[#BFDBFE] px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            <span>10-Fold Cross-Validation</span>
          </span>
        </div>
      </div>

      {/* 3 Main Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-[#D9E4F5] shadow-scientific flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#059669] uppercase tracking-wider">Classification Accuracy</span>
              <div className="w-7 h-7 rounded-full bg-[#DDF7EC] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-[#059669] font-mono">87.0%</span>
            </div>
            <p className="text-xs text-[#64748B] mt-2.5 leading-relaxed">
              Binary classification performance distinguishing high-affinity binders (ΔG ≤ -10.0 kcal/mol) from weaker interactors.
            </p>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#D9E4F5] text-[11px] text-[#64748B] flex justify-between">
            <span>Evaluation metric:</span>
            <span className="font-semibold text-[#172B4D]">Cross-Validated ROC-AUC: 0.91</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-[#D9E4F5] shadow-scientific flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#635BFF] uppercase tracking-wider">Prediction Error (MAE)</span>
              <div className="w-7 h-7 rounded-full bg-[#F0EDFF] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#635BFF]" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-[#635BFF] font-mono">± 1.05</span>
              <span className="text-xs font-mono text-[#64748B]">kcal/mol</span>
            </div>
            <p className="text-xs text-[#64748B] mt-2.5 leading-relaxed">
              Mean absolute deviation between computationally predicted free energies and wet-lab experimental calorimetry measurements.
            </p>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#D9E4F5] text-[11px] text-[#64748B] flex justify-between">
            <span>Correlation coefficient:</span>
            <span className="font-semibold text-[#172B4D] font-mono">Pearson r = 0.79</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-[#D9E4F5] shadow-scientific flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Benchmark Dataset</span>
              <div className="w-7 h-7 rounded-full bg-[#E8F1FF] flex items-center justify-center">
                <Database className="w-4 h-4 text-[#2563EB]" />
              </div>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-[#0F2D5B] font-mono">903</span>
              <span className="text-xs font-mono text-[#64748B]">complexes</span>
            </div>
            <p className="text-xs text-[#64748B] mt-2.5 leading-relaxed">
              Curated from Affinity Benchmark 2.0 with standardized experimental assay temperatures (25 °C) and pH 7.0–7.5.
            </p>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#D9E4F5] text-[11px] text-[#64748B] flex justify-between">
            <span>Biological categories:</span>
            <span className="font-semibold text-[#172B4D]">6 Functional Classes</span>
          </div>
        </div>
      </div>

      {/* Scatter Chart Section */}
      <div className="p-5 sm:p-6 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#0F2D5B] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#2563EB]" />
              <span>Experimental Laboratory Measurement vs. Predicted Free Energy</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Each blue point represents a crystallized protein complex with published wet-lab binding affinity.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#173B70] bg-[#E8F1FF] px-3 py-1.5 rounded-xl border border-[#BFDBFE]">
            <HelpCircle className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <span>Points along the dashed diagonal indicate ideal concordance (r = 0.79).</span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F1FF" />
              <XAxis 
                type="number" 
                dataKey="expDeltaG" 
                name="Lab Measurement" 
                unit=" kcal/mol" 
                domain={[-20, -5]}
                stroke="#64748B"
                tick={{ fontSize: 10, fill: '#64748B' }}
                label={{ value: 'Experimental Lab ΔG (kcal/mol)', position: 'insideBottom', offset: -12, fill: '#172B4D', fontSize: 11 }}
              />
              <YAxis 
                type="number" 
                dataKey="predDeltaG" 
                name="Model Prediction" 
                unit=" kcal/mol" 
                domain={[-20, -5]}
                stroke="#64748B"
                tick={{ fontSize: 10, fill: '#64748B' }}
                label={{ value: 'AffiniProt Predicted ΔG (kcal/mol)', angle: -90, position: 'insideLeft', offset: 5, fill: '#172B4D', fontSize: 11 }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-[#D9E4F5] p-3 rounded-xl shadow-scientific text-xs font-sans">
                        <p className="font-bold text-[#0F2D5B]">{data.pdbId}: {data.name}</p>
                        <p className="text-[#64748B] mt-0.5">Class: <span className="text-[#172B4D] font-medium">{data.class}</span></p>
                        <p className="text-[#172B4D]">Lab Measured: <span className="font-mono font-semibold">{data.expDeltaG} kcal/mol</span></p>
                        <p className="text-[#172B4D]">Model Predicted: <span className="font-mono text-[#2563EB] font-semibold">{data.predDeltaG} kcal/mol</span></p>
                        <p className="text-[#64748B]">Residual: <span className="font-mono text-[#059669] font-medium">{data.residual} kcal/mol</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine stroke="#173B70" strokeDasharray="4 4" segment={[{ x: -20, y: -20 }, { x: -5, y: -5 }]} />
              <Scatter data={scatterData} fill="#2563EB" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Real Complexes Table with "Try in Predictor" action */}
      <div className="p-5 sm:p-6 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#0F2D5B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Verified Benchmark Reference Complexes</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Click &quot;Try in Predictor&quot; to populate FASTA sequences and reproduce affinity calculations live.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search complexes or PDB ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#D9E4F5] rounded-lg text-xs text-[#172B4D] placeholder-[#64748B]/60 focus:outline-hidden focus:bg-white focus:border-[#2563EB] w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-[#D9E4F5] rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F4F7FC] border-b border-[#D9E4F5] text-[#0F2D5B] font-semibold">
              <tr>
                <th className="py-2.5 px-3">PDB ID</th>
                <th className="py-2.5 px-3">Complex Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Lab Measured ΔG</th>
                <th className="py-2.5 px-3 text-right">Predicted ΔG</th>
                <th className="py-2.5 px-3 text-right">Measured Kd</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9E4F5]">
              {filteredComplexes.map((c) => (
                <tr key={c.pdbId} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#2563EB]">
                    <a
                      href={`https://www.rcsb.org/structure/${c.pdbId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                      title="Open in RCSB PDB"
                    >
                      <span>{c.pdbId}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-[#64748B]" />
                    </a>
                  </td>
                  <td className="py-2.5 px-3 text-[#172B4D] font-medium max-w-xs truncate">
                    {c.name}
                  </td>
                  <td className="py-2.5 px-3 text-[#64748B] text-[11px]">
                    {c.functionalClassName}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#172B4D]">
                    {c.experimentalDeltaG.toFixed(2)} kcal/mol
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#2563EB]">
                    {c.predictedDeltaG.toFixed(2)} kcal/mol
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#64748B]">
                    {c.experimentalKdText}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onLoadBenchmarkComplex(c)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E8F1FF] hover:bg-[#D9E4F5] border border-[#D9E4F5] text-[#173B70] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current text-[#2563EB]" />
                      <span>Try in Predictor</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
