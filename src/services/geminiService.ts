import { GoogleGenAI, Type } from "@google/genai";
import { RecipeProphecy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const SYSTEM_INSTRUCTION = `You are the FridgeGenie, a mystical culinary oracle. 
Your purpose is to see the "Gastronomic Destiny" of leftovers and ingredients.
You speak with a theatrical, slightly mystical, yet encouraging tone. 
Instead of plain recipes, you provide "Prophecies".

When given a list of ingredients (and optionally an image):
1. Identify what can be made.
2. Create a "Mystic Prophecy" - a 2-3 sentence dramatic yet fun description of why this dish is the user's destiny.
3. Provide a practical recipe that is easy to follow.
4. Estimate the "Waste Saved" in grams or portion size to emphasize sustainability.
5. Use "Alchemist" terms for cooking levels: Novice, Alchemist, Grand Master.

You MUST respond in strict JSON format matching the schema provided.`;

export async function generateRecipeProphecy(
  ingredients: string[],
  imageB64?: string
): Promise<RecipeProphecy> {
  const model = "gemini-3-flash-preview";
  
  let userParts: any[] = [
    { text: `The seeker approaches with these offerings: ${ingredients.join(", ")}. Reveal their destiny.` }
  ];

  if (imageB64) {
    userParts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageB64.split(",")[1] || imageB64
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: userParts }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          prophecy: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          cookTime: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Novice", "Alchemist", "Grand Master"] },
          wasteSavedApprox: { type: Type.STRING }
        },
        required: ["title", "prophecy", "ingredients", "instructions", "cookTime", "difficulty", "wasteSavedApprox"]
      }
    }
  });

  try {
    const text = response.text;
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse prophecy:", error);
    throw new Error("The stars are cloudy. Please try again.");
  }
}
