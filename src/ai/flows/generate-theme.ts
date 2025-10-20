'use server';

/**
 * @fileOverview A flow for generating a color theme with AI-generated background image.
 *
 * - generateTheme - A function that generates theme colors and background image from a text prompt.
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
  imagePrompt: z.string().describe("A detailed, descriptive prompt for generating a background image that matches the theme aesthetics and color palette."),
  backgroundImageUrl: z.string().optional().describe("Data URL of the AI-generated background image."),
});
export type GenerateThemeOutput = z.infer<typeof GenerateThemeOutputSchema>;

export async function generateTheme(input: GenerateThemeInput): Promise<GenerateThemeOutput> {
  // Generate the theme colors and image prompt
  const themeData = await generateThemeFlow(input);
  
  // Note: Imagen 3 requires Vertex AI (Google Cloud with billing), not available via standard Gemini API
  // Using gradient fallback for now - can be enhanced later with Vertex AI integration
  // or alternative image generation approaches
  
  // Return theme without background image (will use gradient fallback in UI)
  return themeData;
}

const prompt = ai.definePrompt({
  name: 'generateThemePrompt',
  input: { schema: GenerateThemeInputSchema },
  output: { schema: GenerateThemeOutputSchema },
  prompt: `You are a creative UI theme designer. Based on the user's prompt, generate a harmonious and accessible color palette for a web application and a detailed image prompt.

You must return a palette of 8 colors in HSL format (values only, without the 'hsl()' wrapper). The colors should be aesthetically pleasing and ensure good contrast between background, foreground, and accent colors.

You must also generate a detailed, descriptive prompt for an AI image generator that will create a background image perfectly matching the theme's aesthetics and color palette. The image prompt should:
- Describe the visual style and mood
- Reference the dominant colors from the palette
- Specify the desired artistic style (photorealistic, illustration, abstract, etc.)
- Include relevant visual elements that match the theme concept

User Prompt: {{{prompt}}}

Generate a theme with colors and image generation prompt based on this.`,
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
