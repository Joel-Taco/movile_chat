import { config } from 'dotenv';
config();
const GEMINI_API_KEY_CHAT = process.env.GEMINI_API_KEY_CHAT;
 // Debe ir en la parte superior del archivo

export const ChatService = {
  async sendMessage(userMessage: string) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY_CHAT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
        }),
      });

      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no tengo respuesta para eso.";

    } catch (error) {
      console.error("🚨 Error en ChatService:", error);
      return "Hubo un error al procesar tu mensaje.";
    }
  }
};
