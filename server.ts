import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, SchemaType } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini
  const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
  
  // API Route for Prophecy
  app.post("/api/prophesize", async (req, res) => {
    try {
      const { ingredients, imageB64 } = req.body;
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: `You are the FridgeGenie, a mystical culinary oracle. 
Your purpose is to see the "Gastronomic Destiny" of leftovers and ingredients.
You speak with a theatrical, slightly mystical, yet encouraging tone. 
Instead of plain recipes, you provide "Prophecies".

When given a list of ingredients (and optionally an image):
1. Identify what can be made.
2. Create a "Mystic Prophecy" - a 2-3 sentence dramatic yet fun description of why this dish is the user's destiny.
3. Provide a practical recipe that is easy to follow.
4. Estimate the "Waste Saved" in grams or portion size to emphasize sustainability.
5. Use "Alchemist" terms for cooking levels: Novice, Alchemist, Grand Master.

You MUST respond in strict JSON format matching the schema provided.`
      });

      let promptParts: any[] = [
        { text: `The seeker approaches with these offerings: ${ingredients.join(", ")}. Reveal their destiny.` }
      ];

      if (imageB64) {
        promptParts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: imageB64.split(",")[1] || imageB64
          }
        });
      }

      const result = await model.generateContent({
        contents: [{ role: "user", parts: promptParts }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              prophecy: { type: SchemaType.STRING },
              ingredients: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              instructions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
              cookTime: { type: SchemaType.STRING },
              difficulty: { type: SchemaType.STRING, enum: ["Novice", "Alchemist", "Grand Master"] },
              wasteSavedApprox: { type: SchemaType.STRING }
            },
            required: ["title", "prophecy", "ingredients", "instructions", "cookTime", "difficulty", "wasteSavedApprox"]
          }
        }
      });

      const response = await result.response;
      res.json(JSON.parse(response.text()));
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "The stars are cloudy. Please try again." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
