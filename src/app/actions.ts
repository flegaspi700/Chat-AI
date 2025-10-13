"use server";

import { generateChatbotResponse, generateChatbotResponseStream } from "@/ai/flows/generate-chatbot-response";
import { generateTheme, GenerateThemeOutput } from "@/ai/flows/generate-theme";
import { scrapeWebsite } from "@/ai/flows/scrape-website";
import { validateURL, validateMessageLength, validateFileContent } from "@/lib/validation";

export async function getAIResponse(
  userInput: string,
  fileContent: string | undefined
): Promise<{ response?: string; error?: string }> {
  // Validate message length
  const messageValidation = validateMessageLength(userInput);
  if (!messageValidation.isValid) {
    return { error: messageValidation.details || messageValidation.error };
  }

  // Validate file content if provided
  if (fileContent) {
    const contentValidation = validateFileContent(fileContent, 'uploaded content');
    if (!contentValidation.isValid) {
      return { error: contentValidation.details || contentValidation.error };
    }
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

/**
 * Streaming version of getAIResponse
 * Returns a ReadableStream that can be consumed by the client
 */
export async function getAIResponseStream(
  userInput: string,
  fileContent: string | undefined
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Validate message length
        const messageValidation = validateMessageLength(userInput);
        if (!messageValidation.isValid) {
          controller.enqueue(encoder.encode(JSON.stringify({ 
            error: messageValidation.details || messageValidation.error 
          })));
          controller.close();
          return;
        }

        // Validate file content if provided
        if (fileContent) {
          const contentValidation = validateFileContent(fileContent, 'uploaded content');
          if (!contentValidation.isValid) {
            controller.enqueue(encoder.encode(JSON.stringify({ 
              error: contentValidation.details || contentValidation.error 
            })));
            controller.close();
            return;
          }
        }

        for await (const chunk of generateChatbotResponseStream({
          userInput,
          fileContent,
        })) {
          controller.enqueue(encoder.encode(chunk));
        }

        controller.close();
      } catch (error) {
        console.error(error);
        controller.enqueue(encoder.encode(JSON.stringify({ error: "Failed to get response from AI." })));
        controller.close();
      }
    },
  });
}

export async function scrapeUrl(
  url: string
): Promise<{ title?: string; content?: string; error?: string }> {
  // Validate URL format and security
  const urlValidation = validateURL(url);
  if (!urlValidation.isValid) {
    return { 
      error: urlValidation.details || urlValidation.error || "Invalid URL"
    };
  }

  try {
    // Use the validated URL
    const validatedUrl = urlValidation.url || url;
    const result = await scrapeWebsite({ url: validatedUrl });
    
    // Validate scraped content length if successful
    if (result.content) {
      const contentValidation = validateFileContent(result.content, validatedUrl);
      if (!contentValidation.isValid) {
        return { 
          error: contentValidation.details || "Scraped content is too large to process."
        };
      }
    }
    
    return result;
  } catch (error) {
    console.error(`Scraping error for ${url}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { error: `Failed to scrape content from the URL. ${errorMessage}` };
  }
}

export async function generateAITheme(prompt: string): Promise<{
  theme?: GenerateThemeOutput;
  error?: string;
}> {
  if (!prompt) {
    return { error: "Prompt is empty." };
  }
  try {
    const theme = await generateTheme({ prompt });
    return { theme };
  } catch (error) {
    console.error("Theme generation error:", error);
    return { error: "Failed to generate AI theme. Please try again." };
  }
}
