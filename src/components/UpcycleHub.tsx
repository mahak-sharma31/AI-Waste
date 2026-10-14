import React, { useState } from 'react';
import { Lightbulb, Clock, CheckCircle2, ArrowRight, Sparkles, PlusCircle } from 'lucide-react';
import { UPCYCLE_PROJECTS } from '../data/knowledgeBase';
import { UpcycleProject, WasteCategory } from '../types';

export const UpcycleHub: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [customItemInput, setCustomItemInput] = useState('');
  const [customIdeas, setCustomIdeas] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredProjects = activeFilter === 'all'
    ? UPCYCLE_PROJECTS
    : UPCYCLE_PROJECTS.filter((p) => p.category === activeFilter);

  const generateCustomUpcycling = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemInput.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/upcycle-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: customItemInput.trim(), category: 'waste' }),
      });
      const data = await res.json();
      setCustomIdeas(data.ideas || []);
    } catch {
      setCustomIdeas([
        {
          title: `Kitchen Herb Planter from ${customItemInput}`,
          description: 'Rinse thoroughly, drill small drainage holes in bottom, fill with potting soil, and plant basil or parsley.',
          materialsNeeded: [customItemInput, 'Drill/Nail for drainage', 'Soil', 'Seeds'],
          difficulty: 'Easy',
          estTime: '15 mins',
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="upcycle" className="py-12 sm:py-16 lg:py-20 bg-[#f4f7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3d8b5f]">
            04 / DIY UPCYCLING WORKSHOP
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#163528] tracking-tight mt-2">
            Turn Waste Into <span className="text-[#3d8b5f]">Useful Home Goods</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5f7366] mt-3">
            Before throwing items into recycling, discover practical ways to give them a second life.
            From self-watering planters to desk organizers.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'plastic', label: 'Plastic Bottles' },
            { id: 'metal', label: 'Metal Cans' },
            { id: 'paper', label: 'Cardboard & Paper' },
            { id: 'glass', label: 'Glass Jars' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-[#163528] text-white shadow-sm'
                  : 'bg-white text-[#5f7366] hover:text-[#163528] border border-[#d5e3d8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Curated Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredProjects.map((project) => {
            const isExpanded = expandedId === project.id;

            return (
              <div
                key={project.id}
                className="bg-white border border-[#d5e3d8] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#e8f0e4]">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#e3f2e7] flex items-center justify-center text-[#1f4d36]">
                        <Lightbulb className="w-4 h-4 text-[#3d8b5f]" />
                      </span>
                      <h3 className="font-bold text-base text-[#163528]">{project.title}</h3>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#e8f0e4] text-[#1f4d36] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{project.time}</span>
                    </span>
                  </div>

                  <p className="text-xs text-[#5f7366] mt-3 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f7366] block mb-1">
                      Materials Required:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.materials.map((mat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] bg-[#f4f7f2] border border-[#d5e3d8] text-[#163528]"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expanded step-by-step instructions */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#e8f0e4] space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3d8b5f] block">
                        Step-by-Step Instructions:
                      </span>
                      <ol className="list-decimal list-inside text-xs text-[#163528] space-y-1.5 pl-1">
                        {project.steps.map((step, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>

                      <div className="mt-3 p-2.5 rounded-xl bg-[#e3f2e7] text-xs text-[#1f4d36] font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#3d8b5f] flex-shrink-0" />
                        <span>{project.ecoBenefit}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#e8f0e4] flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f4f7f2] text-[#5f7366] border border-[#d5e3d8]">
                    Difficulty: {project.difficulty}
                  </span>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : project.id)}
                    className="text-xs font-bold text-[#1f4d36] hover:text-[#3d8b5f] flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'Hide Steps' : 'View Instructions'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom DIY Upcycle Generator Form */}
        <div className="bg-white border border-[#d5e3d8] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e3f2e7] text-[#1f4d36] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#3d8b5f]" />
              <span>AI Upcycling Idea Generator</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#163528]">
              Have a specific item at home?
            </h3>
            <p className="text-xs sm:text-sm text-[#5f7366]">
              Enter any discarded item (e.g. "Glass Olive Oil Bottle", "Wine Corks", "Old Jeans") to get customized creative upcycle projects.
            </p>

            <form onSubmit={generateCustomUpcycling} className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                placeholder="e.g. Glass pickle jar, cereal box…"
                value={customItemInput}
                onChange={(e) => setCustomItemInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#d5e3d8] text-xs sm:text-sm focus:outline-none focus:border-[#3d8b5f] bg-[#fafcf8]"
              />
              <button
                type="submit"
                disabled={isGenerating || !customItemInput.trim()}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#163528] hover:bg-[#1f4d36] transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Thinking…' : 'Generate'}
              </button>
            </form>

            {customIdeas.length > 0 && (
              <div className="mt-6 text-left space-y-3 pt-4 border-t border-[#e8f0e4]">
                {customIdeas.map((idea, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#f4f7f2] border border-[#d5e3d8] space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#163528]">{idea.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e3f2e7] text-[#1f4d36]">
                        {idea.difficulty || 'Easy'} · {idea.estTime || '15 mins'}
                      </span>
                    </div>
                    <p className="text-xs text-[#5f7366] leading-relaxed">{idea.description}</p>
                    {idea.materialsNeeded && (
                      <p className="text-[11px] text-[#5f7366] pt-1">
                        <strong className="text-[#163528]">Materials:</strong> {idea.materialsNeeded.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
