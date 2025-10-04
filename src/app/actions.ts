"use server";

import { generateChatbotResponse } from "@/ai/flows/generate-chatbot-response";
import { scrapeWebsite } from "@/ai/flows/scrape-website";

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

export async function scrapeUrl(
  url: string
): Promise<{ title?: string; content?: string; error?: string }> {
  if (!url) {
    return { error: "URL is empty." };
  }

  try {
    const result = await scrapeWebsite({ url });
    return result;
  } catch (error) {
    console.error(`Scraping error for ${url}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { error: `Failed to scrape content from the URL. ${errorMessage}` };
  }
}
