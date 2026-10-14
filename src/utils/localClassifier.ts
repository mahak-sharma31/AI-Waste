import { AnalysisResult, WasteCategory } from '../types';
import { ecoDecisionKnowledgeBase, LOW_CONFIDENCE_THRESHOLD } from '../data/knowledgeBase';

interface PixelMetrics {
  totalPixels: number;
  yellowPixels: number;
  greenOrganicPixels: number;
  orangeRedOrganicPixels: number;
  brownOrganicPixels: number;
  cardboardPixels: number;
  metalPixels: number;
  syntheticPlasticPixels: number;
  avgR: number;
  avgG: number;
  avgB: number;
  avgBrightness: number;
  avgSaturation: number;
}

export async function analyzeImageLocally(
  imageElement: HTMLImageElement,
  previewUrl: string
): Promise<AnalysisResult> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 100;
  canvas.height = 100;

  let metrics: PixelMetrics = {
    totalPixels: 3600,
    yellowPixels: 0,
    greenOrganicPixels: 0,
    orangeRedOrganicPixels: 0,
    brownOrganicPixels: 0,
    cardboardPixels: 0,
    metalPixels: 0,
    syntheticPlasticPixels: 0,
    avgR: 128,
    avgG: 128,
    avgB: 128,
    avgBrightness: 128,
    avgSaturation: 0.2,
  };

  if (ctx) {
    try {
      ctx.drawImage(imageElement, 0, 0, 100, 100);
      const imgData = ctx.getImageData(0, 0, 100, 100).data;

      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let focalCount = 0;

      for (let y = 15; y < 85; y++) {
        for (let x = 15; x < 85; x++) {
          const idx = (y * 100 + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];

          sumR += r;
          sumG += g;
          sumB += b;
          focalCount++;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const sat = max === 0 ? 0 : (max - min) / max;

          // 1. Yellow Organic (Banana Peel / Citrus):
          const isYellow =
            r >= 115 &&
            g >= 100 &&
            b <= Math.min(r, g) * 0.78 &&
            b <= 135 &&
            Math.abs(r - g) <= 65;

          // 2. Green Organic (Produce, Vegetables, Leaves):
          const isGreen =
            g >= 60 &&
            g >= r - 15 &&
            g >= b + 20;

          // 3. Orange / Red Organic (Carrot, Tomato, Fruit Peel):
          const isOrangeRed =
            r >= 140 &&
            g >= 40 &&
            g <= 145 &&
            b <= 85 &&
            r > g + 25;

          // 4. Brown spots (Ripe banana freckles, compost, coffee):
          const isBrown =
            r >= 65 &&
            r <= 170 &&
            g >= 40 &&
            g <= 135 &&
            b <= 85 &&
            r > g &&
            g > b;

          // 5. Corrugated Kraft Cardboard:
          const isCardboard =
            r >= 140 &&
            r <= 220 &&
            g >= 115 &&
            g <= 185 &&
            b >= 75 &&
            b <= 145 &&
            sat < 0.42 &&
            !isYellow;

          // 6. Metal Cans / Foil:
          const isMetal =
            Math.abs(r - g) < 18 &&
            Math.abs(g - b) < 18 &&
            sat < 0.18;

          // 7. Synthetic Blue/Cyan Plastic:
          const isSynthetic =
            b > r + 35 || (b > 135 && g > 135 && r < 100);

          if (isYellow) metrics.yellowPixels++;
          else if (isGreen) metrics.greenOrganicPixels++;
          else if (isOrangeRed) metrics.orangeRedOrganicPixels++;
          else if (isBrown) metrics.brownOrganicPixels++;
          else if (isCardboard) metrics.cardboardPixels++;
          else if (isMetal) metrics.metalPixels++;
          else if (isSynthetic) metrics.syntheticPlasticPixels++;
        }
      }

      metrics.totalPixels = Math.max(1, focalCount);
      metrics.avgR = sumR / focalCount;
      metrics.avgG = sumG / focalCount;
      metrics.avgB = sumB / focalCount;
      metrics.avgBrightness = (metrics.avgR * 299 + metrics.avgG * 587 + metrics.avgB * 114) / 1000;
      const maxC = Math.max(metrics.avgR, metrics.avgG, metrics.avgB);
      const minC = Math.min(metrics.avgR, metrics.avgG, metrics.avgB);
      metrics.avgSaturation = maxC === 0 ? 0 : (maxC - minC) / maxC;
    } catch {
      // Cross-origin fallback
    }
  }

  const yellowRatio = metrics.yellowPixels / metrics.totalPixels;
  const greenRatio = metrics.greenOrganicPixels / metrics.totalPixels;
  const orangeRedRatio = metrics.orangeRedOrganicPixels / metrics.totalPixels;
  const brownRatio = metrics.brownOrganicPixels / metrics.totalPixels;
  const totalOrganicRatio = yellowRatio + greenRatio + orangeRedRatio + brownRatio;
  const cardboardRatio = metrics.cardboardPixels / metrics.totalPixels;
  const metalRatio = metrics.metalPixels / metrics.totalPixels;

  let isIdentifiable = true;
  let unclearReason = '';
  let category: WasteCategory = 'unknown';
  let itemName = 'Unidentified Item';
  let materialDetail = 'Material could not be confirmed reliably';
  let decompositionTime = 'Variable';
  let co2DivertedKg = 0.05;
  let confidence = 50;

  if (yellowRatio > 0.10 || (yellowRatio > 0.05 && brownRatio > 0.06)) {
    // Yellow Banana Peel or Citrus Fruit Scrap
    category = 'organic';
    itemName = 'Banana Peel / Yellow Fruit Biomass';
    materialDetail = 'Compostable Fruit Peel (Biodegradable Organic Biomass)';
    decompositionTime = '2 to 4 weeks';
    co2DivertedKg = 0.24;
    confidence = 88;
  } else if (greenRatio > 0.12) {
    category = 'organic';
    itemName = 'Vegetable & Plant Organic Scrap';
    materialDetail = 'Fresh Produce Biomass (Compostable)';
    decompositionTime = '2 to 4 weeks';
    co2DivertedKg = 0.22;
    confidence = 86;
  } else if (orangeRedRatio > 0.12) {
    category = 'organic';
    itemName = 'Fruit Peel / Food Waste';
    materialDetail = 'Compostable Produce Biomass';
    decompositionTime = '3 to 6 weeks';
    co2DivertedKg = 0.21;
    confidence = 85;
  } else if (cardboardRatio > 0.22) {
    category = 'paper';
    itemName = 'Corrugated Cardboard / Kraft Paper';
    materialDetail = 'Dry Cellulose Fibreboard';
    decompositionTime = '2 months';
    co2DivertedKg = 0.12;
    confidence = 86;
  } else if (metalRatio > 0.35 && metrics.avgBrightness > 100) {
    category = 'metal';
    itemName = 'Aluminium Beverage Can / Metal Tin';
    materialDetail = 'Aluminium / Steel Metal Alloy';
    decompositionTime = '200 years';
    co2DivertedKg = 0.17;
    confidence = 84;
  } else if (metrics.syntheticPlasticPixels > metrics.totalPixels * 0.16) {
    category = 'plastic';
    itemName = 'Rigid Plastic Packaging';
    materialDetail = '#1 PET or #2 HDPE Rigid Plastic';
    decompositionTime = '450 years';
    co2DivertedKg = 0.08;
    confidence = 82;
  } else if (totalOrganicRatio > 0.15) {
    category = 'organic';
    itemName = 'Mixed Food Scrap / Organic Matter';
    materialDetail = 'Compostable Kitchen Food Waste';
    decompositionTime = '2 to 4 weeks';
    co2DivertedKg = 0.22;
    confidence = 80;
  } else {
    // Do NOT invent a fake plastic classification when features are unclear
    isIdentifiable = false;
    category = 'unknown';
    itemName = 'Unidentified Waste Object';
    unclearReason =
      'Visual features could not reliably identify this item offline. Please check your internet connection to use the full Gemini AI vision analysis, or ensure good lighting and clear framing.';
    materialDetail = 'Unidentified Composition';
    decompositionTime = 'Unknown';
    co2DivertedKg = 0;
    confidence = 35;
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

  const alternatives = isIdentifiable
    ? [
        { className: categoryLabels[category], probability: confidence / 100 },
        {
          className: category === 'organic' ? 'General Food Scrap' : 'Organic Matter',
          probability: Math.round(((100 - confidence) * 0.65) / 100 * 100) / 100,
        },
      ]
    : [];

  const ecoDecision = ecoDecisionKnowledgeBase[category] || ecoDecisionKnowledgeBase.unknown;

  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    isIdentifiable,
    unclearReason,
    itemName,
    category,
    categoryLabel: categoryLabels[category],
    materialDetail,
    confidence,
    lowConfidence: confidence < LOW_CONFIDENCE_THRESHOLD,
    alternatives,
    cleanlinessStatus: isIdentifiable
      ? category === 'organic'
        ? 'Organic Compost Biomass'
        : 'Clean for sorting'
      : 'Unclear',
    decompositionTime,
    co2DivertedKg,
    ecoDecision,
    upcycleIdea: isIdentifiable
      ? {
          title:
            category === 'organic'
              ? 'Natural Banana Peel Fertilizer Tea'
              : `Upcycling Idea for ${itemName}`,
          description:
            category === 'organic'
              ? 'Soak fruit peels in water for 48 hours to make potassium-rich garden fertilizer, or bury directly in compost.'
              : 'Clean and repurpose as an organizer or planter to divert from landfill.',
          difficulty: 'Easy',
          estTime: '10 mins',
        }
      : undefined,
    previewUrl,
    timestamp: Date.now(),
    timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    engineUsed: 'local-ai',
  };
}
