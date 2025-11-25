import { GoogleGenAI } from "@google/genai";
import { GeneratedImageResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
 * 
 * @param base64Image The source image in base64 format (without the data prefix for the API part, but we usually strip it before calling this or inside).
 * @param mimeType The mime type of the image (e.g., 'image/jpeg').
 * @param prompt The text instruction for editing.
 */
export const editImageWithGemini = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<GeneratedImageResult> => {
  try {
    // Ensure base64 string doesn't have the data URL prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // Note: responseMimeType and responseSchema are NOT supported for nano banana models
    });

    let imageUrl: string | null = null;
    let textOutput: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      
      for (const part of parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          // Construct a displayable data URL. Assuming PNG return or mirroring input, 
          // usually Gemini returns PNG or JPEG. We'll default to PNG for display if unspecified.
          imageUrl = `data:image/png;base64,${base64Data}`;
        } else if (part.text) {
          textOutput = part.text;
        }
      }
    }

    if (!imageUrl && !textOutput) {
      throw new Error("No image or text was returned from the model.");
    }

    return { imageUrl, text: textOutput };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};