import axios from "axios";
import { OPENAI_API_KEY } from "@env";

const API_URL = "https://api.openai.com/v1/chat/completions";

export async function askChatGPT(userInput: string) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant biblique humble et bienveillant...",
          },
          {
            role: "user",
            content: userInput,
          },
        ],
        temperature: 0.7,
        max_tokens: 400,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error: any) {
    console.error("Erreur lors de la requête ChatGPT :", error);
    throw error;
  }
}
