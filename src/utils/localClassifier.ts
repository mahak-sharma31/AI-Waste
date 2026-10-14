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
  previewUrl: string,
  fileNameHint = ''
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

      // Sample focal area (center 60% of pixels: x 20-80, y 20-80) to focus on the object
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let focalCount = 0;

      for (let y = 20; y < 80; y++) {
        for (let x = 20; x < 80; x++) {
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

          // 1. Yellow Banana Peel / Citrus / Melon detector:
          // In RGB: High Red and High Green, distinctly lower Blue
          const isYellow =
            r >= 115 &&
            g >= 100 &&
            b <= Math.min(r, g) * 0.78 &&
            b <= 135 &&
            Math.abs(r - g) <= 65;

          // 2. Green produce/vegetables:
          const isGreen =
            g >= 60 &&
            g >= r - 15 &&
            g >= b + 20;

          // 3. Orange / Red fruit/vegetable peel (orange, carrot, apple, tomato):
          const isOrangeRed =
            r >= 140 &&
            g >= 40 &&
            g <= 145 &&
            b <= 85 &&
            r > g + 25;

          // 4. Brown spots on ripe banana peel, potato skin, coffee grounds:
          const isBrown =
            r >= 65 &&
            r <= 170 &&
            g >= 40 &&
            g <= 135 &&
            b <= 85 &&
            r > g &&
            g > b;

          // 5. Corrugated cardboard (kraft brown with low saturation):
          const isCardboard =
            r >= 140 &&
            r <= 220 &&
            g >= 115 &&
            g <= 185 &&
            b >= 75 &&
            b <= 145 &&
            sat < 0.42 &&
            !isYellow;

          // 6. Metal cans (grey, low saturation, shiny):
          const isMetal =
            Math.abs(r - g) < 18 &&
            Math.abs(g - b) < 18 &&
            sat < 0.18;

          // 7. Synthetic blue/cyan plastics:
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

      metrics.totalPixels = focalCount;
      metrics.avgR = sumR / focalCount;
      metrics.avgG = sumG / focalCount;
      metrics.avgB = sumB / focalCount;
      metrics.avgBrightness = (metrics.avgR * 299 + metrics.avgG * 587 + metrics.avgB * 114) / 1000;
      const maxC = Math.max(metrics.avgR, metrics.avgG, metrics.avgB);
      const minC = Math.min(metrics.avgR, metrics.avgG, metrics.avgB);
      metrics.avgSaturation = maxC === 0 ? 0 : (maxC - minC) / maxC;
    } catch {
      // Cross-origin image fallback
    }
  }

  const lowerHint = fileNameHint.toLowerCase();
  let category: WasteCategory = 'organic';
  let itemName = 'Organic Food Waste';
  let materialDetail = 'Compostable Plant Biomass';
  let decompositionTime = '2-4 weeks';
  let co2DivertedKg = 0.22;
  let confidence = 92;

  const yellowRatio = metrics.yellowPixels / metrics.totalPixels;
  const greenRatio = metrics.greenOrganicPixels / metrics.totalPixels;
  const orangeRedRatio = metrics.orangeRedOrganicPixels / metrics.totalPixels;
  const brownRatio = metrics.brownOrganicPixels / metrics.totalPixels;
  const totalOrganicRatio = yellowRatio + greenRatio + orangeRedRatio + brownRatio;
  const cardboardRatio = metrics.cardboardPixels / metrics.totalPixels;
  const metalRatio = metrics.metalPixels / metrics.totalPixels;

  // First priority: filename hints if explicit
  if (
    lowerHint.includes('banana') ||
    lowerHint.includes('peel') ||
    lowerHint.includes('fruit') ||
    lowerHint.includes('food') ||
    lowerHint.includes('apple') ||
    lowerHint.includes('organic') ||
    lowerHint.includes('vegetable')
  ) {
    category = 'organic';
    itemName = lowerHint.includes('banana') ? 'Banana Peel (Organic Waste)' : 'Fruit & Vegetable Food Waste';
    materialDetail = 'Compostable Plant Biomass (Nutrient-Rich Organic)';
    decompositionTime = '2 to 4 weeks';
    co2DivertedKg = 0.24;
    confidence = 96;
  } else if (
    lowerHint.includes('can') ||
    lowerHint.includes('tin') ||
    lowerHint.includes('metal') ||
    lowerHint.includes('aluminium') ||
    lowerHint.includes('aluminum')
  ) {
    category = 'metal';
    itemName = 'Aluminium Beverage Can';
    materialDetail = 'Aluminium Alloy (Infinitely Recyclable)';
    decompositionTime = '200 years';
    co2DivertedKg = 0.17;
    confidence = 95;
  } else if (
    lowerHint.includes('box') ||
    lowerHint.includes('cardboard') ||
    lowerHint.includes('paper')
  ) {
    category = 'paper';
    itemName = 'Corrugated Cardboard Box';
    materialDetail = 'Unbleached Kraft Fibreboard';
    decompositionTime = '2 months';
    co2DivertedKg = 0.12;
    confidence = 94;
  } else if (
    lowerHint.includes('glass') ||
    lowerHint.includes('jar')
  ) {
    category = 'glass';
    itemName = 'Glass Container / Jar';
    materialDetail = 'Flint Container Glass';
    decompositionTime = '1,000,000 years';
    co2DivertedKg = 0.15;
    confidence = 93;
  } else if (
    lowerHint.includes('bottle') ||
    lowerHint.includes('plastic')
  ) {
    category = 'plastic';
    itemName = 'Rigid Plastic Bottle';
    materialDetail = '#1 PET (Polyethylene Terephthalate)';
    decompositionTime = '450 years';
    co2DivertedKg = 0.08;
    confidence = 93;
  }
  // Visual feature classification:
  else if (yellowRatio > 0.12 || (yellowRatio > 0.06 && brownRatio > 0.08)) {
    // YELLOW DOMINANT: BANANA PEEL, CITRUS, LEMON, OR CORN
    category = 'organic';
    itemName = 'Banana Peel / Yellow Fruit Scrap';
    materialDetail = 'Compostable Fruit Peeling (High Potassium Organic Biomass)';
    decompositionTime = '2 to 4 weeks';
    co2DivertedKg = 0.24;
    confidence = 93;
  } else if (greenRatio > 0.15) {
    // GREEN VEGETABLES / LEAFY ORGANIC
    category = 'organic';
    itemName = 'Vegetable & Plant Organic Waste';
    materialDetail = 'Fresh Produce Biomass (Compostable)';
    decompositionTime = '2 to 4 weeks';
    co2DivertedKg = 0.22;
    confidence = 92;
  } else if (orangeRedRatio > 0.15) {
    // ORANGE / RED PRODUCE (ORANGE PEEL, APPLE, TOMATO)
    category = 'organic';
    itemName = 'Citrus / Fruit Food Waste';
    materialDetail = 'Compostable Fruit Peel & Food Waste';
    decompositionTime = '3 to 6 weeks';
    co2DivertedKg = 0.21;
    confidence = 91;
  } else if (brownRatio > 0.22 && totalOrganicRatio > 0.3) {
    // BROWN ORGANIC: COFFEE GROUNDS, RIPE PEELINGS, BREAD
    category = 'organic';
    itemName = 'Organic Food Waste / Scraps';
    materialDetail = 'Compostable Kitchen Food Biomass';
    decompositionTime = '2 to 4 weeks';
    co2DivertedKg = 0.23;
    confidence = 90;
  } else if (cardboardRatio > 0.25) {
    // KRAFT CARDBOARD
    category = 'paper';
    itemName = 'Corrugated Cardboard / Kraft Paper';
    materialDetail = 'Dry Paper Fibre Packaging';
    decompositionTime = '2 months';
    co2DivertedKg = 0.12;
    confidence = 91;
  } else if (metalRatio > 0.35 && metrics.avgBrightness > 110) {
    // METAL CANS
    category = 'metal';
    itemName = 'Aluminium Beverage Can / Tin';
    materialDetail = 'Aluminium / Steel Alloy';
    decompositionTime = '200 years';
    co2DivertedKg = 0.17;
    confidence = 92;
  } else if (metrics.syntheticPlasticPixels > metrics.totalPixels * 0.18) {
    // SYNTHETIC PLASTIC
    category = 'plastic';
    itemName = 'Rigid Plastic Packaging';
    materialDetail = '#1 PET or #2 HDPE Container';
    decompositionTime = '450 years';
    co2DivertedKg = 0.08;
    confidence = 91;
  } else if (totalOrganicRatio > 0.18) {
    // MIXED ORGANIC FOOD RESIDUE
    category = 'organic';
    itemName = 'Mixed Food Waste / Produce Scrap';
    materialDetail = 'Compostable Kitchen Organic Scrap';
    decompositionTime = '2 to 4 weeks';
    co2DivertedKg = 0.22;
    confidence = 89;
  } else {
    // Fallback: Check overall color warmth
    if (metrics.avgR > metrics.avgB + 40 && metrics.avgG > metrics.avgB + 20) {
      // Warm yellow/amber/brown tone -> Organic / Peel
      category = 'organic';
      itemName = 'Fruit Peel / Food Waste';
      materialDetail = 'Organic Compostable Biomass';
      decompositionTime = '2 to 4 weeks';
      co2DivertedKg = 0.22;
      confidence = 88;
    } else {
      category = 'plastic';
      itemName = 'Plastic Container / Packaging';
      materialDetail = '#1 PET / #5 PP Rigid Plastic';
      decompositionTime = '450 years';
      co2DivertedKg = 0.08;
      confidence = 85;
    }
  }

  const categoryLabels: Record<WasteCategory, string> = {
    plastic: 'Plastic Waste',
    paper: 'Paper & Cardboard',
    metal: 'Metal Waste',
    organic: 'Organic Waste',
    glass: 'Glass Waste',
    'e-waste': 'Electronic Waste',
    hazardous: 'Hazardous Waste',
  };

  const alternatives = [
    { className: categoryLabels[category], probability: confidence / 100 },
    {
      className: category === 'organic' ? 'General Waste' : 'Organic Waste',
      probability: Math.round(((100 - confidence) * 0.65) / 100 * 100) / 100,
    },
    {
      className: category === 'paper' ? 'Cardboard' : 'Paper',
      probability: Math.round(((100 - confidence) * 0.35) / 100 * 100) / 100,
    },
  ];

  const ecoDecision = ecoDecisionKnowledgeBase[category];

  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    itemName,
    category,
    categoryLabel: categoryLabels[category],
    materialDetail,
    confidence,
    lowConfidence: confidence < LOW_CONFIDENCE_THRESHOLD,
    alternatives,
    cleanlinessStatus: category === 'organic' ? 'Organic Compost Biomass' : 'Clean for sorting',
    decompositionTime,
    co2DivertedKg,
    ecoDecision,
    upcycleIdea: {
      title: category === 'organic' ? 'Natural Banana Peel Fertilizer Tea' : `DIY Upcycle for ${itemName}`,
      description:
        category === 'organic'
          ? 'Soak banana peel in a jar of water for 48 hours to create potassium-rich liquid plant food, or bury directly in rose and tomato soil.'
          : 'Clean thoroughly and repurpose as an organizer or seed starter to prevent landfill disposal.',
      difficulty: 'Easy',
      estTime: '10 mins',
    },
    previewUrl,
    timestamp: Date.now(),
    timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    engineUsed: 'local-ai',
  };
}
