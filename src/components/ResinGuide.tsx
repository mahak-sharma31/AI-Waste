import React, { useState } from 'react';
import { Layers, CheckCircle2, AlertTriangle, XCircle, HelpCircle, ShieldCheck } from 'lucide-react';
import { RESIN_CODES } from '../data/knowledgeBase';
import { ResinCode } from '../types';

export const ResinGuide: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState<ResinCode | null>(null);

  const getRecyclabilityBadge = (level: ResinCode['recyclabilityLevel']) => {
    switch (level) {
      case 'Widely Recycled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Widely Recycled</span>
          </span>
        );
      case 'Limited Recycled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Store Drop-off Only</span>
          </span>
        );
      case 'Rarely / Specialist':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Rarely Recycled</span>
          </span>
        );
    }
  };

  const getSafetyBadge = (badge: ResinCode['safetyBadge']) => {
    switch (badge) {
      case 'Food Safe':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Avoid Hot Food':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Caution':
      case 'Hazardous':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <section id="resin-guide" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3d8b5f]">
            03 / RESIN IDENTIFICATION CODES (RIC)
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#163528] tracking-tight mt-2">
            Plastic Decoder <span className="text-[#3d8b5f]">Codes 1 through 7</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5f7366] mt-3">
            Not all plastics are created equal. Use this interactive reference to understand the SPI triangle
            chasing-arrows number molded into bottle bases and food containers.
          </p>
        </div>

        {/* Grid of Resin Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {RESIN_CODES.map((resin) => {
            return (
              <div
                key={resin.code}
                onClick={() => setSelectedCode(resin)}
                className="bg-white border border-[#d5e3d8] hover:border-[#3d8b5f] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#e8f0e4]">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-[#1f4d36]">{resin.symbol}</span>
                      <span className="font-extrabold text-base text-[#163528] group-hover:text-[#3d8b5f] transition-colors">
                        Code #{resin.code}
                      </span>
                    </div>
                    {getRecyclabilityBadge(resin.recyclabilityLevel)}
                  </div>

                  <div className="mt-3">
                    <h3 className="font-bold text-sm text-[#163528]">{resin.acronym}</h3>
                    <p className="text-xs text-[#5f7366] font-medium leading-snug">
                      {resin.fullName}
                    </p>
                  </div>

                  {/* Common products list */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f7366] block mb-1">
                      Commonly Found In:
                    </span>
                    <ul className="text-xs text-[#163528] space-y-1">
                      {resin.commonProducts.slice(0, 3).map((prod, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3d8b5f]" />
                          <span className="truncate">{prod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e8f0e4] flex items-center justify-between text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${getSafetyBadge(
                      resin.safetyBadge
                    )}`}
                  >
                    {resin.safetyBadge}
                  </span>
                  <span className="text-[#3d8b5f] font-bold text-[11px] group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Modal */}
        {selectedCode && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#d5e3d8] shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e8f0e4]">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-[#1f4d36]">{selectedCode.symbol}</span>
                  <div>
                    <h3 className="font-extrabold text-lg text-[#163528]">
                      {selectedCode.acronym} (Resin #{selectedCode.code})
                    </h3>
                    <p className="text-xs text-[#5f7366] font-medium">{selectedCode.fullName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCode(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[#5f7366] block mb-1">
                    Recyclability Status:
                  </span>
                  <div>{getRecyclabilityBadge(selectedCode.recyclabilityLevel)}</div>
                </div>

                <div>
                  <span className="font-bold uppercase tracking-wider text-[#5f7366] block mb-1">
                    Consumer Packaging:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCode.commonProducts.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#f4f7f2] border border-[#d5e3d8] text-[#163528] font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#e3f2e7] border border-[#b8e0c2]">
                  <strong className="text-[#1f4d36] block mb-0.5">Municipal Notes:</strong>
                  <p className="text-[#163528] leading-relaxed">{selectedCode.notes}</p>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[#5f7366]">
                  <ShieldCheck className="w-4 h-4 text-[#3d8b5f]" />
                  <span>
                    Reuse Safety:{' '}
                    <strong>{selectedCode.safeForReuse ? 'Safe for multiple reuses' : 'Not recommended for heating or long-term food contact'}</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCode(null)}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#163528] text-white hover:bg-[#1f4d36] mt-4"
              >
                Close Decoder
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
