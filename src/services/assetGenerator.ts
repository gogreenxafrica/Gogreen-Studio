import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateActivityCardAssets() {
  const giftCardResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: '3D minimalist clay-style illustration of a hand holding a smartphone, a gift card icon floating above the screen, clean white background, soft lighting, high quality, consistent with mobile app design.',
        },
      ],
    },
  });

  const cryptoResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: '3D minimalist clay-style illustration of a hand holding a smartphone, a bitcoin coin icon floating above the screen, clean white background, soft lighting, high quality, consistent with mobile app design.',
        },
      ],
    },
  });

  return { giftCardResponse, cryptoResponse };
}
