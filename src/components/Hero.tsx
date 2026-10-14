import React from 'react';
import { ArrowRight, Camera, Sparkles, ShieldCheck, TreePine, Award, Zap } from 'lucide-react';

interface HeroProps {
  onStartScanning: () => void;
  onOpenLiveCamera: () => void;
  onViewAnalytics: () => void;
  totalScans: number;
}

export const Hero: React.FC<HeroProps> = ({
  onStartScanning,
  onOpenLiveCamera,
  onViewAnalytics,
  totalScans,
}) => {
  return (
    <section id="home" className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-16 lg:pb-24">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#b8e0c2]/35 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-[#3d8b5f]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading and pitch */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e3f2e7] border border-[#b8e0c2] text-[#1f4d36] text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#3d8b5f] animate-ping" />
              <span>AI / ML EXPO PROJECT 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#163528] tracking-tight leading-[1.1]">
              Smart Waste <br />
              Classification with{' '}
              <span className="text-[#3d8b5f] underline decoration-[#b8e0c2] decoration-wavy decoration-2">
                EcoVision AI
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5f7366] max-w-xl leading-relaxed">
              Scan discarded items instantly using your camera or image uploads.
              Get automated material detection, resin code recognition, decomposition timelines,
              and step-by-step <span className="font-semibold text-[#163528]">EcoDecision</span> rules to divert waste from landfills.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartScanning}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#163528] hover:bg-[#1f4d36] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <span>Start Scanning</span>
                <ArrowRight className="w-4 h-4 text-[#b8e0c2]" />
              </button>

              <button
                onClick={onOpenLiveCamera}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-[#1f4d36] bg-[#e3f2e7] hover:bg-[#b8e0c2] border border-[#b8e0c2] transition-colors"
              >
                <Camera className="w-4 h-4 text-[#3d8b5f]" />
                <span>Live Camera</span>
              </button>

              <button
                onClick={onViewAnalytics}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-[#163528] bg-white hover:bg-[#f4f7f2] border border-[#d5e3d8] transition-colors"
              >
                <span>View Analytics</span>
              </button>
            </div>

            {/* Note & Trust badging */}
            <div className="flex items-center gap-4 pt-2 text-xs text-[#5f7366]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3d8b5f]" />
                <span>On-device privacy preserved</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#3d8b5f]" />
                <span>Multi-class recognition</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero interactive card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-[#b8e0c2] to-[#3d8b5f]/30 rounded-3xl filter blur-2xl transform scale-95 opacity-70 animate-glow" />

              <div className="relative bg-white border border-[#d5e3d8] rounded-3xl p-6 shadow-xl animate-float">
                {/* Header of card */}
                <div className="flex items-center justify-between pb-4 border-b border-[#e8f0e4]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3d8b5f]" />
                    <span className="text-[11px] font-extrabold tracking-wider text-[#5f7366] uppercase">
                      CLASSIFICATION PIPELINE
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#e3f2e7] text-[#1f4d36]">
                    Active {totalScans > 0 ? `(${totalScans} scanned)` : ''}
                  </span>
                </div>

                {/* Card visual illustration */}
                <div className="my-5 p-6 rounded-2xl bg-gradient-to-br from-[#e3f2e7] via-[#b8e0c2]/40 to-[#e8f0e4] border border-[#d5e3d8] flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl mb-3">
                    ♻️
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1f4d36]">
                    EcoVision Neural Vision
                  </span>
                  <span className="text-[11px] text-[#5f7366] mt-1">
                    Multi-Class Waste & Resin Analyzer
                  </span>
                </div>

                {/* Classes chips */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#5f7366]">
                    SUPPORTED CATEGORIES
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Plastic (#1-#7)', 'Paper & Cardboard', 'Metal & Aluminium', 'Organic & Compost', 'Glass Bottles', 'E-Waste'].map((cat) => (
                      <span
                        key={cat}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#f4f7f2] border border-[#d5e3d8] text-[#163528]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer of card */}
                <div className="mt-5 pt-4 border-t border-[#e8f0e4] flex items-center justify-between text-xs">
                  <span className="text-[#5f7366]">Confidence estimation</span>
                  <span className="font-bold text-[#1f4d36]">Transparent & Probabilistic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature highlight bar */}
        <div className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-[#d5e3d8] rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e3f2e7] flex items-center justify-center text-[#1f4d36] flex-shrink-0">
              <Camera className="w-5 h-5 text-[#3d8b5f]" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[#163528]">Live & Upload</h3>
              <p className="text-[11px] text-[#5f7366]">Webcam or batch photos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e3f2e7] flex items-center justify-center text-[#1f4d36] flex-shrink-0">
              <TreePine className="w-5 h-5 text-[#3d8b5f]" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[#163528]">EcoDecision</h3>
              <p className="text-[11px] text-[#5f7366]">Rinse, reuse & recycle</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e3f2e7] flex items-center justify-center text-[#1f4d36] flex-shrink-0">
              <Zap className="w-5 h-5 text-[#3d8b5f]" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[#163528]">CO₂ Tracker</h3>
              <p className="text-[11px] text-[#5f7366]">Carbon avoided metrics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e3f2e7] flex items-center justify-center text-[#1f4d36] flex-shrink-0">
              <Award className="w-5 h-5 text-[#3d8b5f]" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-[#163528]">EcoChallenge</h3>
              <p className="text-[11px] text-[#5f7366]">Quiz & habit master</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
