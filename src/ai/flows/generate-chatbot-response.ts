'use server';

/**
 * @fileOverview A flow for generating chatbot responses based on user input and uploaded files.
 *
 * - generateChatbotResponse - A function that generates a chatbot response.
 * - GenerateChatbotResponseInput - The input type for the generateChatbotResponse function.
 * - GenerateChatbotResponseOutput - The return type for the generateChatbotResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChatbotResponseInputSchema = z.object({
  userInput: z.string().describe('The user input to the chatbot.'),
  fileContent: z.string().optional().describe('The content of the uploaded file(s) or scraped URL(s), if any. Each source starts with "Source: <name> (type)".'),
});
export type GenerateChatbotResponseInput = z.infer<typeof GenerateChatbotResponseInputSchema>;

const GenerateChatbotResponseOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type GenerateChatbotResponseOutput = z.infer<typeof GenerateChatbotResponseOutputSchema>;

export async function generateChatbotResponse(input: GenerateChatbotResponseInput): Promise<GenerateChatbotResponseOutput> {
  return generateChatbotResponseFlow(input);
}

/**
 * Streaming version of generateChatbotResponse
 * Returns an async generator that yields text chunks
 */
export async function* generateChatbotResponseStream(input: GenerateChatbotResponseInput): AsyncGenerator<string> {
  const promptText = `You are a helpful AI chatbot. Use the content from the provided sources (files or websites) and the user's input to generate a relevant and informative response. When referencing a specific source, please mention it by name.

${input.fileContent ? `Sources:\n${input.fileContent}\n\n` : ''}User Input: ${input.userInput}

Response: `;

  const result = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: promptText,
    config: {
      temperature: 0.7,
    },
  });

  // For now, we'll simulate streaming by chunking the response
  // In a future update, we can use true streaming when Genkit supports it better
  const response = result.text || '';
  const chunkSize = 10; // characters per chunk
  
  for (let i = 0; i < response.length; i += chunkSize) {
    yield response.slice(i, i + chunkSize);
    // Small delay to simulate streaming
    await new Promise(resolve => setTimeout(resolve, 20));
  }
}

const prompt = ai.definePrompt({
  name: 'generateChatbotResponsePrompt',
  input: {schema: GenerateChatbotResponseInputSchema},
  output: {schema: GenerateChatbotResponseOutputSchema},
  prompt: `You are a helpful AI chatbot. Use the content from the provided sources (files or websites) and the user's input to generate a relevant and informative response. When referencing a specific source, please mention it by name.

Sources:
{{{fileContent}}}

User Input: {{{userInput}}}

Response: `,
});

const generateChatbotResponseFlow = ai.defineFlow(
  {
    name: 'generateChatbotResponseFlow',
    inputSchema: GenerateChatbotResponseInputSchema,
    outputSchema: GenerateChatbotResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
