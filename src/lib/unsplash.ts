/**
 * Utility functions for fetching images from Unsplash API
 */

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
  description: string | null;
}

/**
 * Fetches a random image from Unsplash based on a search query
 * @param query - Search query for the image (e.g., "ocean waves", "cyberpunk city")
 * @returns Image URL or null if fetch fails
 */
export async function fetchUnsplashImage(query: string): Promise<string | null> {
  // If no API key, return a fallback gradient
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not configured. Using gradient fallback.');
    return null;
  }

  try {
    const url = new URL('https://api.unsplash.com/photos/random');
    url.searchParams.set('query', query);
    url.searchParams.set('orientation', 'landscape');
    url.searchParams.set('client_id', UNSPLASH_ACCESS_KEY);

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Unsplash API error:', response.status, response.statusText);
      return null;
    }

    const data: UnsplashImage = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return null;
  }
}

/**
 * Generates a CSS gradient fallback when no image is available
 * @param primaryColor - Primary color in HSL format (e.g., "220 70% 50%")
 * @param accentColor - Accent color in HSL format
 * @returns CSS gradient string
 */
export function generateGradientFallback(primaryColor: string, accentColor: string): string {
  return `linear-gradient(135deg, hsl(${primaryColor}) 0%, hsl(${accentColor}) 100%)`;
}
