import type { AITheme } from '@/lib/types';

export const mockLightTheme: AITheme = {
  id: 'theme-light-1',
  name: 'Ocean Breeze',
  backgroundImageUrl: 'data:image/png;base64,mockImageData',
};

export const mockDarkTheme: AITheme = {
  id: 'theme-dark-1',
  name: 'Midnight Forest',
  backgroundImageUrl: 'data:image/png;base64,mockImageData',
};

export const mockThemeGenerationResponse = {
  theme: {
    id: 'theme-gen-1',
    name: 'Sunset Glow',
    backgroundImageUrl: 'data:image/png;base64,mockImageData',
  },
};

export const mockThemeColors = {
  primary: 'hsl(220, 70%, 50%)',
  background: 'hsl(220, 20%, 95%)',
  accent: 'hsl(190, 80%, 40%)',
};
