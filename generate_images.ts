import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate() {
  const giftCardResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: '3D minimalist clay-style icon of a gift card, isolated on a clean white background, soft lighting, high quality, mobile app design style.',
        },
      ],
    },
  });

  const cryptoResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: '3D minimalist clay-style icon of a bitcoin coin, isolated on a clean white background, soft lighting, high quality, mobile app design style.',
        },
      ],
    },
  });

  console.log('GiftCard:', giftCardResponse.candidates[0].content.parts[0].inlineData?.data);
  console.log('Crypto:', cryptoResponse.candidates[0].content.parts[0].inlineData?.data);
}

generate();
