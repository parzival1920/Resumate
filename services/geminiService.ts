import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BulletPointsResponse } from "../types";

// Initialize the client strictly according to guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    bullets: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 5-7 tailored resume bullet points.",
    },
    error: {
      type: Type.STRING,
      description: "Error message if there is insufficient information. Set to null if successful.",
      nullable: true,
    },
  },
  required: ["bullets"],
};

export const generateResumeBullets = async (
  jobDescription: string,
  resumeText: string
): Promise<BulletPointsResponse> => {
  try {
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      Act as a resume optimization assistant for students and early-career applicants.
      
      Task: Generate 5-7 concise, role-specific resume bullet points tailored to the job description based strictly on the provided resume text.
      
      Job Description:
      """
      ${jobDescription}
      """
      
      Resume Text:
      """
      ${resumeText}
      """
      
      Rules:
      1. Start each bullet with a strong action verb and use past tense.
      2. Only use information present in the resume. Do NOT invent experience, tools, seniority, or metrics.
      3. Incorporate relevant keywords from the job description naturally without copying it verbatim.
      4. Keep bullets professional, concise, and ATS-friendly.
      5. If there is insufficient information in the resume to match the job description, return an empty bullets array and set the 'error' field to "Insufficient information to generate tailored bullets."
      
      Output:
      Return a JSON object with a 'bullets' array and an optional 'error' string.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Balanced creativity and adherence
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No response received from AI.");
    }

    const result = JSON.parse(jsonText) as BulletPointsResponse;
    
    // Fallback if the model returns bullets but also an error message (prioritize error if bullets are empty)
    if (result.error && result.bullets.length === 0) {
      return { bullets: [], error: result.error };
    }

    // Ensure we have bullets if no error
    if (!result.error && (!result.bullets || result.bullets.length === 0)) {
        return { bullets: [], error: "Insufficient information to generate tailored bullets." };
    }

    return result;

  } catch (error) {
    console.error("Error generating bullets:", error);
    throw new Error("Failed to generate resume bullets. Please try again.");
  }
};