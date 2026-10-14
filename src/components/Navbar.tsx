import React, { useState } from 'react';
import { Camera, Recycle, Sparkles, BarChart3, HelpCircle, Layers, Lightbulb, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLiveCamera: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenLiveCamera }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'scanner', label: 'AI Scanner', icon: Camera },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'challenge', label: 'EcoChallenge', icon: HelpCircle },
    { id: 'resin-guide', label: 'Resin Codes (1-7)', icon: Layers },
    { id: 'upcycle', label: 'DIY Upcycling', icon: Lightbulb },
    { id: 'recycling', label: 'Recycling Guide', icon: Recycle },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#f4f7f2]/90 backdrop-blur-md border-b border-[#d5e3d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1f4d36] text-[#b8e0c2] flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
              <Recycle className="w-5 h-5 text-[#b8e0c2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl sm:text-2xl text-[#163528] tracking-tight leading-none">
                EcoVision<span className="text-[#3d8b5f] font-black"> AI</span>
              </span>
              <span className="text-[10px] font-semibold text-[#5f7366] tracking-wider uppercase">
                Smart Waste Intelligence
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#e8f0e4]/60 p-1 rounded-full border border-[#d5e3d8]/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1f4d36] text-white shadow-sm'
                      : 'text-[#5f7366] hover:text-[#163528] hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenLiveCamera}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#1f4d36] bg-[#e3f2e7] hover:bg-[#b8e0c2] transition-colors border border-[#b8e0c2]"
              title="Open Live Camera Scanner"
            >
              <Camera className="w-4 h-4 text-[#3d8b5f]" />
              <span>Live Camera</span>
            </button>

            <button
              onClick={() => handleNavClick('scanner')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#163528] hover:bg-[#1f4d36] transition-all shadow-sm hover:-translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#b8e0c2]" />
              <span>Try Scanner</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenLiveCamera}
              className="p-2 rounded-lg bg-[#e3f2e7] text-[#1f4d36]"
              aria-label="Open Camera"
            >
              <Camera className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white border border-[#d5e3d8] text-[#163528]"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#d5e3d8] px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#1f4d36] text-white'
                    : 'text-[#163528] hover:bg-[#e8f0e4]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
