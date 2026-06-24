export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get the API key from Vercel Environment Variables
  const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API Key is missing on the server.' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const modelsToTry = ['gemini-2.5-flash', 'gemma-4-26b-a4b-it'];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to generate report from Gemini API.");
      }

      // Return the raw text string back to the client, the client will parse it
      return res.status(200).json({ 
        text: data.candidates[0].content.parts[0].text 
      });

    } catch (error) {
      console.warn(`Model ${model} failed, trying next fallback...`, error.message);
      lastError = error;
    }
  }

  return res.status(500).json({ error: "All Gemini API models failed.", details: lastError?.message });
}
