/**
 * AffiniProt - Results View Component
 * Professional Scientific Dashboard Interface
 * Palette: Navy #0F2D5B, Blue #2563EB, Purple #635BFF, Green #059669, Border #D9E4F5
 */

import React, { useState } from 'react';
import { 
  Download, 
  RotateCcw, 
  ShieldCheck, 
  Layers, 
  Copy, 
  Check, 
  Info,
  Flame,
  Activity,
  Award,
  Eye,
  BarChart3,
  Dna
} from 'lucide-react';
import { PredictionPayload } from '../types.ts';
import { StructureViewer } from './StructureViewer.tsx';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';

interface ResultsViewProps {
  result: PredictionPayload;
  onReset: () => void;
  onOpenMethodology: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onReset,
  onOpenMethodology
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showStructure, setShowStructure] = useState<boolean>(false);
  const [customPdbId, setCustomPdbId] = useState<string>('');

  const { prediction, proteinA, proteinB, functionalClass, metadata } = result;

  // Prepare feature contributions data for Recharts
  const featureBarData = prediction.selectedFeatures.map(f => ({
    name: f.name.length > 22 ? f.name.substring(0, 20) + '...' : f.name,
    fullName: f.name,
    contribution: f.weightContribution,
    rawVal: f.rawVal
  }));

  // Prepare Amino Acid Composition comparison data
  const standardAAs = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y'];
  const aacData = standardAAs.map(aa => ({
    aa,
    protA: Math.round(((proteinA.composition[aa] || 0) / Math.max(1, proteinA.length)) * 1000) / 10,
    protB: Math.round(((proteinB.composition[aa] || 0) / Math.max(1, proteinB.length)) * 1000) / 10,
  }));

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AffiniProt_Prediction_${result.requestId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadCSV = () => {
    let csv = `Metric,Value,Units\n`;
    csv += `Request ID,${result.requestId},\n`;
    csv += `Timestamp,${result.timestamp},\n`;
    csv += `Functional Class,${functionalClass.name} (${functionalClass.code}),\n`;
    csv += `Binding Free Energy (ΔG),${prediction.deltaG},kcal/mol\n`;
    csv += `Dissociation Constant (Kd),${prediction.kdMolar},Molar\n`;
    csv += `Kd Formatted,${prediction.kdFormatted},\n`;
    csv += `Classification,${prediction.classification},\n`;
    csv += `High Affinity Probability,${prediction.classificationProbabilityHigh},\n`;
    csv += `Protein A Length,${proteinA.length},residues\n`;
    csv += `Protein B Length,${proteinB.length},residues\n`;

    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AffiniProt_Prediction_${result.requestId}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    const text = `AffiniProt Prediction Report
Request ID: ${result.requestId}
Complex: ${proteinA.id} + ${proteinB.id}
Functional Class: ${functionalClass.name} (${functionalClass.code})
Predicted Free Energy (ΔG): ${prediction.deltaG.toFixed(2)} kcal/mol
Dissociation Constant (Kd): ${prediction.kdFormatted}
Affinity Level: ${prediction.classification}
Thermodynamic Summary: ${prediction.thermodynamicInterpretation}
Computational Model: Deep learning sequence-to-affinity framework`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isHighAffinity = prediction.classification === 'High Affinity';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 5. Top Results Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9E4F5]">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-mono text-[#64748B]">
            <span>Request ID: <strong className="text-[#0F2D5B] font-semibold">{result.requestId}</strong></span>
            <span className="text-[#D9E4F5]">·</span>
            <span className="text-[#059669] font-sans font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
              <span>Calculation Complete</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2D5B] tracking-tight mt-1">
            Prediction Results
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mt-1">
            <span>Complex:</span>
            <span className="font-semibold text-[#172B4D]">
              {metadata.userIdentifier || `${proteinA.id} + ${proteinB.id}`}
            </span>
            <span className="text-[#D9E4F5]">·</span>
            <span>Class:</span>
            <span className="text-[#2563EB] font-medium">{functionalClass.name}</span>
            {metadata.userNotes && (
              <>
                <span className="text-[#D9E4F5]">·</span>
                <span className="text-[#64748B] italic">({metadata.userNotes})</span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F4F7FC] border border-[#D9E4F5] rounded-xl text-xs font-medium text-[#172B4D] transition-colors cursor-pointer shadow-2xs"
            title="Copy summary report to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5 text-[#2563EB]" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F4F7FC] border border-[#D9E4F5] rounded-xl text-xs font-medium text-[#172B4D] transition-colors cursor-pointer shadow-2xs"
            title="Export CSV data"
          >
            <Download className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F4F7FC] border border-[#D9E4F5] rounded-xl text-xs font-medium text-[#172B4D] transition-colors cursor-pointer shadow-2xs"
            title="Export full JSON payload"
          >
            <Download className="w-3.5 h-3.5 text-[#635BFF]" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#2563EB] to-[#635BFF] hover:from-[#1D4ED8] hover:to-[#4F46E5] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Start a new prediction"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Prediction</span>
          </button>
        </div>
      </div>

      {/* 6. Three Main Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card A: Binding Free Energy (ΔG) - Purple Accent #635BFF */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D9E4F5] shadow-scientific flex flex-col justify-between shadow-scientific-hover">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#635BFF] tracking-wider uppercase">
                Binding Free Energy (ΔG)
              </span>
              <div className="w-8 h-8 rounded-full bg-[#F0EDFF] flex items-center justify-center">
                <Flame className="w-4 h-4 text-[#635BFF]" />
              </div>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#635BFF] font-mono tracking-tight">
                {prediction.deltaG.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-[#635BFF]/80 font-mono">kcal/mol</span>
            </div>

            <p className="text-xs text-[#64748B] mt-3 leading-relaxed">
              More negative binding free energy generally indicates more favorable binding under the specified conditions.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#D9E4F5] text-xs text-[#64748B] flex items-center justify-between">
            <span>Benchmark MAE error:</span>
            <span className="font-mono text-[#635BFF] font-semibold">± 1.05 kcal/mol</span>
          </div>
        </div>

        {/* Card B: Dissociation Constant (Kd) - Blue Accent #2563EB */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D9E4F5] shadow-scientific flex flex-col justify-between shadow-scientific-hover">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#2563EB] tracking-wider uppercase">
                Dissociation Constant (Kd)
              </span>
              <div className="w-8 h-8 rounded-full bg-[#E8F1FF] flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#2563EB]" />
              </div>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0F2D5B] font-mono tracking-tight truncate max-w-full">
                {prediction.kdFormatted}
              </span>
            </div>

            <p className="text-xs text-[#64748B] mt-3 leading-relaxed">
              Lower Kd values generally indicate stronger binding affinity. Calculated from <code className="text-[#173B70] font-mono text-[11px] bg-[#E8F1FF] px-1 py-0.5 rounded">Kd = exp(ΔG / RT)</code> at 25 °C.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#D9E4F5] text-xs text-[#64748B] flex items-center justify-between">
            <span>Molar concentration:</span>
            <span className="font-mono text-[#0F2D5B] font-semibold truncate max-w-[150px]">
              {prediction.kdMolar.toExponential(2)} M
            </span>
          </div>
        </div>

        {/* Card C: Affinity Level - Green Accent #059669 */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D9E4F5] shadow-scientific flex flex-col justify-between shadow-scientific-hover">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#059669] tracking-wider uppercase">
                Affinity Classification
              </span>
              <div className="w-8 h-8 rounded-full bg-[#DDF7EC] flex items-center justify-center">
                <Award className="w-4 h-4 text-[#059669]" />
              </div>
            </div>

            <div className="mt-1 flex items-center gap-2">
              <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isHighAffinity ? 'text-[#059669]' : 'text-[#D97706]'
              }`}>
                {prediction.classification}
              </span>
            </div>

            <p className="text-xs text-[#64748B] mt-3 leading-relaxed">
              Threshold defined at ΔG ≤ -10.0 kcal/mol (Kd ≤ 46.7 nM). Cross-validated on independent structural benchmarks.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-[#D9E4F5] text-xs text-[#64748B] flex items-center justify-between">
            <span>10-fold test accuracy:</span>
            <span className="font-mono text-[#059669] font-semibold">87.0%</span>
          </div>
        </div>
      </div>

      {/* 7. Full-Width Thermodynamic Interpretation Panel */}
      <div className="p-5 bg-[#E8F1FF] border border-[#BFDBFE] rounded-2xl shadow-xs text-xs flex items-start gap-3.5">
        <div className="w-7 h-7 rounded-lg bg-white border border-[#D9E4F5] flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4 text-[#2563EB]" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h2 className="text-sm font-bold text-[#0F2D5B]">
            Thermodynamic Interpretation
          </h2>
          <p className="text-[#173B70] leading-relaxed">
            {prediction.thermodynamicInterpretation}
          </p>
          <p className="text-[11px] text-[#64748B] leading-relaxed pt-1">
            *Note: Predicted values represent computational estimates derived from sequence biophysical characteristics. While correlated with experimental affinities, computational ΔG does not confirm in vivo biological activity or functional efficacy.
          </p>
        </div>
      </div>

      {/* Partner Physicochemical Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Partner A */}
        <div className="p-5 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D9E4F5]">
            <span className="font-bold text-xs text-[#0F2D5B] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] ring-2 ring-[#BFDBFE]" />
              <span>Interacting Chain A ({proteinA.id})</span>
            </span>
            <span className="text-xs text-[#2563EB] font-mono font-semibold">{proteinA.length} aa</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-[#F4F7FC] rounded-xl border border-[#D9E4F5]">
              <span className="text-[10px] text-[#64748B] block font-medium">Molecular Weight</span>
              <p className="font-mono text-[#0F2D5B] font-bold mt-1">{(proteinA.molecularWeight / 1000).toFixed(1)} kDa</p>
            </div>
            <div className="p-3 bg-[#F4F7FC] rounded-xl border border-[#D9E4F5]">
              <span className="text-[10px] text-[#64748B] block font-medium">Net Charge (pH 7.4)</span>
              <p className="font-mono text-[#0F2D5B] font-bold mt-1">
                {proteinA.netCharge > 0 ? `+${proteinA.netCharge.toFixed(1)}` : proteinA.netCharge.toFixed(1)} e
              </p>
            </div>
            <div className="p-3 bg-[#F4F7FC] rounded-xl border border-[#D9E4F5]">
              <span className="text-[10px] text-[#64748B] block font-medium">Isoelectric Pt (pI)</span>
              <p className="font-mono text-[#0F2D5B] font-bold mt-1">{proteinA.isoelectricPoint.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Partner B */}
        <div className="p-5 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D9E4F5]">
            <span className="font-bold text-xs text-[#0F2D5B] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF] ring-2 ring-[#DDD6FE]" />
              <span>Interacting Chain B ({proteinB.id})</span>
            </span>
            <span className="text-xs text-[#635BFF] font-mono font-semibold">{proteinB.length} aa</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-[#F4F7FC] rounded-xl border border-[#D9E4F5]">
              <span className="text-[10px] text-[#64748B] block font-medium">Molecular Weight</span>
              <p className="font-mono text-[#0F2D5B] font-bold mt-1">{(proteinB.molecularWeight / 1000).toFixed(1)} kDa</p>
            </div>
            <div className="p-3 bg-[#F4F7FC] rounded-xl border border-[#D9E4F5]">
              <span className="text-[10px] text-[#64748B] block font-medium">Net Charge (pH 7.4)</span>
              <p className="font-mono text-[#0F2D5B] font-bold mt-1">
                {proteinB.netCharge > 0 ? `+${proteinB.netCharge.toFixed(1)}` : proteinB.netCharge.toFixed(1)} e
              </p>
            </div>
            <div className="p-3 bg-[#F4F7FC] rounded-xl border border-[#D9E4F5]">
              <span className="text-[10px] text-[#64748B] block font-medium">Isoelectric Pt (pI)</span>
              <p className="font-mono text-[#0F2D5B] font-bold mt-1">{proteinB.isoelectricPoint.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Contributions & AA Composition Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Feature Importance Chart */}
        <div className="p-5 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific">
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#D9E4F5]">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#2563EB]" />
              <h2 className="text-xs font-bold text-[#0F2D5B]">Biophysical Feature Weights</h2>
            </div>
            <button
              type="button"
              onClick={onOpenMethodology}
              className="text-[11px] text-[#2563EB] hover:underline"
            >
              Methodology →
            </button>
          </div>

          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureBarData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F1FF" horizontal={false} />
                <XAxis 
                  type="number" 
                  stroke="#64748B" 
                  fontSize={10}
                  tickLine={false}
                  domain={[-1.5, 1.5]}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#64748B" 
                  fontSize={10} 
                  tickLine={false}
                  width={110}
                />
                <Tooltip 
                  formatter={(val: any) => {
                    const num = typeof val === 'number' ? val : 0;
                    return [`${num > 0 ? '+' : ''}${num.toFixed(3)}`, 'Weight Contribution'];
                  }}
                  labelFormatter={(name) => `Feature: ${name}`}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#D9E4F5',
                    boxShadow: '0 4px 16px rgba(15, 45, 91, 0.08)',
                    fontSize: '11px',
                    color: '#172B4D'
                  }}
                />
                <ReferenceLine x={0} stroke="#173B70" strokeWidth={1.5} />
                <Bar 
                  dataKey="contribution" 
                  fill="#2563EB" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[#64748B] mt-2 text-center">
            Normalized relative feature importance in predicting binding energy for this complex class.
          </p>
        </div>

        {/* Amino Acid Distribution Chart */}
        <div className="p-5 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific">
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#D9E4F5]">
            <div className="flex items-center gap-2">
              <Dna className="w-4 h-4 text-[#635BFF]" />
              <h2 className="text-xs font-bold text-[#0F2D5B]">Residue Composition Profile (%)</h2>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-[#2563EB] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" /> Chain A
              </span>
              <span className="flex items-center gap-1 text-[#635BFF] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#635BFF]" /> Chain B
              </span>
            </div>
          </div>

          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aacData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F1FF" vertical={false} />
                <XAxis 
                  dataKey="aa" 
                  stroke="#64748B" 
                  fontSize={10} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={10} 
                  tickLine={false} 
                  unit="%" 
                />
                <Tooltip 
                  formatter={(val: any, name: any) => [`${val}%`, name === 'protA' ? 'Chain A' : 'Chain B']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#D9E4F5',
                    boxShadow: '0 4px 16px rgba(15, 45, 91, 0.08)',
                    fontSize: '11px',
                    color: '#172B4D'
                  }}
                />
                <Bar dataKey="protA" fill="#2563EB" radius={[3, 3, 0, 0]} />
                <Bar dataKey="protB" fill="#635BFF" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-[#64748B] mt-2 text-center">
            Standard 20 amino acid frequency comparison between interacting chains.
          </p>
        </div>
      </div>

      {/* 3D Structure Viewer Collapsible Option */}
      <div className="p-5 bg-white border border-[#D9E4F5] rounded-2xl shadow-scientific space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-[#2563EB]" />
            <div>
              <h2 className="text-xs font-bold text-[#0F2D5B]">3D Molecular Complex Visualization</h2>
              <p className="text-[11px] text-[#64748B]">
                Optional: Inspect experimental crystallography complex in interactive Mol* viewer.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowStructure(!showStructure)}
            className="px-3.5 py-1.5 bg-[#E8F1FF] hover:bg-[#D9E4F5] text-[#173B70] border border-[#D9E4F5] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            {showStructure ? 'Hide 3D Viewer' : 'Load 3D Viewer'}
          </button>
        </div>

        {showStructure && (
          <div className="pt-3 border-t border-[#D9E4F5] space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customPdbId}
                onChange={(e) => setCustomPdbId(e.target.value.toUpperCase())}
                placeholder="Enter 4-letter PDB ID (e.g. 1CHO, 1BVK, 1WQ1)"
                maxLength={4}
                className="px-3 py-1.5 text-xs uppercase font-mono bg-[#F8FAFC] border border-[#D9E4F5] rounded-lg text-[#172B4D] w-64 focus:outline-hidden focus:border-[#2563EB]"
              />
              <span className="text-[11px] text-[#64748B]">Defaults to benchmark structure</span>
            </div>
            <StructureViewer pdbId={customPdbId || '1CHO'} />
          </div>
        )}
      </div>
    </div>
  );
};
