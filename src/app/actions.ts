"use server";

import { generateChatbotResponse } from "@/ai/flows/generate-chatbot-response";

export async function getAIResponse(
  userInput: string,
  fileContent: string | undefined
): Promise<{ response?: string; error?: string }> {
  if (!userInput) {
    return { error: "User input is empty." };
  }

  try {
    const aiResponse = await generateChatbotResponse({
      userInput,
      fileContent,
    });
    return { response: aiResponse.response };
  } catch (error) {
    console.error(error);
    return { error: "Failed to get response from AI. Please try again." };
  }
}
