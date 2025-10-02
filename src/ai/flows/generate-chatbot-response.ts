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
  fileContent: z.string().optional().describe('The content of the uploaded file(s), if any. Each file starts with "File: <filename>".'),
});
export type GenerateChatbotResponseInput = z.infer<typeof GenerateChatbotResponseInputSchema>;

const GenerateChatbotResponseOutputSchema = z.object({
  response: z.string().describe('The chatbot response.'),
});
export type GenerateChatbotResponseOutput = z.infer<typeof GenerateChatbotResponseOutputSchema>;

export async function generateChatbotResponse(input: GenerateChatbotResponseInput): Promise<GenerateChatbotResponseOutput> {
  return generateChatbotResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatbotResponsePrompt',
  input: {schema: GenerateChatbotResponseInputSchema},
  output: {schema: GenerateChatbotResponseOutputSchema},
  prompt: `You are a helpful AI chatbot. Use the content from the uploaded file(s) and the user's input to generate a relevant and informative response. When referencing a specific file, please mention it by name.

File Content(s):
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
