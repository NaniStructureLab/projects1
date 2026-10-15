/**
 * AffiniProt - Clean Minimal Footer Component
 * Dark Navy Professional Attribution Bar (#0F2D5B)
 * Attribution to Dharshini U, M.Sc. Bioinformatics
 */

import React from 'react';
import { NavTab } from './Navbar.tsx';
import { Dna } from 'lucide-react';

interface FooterProps {
  onTabChange?: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="mt-16 border-t border-[#173B70] bg-[#0F2D5B] py-6 text-xs text-[#BFDBFE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#173B70] text-[#93C5FD] flex items-center justify-center">
            <Dna className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs">AffiniProt</span>
        </div>
        <span className="hidden sm:inline text-[#173B70]">|</span>
        <p className="text-xs font-medium text-[#93C5FD]">
          Designed by Dharshini U Msc Bioinformatics
        </p>
      </div>
    </footer>
  );
};
