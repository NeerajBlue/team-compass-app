// src/api/gemini.js
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateActionPlan(data, quadrant, strategy) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file or Cloudflare settings.");
  }

  const prompt = `You are a Senior OD Consultant at Blue Wisdom.
Create a hyper-personalized, extremely detailed 8-10 page structured Action Plan for an employee based on the Blue Wisdom Performance Matrix methodology.
We are modeling this after elite psychometric reports (like Thomas Profiling). DO NOT use plain write-ups or long paragraphs.
EVERYTHING must be highly visual, using bullet points, short punchy sentences, and relevant emojis/icons.

Context:
- Employee Name: ${data.name}
- Role & Department: ${data.role} in ${data.department}
- Overall Performance Trend: ${data.overallPerformance}
- Performance Quadrant: ${quadrant}
- Core Strategy to apply: ${strategy} (Must use this exact strategy logic: Delegate, Excite, Guide, or Direct).

Current Key Result Areas (KRAs):
1. ${data.kra1 || "Not specified"}
2. ${data.kra2 || "Not specified"}
3. ${data.kra3 || "Not specified"}

Granular Ability (Competence) Scores (1-5 scale):
- Job-Specific Expertise: ${data.ability.jobExpertise}/5
- Problem-Solving & Strategic Thinking: ${data.ability.problemSolving}/5
- Quality of Work: ${data.ability.qualityOfWork}/5
- Collaboration: ${data.ability.collaboration}/5
- Adaptability: ${data.ability.adaptability}/5
- Planning & Execution: ${data.ability.planning}/5

Granular Willingness (Commitment) Scores (1-5 scale):
- Proactiveness & Initiative: ${data.willingness.proactiveness}/5
- Commitment & Accountability: ${data.willingness.commitment}/5
- Positive Attitude: ${data.willingness.positiveAttitude}/5
- Openness to Feedback: ${data.willingness.opennessToFeedback}/5
- Engagement & Team Contribution: ${data.willingness.engagement}/5
- Drive for Continuous Improvement: ${data.willingness.continuousImprovement}/5

Manager Remarks: 
"${data.remarks || "No specific remarks provided."}"

Instructions:
You MUST return a valid JSON object. Write extensive, high-value content so it fills a comprehensive corporate report. Use a direct, punchy, and confident Blue Wisdom tone.
Use appropriate emojis (like 🎯, 🚀, 💡, ⚠️, 📊) at the start of bullet points to make it visually engaging.

{
  "executiveSummary": {
    "overview": "1-2 punchy sentences summarizing the profile.",
    "keyDrivers": ["Bullet point with emoji...", "Bullet point with emoji..."],
    "criticalRisks": ["Bullet point with emoji...", "Bullet point with emoji..."]
  },
  "quadrantAnalysis": {
    "traits": ["Trait 1...", "Trait 2...", "Trait 3..."],
    "behaviorUnderPressure": "How they likely act when stressed (short sentence)",
    "motivationStyle": "What drives them (short sentence)",
    "strategyJustification": ["Why we chose the strategy...", "Bullet 2..."]
  },
  "kraPlans": [
    {
      "title": "KRA Title Here",
      "impact": "Short sentence on why this matters.",
      "actionSteps": ["Step 1 with emoji...", "Step 2 with emoji...", "Step 3 with emoji..."],
      "leadIndicator": "Metric to track daily/weekly",
      "lagIndicator": "Metric to track monthly/quarterly"
    }
  ],
  "competencyDevelopment": {
    "superPowers": ["Strength 1 with emoji...", "Strength 2 with emoji..."],
    "blindSpots": ["Blind spot 1 with emoji...", "Blind spot 2 with emoji..."],
    "coachingTactics": ["Tactic 1...", "Tactic 2...", "Tactic 3..."]
  },
  "willingnessAndMindset": {
    "engagementLevel": "Short assessment of their current drive",
    "retentionRisk": "Low/Medium/High with a 1 sentence reason",
    "managerInterventions": ["Intervention 1 with emoji...", "Intervention 2 with emoji..."]
  },
  "managerActionItems": [
    "Week 1 action...",
    "Week 2 action...",
    "Week 3 action..."
  ],
  "recommendedResources": [
    {"type": "📚 Book", "title": "Book Name", "reason": "Why read it"},
    {"type": "🧠 Concept", "title": "Concept Name", "reason": "Why study it"}
  ]
}

DO NOT wrap the JSON in markdown code blocks. Return strictly raw JSON.`;

  const IS_DEV = import.meta.env.DEV;

  if (IS_DEV) {
    // LOCAL DEV: Call Gemini directly so we don't need the Vercel CLI running locally
    const modelsToTry = ['gemini-2.5-flash', 'gemma-4-26b-a4b-it'];
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Failed to generate report from Gemini API.");

        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(text);
      } catch (error) {
        console.warn(`Model ${model} failed, trying next fallback...`, error.message);
        lastError = error;
      }
    }
    throw lastError;
  } else {
    // PRODUCTION: Call the secure Vercel Serverless Function proxy
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to generate report via secure proxy.");
    }

    let text = data.text;
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(text);
  }
}
