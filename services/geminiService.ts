import { GoogleGenAI, ChatSession } from "@google/genai";

// Initialize lazily to avoid top-level crash if env vars are missing
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is not configured!");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

// Constants
const MODEL_NAME = 'gemini-2.5-flash-image';
const CHAT_MODEL_NAME = 'gemini-2.5-flash';

const FUNNY_ITEMS = [
  "a single raw potato",
  "a red brick",
  "a roll of toilet paper",
  "a half-eaten sandwich",
  "a rubber duck",
  "a stapler",
  "a single old sneaker",
  "a broccoli floret",
  "a bottle of yellow mustard",
  "a rusty wrench",
  "a half-empty bottle of ketchup",
  "a cheese grater",
  "a prickly cactus pot",
  "a toilet plunger",
  "a bag of frozen peas",
  "a beige CRT monitor from 1998",
  "a traffic cone",
  "a used yellow dish sponge",
  "a single AA battery",
  "a cast iron frying pan",
  "a pinecone",
  "a used toothbrush",
  "a grey rock",
  "a roll of duct tape",
  "a banana with brown spots",
  "an empty cardboard box",
  "a desk fan",
  "a garden gnome"
];

// --- SANTA CHAT LOGIC ---

let santaChatSession: ChatSession | null = null;

export const getSantaChatResponse = async (userMessage: string): Promise<string> => {
  try {
    const ai = getAI();

    // Initialize session if it doesn't exist
    if (!santaChatSession) {
      santaChatSession = ai.chats.create({
        model: CHAT_MODEL_NAME,
        config: {
          systemInstruction: `
            You are Santa Claus. 
            Character traits: Jolly, Witty, Kind, slightly obsessed with cookies and milk.
            Context: You are on the website for $CHRISTMAS, the official Christmas Memecoin on Solana.
            
            Guidelines:
            1. Always start or end with a variation of "Ho ho ho!".
            2. Be funny and lighthearted. Use emojis (🎄, 🎅, 🍪).
            3. If asked about the coin ($CHRISTMAS), say it's the only currency accepted at the North Pole Gift Shop now.
            4. If asked for a joke, tell a corny Christmas "dad joke".
            5. Keep responses concise (under 50 words) as you are in a small chat window.
            6. Never break character. You are the real Santa.
            7. Mention the elves (who are currently trading crypto) or Mrs. Claus occasionally.
          `,
          temperature: 0.9, // High creativity for humor
        },
      });
    }

    const response = await santaChatSession.sendMessage({
      message: userMessage
    });

    return response.text || "Ho ho ho! The wifi at the North Pole is snowy today. Try again!";
  } catch (error) {
    console.error("Santa API Error:", error);
    return "Ho ho ho! My elves tripped over the server cables. Give me a moment!";
  }
};

export const resetSantaChat = () => {
    santaChatSession = null;
};

// --- EXISTING IMAGE LOGIC ---

/**
 * Generates a random funny everyday Christmas gift image.
 */
export const generateRandomGift = async (): Promise<string> => {
  try {
    const ai = getAI();
    // Select a random item on the client side to ensure variety
    const randomItem = FUNNY_ITEMS[Math.floor(Math.random() * FUNNY_ITEMS.length)];

    // Updated prompt injects the specific item
    const prompt = `Create a high-quality, photorealistic product shot of ${randomItem} tied directly with a shiny red satin Christmas ribbon bow. The object should NOT be wrapped in paper; the bow is tied around the raw object. The background should be a clean, soft studio gray or white to highlight the absurdity. Cinematic lighting, 8k resolution, highly detailed texture.`;
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        // Nano banana models usually don't support responseMimeType/Schema
      }
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Error generating gift:", error);
    throw error;
  }
};

/**
 * Applies a Santa hat and Christmas theme to a user uploaded image.
 */
export const santafyImage = async (base64Image: string): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = "Edit this image: Put a fluffy red Santa hat on the main subject/character. Make the background festive with Christmas lights and snow. Keep the subject recognizable but stylized.";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG or JPEG, generally safe for API
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error("Error santafying image:", error);
    throw error;
  }
};

/**
 * Helper to extract base64 image from the Gemini response structure.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractImageFromResponse = (response: any): string => {
  if (response.candidates && response.candidates.length > 0) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64String = part.inlineData.data;
        return `data:image/png;base64,${base64String}`;
      }
    }
  }
  throw new Error("No image generated.");
};