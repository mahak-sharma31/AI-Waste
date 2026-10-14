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
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        fallback: true,
        reason: 'GEMINI_API_KEY is not configured. Falling back to local visual classifier.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Clean up base64 prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Analyze this image of a waste or recyclable item with high precision for an eco-classification system.
Identify the item, classify it, determine its exact material composition (including resin identification code if plastic), and provide transparent EcoDecision disposal steps.

Return ONLY a valid JSON object matching this schema without any markdown formatting or ticks:
{
  "item_name": "string (e.g. 'Crushed Aluminum Soda Can' or 'Clear PET Water Bottle')",
  "category": "plastic" | "paper" | "metal" | "organic" | "glass" | "e-waste" | "hazardous",
  "category_label": "Plastic" | "Paper" | "Metal" | "Organic" | "Glass" | "E-Waste" | "Hazardous",
  "material_detail": "string (e.g. '#1 PET (Polyethylene Terephthalate)' or 'Corrugated Cardboard')",
  "confidence": number between 1 and 99 representing your model confidence score,
  "alternatives": [
    {"className": "string", "probability": number between 0 and 1}
  ],
  "cleanliness_status": "Clean" | "Needs light rinse" | "Contaminated with grease/food",
  "decomposition_time": "string (e.g. '450 years' or '2-4 weeks')",
  "co2_diverted_kg": number estimated kg of CO2 saved if recycled/composted properly (e.g. 0.09),
  "eco_decision": {
    "title": "string",
    "disposal": ["string", "string"],
    "preparation": ["string", "string"],
    "reuse": ["string", "string"],
    "recycling": "string explaining municipal curbside acceptance and processing",
    "safety": "string (safety instructions, hazards, or chemical notes)"
  },
  "upcycle_idea": {
    "title": "string creative DIY upcycling idea",
    "description": "string 2-sentence guide on how to repurpose this exact item at home",
    "difficulty": "Easy" | "Medium" | "Advanced"
  }
}`;

    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: any = null;
    let responseText = '';
    let usedModel = 'gemini-3.1-flash-lite';

    for (const modelName of modelsToTry) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout on ${modelName}`)), 7000)
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
      throw lastError || new Error('Vision models unavailable');
    }

    try {
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, data: parsed, engine: usedModel });
    } catch {
      // If JSON parsing fails, extract JSON substring
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json({ success: true, data: parsed, engine: usedModel });
      }
      throw new Error('Failed to parse AI model response');
    }
  } catch (error: any) {
    console.warn('Gemini waste analysis encountered error, defaulting to client fallback:', error.message);
    return res.json({
      fallback: true,
      error: error.message
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
