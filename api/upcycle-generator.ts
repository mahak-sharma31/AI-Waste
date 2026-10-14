import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { item, category } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        fallback: true,
        ideas: [
          {
            title: `Self-Watering Planter from ${item || 'Container'}`,
            description: 'Cut container in half, invert the top with a wick into water in the base. Ideal for kitchen herbs.',
            materialsNeeded: ['Container', 'Cotton string', 'Soil', 'Seeds'],
            difficulty: 'Easy',
            estTime: '15 mins',
          },
          {
            title: `Desk Organizer & Cable Caddy`,
            description: 'Trim to height and wrap in twine or scrap paper for pens, cables, and brushes.',
            materialsNeeded: ['Container', 'Scrap paper or twine', 'Scissors'],
            difficulty: 'Easy',
            estTime: '10 mins',
          },
        ],
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
    return res.status(200).json({ success: true, ideas: parsed });
  } catch (err: any) {
    return res.status(200).json({ fallback: true, error: err.message });
  }
}
