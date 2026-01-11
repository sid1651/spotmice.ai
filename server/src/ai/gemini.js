import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extractJson(text) {
  return JSON.parse(
    text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()
  );
}

export async function generateHarmony(noteSummary) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      maxOutputTokens: 3000,   // ✅ YOUR REQUIREMENT
      temperature: 0.7,
      topP: 0.9
    }
  });

  const prompt = `
You are a professional music theory assistant.

Input notes (grid-based piano roll):
${JSON.stringify(noteSummary, null, 1)}

TASK:
- For EACH input note, generate EXACTLY ONE harmony note
- Use consonant intervals: 3rd (3 or 4), 5th (7), or 6th (9)
- Do NOT skip notes
- Do NOT summarize
- Do NOT reduce output

STRICT REQUIREMENTS:
- Output harmonies.length MUST equal input notes length
- Generate at least ${noteSummary.length} harmony objects

OUTPUT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations
- No trailing text

FORMAT:
{
  "harmonies": [
    {
      "baseNoteId": "string",
      "interval": number,
      "yOffset": number,
      "timeOffset": number
    }
  ]
}
`;


  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  console.log("✅ Gemini output:", raw);

  try {
    return extractJson(raw);
  } catch (err) {
    console.error("❌ Gemini output:", raw);
    throw err;
  }
}
