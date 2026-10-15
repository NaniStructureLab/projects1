/**
 * AffiniProt DL - Interactive 3D Macromolecular Viewer
 * Embedded 3Dmol.js WebGL visualizer for PDB / mmCIF complexes.
 */

import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, RefreshCw, Layers, ExternalLink } from 'lucide-react';

interface StructureViewerProps {
  pdbId?: string;
  structureUrl?: string;
  title?: string;
  height?: string;
}

export const StructureViewer: React.FC<StructureViewerProps> = ({
  pdbId,
  structureUrl,
  title,
  height = '360px'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [styleMode, setStyleMode] = useState<'cartoon' | 'surface' | 'stick'>('cartoon');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const targetPdb = pdbId?.toUpperCase() || (structureUrl ? structureUrl.split('/').pop()?.replace(/\.(cif|pdb)$/i, '').toUpperCase() : '1CHO');

  useEffect(() => {
    let isCancelled = false;
    let viewer: any = null;

    async function initAndLoad() {
      if (!containerRef.current) return;
      setLoading(true);
      setLoadError(null);

      try {
        const $3Dmol = await import('3dmol');
        if (isCancelled) return;

        // Clear container
        containerRef.current.innerHTML = '';

        viewer = $3Dmol.createViewer(containerRef.current, {
          backgroundColor: '#090d16',
        });
        viewerRef.current = viewer;

        // Fetch coordinate file (prefer mmCIF from RCSB)
        const fetchUrl = structureUrl || `https://files.rcsb.org/download/${targetPdb}.cif`;
        const res = await fetch(fetchUrl);
        if (!res.ok) {
          throw new Error(`Failed to download structure data (HTTP ${res.status})`);
        }
        const data = await res.text();
        if (isCancelled) return;

        viewer.clear();
        viewer.addModel(data, fetchUrl.endsWith('.pdb') ? 'pdb' : 'cif');
        
        // Color distinct chains distinctly (Chain A vs Chain B)
        viewer.setStyle({}, {
          cartoon: {
            colorscheme: 'chainHetatm',
          }
        });

        viewer.zoomTo();
        viewer.render();
        setLoading(false);
      } catch (err: any) {
        if (!isCancelled) {
          console.warn('[StructureViewer] WebGL/Structure load notice:', err);
          setLoadError(err?.message || 'Structure visualization unavailable');
          setLoading(false);
        }
      }
    }

    initAndLoad();

    return () => {
      isCancelled = true;
      if (viewerRef.current) {
        try {
          viewerRef.current.spin(false);
          viewerRef.current.clear();
        } catch (_) {}
      }
    };
  }, [targetPdb, structureUrl]);

  const handleToggleSpin = () => {
    if (!viewerRef.current) return;
    const nextSpin = !isSpinning;
    setIsSpinning(nextSpin);
    viewerRef.current.spin(nextSpin, [0, 1, 0]);
  };

  const handleResetCamera = () => {
    if (!viewerRef.current) return;
    viewerRef.current.zoomTo();
    viewerRef.current.render();
  };

  const handleStyleChange = (mode: 'cartoon' | 'surface' | 'stick') => {
    if (!viewerRef.current) return;
    setStyleMode(mode);
    viewerRef.current.removeAllSurfaces();

    if (mode === 'cartoon') {
      viewerRef.current.setStyle({}, { cartoon: { colorscheme: 'chainHetatm' } });
    } else if (mode === 'stick') {
      viewerRef.current.setStyle({}, { stick: { colorscheme: 'chainHetatm', radius: 0.2 } });
    } else if (mode === 'surface') {
      viewerRef.current.setStyle({}, { cartoon: { colorscheme: 'chainHetatm', opacity: 0.6 } });
      viewerRef.current.addSurface(0, { opacity: 0.7, color: 'white' });
    }
    viewerRef.current.render();
  };

  return (
    <div className="relative border border-[#D9E4F5] rounded-xl overflow-hidden bg-slate-950 flex flex-col shadow-xs">
      {/* Top bar */}
      <div className="px-3.5 py-2.5 bg-[#F4F7FC] border-b border-[#D9E4F5] flex items-center justify-between text-xs text-[#172B4D]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#0F2D5B] font-mono tracking-wide">{targetPdb}</span>
          <span className="text-[#D9E4F5]">·</span>
          <span className="text-[#64748B] truncate max-w-[200px]">{title || 'Protein Complex 3D'}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleStyleChange('cartoon')}
            className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${styleMode === 'cartoon' ? 'bg-white text-[#2563EB] font-medium shadow-2xs border border-[#D9E4F5]' : 'text-[#64748B] hover:text-[#0F2D5B]'}`}
            title="Ribbon cartoon representation"
          >
            Cartoon
          </button>
          <button
            type="button"
            onClick={() => handleStyleChange('stick')}
            className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${styleMode === 'stick' ? 'bg-white text-[#2563EB] font-medium shadow-2xs border border-[#D9E4F5]' : 'text-[#64748B] hover:text-[#0F2D5B]'}`}
            title="All-atom stick model"
          >
            Sticks
          </button>
          <button
            type="button"
            onClick={handleToggleSpin}
            className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${isSpinning ? 'bg-[#E8F1FF] text-[#2563EB] border border-[#BFDBFE]' : 'text-[#64748B] hover:text-[#0F2D5B]'}`}
            title="Toggle rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetCamera}
            className="p-1.5 text-[#64748B] hover:text-[#0F2D5B] rounded transition-colors cursor-pointer"
            title="Reset Camera View"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <a
            href={`https://www.rcsb.org/structure/${targetPdb}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer"
            title="View Entry on RCSB PDB"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative w-full" style={{ height }}>
        <div ref={containerRef} className="w-full h-full" />

        {loading && (
          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin text-sky-400" />
            <span>Loading 3D Macromolecular Coordinates ({targetPdb})...</span>
          </div>
        )}

        {loadError && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center text-xs text-slate-400">
            <Layers className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-slate-300 font-medium">3D Structure Stream Notice</p>
            <p className="text-slate-500 mt-1 max-w-sm">
              {loadError}. You can view the high-resolution structure directly on RCSB PDB.
            </p>
            <a
              href={`https://www.rcsb.org/structure/${targetPdb}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
            >
              <span>Open on RCSB PDB</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Legend */}
        {!loading && !loadError && (
          <div className="absolute bottom-2.5 left-2.5 pointer-events-none bg-slate-950/70 backdrop-blur-xs px-2.5 py-1.5 rounded border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
              <span>Chain A</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              <span>Chain B</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">Left-drag to rotate · Scroll to zoom</span>
          </div>
        )}
      </div>
    </div>
  );
};
