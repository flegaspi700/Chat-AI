'use server';

/**
 * @fileOverview Summarizes the content of an uploaded file.
 *
 * - summarizeUploadedFile - A function that summarizes the content of an uploaded file.
 * - SummarizeUploadedFileInput - The input type for the summarizeUploadedFile function.
 * - SummarizeUploadedFileOutput - The return type for the summarizeUploadedFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUploadedFileInputSchema = z.object({
  fileContent: z.string().describe('The content of the uploaded file.'),
});

export type SummarizeUploadedFileInput = z.infer<typeof SummarizeUploadedFileInputSchema>;

const SummarizeUploadedFileOutputSchema = z.object({
  summary: z.string().describe('A summary of the content of the uploaded file.'),
});

export type SummarizeUploadedFileOutput = z.infer<typeof SummarizeUploadedFileOutputSchema>;

export async function summarizeUploadedFile(input: SummarizeUploadedFileInput): Promise<SummarizeUploadedFileOutput> {
  return summarizeUploadedFileFlow(input);
}

const summarizeUploadedFilePrompt = ai.definePrompt({
  name: 'summarizeUploadedFilePrompt',
  input: {schema: SummarizeUploadedFileInputSchema},
  output: {schema: SummarizeUploadedFileOutputSchema},
  prompt: `Summarize the following text: {{{fileContent}}}`,
});

const summarizeUploadedFileFlow = ai.defineFlow(
  {
    name: 'summarizeUploadedFileFlow',
    inputSchema: SummarizeUploadedFileInputSchema,
    outputSchema: SummarizeUploadedFileOutputSchema,
  },
  async input => {
    const {output} = await summarizeUploadedFilePrompt(input);
    return output!;
  }
);
