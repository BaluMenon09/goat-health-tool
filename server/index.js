import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env file");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Goat Health Backend is running");
});

app.post("/api/check-goat-health", async (req, res) => {
  try {
    const { symptoms = [], ageGroup = "adult", notes = "" } = req.body;

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        error: "Please send at least one symptom.",
      });
    }

    const prompt = `
You are a goat health field screening assistant.

Rules:
- This is only for early screening, not final diagnosis.
- Do not prescribe exact medicines or dosages.
- Use clear and simple language.
- If symptoms suggest danger, clearly recommend urgent veterinary help.
- Return ONLY a single valid JSON object.
- Do not include markdown, code fences, headings, or explanations outside the JSON.
- Keep next_steps practical for field use.

Input:
Symptoms: ${symptoms.join(", ")}
Age group: ${ageGroup}
Additional notes: ${notes}

Return JSON exactly in this format:
{
  "likely_condition": "string",
  "risk_level": "Low | Medium | High",
  "summary": "string",
  "next_steps": ["step 1", "step 2", "step 3"],
  "urgent_signs": ["sign 1", "sign 2"],
  "vet_help_needed": true
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text.trim();

    let parsed;
    try {
      let cleaned = text;

      cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "").trim();

      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");

      if (start === -1 || end === -1) {
        throw new Error("No JSON object found in response");
      }

      cleaned = cleaned.slice(start, end + 1);

      parsed = JSON.parse(cleaned);
    } catch (err) {
      return res.status(500).json({
        error: "Gemini returned invalid JSON.",
        raw: text,
        details: err.message,
      });
    }

    res.json(parsed);
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({
      error: "Failed to get response from Gemini.",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
