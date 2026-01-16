import { GoogleGenAI } from "@google/genai";

export async function getGameCommentary(score: number): Promise<string> {
  const apiKey = process.env.API_KEY;

  // Ensure the API key exists and is a non-empty string before initializing the SDK
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === "") {
    console.warn("Gemini API key not found or invalid. Skipping AI commentary.");
    return "Great game! Keep hunting those mice!";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `In a snake game, the player scored ${score}. Give them a very short, fun, and encouraging message in English (max 10 words).`,
      config: {
        temperature: 0.8,
      }
    });
    
    // Accessing the .text property directly as per latest SDK guidelines
    return response.text || "Excellent score!";
  } catch (error) {
    console.error("AI service error:", error);
    return "Amazing performance!";
  }
}