import { GoogleGenAI, Type } from "@google/genai";
import { BulletPointsResponse } from "../types";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResumeBullets = async (
  jobDescription: string,
  resumeText: string
): Promise<BulletPointsResponse> => {
  try {
    const modelId = "gemini-2.5-flash";

    const prompt = `
      You are a professional resume writer optimizing resumes for recruiters and ATS systems.

      Task:
      Rewrite the provided resume content to be more professional, concise, and impactful without adding false experience or exaggeration.

      Guidelines:
      - Convert generic skill statements into action-oriented bullet points
      - Prefer specific tasks and responsibilities over vague traits
      - Avoid filler phrases (e.g., “utilized strong skills”, “demonstrated ability”)
      - Start each bullet with a clear action verb
      - Maintain honesty; do not invent metrics or achievements
      - Keep language ATS-friendly and recruiter-readable

      Tone:
      Professional, confident, and clear — not inflated or overly verbose.

      Input includes:
      
      Job Description:
      ${jobDescription}

      Candidate Resume Text:
      ${resumeText}

      Output format:
      - 3–6 concise resume bullet points
      - Each bullet should reflect relevance to the job description
      - Do not include explanations. Output only the optimized resume bullets.

      TECHNICAL INSTRUCTION:
      Return the response strictly as a JSON object containing an array of strings named "bullets".
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bullets: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },
          required: ["bullets"],
        },
      },
    });

    const outputText = response.text;
    
    if (!outputText) {
      throw new Error("Gemini returned an empty response.");
    }

    // Parse the JSON output
    const parsedData = JSON.parse(outputText);

    // Validate that we received the expected structure
    if (!parsedData.bullets || !Array.isArray(parsedData.bullets)) {
        throw new Error("Invalid response format received from AI.");
    }

    return {
      bullets: parsedData.bullets,
      error: null,
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return {
      bullets: [],
      error: "Failed to generate tailored bullets. Please try again later.",
    };
  }
};