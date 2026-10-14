import React, { useState } from 'react';
import { BarChart3, Download, Leaf, Recycle, Trash2, Award, TrendingUp, AlertTriangle, X } from 'lucide-react';
import { AnalysisResult, WasteCategory } from '../types';
import { CATEGORY_COLORS } from '../data/knowledgeBase';

interface AnalyticsProps {
  history: AnalysisResult[];
  onClearHistory: () => void;
  onDeleteCategory: (category: WasteCategory) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ history, onClearHistory, onDeleteCategory }) => {
  const [confirmModal, setConfirmModal] = useState<{
    type: 'all' | 'stream';
    category?: WasteCategory;
    categoryLabel?: string;
    count?: number;
  } | null>(null);

  // Aggregate stats
  const totalScans = history.length;

  const categoryCounts: Record<WasteCategory, number> = {
    plastic: 0,
    paper: 0,
    metal: 0,
    organic: 0,
    glass: 0,
    'e-waste': 0,
    hazardous: 0,
    unknown: 0,
  };

  let totalCo2Avoided = 0;

  history.forEach((item) => {
    if (categoryCounts[item.category] !== undefined) {
      categoryCounts[item.category] += 1;
    } else {
      categoryCounts.plastic += 1;
    }
    totalCo2Avoided += item.co2DivertedKg || 0.1;
  });

  // Top category
  let topCategory: WasteCategory | null = null;
  let topCount = 0;
  (Object.keys(categoryCounts) as WasteCategory[]).forEach((cat) => {
    if (categoryCounts[cat] > topCount) {
      topCount = categoryCounts[cat];
      topCategory = cat;
    }
  });

  const maxCount = Math.max(1, ...Object.values(categoryCounts));

  const categoryLabels: Record<WasteCategory, string> = {
    plastic: 'Plastic Waste',
    paper: 'Paper & Cardboard',
    metal: 'Metal & Cans',
    organic: 'Organic / Compost',
    glass: 'Glass Bottles',
    'e-waste': 'Electronic Waste',
    hazardous: 'Hazardous Waste',
    unknown: 'Unidentified Material',
  };

  // Export CSV
  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = ['ID', 'Item Name', 'Category', 'Confidence', 'CO2 Avoided (kg)', 'Timestamp'];
    const rows = history.map((item) => [
      item.id,
      `"${item.itemName.replace(/"/g, '""')}"`,
      item.categoryLabel,
      `${item.confidence}%`,
      item.co2DivertedKg,
      `"${item.timeFormatted}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecovision-scans-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExecuteDelete = () => {
    if (!confirmModal) return;
    if (confirmModal.type === 'all') {
      onClearHistory();
    } else if (confirmModal.type === 'stream' && confirmModal.category) {
      onDeleteCategory(confirmModal.category);
    }
    setConfirmModal(null);
  };

  return (
    <section id="analytics" className="py-12 sm:py-16 lg:py-20 bg-[#e8f0e4]/40 border-y border-[#d5e3d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3d8b5f]">
            02 / WASTE ANALYTICS & CARBON IMPACT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#163528] tracking-tight mt-2">
            Dashboard from <span className="text-[#3d8b5f]">Your Real Scans</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5f7366] mt-3">
            Real-time calculations based on completed scans in your browser. Track material distribution,
            delete individual streams, or reset metrics.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Card 1: Total Scans */}
          <div className="bg-white border border-[#d5e3d8] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#5f7366] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Total Scans</span>
              <Recycle className="w-4 h-4 text-[#3d8b5f]" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#163528]">
              {totalScans}
            </div>
            <p className="text-[11px] text-[#5f7366] mt-2">
              Items sorted and identified
            </p>
          </div>

          {/* Card 2: Top Category */}
          <div className="bg-white border border-[#d5e3d8] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#5f7366] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Top Category</span>
              <TrendingUp className="w-4 h-4 text-[#3d8b5f]" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#163528] truncate">
              {topCategory ? categoryLabels[topCategory] : '—'}
            </div>
            <p className="text-[11px] text-[#5f7366] mt-2">
              {topCategory ? `${topCount} scan(s) (${Math.round((topCount / totalScans) * 100)}%)` : 'Run scanner to populate'}
            </p>
          </div>

          {/* Card 3: CO2 Diverted */}
          <div className="bg-white border border-[#d5e3d8] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#5f7366] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">CO₂ Footprint Avoided</span>
              <Leaf className="w-4 h-4 text-[#1f4d36]" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#1f4d36]">
              {totalCo2Avoided.toFixed(2)}{' '}
              <span className="text-sm font-semibold text-[#5f7366]">kg</span>
            </div>
            <p className="text-[11px] text-[#5f7366] mt-2">
              Carbon emissions mitigated
            </p>
          </div>

          {/* Card 4: Eco-Score Level */}
          <div className="bg-white border border-[#d5e3d8] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#5f7366] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Eco Rank</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#163528]">
              {totalScans >= 15
                ? 'Zero-Waste Master'
                : totalScans >= 5
                ? 'Eco Guardian'
                : totalScans > 0
                ? 'Green Starter'
                : 'Unranked'}
            </div>
            <p className="text-[11px] text-[#5f7366] mt-2">
              {totalScans >= 5 ? 'Earned Sorting Badge' : 'Scan items to advance'}
            </p>
          </div>
        </div>

        {/* Category Breakdown & Bar Chart */}
        <div className="bg-white border border-[#d5e3d8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e8f0e4]">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#3d8b5f]">
                DISTRIBUTION
              </span>
              <h3 className="text-xl font-bold text-[#163528]">
                Scans by Material Stream
              </h3>
              <p className="text-xs text-[#5f7366] mt-0.5">
                Manage, inspect, or delete individual material streams below.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {totalScans > 0 && (
                <>
                  <button
                    onClick={exportCSV}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#163528] bg-[#f4f7f2] hover:bg-[#e8f0e4] border border-[#d5e3d8] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setConfirmModal({ type: 'all' })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset All Data</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {totalScans === 0 ? (
            <div className="py-12 text-center text-[#5f7366]">
              <BarChart3 className="w-10 h-10 text-[#d5e3d8] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#163528]">
                No scans recorded yet
              </p>
              <p className="text-xs text-[#5f7366] mt-1">
                Upload or photograph waste items in the AI Scanner above to populate charts.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Category distribution bars with Stream Delete option */}
              {(Object.keys(categoryCounts) as WasteCategory[]).map((cat) => {
                const count = categoryCounts[cat];
                const pctOfMax = Math.round((count / maxCount) * 100);
                const pctOfTotal = totalScans > 0 ? Math.round((count / totalScans) * 100) : 0;
                const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.plastic;

                return (
                  <div key={cat} className="p-3 rounded-2xl bg-[#fafcf8] border border-[#d5e3d8]/80 space-y-2 hover:border-[#3d8b5f]/50 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${colors.bar}`} />
                        <span className="font-bold text-[#163528]">{categoryLabels[cat]}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[#5f7366] font-semibold">
                          {count} scan{count !== 1 ? 's' : ''} ({pctOfTotal}%)
                        </span>

                        {count > 0 && (
                          <button
                            onClick={() =>
                              setConfirmModal({
                                type: 'stream',
                                category: cat,
                                categoryLabel: categoryLabels[cat],
                                count,
                              })
                            }
                            title={`Delete all ${categoryLabels[cat]} scans`}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Clear Stream</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-3 rounded-full bg-[#e8f0e4] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                        style={{ width: `${pctOfMax}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* In-App Confirmation Modal (NO window.confirm!) */}
        {confirmModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#d5e3d8] shadow-2xl space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#163528]">
                      {confirmModal.type === 'all'
                        ? 'Reset All Scan History?'
                        : `Delete ${confirmModal.categoryLabel} Stream?`}
                    </h3>
                    <p className="text-xs text-[#5f7366] mt-0.5">This action cannot be undone.</p>
                  </div>
                </div>
                <button
                  onClick={() => setConfirmModal(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-[#5f7366] leading-relaxed">
                {confirmModal.type === 'all'
                  ? `Are you sure you want to delete all ${totalScans} scan records? Your carbon savings and category statistics will be reset.`
                  : `Are you sure you want to delete all ${confirmModal.count} scans under "${confirmModal.categoryLabel}"? Your analytics for this material stream will be cleared.`}
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#163528] bg-[#f4f7f2] hover:bg-[#e8f0e4] border border-[#d5e3d8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteDelete}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
                >
                  {confirmModal.type === 'all' ? 'Yes, Reset All' : 'Yes, Delete Stream'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
