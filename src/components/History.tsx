import React, { useState } from 'react';
import { Clock, Trash2, Filter, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { AnalysisResult, WasteCategory } from '../types';
import { CATEGORY_COLORS } from '../data/knowledgeBase';

interface HistoryProps {
  history: AnalysisResult[];
  onClearHistory: () => void;
  onDeleteSingle: (id: string) => void;
  onDeleteCategory: (category: WasteCategory) => void;
}

export const History: React.FC<HistoryProps> = ({
  history,
  onClearHistory,
  onDeleteSingle,
  onDeleteCategory,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [confirmModal, setConfirmModal] = useState<{
    type: 'all' | 'category' | 'single';
    id?: string;
    itemName?: string;
    category?: WasteCategory;
    count?: number;
  } | null>(null);

  const filteredHistory = filter === 'all'
    ? history
    : history.filter((item) => item.category === filter);

  const handleExecuteDelete = () => {
    if (!confirmModal) return;

    if (confirmModal.type === 'all') {
      onClearHistory();
    } else if (confirmModal.type === 'category' && confirmModal.category) {
      onDeleteCategory(confirmModal.category);
    } else if (confirmModal.type === 'single' && confirmModal.id) {
      onDeleteSingle(confirmModal.id);
    }

    setConfirmModal(null);
  };

  return (
    <section id="history" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#3d8b5f]">
              YOUR ACTIVITY LOG
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#163528] tracking-tight mt-1">
              Recent <span className="text-[#3d8b5f]">Waste Scans</span>
            </h2>
            <p className="text-xs text-[#5f7366] mt-0.5">
              Review, filter, or delete individual scan records and material history.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filter !== 'all' && filteredHistory.length > 0 && (
              <button
                onClick={() =>
                  setConfirmModal({
                    type: 'category',
                    category: filter as WasteCategory,
                    count: filteredHistory.length,
                  })
                }
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete {filter} scans ({filteredHistory.length})</span>
              </button>
            )}

            {history.length > 0 && (
              <button
                onClick={() => setConfirmModal({ type: 'all' })}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5f7366] hover:text-rose-600 px-3.5 py-1.5 rounded-xl border border-[#d5e3d8] hover:border-rose-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Scans ({history.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        {history.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-[#5f7366] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter by Material:
            </span>
            {['all', 'plastic', 'paper', 'metal', 'organic', 'glass', 'e-waste'].map((cat) => {
              const countInCat = cat === 'all' ? history.length : history.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                    filter === cat
                      ? 'bg-[#163528] text-white shadow-sm'
                      : 'bg-white border border-[#d5e3d8] text-[#5f7366] hover:text-[#163528]'
                  }`}
                >
                  {cat} {countInCat > 0 ? `(${countInCat})` : ''}
                </button>
              );
            })}
          </div>
        )}

        {/* Cards Grid */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white border border-[#d5e3d8] rounded-2xl p-10 text-center text-[#5f7366]">
            <Clock className="w-8 h-8 text-[#d5e3d8] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#163528]">
              {history.length === 0 ? 'Your completed scans will appear here.' : `No items found under "${filter}".`}
            </p>
            <p className="text-xs text-[#5f7366] mt-1">
              Analyze items with the AI Scanner to store results locally.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHistory.slice(0, 24).map((item) => {
              const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.plastic;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-[#d5e3d8] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-start gap-3.5 relative group"
                >
                  <img
                    src={item.previewUrl}
                    alt={item.itemName}
                    className="w-16 h-16 rounded-xl object-cover border border-[#d5e3d8] flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1 pr-6">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${colors.bg} ${colors.text} border ${colors.border}`}
                      >
                        {item.categoryLabel}
                      </span>
                      <span className="text-[10px] text-[#5f7366] font-medium">
                        {item.confidence}%
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#163528] truncate">
                      {item.itemName}
                    </h4>
                    <p className="text-[11px] text-[#5f7366] truncate mt-0.5">
                      {item.materialDetail}
                    </p>
                    <span className="text-[10px] text-[#5f7366] block mt-1">
                      {item.timeFormatted}
                    </span>
                  </div>

                  {/* Individual Delete Button on Scan Card */}
                  <button
                    onClick={() =>
                      setConfirmModal({
                        type: 'single',
                        id: item.id,
                        itemName: item.itemName,
                      })
                    }
                    title="Delete this scan"
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    aria-label={`Delete ${item.itemName} scan`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

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
                        ? 'Clear All Recent Scans?'
                        : confirmModal.type === 'category'
                        ? `Delete All ${confirmModal.category} Scans?`
                        : `Delete "${confirmModal.itemName}"?`}
                    </h3>
                    <p className="text-xs text-[#5f7366] mt-0.5">This will remove the selected data from your browser.</p>
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
                  ? `Are you sure you want to delete all ${history.length} scans from your activity log and analytics?`
                  : confirmModal.type === 'category'
                  ? `Are you sure you want to remove all ${confirmModal.count} scans classified as "${confirmModal.category}"?`
                  : `Are you sure you want to remove this scan from your history?`}
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
                  {confirmModal.type === 'all'
                    ? 'Yes, Clear All'
                    : confirmModal.type === 'category'
                    ? 'Yes, Delete Stream'
                    : 'Yes, Delete Scan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
