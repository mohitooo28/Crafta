import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generationConfig = {
  maxOutputTokens: 8192,
  temperature: 0.2,
  topP: 0.95,
  topK: 40,
  responseMimeType: "text/plain",
};

const codeGenerationConfig = {
  maxOutputTokens: 8192,
  temperature: 0.2,
  topP: 0.95,
  topK: 40,
  responseMimeType: "application/json",
};

const model = "gemini-2.0-flash";

class ChatSession {
  history = [];

  async sendMessage(message) {
    this.history.push({ role: "user", parts: [{ text: message }] });

    const response = await genAI.models.generateContent({
      model,
      contents: this.history,
      generationConfig,
    });

    const text = response.text;
    this.history.push({ role: "model", parts: [{ text }] });
    return text;
  }
}

export const chatSession = new ChatSession();

export const GenAiCode = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: codeGenerationConfig,
  history: [],
});
