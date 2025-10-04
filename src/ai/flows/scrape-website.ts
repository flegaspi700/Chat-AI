'use server';

/**
 * @fileOverview A flow for scraping website content.
 *
 * - scrapeWebsite - A function that scrapes content from a given URL.
 * - ScrapeWebsiteInput - The input type for the scrapeWebsite function.
 * - ScrapeWebsiteOutput - The return type for the scrapeWebsite function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as cheerio from 'cheerio';

const ScrapeWebsiteInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to scrape.'),
});
export type ScrapeWebsiteInput = z.infer<typeof ScrapeWebsiteInputSchema>;

const ScrapeWebsiteOutputSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  content: z.string(),
});
export type ScrapeWebsiteOutput = z.infer<typeof ScrapeWebsiteOutputSchema>;

export async function scrapeWebsite(input: ScrapeWebsiteInput): Promise<ScrapeWebsiteOutput> {
  return scrapeWebsiteFlow(input);
}

const scrapeWebsiteFlow = ai.defineFlow(
  {
    name: 'scrapeWebsiteFlow',
    inputSchema: ScrapeWebsiteInputSchema,
    outputSchema: ScrapeWebsiteOutputSchema,
  },
  async ({ url }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      const $ = cheerio.load(html);

      // Remove script and style elements
      $('script, style, nav, header, footer, aside').remove();

      // Extract text from the body, trying to get meaningful content
      const title = $('title').text();
      let content = $('article, main, body').text();

      // Simple cleanup
      content = content
        .replace(/\s\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      if (!content) {
        throw new Error('Could not extract meaningful content from the page.');
      }

      return {
        url,
        title,
        content,
      };
    } catch (e: any) {
      console.error(`Error scraping ${url}:`, e);
      throw new Error(`Failed to fetch or parse content from URL: ${e.message}`);
    }
  }
);
