// src/api/gemini.js
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateActionPlan(employeeName, quadrant, strategy, remarks) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file or Cloudflare settings.");
  }

  const prompt = `You are a Senior OD Consultant at Blue Wisdom.
Create a hyper-personalized 3-Month Action Plan for an employee based on the Blue Wisdom Performance Matrix methodology.

Context:
- Employee Name: ${employeeName}
- Quadrant: ${quadrant}
- Core Strategy to apply: ${strategy} (Must use this exact strategy logic: Delegate, Excite, Guide, or Direct).
- Manager Remarks: "${remarks}"

Instructions:
1. Write a direct, punchy, and confident evaluation (Blue Wisdom Tone).
2. Propose 3 specific Key Result Areas (KRAs) tailored to the strategy.
3. Include one Lead indicator and one Lag indicator for tracking.
4. Format in clean Markdown without any conversational filler. Keep it actionable and professional.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to generate report from Gemini API.");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
