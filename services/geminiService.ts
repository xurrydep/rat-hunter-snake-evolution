import { GoogleGenAI } from "@google/genai";

export async function getGameCommentary(score: number): Promise<string> {
  // Initialize right before making an API call as per rules
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `In a snake game, the player scored ${score}. Give them a very short, fun, and encouraging message in English (max 10 words).`,
      config: {
        temperature: 0.8,
      }
    });
    // Accessing .text property directly
    return response.text || "Great game!";
  } catch (error) {
    console.error("AI service error:", error);
    return "Excellent score!";
  }
}