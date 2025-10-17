'use server';

/**
 * @fileOverview A flow for generating concise summaries of uploaded file or URL content.
 *
 * - summarizeContent - A function that generates a summary of source content.
 * - SummarizeContentInput - The input type for the summarizeContent function.
 * - SummarizeContentOutput - The return type for the summarizeContent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeContentInputSchema = z.object({
  content: z.string().describe('The content to summarize (from file or URL).'),
  sourceName: z.string().describe('The name of the source (file name or URL).'),
  sourceType: z.enum(['file', 'url']).describe('The type of source.'),
});
export type SummarizeContentInput = z.infer<typeof SummarizeContentInputSchema>;

const SummarizeContentOutputSchema = z.object({
  summary: z.string().describe('A concise 2-3 paragraph summary (200-300 words) of the content, highlighting key points, main topics, and important facts.'),
  keyPoints: z.array(z.string()).describe('3-5 bullet points of the most important takeaways.'),
});
export type SummarizeContentOutput = z.infer<typeof SummarizeContentOutputSchema>;

export async function summarizeContent(input: SummarizeContentInput): Promise<SummarizeContentOutput> {
  return summarizeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeContentPrompt',
  input: { schema: SummarizeContentInputSchema },
  output: { schema: SummarizeContentOutputSchema },
  prompt: `You are an expert content analyst. Your task is to read the provided content and generate a comprehensive yet concise summary.

Source: {{sourceName}} ({{sourceType}})

Content:
{{content}}

Generate:
1. A 2-3 paragraph summary (200-300 words) that captures the main ideas, key arguments, and important details
2. 3-5 bullet points highlighting the most important takeaways

Be objective, accurate, and focus on the most valuable information. The summary should give someone a clear understanding of the content without needing to read the full text.`,
});

const summarizeContentFlow = ai.defineFlow(
  {
    name: 'summarizeContentFlow',
    inputSchema: SummarizeContentInputSchema,
    outputSchema: SummarizeContentOutputSchema,
  },
  async (input) => {
    // Truncate content if too long (max 50K chars for summary generation)
    const truncatedContent = input.content.length > 50000 
      ? input.content.slice(0, 50000) + '...[truncated]'
      : input.content;

    const { output } = await prompt({
      ...input,
      content: truncatedContent,
    });

    return output!;
  }
);
