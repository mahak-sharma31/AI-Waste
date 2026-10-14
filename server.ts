import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// AI waste analysis endpoint powered by Gemini Vision
app.post('/api/analyze-waste', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'imageBase64 image data is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: false,
        requiresApiKey: true,
        error: 'GEMINI_API_KEY is not configured in server environment variables. Please add your GEMINI_API_KEY to your environment variables.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `You are an expert AI waste auditor and material identification scientist.
Inspect the provided image carefully and identify the exact object and material composition shown in the pixels.

Evaluation Rules:
1. Object & Material Identification:
   - Identify the EXACT specific object (e.g. "Yellow ripe banana peel with brown speckles", "Clear 500ml PET water bottle with blue cap", "Crushed aluminium beverage soda can", "Brown corrugated cardboard shipping box", "Clear glass jam jar with metal lid").
   - Determine its precise material composition (e.g. "Organic fruit biomass (biodegradable banana peel)", "#1 PET (Polyethylene Terephthalate)", "Aluminium 3004 alloy", "Corrugated unbleached kraft cellulose fibreboard").
   - If the image is blurry, dark, blank, corrupted, or does not clearly depict a recognizable waste item, set "is_identifiable": false and explain clearly in "unclear_reason" (e.g. "The image is too blurry to determine if this is food scrap or plastic packaging. Please take a closer, well-lit photo."). Do NOT invent a fake object or category.
2. Tailored Recycling & Disposal Instructions:
   - Generate custom, specific instructions generated specifically for THIS IDENTIFIED OBJECT and MATERIAL. Do not use generic boilerplate.
   - For banana peel: state that it belongs in municipal food waste (brown/green bin) or home compost, strictly caution against placing in dry recyclables, give specific preparation (remove produce stickers), reuse (compost tea/fertilizer), and environmental impact (preventing anaerobic methane generation).
   - For plastic bottle: mention emptying liquid, light rinsing, cap recycling guidelines, and resin code #1 curbside stream.
   - For aluminium can: note that aluminium is 100% infinitely recyclable, empty liquid, leave uncrushed if optical sorting requires.
   - For cardboard box: flatten to save truck volume, strip plastic packing tape, keep dry.
3. Categorization:
   - Category MUST be one of: "plastic", "paper", "metal", "organic", "glass", "e-waste", "hazardous", or "unknown".

Return ONLY a valid JSON object matching this schema:
{
  "is_identifiable": boolean,
  "unclear_reason": "string (empty if identifiable)",
  "item_name": "string (specific recognized object)",
  "category": "plastic" | "paper" | "metal" | "organic" | "glass" | "e-waste" | "hazardous" | "unknown",
  "category_label": "Plastic" | "Paper & Cardboard" | "Metal" | "Organic" | "Glass" | "E-Waste" | "Hazardous" | "Unidentified",
  "material_detail": "string (precise material detected)",
  "confidence": number between 1 and 99,
  "alternatives": [
    {"className": "string", "probability": number}
  ],
  "cleanliness_status": "string (e.g. 'Clean & Dry', 'Organic Biomass', 'Needs light rinse', 'Contaminated')",
  "decomposition_time": "string (e.g. '2-4 weeks' for banana peel, '450 years' for plastic bottle, '200 years' for can)",
  "co2_diverted_kg": number,
  "eco_decision": {
    "title": "string (specific to this object)",
    "disposal": ["string specific step 1", "string specific step 2"],
    "preparation": ["string specific prep 1", "string specific prep 2"],
    "reuse": ["string specific DIY reuse idea 1", "string specific DIY reuse idea 2"],
    "recycling": "string (specific facility processing explanation for this exact material)",
    "safety": "string (specific safety note)"
  },
  "upcycle_idea": {
    "title": "string (practical DIY upcycling project)",
    "description": "string (specific 2-sentence guide)",
    "difficulty": "Easy" | "Medium" | "Advanced"
  }
}`;

    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let lastError: any = null;
    let responseText = '';
    let usedModel = 'gemini-3.1-flash-lite';

    for (const modelName of modelsToTry) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout on ${modelName}`)), 9000)
        );

        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        });

        const response: any = await Promise.race([generatePromise, timeoutPromise]);
        responseText = response.text || '';
        if (responseText) {
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} attempt failed:`, err.message);
      }
    }

    if (!responseText) {
      throw lastError || new Error('Vision models currently unavailable');
    }

    let parsedData: any = null;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI model response as JSON');
      }
    }

    return res.status(200).json({ success: true, data: parsedData, engine: usedModel });
  } catch (error: any) {
    console.error('Gemini waste analysis error:', error.message);
    return res.status(200).json({
      success: false,
      error: error.message || 'Vision classification failed'
    });
  }
});

// Endpoint for custom DIY Upcycling generator
app.post('/api/upcycle-generator', async (req, res) => {
  try {
    const { item, category } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        fallback: true,
        ideas: [
          {
            title: `Self-Watering Planter from ${item || 'Container'}`,
            description: 'Cut container in half, invert the top with a wick into water in the base. Ideal for kitchen herbs.',
            materialsNeeded: ['Container', 'Cotton string', 'Soil', 'Seeds'],
            difficulty: 'Easy',
            estTime: '15 mins'
          },
          {
            title: `Desk Organizer & Cable Caddy`,
            description: 'Trim to height and wrap in twine or scrap paper for pens, cables, and brushes.',
            materialsNeeded: ['Container', 'Scrap paper or twine', 'Scissors'],
            difficulty: 'Easy',
            estTime: '10 mins'
          }
        ]
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Suggest 3 creative, practical DIY upcycling projects for a discarded "${item || category}".
Return ONLY a valid JSON array of objects:
[
  {
    "title": "string project title",
    "description": "string concise step-by-step description",
    "materialsNeeded": ["string", "string"],
    "difficulty": "Easy" | "Medium" | "Advanced",
    "estTime": "string (e.g. '15 mins')"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ success: true, ideas: parsed });
  } catch (err: any) {
    res.json({ fallback: true, error: err.message });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`EcoVision AI Server running on port ${port} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
