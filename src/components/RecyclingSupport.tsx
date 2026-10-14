import React, { useState } from 'react';
import { Search, MapPin, ExternalLink, HelpCircle, AlertCircle, Info } from 'lucide-react';

export const RecyclingSupport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');

  const materialQuickGuide = [
    { item: 'Aerosol Cans', stream: 'Metal / HWRC', guidance: 'Ensure completely empty. Do not pierce or flatten. Accepted curbside in most metal programs.' },
    { item: 'Batteries (AA, AAA, Li-ion)', stream: 'Specialist Drop-off', guidance: 'NEVER in curbside bins. Tape positive terminal and return to supermarket battery collection boxes.' },
    { item: 'Styrofoam (Polystyrene)', stream: 'General Waste / Drop-off', guidance: 'Rarely accepted curbside. Look for specialist EPS drop-offs or reuse as shipping packing.' },
    { item: 'Soft Plastic Bags & Film', stream: 'Store Take-Back', guidance: 'Keep out of regular recycling bins to prevent jamming machinery. Return to grocery front-of-store bins.' },
    { item: 'Greasy Pizza Boxes', stream: 'Organic / Residual', guidance: 'Tear away clean top lid for paper recycling. Put greasy, cheesy base in compost or general rubbish.' },
    { item: 'Light Bulbs (CFL & LED)', stream: 'Hazardous / WEEE', guidance: 'CFLs contain traces of mercury; take to municipal HWRC. LEDs can go to electronic collection.' },
  ];

  const filteredMaterials = materialFilter.trim()
    ? materialQuickGuide.filter(
        (m) =>
          m.item.toLowerCase().includes(materialFilter.toLowerCase()) ||
          m.stream.toLowerCase().includes(materialFilter.toLowerCase())
      )
    : materialQuickGuide;

  return (
    <section id="recycling" className="py-12 sm:py-16 lg:py-20 bg-white border-t border-[#d5e3d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3d8b5f]">
            06 / RECYCLING SUPPORT & LOCATOR GUIDANCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#163528] tracking-tight mt-2">
            Find Local <span className="text-[#3d8b5f]">Recycling Options</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5f7366] mt-3">
            Recycling regulations differ across council and city boundaries. Use this guide to find verified
            local waste collection points — facility names are never fabricated.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Local Area Guidance Search */}
          <div className="lg:col-span-6 bg-[#fbfdfa] border border-[#d5e3d8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-[#163528]">
              Locate Municipal Facility Rules
            </h3>
            <p className="text-xs sm:text-sm text-[#5f7366]">
              Enter your city, municipality, or postcode to view recommended next steps for your jurisdiction.
            </p>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-[#5f7366] absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Manchester, Austin, Toronto, London…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#d5e3d8] text-xs sm:text-sm focus:outline-none focus:border-[#3d8b5f] bg-white"
                />
              </div>
            </div>

            {/* Results / Guidance Notice */}
            <div className="p-4 rounded-2xl bg-[#e8f0e4]/50 border border-[#d5e3d8] space-y-3 text-xs leading-relaxed">
              {searchQuery.trim() ? (
                <>
                  <div className="font-bold text-[#163528] flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#3d8b5f]" />
                    <span>Guidance for area: “{searchQuery}”</span>
                  </div>
                  <p className="text-[#5f7366]">
                    Official addresses vary by municipal council. To locate verified drop-offs near <strong>{searchQuery}</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[#163528] pl-1">
                    <li>Search your official local government council portal for “Household Waste Recycling Centre (HWRC)”.</li>
                    <li>For grocery bag and film drop-offs, check major supermarket entrances.</li>
                    <li>For hazardous paints and motor oils, check municipal designated chemical disposal days.</li>
                  </ul>
                </>
              ) : (
                <>
                  <div className="font-bold text-[#163528]">
                    No fabricated facilities — transparent protocol
                  </div>
                  <p className="text-[#5f7366]">
                    This tool does not invent imaginary facility addresses. For true verified locations, consult official resources:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[#163528] pl-1">
                    <li><strong>UK:</strong> Recycle Now (recyclenow.com) locator</li>
                    <li><strong>US:</strong> Earth911.com recycling directory</li>
                    <li><strong>Global:</strong> Your city council waste management portal</li>
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Tricky Materials Quick Guide */}
          <div className="lg:col-span-6 bg-[#fbfdfa] border border-[#d5e3d8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#e8f0e4]">
              <div>
                <h3 className="font-bold text-lg text-[#163528]">
                  Tricky Materials Cheat-Sheet
                </h3>
                <span className="text-[11px] text-[#5f7366]">
                  How to handle items that confuse standard bins
                </span>
              </div>
            </div>

            <input
              type="text"
              placeholder="Search tricky item (e.g. batteries, aerosol)…"
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#d5e3d8] text-xs focus:outline-none focus:border-[#3d8b5f] bg-white"
            />

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredMaterials.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white border border-[#d5e3d8] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-[#163528] font-bold">{m.item}</strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e3f2e7] text-[#1f4d36]">
                      {m.stream}
                    </span>
                  </div>
                  <p className="text-[#5f7366] text-[11px] leading-snug">{m.guidance}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
