import type { AITheme } from '@/lib/types';

export const mockLightTheme: AITheme = {
  id: 'theme-light-1',
  name: 'Ocean Breeze',
  imageHint: 'Light blue ocean waves with white foam',
};

export const mockDarkTheme: AITheme = {
  id: 'theme-dark-1',
  name: 'Midnight Forest',
  imageHint: 'Dark forest at night with moonlight',
};

export const mockThemeGenerationResponse = {
  theme: {
    id: 'theme-gen-1',
    name: 'Sunset Glow',
    imageHint: 'Warm orange and pink sunset colors',
  },
};

export const mockThemeColors = {
  primary: 'hsl(220, 70%, 50%)',
  background: 'hsl(220, 20%, 95%)',
  accent: 'hsl(190, 80%, 40%)',
};
