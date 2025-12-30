// src/shared/lib/theme/fonts.ts
// Font library and utilities

import type { FontOption } from '@/shared/types/theme';

// Complete Google Fonts library
export const GOOGLE_FONTS: FontOption[] = [
  // Sans-Serif (Modern, Clean)
  { name: 'Inter', value: 'Inter', category: 'sans-serif' },
  { name: 'Roboto', value: 'Roboto', category: 'sans-serif' },
  { name: 'Open Sans', value: 'Open Sans', category: 'sans-serif' },
  { name: 'Lato', value: 'Lato', category: 'sans-serif' },
  { name: 'Montserrat', value: 'Montserrat', category: 'sans-serif' },
  { name: 'Poppins', value: 'Poppins', category: 'sans-serif' },
  { name: 'Raleway', value: 'Raleway', category: 'sans-serif' },
  { name: 'Nunito', value: 'Nunito', category: 'sans-serif' },
  { name: 'Work Sans', value: 'Work Sans', category: 'sans-serif' },
  { name: 'DM Sans', value: 'DM Sans', category: 'sans-serif' },
  { name: 'Outfit', value: 'Outfit', category: 'sans-serif' },
  { name: 'Space Grotesk', value: 'Space Grotesk', category: 'sans-serif' },
  { name: 'Manrope', value: 'Manrope', category: 'sans-serif' },
  { name: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans', category: 'sans-serif' },
  { name: 'Sora', value: 'Sora', category: 'sans-serif' },
  
  // Serif (Classic, Elegant)
  { name: 'Playfair Display', value: 'Playfair Display', category: 'serif' },
  { name: 'Merriweather', value: 'Merriweather', category: 'serif' },
  { name: 'Lora', value: 'Lora', category: 'serif' },
  { name: 'Libre Baskerville', value: 'Libre Baskerville', category: 'serif' },
  { name: 'EB Garamond', value: 'EB Garamond', category: 'serif' },
  { name: 'Cormorant Garamond', value: 'Cormorant Garamond', category: 'serif' },
  { name: 'Crimson Pro', value: 'Crimson Pro', category: 'serif' },
  { name: 'Bitter', value: 'Bitter', category: 'serif' },
  
  // Display (Bold, Statement)
  { name: 'Bebas Neue', value: 'Bebas Neue', category: 'display' },
  { name: 'Oswald', value: 'Oswald', category: 'display' },
  { name: 'Anton', value: 'Anton', category: 'display' },
  { name: 'Archivo Black', value: 'Archivo Black', category: 'display' },
  { name: 'Righteous', value: 'Righteous', category: 'display' },
  { name: 'Titan One', value: 'Titan One', category: 'display' },
  
  // Handwriting (Personal, Creative)
  { name: 'Dancing Script', value: 'Dancing Script', category: 'handwriting' },
  { name: 'Pacifico', value: 'Pacifico', category: 'handwriting' },
  { name: 'Caveat', value: 'Caveat', category: 'handwriting' },
  { name: 'Sacramento', value: 'Sacramento', category: 'handwriting' },
  { name: 'Great Vibes', value: 'Great Vibes', category: 'handwriting' },
  { name: 'Satisfy', value: 'Satisfy', category: 'handwriting' },
  
  // Monospace (Tech, Code)
  { name: 'JetBrains Mono', value: 'JetBrains Mono', category: 'monospace' },
  { name: 'Fira Code', value: 'Fira Code', category: 'monospace' },
  { name: 'Source Code Pro', value: 'Source Code Pro', category: 'monospace' },
  { name: 'IBM Plex Mono', value: 'IBM Plex Mono', category: 'monospace' },
];

// Get fonts by category
export const getFontsByCategory = (category: FontOption['category']): FontOption[] => {
  return GOOGLE_FONTS.filter(font => font.category === category);
};

// Get all font categories
export const FONT_CATEGORIES: { id: FontOption['category']; name: string; description: string }[] = [
  { id: 'sans-serif', name: 'Sans Serif', description: 'Modern and clean' },
  { id: 'serif', name: 'Serif', description: 'Classic and elegant' },
  { id: 'display', name: 'Display', description: 'Bold statements' },
  { id: 'handwriting', name: 'Handwriting', description: 'Personal touch' },
  { id: 'monospace', name: 'Monospace', description: 'Tech vibes' },
];

// Font pairing recommendations
export const FONT_PAIRINGS: { heading: string; body: string; description: string }[] = [
  { heading: 'Playfair Display', body: 'Lato', description: 'Elegant & readable' },
  { heading: 'Montserrat', body: 'Open Sans', description: 'Modern & clean' },
  { heading: 'Poppins', body: 'Inter', description: 'Friendly & professional' },
  { heading: 'Bebas Neue', body: 'Roboto', description: 'Bold & balanced' },
  { heading: 'Space Grotesk', body: 'DM Sans', description: 'Contemporary & fresh' },
  { heading: 'Cormorant Garamond', body: 'Nunito', description: 'Sophisticated & warm' },
  { heading: 'Oswald', body: 'Lato', description: 'Strong & approachable' },
  { heading: 'Dancing Script', body: 'Open Sans', description: 'Creative & legible' },
];

// Generate Google Fonts URL for loading
export const generateGoogleFontsUrl = (fonts: string[]): string => {
  const uniqueFonts = [...new Set(fonts)];
  const fontParams = uniqueFonts
    .map(font => `family=${encodeURIComponent(font)}:wght@400;500;600;700`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
};

