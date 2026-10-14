import React from 'react';
import { Recycle, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#d5e3d8] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          {/* Logo & description */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1f4d36] text-[#b8e0c2] flex items-center justify-center font-bold text-sm">
              <Recycle className="w-4 h-4 text-[#b8e0c2]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg text-[#163528] tracking-tight">
                EcoVision<span className="text-[#3d8b5f]"> AI</span>
              </span>
              <p className="text-[11px] text-[#5f7366]">
                Smart Waste Classification & EcoDecision System
              </p>
            </div>
          </div>

          {/* Educational disclaimer */}
          <p className="text-xs text-[#5f7366] max-w-md">
            Educational AI/ML project — model confidence scores are probabilistic estimations.
            Always confirm with your municipal recycling regulations before disposal.
          </p>

          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full bg-[#e3f2e7] text-[#1f4d36] border border-[#b8e0c2]">
              AI PROJECT EXPO 2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
