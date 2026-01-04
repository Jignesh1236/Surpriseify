
import { GoogleGenAI } from "@google/genai";
import { Vibe } from "../types";

export const generateAIMessage = async (vibe: Vibe, recipient: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompts = {
    [Vibe.LOVE]: `Act as a world-renowned romantic poet. Write a single-sentence, breathtaking message for ${recipient} in 15 words. Mix poetic English with heart-melting Urdu/Hindi words. The vibe is 'Cinematic Romance'.`,
    [Vibe.PROPOSE]: `Write a life-changing, elegant, and profound proposal sentence for ${recipient} in 15 words. It must feel like a royal promise. Dignified and deeply emotional.`,
    [Vibe.SORRY]: `Write a soul-touching, gentle apology for ${recipient} in 15 words. It should feel like a soft hug. Sincere, quiet, and beautiful.`,
    [Vibe.FRIEND]: `Write a high-voltage, chaotic, but deeply appreciative tribute to a best friend named ${recipient} in 15 words. Use modern slang and extreme hype energy.`,
    [Vibe.BIRTHDAY]: `Write a high-energy, premium birthday wish for ${recipient} in 15 words. It should feel like a grand celebration. Use words like 'Legend', 'Unstoppable', and 'Iconic'.`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompts[vibe],
      config: {
        temperature: 0.95,
        topK: 64,
        topP: 0.9,
      }
    });

    const text = response.text?.trim() || "Another year of being absolutely legendary.";
    return text.replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The stars celebrate you today, as they should every day.";
  }
};
