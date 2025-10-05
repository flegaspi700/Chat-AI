'use server';

/**
 * @fileOverview A flow for generating a color theme based on a user prompt.
 *
 * - generateTheme - A function that generates theme colors from a text prompt.
 * - GenerateThemeInput - The input type for the generateTheme function.
 * - GenerateThemeOutput - The return type for the generateTheme function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateThemeInputSchema = z.object({
  prompt: z.string().describe('A description of the theme to generate. For example, "a calm, oceanic theme with blues and greens".'),
});
export type GenerateThemeInput = z.infer<typeof GenerateThemeInputSchema>;

const ColorPaletteSchema = z.object({
  background: z.string().describe("The background color in HSL format, like '220 20% 95%'."),
  foreground: z.string().describe("The foreground (text) color in HSL format, like '220 10% 20%'."),
  primary: z.string().describe("The primary action color in HSL format, like '220 70% 50%'."),
  primaryForeground: z.string().describe("The foreground color for primary elements in HSL format, like '0 0% 100%'."),
  secondary: z.string().describe("The secondary element color in HSL format, like '220 15% 90%'."),
  accent: z.string().describe("The accent color in HSL format, like '190 80% 40%'."),
  card: z.string().describe("The card background color in HSL format, like '220 20% 100%'."),
  border: z.string().describe("The border color in HSL format, like '220 15% 85%'."),
});

const GenerateThemeOutputSchema = z.object({
  themeName: z.string().describe("A short, two-word, lowercase name for the generated theme, like 'ocean tranquility'."),
  palette: ColorPaletteSchema,
  imageHint: z.string().describe("A two-word search query for a background image that matches the theme."),
});
export type GenerateThemeOutput = z.infer<typeof GenerateThemeOutputSchema>;

export async function generateTheme(input: GenerateThemeInput): Promise<GenerateThemeOutput> {
  return generateThemeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateThemePrompt',
  input: { schema: GenerateThemeInputSchema },
  output: { schema: GenerateThemeOutputSchema },
  prompt: `You are a creative UI theme designer. Based on the user's prompt, generate a harmonious and accessible color palette for a web application and a background image hint.

You must return a palette of 8 colors in HSL format (values only, without the 'hsl()' wrapper). The colors should be aesthetically pleasing and ensure good contrast between background, foreground, and accent colors.

You must also return a two-word search query for a background image that matches the theme.

User Prompt: {{{prompt}}}

Generate a theme and image hint based on this prompt.`,
});

const generateThemeFlow = ai.defineFlow(
  {
    name: 'generateThemeFlow',
    inputSchema: GenerateThemeInputSchema,
    outputSchema: GenerateThemeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
