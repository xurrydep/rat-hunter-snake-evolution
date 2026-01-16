
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini SDK using process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getGameCommentary(score: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `In a snake game, the player scored ${score}. Give them a very short, fun, and encouraging message in English (max 10 words).`,
      config: {
        temperature: 0.8,
      }
    });
    // Accessing .text property directly from GenerateContentResponse
    return response.text || "Great game!";
  } catch (error) {
    console.error("AI service error:", error);
    return "Excellent score!";
  }
}
