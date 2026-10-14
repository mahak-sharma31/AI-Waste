import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Scanner } from './components/Scanner';
import { Analytics } from './components/Analytics';
import { History } from './components/History';
import { ResinGuide } from './components/ResinGuide';
import { UpcycleHub } from './components/UpcycleHub';
import { EcoChallenge } from './components/EcoChallenge';
import { RecyclingSupport } from './components/RecyclingSupport';
import { Footer } from './components/Footer';
import { AnalysisResult, WasteCategory } from './types';

const STORAGE_KEY = 'ecovision_scan_history';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('scanner');
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [showLiveCamera, setShowLiveCamera] = useState<boolean>(false);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage:', e);
    }
  }, []);

  // Save history updates (replace if existing ID, or prepend if new)
  const handleScanCompleted = (newScan: AnalysisResult) => {
    setHistory((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === newScan.id);
      let updated: AnalysisResult[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = newScan;
      } else {
        updated = [newScan, ...prev].slice(0, 50);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save history to localStorage:', e);
      }
      return updated;
    });
  };

  // Delete a single scan by ID
  const handleDeleteSingle = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save history to localStorage:', e);
      }
      return updated;
    });
  };

  // Delete all scans in a specific material stream/category
  const handleDeleteCategory = (category: WasteCategory) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.category !== category);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save history to localStorage:', e);
      }
      return updated;
    });
  };

  // Clear all scan history
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to remove history from localStorage:', e);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f2] text-[#163528]">
      {/* Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLiveCamera={() => {
          setShowLiveCamera(true);
          scrollToSection('scanner');
        }}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onStartScanning={() => scrollToSection('scanner')}
          onOpenLiveCamera={() => {
            setShowLiveCamera(true);
            scrollToSection('scanner');
          }}
          onViewAnalytics={() => scrollToSection('analytics')}
          totalScans={history.length}
        />

        {/* AI Scanner & EcoDecision */}
        <Scanner
          onScanCompleted={handleScanCompleted}
          showLiveCameraDirectly={showLiveCamera}
          onCloseLiveCameraDirectly={() => setShowLiveCamera(false)}
        />

        {/* Analytics & Impact Dashboard */}
        <Analytics
          history={history}
          onClearHistory={handleClearHistory}
          onDeleteCategory={handleDeleteCategory}
        />

        {/* History Activity Stream */}
        <History
          history={history}
          onClearHistory={handleClearHistory}
          onDeleteSingle={handleDeleteSingle}
          onDeleteCategory={handleDeleteCategory}
        />

        {/* Resin Identification Codes (1-7) Guide */}
        <ResinGuide />

        {/* DIY Upcycling Hub */}
        <UpcycleHub />

        {/* EcoChallenge Interactive Quiz */}
        <EcoChallenge />

        {/* Recycling Support & Material Lookup */}
        <RecyclingSupport />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
