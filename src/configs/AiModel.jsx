import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const generativeModel = genAI.getGenerativeModel({
      model,
      generationConfig,
    });

    const chat = generativeModel.startChat({
      history: this.history.slice(0, -1), // Exclude the current message
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text();

    this.history.push({ role: "model", parts: [{ text }] });
    return text;
  }
}

export const chatSession = new ChatSession();

export const GenAiCode = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: codeGenerationConfig,
});
