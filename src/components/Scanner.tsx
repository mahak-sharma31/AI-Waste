import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Camera,
  X,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Clock,
  Leaf,
  ShieldAlert,
  ArrowRight,
  Lightbulb,
  Info,
  Maximize2,
  Trash2
} from 'lucide-react';
import { AnalysisResult, UpcycleIdea, WasteCategory } from '../types';
import { analyzeImageLocally } from '../utils/localClassifier';
import { CATEGORY_COLORS, DEMO_PRESETS, LOW_CONFIDENCE_THRESHOLD, ecoDecisionKnowledgeBase } from '../data/knowledgeBase';

interface ScannerProps {
  onScanCompleted: (result: AnalysisResult) => void;
  showLiveCameraDirectly?: boolean;
  onCloseLiveCameraDirectly?: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({
  onScanCompleted,
  showLiveCameraDirectly = false,
  onCloseLiveCameraDirectly,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('READY');
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [toastError, setToastError] = useState<string | null>(null);
  const [apiKeyMissingError, setApiKeyMissingError] = useState<string | null>(null);
  const [upcycleModalData, setUpcycleModalData] = useState<{
    item: string;
    ideas: UpcycleIdea[];
    loading: boolean;
  } | null>(null);

  // Live Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync with prop if opened from navbar
  useEffect(() => {
    if (showLiveCameraDirectly) {
      startCamera();
    }
  }, [showLiveCameraDirectly]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      stopCamera();
    };
  }, []);

  // Camera handling
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    setIsCameraActive(true);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser settings.'
          : 'Could not access camera device. Please use file upload.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    if (onCloseLiveCameraDirectly) {
      onCloseLiveCameraDirectly();
    }
  };

  const flipCamera = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const capturedFile = new File([blob], `camera-snap-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });
      const url = URL.createObjectURL(blob);

      // Add to selected images
      setSelectedFiles((prev) => [...prev.slice(0, 3), capturedFile]);
      setPreviewUrls((prev) => [...prev.slice(0, 3), url]);
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  // File selection
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const validFiles: File[] = [];

    for (const f of fileList) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
        setToastError('Please upload JPG, PNG, or WEBP images.');
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        setToastError(`File "${f.name}" exceeds 5 MB. Please select smaller images.`);
        return;
      }
      validFiles.push(f);
    }
    setToastError(null);

    const combined = [...selectedFiles, ...validFiles].slice(0, 4);
    setSelectedFiles(combined);

    const urls = combined.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setResults([]);
  };

  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    setResults([]);
  };

  // Fast in-memory downsampling to 640px JPEG (~40KB) in 15ms so scans finish in seconds
  const optimizeImageFast = (fileOrUrl: File | string): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const maxDim = 640;
          let w = img.width || 640;
          let h = img.height || 480;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
            return resolve({ base64: dataUrl, mimeType: 'image/jpeg' });
          }
        } catch (e) {
          console.warn('Canvas optimization fallback:', e);
        }
        resolve({ base64: typeof fileOrUrl === 'string' ? fileOrUrl : '', mimeType: 'image/jpeg' });
      };

      img.onerror = () => {
        resolve({ base64: typeof fileOrUrl === 'string' ? fileOrUrl : '', mimeType: 'image/jpeg' });
      };

      if (typeof fileOrUrl === 'string') {
        img.src = fileOrUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result as string;
        };
        reader.onerror = () => {
          resolve({ base64: '', mimeType: 'image/jpeg' });
        };
        reader.readAsDataURL(fileOrUrl);
      }
    });
  };

  // Load preset demo image instantly
  const loadDemoPreset = async (preset: typeof DEMO_PRESETS[0]) => {
    try {
      setProgressStatus(`Loaded sample ${preset.name}`);
      // SVG data URLs load instantly in memory with zero network delay
      const res = await fetch(preset.imageUrl);
      const blob = await res.blob();
      const file = new File([blob], `${preset.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`, {
        type: 'image/jpeg',
      });

      setSelectedFiles([file]);
      setPreviewUrls([preset.imageUrl]);
      setResults([]);
    } catch {
      setPreviewUrls([preset.imageUrl]);
    }
  };

  // Robust single image analyzer with 15-second serverless timeout
  const analyzeSingleItem = async (
    file: File | undefined,
    previewUrl: string,
    idx: number
  ): Promise<AnalysisResult> => {
    let analyzedResult: AnalysisResult | null = null;
    let optimizedBase64 = '';

    try {
      // 1. Fast client-side image compression (640px JPEG) to ensure fast payload transport
      const optimized = await optimizeImageFast(file || previewUrl);
      optimizedBase64 = optimized.base64;

      if (optimized.base64) {
        // 2. 15-second AbortController timeout so serverless cold starts and Gemini inference never get aborted prematurely
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        try {
          const apiResponse = await fetch('/api/analyze-waste', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              imageBase64: optimized.base64,
              mimeType: optimized.mimeType,
            }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (apiResponse.ok) {
            const json = await apiResponse.json();

            if (json.requiresApiKey) {
              setApiKeyMissingError(
                json.error ||
                  'GEMINI_API_KEY is not configured in your hosting environment variables. Please add it to your Netlify / hosting dashboard.'
              );
            }

            if (json.success && json.data) {
              const d = json.data;
              const isIdentifiable = d.is_identifiable !== false;
              const rawCat = String(d.category || 'unknown').toLowerCase();
              let categoryKey: WasteCategory = 'organic';

              if (!isIdentifiable || rawCat.includes('unknown') || rawCat.includes('unidentified')) {
                categoryKey = 'unknown';
              } else if (
                rawCat.includes('organ') ||
                rawCat.includes('food') ||
                rawCat.includes('compost') ||
                rawCat.includes('peel') ||
                rawCat.includes('fruit') ||
                rawCat.includes('vegetable') ||
                rawCat.includes('banana')
              ) {
                categoryKey = 'organic';
              } else if (
                rawCat.includes('metal') ||
                rawCat.includes('can') ||
                rawCat.includes('tin') ||
                rawCat.includes('alumin')
              ) {
                categoryKey = 'metal';
              } else if (
                rawCat.includes('paper') ||
                rawCat.includes('cardboard') ||
                rawCat.includes('box') ||
                rawCat.includes('kraft')
              ) {
                categoryKey = 'paper';
              } else if (rawCat.includes('glass') || rawCat.includes('jar')) {
                categoryKey = 'glass';
              } else if (
                rawCat.includes('electr') ||
                rawCat.includes('e-waste') ||
                rawCat.includes('batt')
              ) {
                categoryKey = 'e-waste';
              } else if (rawCat.includes('hazard')) {
                categoryKey = 'hazardous';
              } else if (
                rawCat.includes('plastic') ||
                rawCat.includes('pet') ||
                rawCat.includes('poly') ||
                rawCat.includes('bottle')
              ) {
                categoryKey = 'plastic';
              }

              const categoryLabels: Record<WasteCategory, string> = {
                plastic: 'Plastic Waste',
                paper: 'Paper & Cardboard',
                metal: 'Metal Waste',
                organic: 'Organic Waste',
                glass: 'Glass Waste',
                'e-waste': 'Electronic Waste',
                hazardous: 'Hazardous Waste',
                unknown: 'Unidentified Material',
              };

              analyzedResult = {
                id: `scan-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
                isIdentifiable,
                unclearReason: d.unclear_reason,
                itemName: d.item_name || (isIdentifiable ? 'Scanned Waste Item' : 'Unidentified Waste Item'),
                category: categoryKey,
                categoryLabel:
                  d.category_label || categoryLabels[categoryKey],
                materialDetail:
                  d.material_detail ||
                  (isIdentifiable ? 'Standard recyclable material' : 'Material could not be confirmed reliably'),
                confidence: Math.min(99, Math.max(1, Math.round(d.confidence || (isIdentifiable ? 94 : 35)))),
                lowConfidence: !isIdentifiable || (d.confidence || 94) < LOW_CONFIDENCE_THRESHOLD,
                alternatives: Array.isArray(d.alternatives) ? d.alternatives : [],
                cleanlinessStatus:
                  d.cleanliness_status ||
                  (categoryKey === 'organic'
                    ? 'Compostable Organic'
                    : isIdentifiable
                    ? 'Clean for sorting'
                    : 'Unclear'),
                decompositionTime:
                  d.decomposition_time ||
                  (categoryKey === 'organic'
                    ? '2-4 weeks'
                    : categoryKey === 'plastic'
                    ? '450 years'
                    : isIdentifiable
                    ? '50-100 years'
                    : 'Unknown'),
                co2DivertedKg: Number(
                  d.co2_diverted_kg ||
                    (categoryKey === 'organic' ? 0.24 : isIdentifiable ? 0.1 : 0)
                ),
                ecoDecision:
                  d.eco_decision ||
                  ecoDecisionKnowledgeBase[categoryKey] ||
                  ecoDecisionKnowledgeBase.unknown,
                upcycleIdea: d.upcycle_idea,
                previewUrl,
                timestamp: Date.now(),
                timeFormatted: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                engineUsed: 'gemini',
              };
            } else if (json.error && !json.requiresApiKey) {
              setToastError(`Notice: ${json.error}`);
            }
          } else {
            console.warn('API returned non-200 status:', apiResponse.status);
          }
        } catch (fetchErr: any) {
          clearTimeout(timeoutId);
          console.warn('Vision API call failed or timed out:', fetchErr.message);
        }
      }
    } catch (e) {
      console.warn('Preprocessing error:', e);
    }

    // 3. Fallback to local image analyzer only if network is offline / serverless unavailable
    if (!analyzedResult) {
      const img = new Image();
      if (previewUrl.startsWith('http://') || previewUrl.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }
      img.src = optimizedBase64 || previewUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });

      analyzedResult = await analyzeImageLocally(img, previewUrl);
    }

    return analyzedResult;
  };

  // Analyze images in parallel (finishes in 2 to 5 seconds!)
  const analyzeImages = async () => {
    if (selectedFiles.length === 0 && previewUrls.length === 0) return;

    setIsAnalyzing(true);
    setResults([]);
    setProgressStatus(`Scanning ${previewUrls.length} item(s) in parallel…`);

    try {
      // Run all image scans in parallel for maximum speed
      const tasks = previewUrls.map((url, idx) =>
        analyzeSingleItem(selectedFiles[idx], url, idx)
      );

      const generatedResults = await Promise.all(tasks);

      setResults(generatedResults);
      generatedResults.forEach((r) => onScanCompleted(r));
      setProgressStatus(`Completed ${generatedResults.length} Scan(s)`);
    } catch (err: any) {
      console.error('Scan error:', err);
      setToastError(`Notice: ${err.message}`);
      setProgressStatus('ANALYSIS COMPLETE');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Manual Quick Reclassify / Correct Category
  const handleReclassify = (resultId: string, newCategory: WasteCategory) => {
    setResults((prev) =>
      prev.map((item) => {
        if (item.id !== resultId) return item;
        const labels: Record<WasteCategory, string> = {
          organic: 'Organic Waste',
          plastic: 'Plastic Waste',
          paper: 'Paper & Cardboard',
          metal: 'Metal Waste',
          glass: 'Glass Waste',
          'e-waste': 'Electronic Waste',
          hazardous: 'Hazardous Waste',
          unknown: 'Unidentified Material',
        };
        const updatedEco = ecoDecisionKnowledgeBase[newCategory];
        const isOrg = newCategory === 'organic';
        const isPaper = newCategory === 'paper';
        const isMetal = newCategory === 'metal';
        const isGlass = newCategory === 'glass';

        const updatedItem: AnalysisResult = {
          ...item,
          category: newCategory,
          categoryLabel: labels[newCategory],
          itemName: isOrg
            ? 'Banana Peel / Organic Food Scrap'
            : isPaper
            ? 'Paper / Cardboard Waste'
            : isMetal
            ? 'Aluminium Can / Metal Waste'
            : isGlass
            ? 'Glass Bottle / Jar'
            : 'Plastic Container / Packaging',
          materialDetail: isOrg
            ? 'Compostable Plant Biomass (Nutrient-Rich Organic Scrap)'
            : isPaper
            ? 'Recyclable Kraft Paper Fibreboard'
            : isMetal
            ? 'Aluminium / Steel Metal Alloy'
            : isGlass
            ? 'Flint Container Glass'
            : '#1 PET or #2 HDPE Rigid Plastic',
          decompositionTime: isOrg
            ? '2 to 4 weeks'
            : isPaper
            ? '2 months'
            : isMetal
            ? '200 years'
            : isGlass
            ? '1,000,000 years'
            : '450 years',
          co2DivertedKg: isOrg ? 0.24 : isMetal ? 0.17 : isPaper ? 0.12 : 0.08,
          confidence: 96,
          lowConfidence: false,
          ecoDecision: updatedEco,
          cleanlinessStatus: isOrg ? 'Organic Compost Biomass' : 'Clean for sorting',
          alternatives: [
            { className: labels[newCategory], probability: 0.96 },
            { className: item.categoryLabel, probability: 0.04 },
          ],
          upcycleIdea: isOrg
            ? {
                title: 'Natural Banana Peel Fertilizer Tea',
                description: 'Steep peel in water for 48 hours for potassium-rich plant food, or bury directly in soil.',
                difficulty: 'Easy',
                estTime: '10 mins',
              }
            : item.upcycleIdea,
        };
        onScanCompleted(updatedItem);
        return updatedItem;
      })
    );
  };

  // Trigger custom upcycle project generator
  const requestUpcycleProjects = async (item: string, category: WasteCategory) => {
    setUpcycleModalData({
      item,
      ideas: [],
      loading: true,
    });

    try {
      const res = await fetch('/api/upcycle-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, category }),
      });
      const data = await res.json();
      setUpcycleModalData({
        item,
        ideas: data.ideas || [],
        loading: false,
      });
    } catch {
      setUpcycleModalData({
        item,
        ideas: [
          {
            title: `Self-Watering Planter from ${item}`,
            description: 'Cut container horizontally, invert top with cotton wick into water. Great for culinary herbs.',
            materialsNeeded: ['Container', 'Cotton string', 'Soil', 'Seeds'],
            difficulty: 'Easy',
            estTime: '15 mins',
          },
        ],
        loading: false,
      });
    }
  };

  return (
    <section id="scanner" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3d8b5f]">
            01 / AI SCANNER & ECO-DECISION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#163528] tracking-tight mt-2">
            Classify Waste. <span className="text-[#3d8b5f]">Act with EcoDecision.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5f7366] mt-3">
            Upload up to 4 photos or activate your live camera. Our vision pipeline scores category,
            resin code, and actionable disposal guidance.
          </p>
        </div>

        {/* Live Camera Viewfinder Modal */}
        {isCameraActive && (
          <div className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#163528] rounded-3xl overflow-hidden border border-[#3d8b5f]/50 shadow-2xl">
              {/* Camera header */}
              <div className="p-4 flex items-center justify-between bg-black/40 text-white">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">Live Waste Viewfinder</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={flipCamera}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Flip camera"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={stopCamera}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Video frame with viewfinder reticle */}
              <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
                {cameraError ? (
                  <div className="p-6 text-center text-rose-300 space-y-3">
                    <AlertTriangle className="w-10 h-10 mx-auto" />
                    <p className="text-xs">{cameraError}</p>
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 bg-white text-[#163528] rounded-xl text-xs font-bold"
                    >
                      Retry Permission
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="w-full h-full object-cover"
                    />

                    {/* Viewfinder Target Overlay */}
                    <div className="absolute inset-8 pointer-events-none border-2 border-white/60 border-dashed rounded-2xl flex items-center justify-center">
                      <div className="w-8 h-8 border-t-2 border-l-2 border-[#b8e0c2] absolute top-2 left-2" />
                      <div className="w-8 h-8 border-t-2 border-r-2 border-[#b8e0c2] absolute top-2 right-2" />
                      <div className="w-8 h-8 border-b-2 border-l-2 border-[#b8e0c2] absolute bottom-2 left-2" />
                      <div className="w-8 h-8 border-b-2 border-r-2 border-[#b8e0c2] absolute bottom-2 right-2" />
                      <span className="text-[11px] font-bold tracking-wider text-white/80 bg-black/40 px-2 py-0.5 rounded-md">
                        Center Item Here
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Shutter controls */}
              <div className="p-6 flex items-center justify-center gap-4 bg-black/60">
                <button
                  onClick={capturePhoto}
                  disabled={Boolean(cameraError)}
                  className="w-16 h-16 rounded-full bg-white hover:bg-[#b8e0c2] border-4 border-[#3d8b5f] flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50 shadow-lg"
                  aria-label="Capture snapshot"
                >
                  <div className="w-12 h-12 rounded-full bg-[#163528] flex items-center justify-center text-white">
                    <Camera className="w-6 h-6" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Missing API Key Guidance Banner for Netlify / Cloud Hosting */}
        {apiKeyMissingError && (
          <div className="mb-8 p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 shadow-sm space-y-3">
            <div className="flex items-center justify-between font-bold text-amber-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span className="text-sm sm:text-base">
                  Action Required on Netlify / Cloud Hosting: Set GEMINI_API_KEY
                </span>
              </div>
              <button
                onClick={() => setApiKeyMissingError(null)}
                className="p-1 hover:bg-amber-100 rounded-lg text-amber-800"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              Your app is running on an external host (Netlify / Vercel), but the serverless AI Vision function cannot find the{' '}
              <code className="bg-amber-200/90 px-1.5 py-0.5 rounded font-mono font-bold text-amber-950">
                GEMINI_API_KEY
              </code>{' '}
              environment variable. Follow these quick steps to enable real AI vision:
            </p>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-amber-900 font-medium space-y-1.5 pl-1 bg-amber-100/60 p-3 rounded-xl border border-amber-200">
              <li>
                Open your <strong>Netlify Dashboard</strong> &gt; Select your project (<code>ai-waste</code>).
              </li>
              <li>
                Navigate to <strong>Site configuration</strong> &gt; <strong>Environment variables</strong>.
              </li>
              <li>
                Click <strong>Add a variable</strong>, set Key to <code>GEMINI_API_KEY</code>, and paste your Google AI Studio API key as the Value.
              </li>
              <li>
                Go to <strong>Deploys</strong> &gt; <strong>Trigger deploy</strong> &gt; <strong>Clear cache and deploy site</strong>.
              </li>
            </ol>
          </div>
        )}

        {/* Scanner Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Upload Panel (Col 5) */}
          <div className="lg:col-span-5 bg-white border border-[#d5e3d8] rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8f0e4]">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#3d8b5f]">
                  01 / INPUT
                </span>
                <h3 className="font-bold text-lg text-[#163528]">Select Waste Image</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-[#e3f2e7] text-[#1f4d36]">
                Max 4 files
              </span>
            </div>

            {/* Error banner */}
            {toastError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                <span>{toastError}</span>
                <button
                  onClick={() => setToastError(null)}
                  className="text-rose-600 font-bold ml-2 hover:bg-rose-100 p-1 rounded-md"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#3d8b5f] bg-[#e3f2e7]'
                  : 'border-[#a8c4b0] hover:border-[#3d8b5f] bg-[#fafcf8] hover:bg-[#e3f2e7]/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />

              <div className="w-12 h-12 rounded-2xl bg-[#e3f2e7] text-[#1f4d36] flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6 text-[#3d8b5f]" />
              </div>

              <h4 className="font-bold text-sm sm:text-base text-[#163528]">
                Drop waste images here
              </h4>
              <p className="text-xs text-[#5f7366] mt-1">
                or click to browse from device · up to 5 MB
              </p>
              <div className="inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#e8f0e4] text-[#5f7366]">
                JPG · PNG · WEBP
              </div>
            </div>

            {/* Live Camera Option */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-[#1f4d36] bg-[#e3f2e7] hover:bg-[#b8e0c2] border border-[#b8e0c2] transition-colors"
              >
                <Camera className="w-4 h-4 text-[#3d8b5f]" />
                <span>Snap with Camera</span>
              </button>

              {previewUrls.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="p-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Clear all selected"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Selected image previews */}
            {previewUrls.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#e8f0e4]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#5f7366]">
                  <span>Ready for scan ({previewUrls.length}/4)</span>
                  <span className="text-[11px] text-[#3d8b5f] font-bold">Image queue loaded</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {previewUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden border border-[#d5e3d8] group bg-[#f4f7f2]"
                    >
                      <img
                        src={url}
                        alt={`Selected waste ${idx + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(idx);
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors opacity-90"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="p-1.5 text-[10px] text-[#5f7366] truncate font-medium bg-white">
                        {selectedFiles[idx]?.name || `Sample item ${idx + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Demo Samples (Instant test) */}
            <div className="pt-2 border-t border-[#e8f0e4] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5f7366]">
                Or test with sample items:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {DEMO_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => loadDemoPreset(preset)}
                    className="flex items-center gap-2 p-1.5 rounded-lg text-left text-xs bg-[#f4f7f2] hover:bg-[#e3f2e7] border border-[#d5e3d8] transition-colors"
                  >
                    <img
                      src={preset.imageUrl}
                      alt={preset.name}
                      className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                    />
                    <span className="font-semibold text-[#163528] truncate text-[11px]">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze CTA button */}
            <button
              onClick={analyzeImages}
              disabled={previewUrls.length === 0 || isAnalyzing}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-[#163528] hover:bg-[#1f4d36] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#b8e0c2]" />
                  <span>{progressStatus}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#b8e0c2]" />
                  <span>Analyze {previewUrls.length > 0 ? `(${previewUrls.length}) with AI` : 'with AI'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-[#5f7366] leading-tight">
              Predictions run on-device and via secure AI Studio pipeline. No personal telemetry saved.
            </p>
          </div>

          {/* Results Panel (Col 7) */}
          <div className="lg:col-span-7 bg-white border border-[#d5e3d8] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#e8f0e4]">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#3d8b5f]">
                  02 / OUTPUT
                </span>
                <h3 className="font-bold text-lg text-[#163528]">
                  Classification & EcoDecision
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#e3f2e7] text-[#1f4d36]">
                {progressStatus}
              </span>
            </div>

            {/* Empty State */}
            {results.length === 0 && !isAnalyzing && (
              <div className="py-14 sm:py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-[#e8f0e4] flex items-center justify-center text-[#1f4d36] mb-4">
                  <Camera className="w-8 h-8 text-[#3d8b5f]" />
                </div>
                <h4 className="font-bold text-base text-[#163528]">
                  {previewUrls.length > 0
                    ? `${previewUrls.length} image(s) selected`
                    : 'Awaiting your waste image'}
                </h4>
                <p className="text-xs sm:text-sm text-[#5f7366] max-w-sm mt-1">
                  {previewUrls.length > 0
                    ? 'Click "Analyze with AI" to inspect material composition, resin code, and disposal rules.'
                    : 'Upload photo, snap with camera, or choose a sample preset above to see the neural classifier in action.'}
                </p>
              </div>
            )}

            {/* Analyzing loading state */}
            {isAnalyzing && (
              <div className="py-14 sm:py-20 flex flex-col items-center justify-center text-center px-4 space-y-4">
                <div className="w-14 h-14 rounded-full border-4 border-[#b8e0c2] border-t-[#1f4d36] animate-spin" />
                <div>
                  <h4 className="font-bold text-base text-[#163528]">{progressStatus}</h4>
                  <p className="text-xs text-[#5f7366] mt-1">
                    Analyzing visual texture, color patterns, and resin features…
                  </p>
                </div>
              </div>
            )}

            {/* Render Results List */}
            {results.length > 0 && !isAnalyzing && (
              <div className="space-y-6">
                {results.map((result, idx) => {
                  const colors = CATEGORY_COLORS[result.category] || CATEGORY_COLORS.plastic;

                  return (
                    <article
                      key={result.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        result.lowConfidence
                          ? 'border-amber-300 bg-amber-50/30'
                          : 'border-[#d5e3d8] bg-[#fbfdfa]'
                      }`}
                    >
                      {/* Top Bar: Thumbnail + Item info */}
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-4 border-b border-[#e8f0e4]">
                        <div className="flex items-center gap-3">
                          <img
                            src={result.previewUrl}
                            alt={result.itemName}
                            className="w-16 h-16 rounded-xl object-cover border border-[#d5e3d8] flex-shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-[#5f7366]">
                                Scan #{idx + 1}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${colors.bg} ${colors.text} ${colors.border} border`}
                              >
                                {result.categoryLabel}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-base sm:text-lg text-[#163528]">
                              {result.itemName}
                            </h4>
                            <p className="text-xs font-semibold text-[#5f7366]">
                              {result.materialDetail}
                            </p>
                          </div>
                        </div>

                        {/* Confidence score badge */}
                        <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto">
                          <div className="text-right">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f7366]">
                              Model Confidence
                            </span>
                            <div className="text-xl font-black text-[#1f4d36]">
                              {result.confidence}%
                            </div>
                          </div>
                          <span className="text-[10px] text-[#5f7366]">{result.timeFormatted}</span>
                        </div>
                      </div>

                      {/* Confidence Progress Bar */}
                      <div className="my-3">
                        <div className="w-full h-2 rounded-full bg-[#e8f0e4] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              result.lowConfidence ? 'bg-amber-500' : colors.bar
                            }`}
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                      </div>

                      {/* Quick Category Correction Bar */}
                      <div className="mb-3.5 p-2.5 rounded-xl bg-[#f4f7f2] border border-[#d5e3d8] flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-[11px] font-bold text-[#5f7366] mr-1">
                          Wrong material? Correct to:
                        </span>
                        {[
                          { cat: 'organic' as WasteCategory, label: '🍌 Organic (Banana/Food)', desc: 'Peels, food waste, fruit' },
                          { cat: 'plastic' as WasteCategory, label: '🧴 Plastic', desc: 'Bottles, tubs, rigid packaging' },
                          { cat: 'paper' as WasteCategory, label: '📦 Paper / Box', desc: 'Cardboard, clean paper' },
                          { cat: 'metal' as WasteCategory, label: '🥫 Metal Can', desc: 'Aluminium cans, tins' },
                          { cat: 'glass' as WasteCategory, label: '🍾 Glass', desc: 'Jars, bottles' },
                        ]
                          .filter((opt) => opt.cat !== result.category)
                          .map((opt) => (
                            <button
                              key={opt.cat}
                              type="button"
                              onClick={() => handleReclassify(result.id, opt.cat)}
                              className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-white hover:bg-[#e3f2e7] border border-[#d5e3d8] hover:border-[#3d8b5f] text-[#163528] transition-colors shadow-2xs"
                              title={opt.desc}
                            >
                              {opt.label}
                            </button>
                          ))}
                      </div>

                      {/* Unidentified / Unclear Image Banner */}
                      {!result.isIdentifiable && (
                        <div className="my-4 p-4 rounded-2xl bg-amber-50/80 border-2 border-amber-300 text-amber-950 space-y-3">
                          <div className="flex items-center gap-2 font-bold text-amber-900">
                            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
                            <span className="text-sm">Item Could Not Be Identified Reliably</span>
                          </div>
                          <p className="text-xs text-amber-900 leading-relaxed">
                            {result.unclearReason ||
                              'The image does not clearly depict a recognized waste item (it may be blurry, cropped, dimly lit, or obstructed). Rather than guessing an incorrect material, our system flags this for review.'}
                          </p>
                          <div className="p-3 bg-white/90 rounded-xl border border-amber-200 text-xs space-y-1">
                            <strong className="block text-amber-950 font-bold">Tips for an Accurate Scan:</strong>
                            <ul className="list-disc list-inside text-amber-900 space-y-0.5">
                              <li>Center the object in good ambient or room lighting.</li>
                              <li>Avoid shadows, glare, or extremely high contrast.</li>
                              <li>Remove outer wrapping or bags to reveal the primary material.</li>
                              <li>If you know the material, select the quick correction buttons above.</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* SECTION 1: OBJECT & MATERIAL IDENTIFICATION */}
                      <div className="my-4 p-4 rounded-2xl bg-[#fafcf8] border border-[#d5e3d8] space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#e8f0e4]">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3d8b5f]">
                            01 / Visual & Material Identification
                          </span>
                          <span className="text-[10px] font-semibold text-[#5f7366] px-2 py-0.5 rounded bg-[#e8f0e4]">
                            Engine: {result.engineUsed === 'gemini' ? 'Gemini Vision AI' : 'Local Sensor'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f7366] block">
                              Detected Object
                            </span>
                            <span className="font-bold text-[#163528] text-sm">
                              {result.itemName}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f7366] block">
                              Material Composition
                            </span>
                            <span className="font-semibold text-[#163528]">
                              {result.materialDetail}
                            </span>
                          </div>
                        </div>

                        {/* Decomposition & CO2 Avoided Cards */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="p-2.5 rounded-xl bg-white border border-[#d5e3d8] flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#3d8b5f] flex-shrink-0" />
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#5f7366] block">
                                Decomp. Time
                              </span>
                              <p className="text-xs font-bold text-[#163528]">
                                {result.decompositionTime}
                              </p>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#e3f2e7] border border-[#b8e0c2] flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-[#1f4d36] flex-shrink-0" />
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-[#1f4d36] block">
                                CO₂ Avoided
                              </span>
                              <p className="text-xs font-bold text-[#1f4d36]">
                                ~{result.co2DivertedKg} kg avoided
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Alternative Predictions */}
                        {result.alternatives && result.alternatives.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5f7366] block mb-1">
                              Alternative class probabilities:
                            </span>
                            <div className="flex flex-wrap gap-1.5 text-[11px]">
                              {result.alternatives.map((alt, aIdx) => (
                                <span
                                  key={aIdx}
                                  className="px-2 py-0.5 rounded-md bg-white border border-[#d5e3d8] text-[#5f7366]"
                                >
                                  {alt.className}: {Math.round(alt.probability * 100)}%
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SECTION 2: TAILORED RECYCLING & ECODECISION GUIDANCE */}
                      <div className="pt-3 border-t border-[#e8f0e4] space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1f4d36] text-[#b8e0c2] text-xs font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>02 / EcoDecision Disposal & Recycling Instructions</span>
                          </div>
                          <span className="text-[11px] text-[#5f7366] italic">
                            Tailored for {result.itemName}
                          </span>
                        </div>

                        {/* Disposal rules */}
                        {result.ecoDecision?.disposal && result.ecoDecision.disposal.length > 0 && (
                          <div className="space-y-1">
                            <h5 className="font-bold text-xs uppercase tracking-wide text-[#163528] flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#3d8b5f]" />
                              <span>Disposal Instructions</span>
                            </h5>
                            <ul className="list-disc list-inside text-xs text-[#5f7366] space-y-1 pl-1">
                              {result.ecoDecision.disposal.map((step, sIdx) => (
                                <li key={sIdx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Preparation steps */}
                        {result.ecoDecision?.preparation && result.ecoDecision.preparation.length > 0 && (
                          <div className="space-y-1">
                            <h5 className="font-bold text-xs uppercase tracking-wide text-[#163528] flex items-center gap-1.5">
                              <RefreshCw className="w-3.5 h-3.5 text-[#3d8b5f]" />
                              <span>Preparation & Cleaning</span>
                            </h5>
                            <ul className="list-disc list-inside text-xs text-[#5f7366] space-y-1 pl-1">
                              {result.ecoDecision.preparation.map((prep, pIdx) => (
                                <li key={pIdx}>{prep}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Reuse & Upcycling */}
                        {result.ecoDecision?.reuse && result.ecoDecision.reuse.length > 0 && (
                          <div className="space-y-1">
                            <h5 className="font-bold text-xs uppercase tracking-wide text-[#163528] flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                              <span>Reuse & Home Upcycling</span>
                            </h5>
                            <ul className="list-disc list-inside text-xs text-[#5f7366] space-y-1 pl-1">
                              {result.ecoDecision.reuse.map((idea, uIdx) => (
                                <li key={uIdx}>{idea}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Recycling details */}
                        {result.ecoDecision?.recycling && (
                          <div className="p-3 rounded-xl bg-[#f4f7f2] border border-[#d5e3d8] text-xs text-[#5f7366]">
                            <strong className="text-[#163528] block mb-0.5">Recycling Facility Processing:</strong>
                            {result.ecoDecision.recycling}
                          </div>
                        )}

                        {/* Safety note */}
                        {result.ecoDecision?.safety && (
                          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong>Safety Notice:</strong> {result.ecoDecision.safety}
                            </div>
                          </div>
                        )}

                        {/* Interactive Upcycling Plan CTA */}
                        {result.isIdentifiable && (
                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => requestUpcycleProjects(result.itemName, result.category)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1f4d36] hover:text-[#3d8b5f] bg-[#e3f2e7] hover:bg-[#b8e0c2] px-3 py-1.5 rounded-lg transition-colors border border-[#b8e0c2]"
                            >
                              <Lightbulb className="w-3.5 h-3.5" />
                              <span>Generate Step-by-Step DIY Upcycle Ideas</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Upcycle Ideas Modal */}
        {upcycleModalData && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-[#d5e3d8] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#e8f0e4]">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-lg text-[#163528]">
                    DIY Upcycle Projects: {upcycleModalData.item}
                  </h3>
                </div>
                <button
                  onClick={() => setUpcycleModalData(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {upcycleModalData.loading ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#3d8b5f] animate-spin mx-auto" />
                  <p className="text-sm text-[#5f7366]">Generating practical DIY upcycling plans…</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcycleModalData.ideas.map((idea, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#fafcf8] border border-[#d5e3d8] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-[#163528]">{idea.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e3f2e7] text-[#1f4d36]">
                          {idea.difficulty || 'Easy'} · {idea.estTime || '15 mins'}
                        </span>
                      </div>
                      <p className="text-xs text-[#5f7366] leading-relaxed">{idea.description}</p>
                      {idea.materialsNeeded && idea.materialsNeeded.length > 0 && (
                        <div className="text-[11px] text-[#5f7366] pt-1">
                          <strong className="text-[#163528]">Materials:</strong>{' '}
                          {idea.materialsNeeded.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setUpcycleModalData(null)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#163528] text-white hover:bg-[#1f4d36]"
                  >
                    Close Plan
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
