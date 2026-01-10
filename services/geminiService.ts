import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { BulletPointsResponse } from "../types";

// Initialize the stable client
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

export const generateResumeBullets = async (
  jobDescription: string,
  resumeText: string
): Promise<BulletPointsResponse> => {
  try {
    // Use the stable Flash model which is widely available and performant
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            bullets: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
              description: "A list of 5-7 tailored resume bullet points.",
            },
            error: {
              type: SchemaType.STRING,
              description: "Error message if there is insufficient information. Set to null if successful.",
              nullable: true,
            },
          },
          required: ["bullets"],
        },
        temperature: 0.7,
      },
    });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    
    if (!jsonText) {
      throw new Error("No response received from AI.");
    }

    const parsedResult = JSON.parse(jsonText) as BulletPointsResponse;
    
    // Fallback if the model returns bullets but also an error message (prioritize error if bullets are empty)
    if (parsedResult.error && parsedResult.bullets.length === 0) {
      return { bullets: [], error: parsedResult.error };
    }

    // Ensure we have bullets if no error
    if (!parsedResult.error && (!parsedResult.bullets || parsedResult.bullets.length === 0)) {
        return { bullets: [], error: "Insufficient information to generate tailored bullets." };
    }

    return parsedResult;

  } catch (error) {
    console.error("Error generating bullets:", error);
    throw new Error("Failed to generate resume bullets. Please try again.");
  }
};