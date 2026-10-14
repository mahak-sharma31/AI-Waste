import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        fallback: true,
        reason: 'GEMINI_API_KEY is not configured. Falling back to local visual classifier.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Analyze this image of a waste or recyclable item with high precision for an eco-classification system.
Identify the exact item (e.g. if it is a banana peel, fruit scrap, vegetable peel, plastic bottle, aluminum can, paper box, etc.), classify it into its true category, and provide transparent EcoDecision disposal steps.

Return ONLY a valid JSON object matching this schema without any markdown formatting or ticks:
{
  "item_name": "string (e.g. 'Fresh Banana Peel' or 'Clear PET Water Bottle')",
  "category": "plastic" | "paper" | "metal" | "organic" | "glass" | "e-waste" | "hazardous",
  "category_label": "Plastic" | "Paper" | "Metal" | "Organic" | "Glass" | "E-Waste" | "Hazardous",
  "material_detail": "string (e.g. 'Compostable Fruit Peel (Rich in Potassium)' or '#1 PET')",
  "confidence": number between 1 and 99 representing your model confidence score,
  "alternatives": [
    {"className": "string", "probability": number between 0 and 1}
  ],
  "cleanliness_status": "Clean" | "Organic Biomass" | "Contaminated with grease/food",
  "decomposition_time": "string (e.g. '2-4 weeks' for banana peel, '450 years' for plastic)",
  "co2_diverted_kg": number estimated kg of CO2 saved if recycled/composted properly,
  "eco_decision": {
    "title": "string",
    "disposal": ["string", "string"],
    "preparation": ["string", "string"],
    "reuse": ["string", "string"],
    "recycling": "string explaining composting or municipal curbside processing",
    "safety": "string"
  },
  "upcycle_idea": {
    "title": "string creative DIY upcycling idea (e.g. Banana Peel Plant Fertilizer Tea)",
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
        console.warn(`Model ${modelName} failed on Vercel:`, err.message);
      }
    }

    if (!responseText) {
      throw lastError || new Error('Vision models unavailable');
    }

    try {
      const parsed = JSON.parse(responseText);
      return res.status(200).json({ success: true, data: parsed, engine: usedModel });
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ success: true, data: parsed, engine: usedModel });
      }
      throw new Error('Failed to parse AI model response');
    }
  } catch (error: any) {
    return res.status(200).json({ fallback: true, error: error.message });
  }
}
