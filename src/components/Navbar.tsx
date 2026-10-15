/**
 * AffiniProt - Navigation Bar Component
 * Dark Navy Professional Scientific Header (#0F2D5B)
 */

import React, { useEffect, useState } from 'react';
import { Activity, BookOpen, Award, Info, Dna, Menu, X } from 'lucide-react';

export type NavTab = 'predict' | 'validation' | 'methodology' | 'about';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'healthy' | 'offline'>('checking');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok && isMounted) {
          setBackendStatus('healthy');
        } else if (isMounted) {
          setBackendStatus('offline');
        }
      } catch (_) {
        if (isMounted) setBackendStatus('offline');
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'predict', label: 'Predict', icon: Activity },
    { id: 'validation', label: 'Accuracy & Benchmark', icon: Award },
    { id: 'methodology', label: 'How It Works', icon: BookOpen },
    { id: 'about', label: 'About & Pros/Cons', icon: Info },
  ];

  const handleNavClick = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0F2D5B] border-b border-[#173B70] shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div 
          onClick={() => handleNavClick('predict')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#173B70] border border-[#2563EB]/40 flex items-center justify-center shadow-xs group-hover:bg-[#2563EB] transition-colors">
            <Dna className="w-5 h-5 text-[#93C5FD] group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                AffiniProt
              </span>
              <span className="text-[10px] font-semibold text-[#93C5FD] bg-[#173B70] border border-[#2563EB]/30 px-1.5 py-0.5 rounded font-mono">
                DL
              </span>
            </div>
            <p className="text-[11px] text-[#93C5FD]/90 hidden sm:block font-normal">
              Protein–Protein Binding Affinity Predictor
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#173B70] text-white border border-[#2563EB]/40 shadow-xs'
                    : 'text-[#BFDBFE] hover:text-white hover:bg-[#173B70]/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#93C5FD]' : 'text-[#93C5FD]/70'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side: Status indicator & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Backend Status indicator */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-[#93C5FD]/80 pl-3 border-l border-[#173B70]">
            <span 
              className={`w-2 h-2 rounded-full ${
                backendStatus === 'healthy' 
                  ? 'bg-[#059669]' 
                  : backendStatus === 'checking' 
                  ? 'bg-[#D97706]' 
                  : 'bg-[#DC2626]'
              }`} 
            />
            <span className="font-mono text-[#BFDBFE]">
              {backendStatus === 'healthy' ? 'Engine Ready' : backendStatus === 'checking' ? 'Connecting...' : 'Offline'}
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-[#BFDBFE] hover:text-white hover:bg-[#173B70] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F2D5B] border-t border-[#173B70] px-4 py-3 space-y-1 shadow-lg">
          <p className="text-[11px] text-[#93C5FD] pb-1.5 px-2 font-medium">
            Protein–Protein Binding Affinity Predictor
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-[#173B70] text-white border border-[#2563EB]/40 font-semibold'
                    : 'text-[#BFDBFE] hover:text-white hover:bg-[#173B70]/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#93C5FD]' : 'text-[#93C5FD]/70'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 px-2 flex items-center gap-2 text-[11px] border-t border-[#173B70] mt-2">
            <span 
              className={`w-2 h-2 rounded-full ${
                backendStatus === 'healthy' ? 'bg-[#059669]' : 'bg-[#D97706]'
              }`} 
            />
            <span className="text-[#93C5FD] font-mono">
              Status: {backendStatus === 'healthy' ? 'Engine Ready' : 'Connecting...'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
