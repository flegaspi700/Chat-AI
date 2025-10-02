'use server';

/**
 * @fileOverview A flow that answers questions based on the content of uploaded files.
 *
 * - answerQuestionsFromFile - A function that answers questions based on file content.
 * - AnswerQuestionsFromFileInput - The input type for the answerQuestionsFromFile function.
 * - AnswerQuestionsFromFileOutput - The return type for the answerQuestionsFromFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsFromFileInputSchema = z.object({
  question: z.string().describe('The question to answer based on the file content.'),
  fileContent: z.string().describe('The content of the uploaded file.'),
});
export type AnswerQuestionsFromFileInput = z.infer<typeof AnswerQuestionsFromFileInputSchema>;

const AnswerQuestionsFromFileOutputSchema = z.object({
  answer: z.string().describe('The answer to the question based on the file content.'),
});
export type AnswerQuestionsFromFileOutput = z.infer<typeof AnswerQuestionsFromFileOutputSchema>;

export async function answerQuestionsFromFile(input: AnswerQuestionsFromFileInput): Promise<AnswerQuestionsFromFileOutput> {
  return answerQuestionsFromFileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsFromFilePrompt',
  input: {schema: AnswerQuestionsFromFileInputSchema},
  output: {schema: AnswerQuestionsFromFileOutputSchema},
  prompt: `You are an AI assistant that answers questions based on the content of a given file.\n\nFile Content: {{{fileContent}}}\n\nQuestion: {{{question}}}\n\nAnswer: `,
});

const answerQuestionsFromFileFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFromFileFlow',
    inputSchema: AnswerQuestionsFromFileInputSchema,
    outputSchema: AnswerQuestionsFromFileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
