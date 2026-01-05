
import { GoogleGenAI, Type } from "@google/genai";

// Initialize GoogleGenAI once with the API key from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a professional product description using the gemini-3-flash-preview model.
 */
export const generateProductDescription = async (name: string, category: string, features: string) => {
  const prompt = `Write a compelling, professional e-commerce product description for:
    Name: ${name}
    Category: ${category}
    Key Features: ${features}
    Keep it under 150 words. Focus on benefits and value proposition. If it's crypto, emphasize P2P security.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate description. Please write one manually.";
  }
};

/**
 * Suggests negotiation advice based on chat history.
 */
export const getNegotiationAdvice = async (chatHistory: string, productPrice: number) => {
  const prompt = `You are a professional sales negotiator. Here is a chat history between a buyer and a seller for an item (possibly a P2P crypto asset) priced at $${productPrice}:
    ---
    ${chatHistory}
    ---
    Suggest the next best move for the seller to close the deal or handle objections. For crypto, mention escrow safety. Keep it concise.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I recommend sticking to your firm price for now.";
  }
};

/**
 * General purpose assistant chat with system instructions.
 */
export const chatWithAssistant = async (message: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: ${context}\nUser: ${message}`,
      config: {
        systemInstruction: "You are the Willy Paully Assistant. Help users with P2P Crypto trading, encrypted escrow, platform features, and marketplace safety. If they ask about selling fees, tell them it's 2.5%. For crypto P2P, emphasize that we use end-to-end encryption for chats and a secure escrow system for asset releases. Explain that we comply with global KYC/AML laws.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Assistant Error:", error);
    return "I'm having trouble responding right now.";
  }
};
