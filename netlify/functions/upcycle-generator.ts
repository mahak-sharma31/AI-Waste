import { GoogleGenAI } from '@google/genai';

export const handler = async (event: any) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    let rawBody = event.body || '';
    if (event.isBase64Encoded && typeof rawBody === 'string') {
      rawBody = Buffer.from(rawBody, 'base64').toString('utf8');
    }
    let body: any = {};
    try {
      body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody || {};
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid JSON request payload' }),
      };
    }

    const { item, category } = body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
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
        }),
      };
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
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, ideas: parsed }),
    };
  } catch (err: any) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
