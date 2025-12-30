// src/shared/lib/theme/presets.ts
// Theme presets library

import type { ThemePreset, AppearanceConfig } from '@/shared/types/theme';

// Helper to create preset
const createPreset = (
  id: string,
  name: string,
  description: string,
  category: ThemePreset['category'],
  config: AppearanceConfig,
  preview: ThemePreset['preview'],
  isPro = false
): ThemePreset => ({
  id,
  name,
  description,
  category,
  isPro,
  config,
  preview,
});

// ============================================
// MINIMAL THEMES
// ============================================

export const MINIMAL_THEMES: ThemePreset[] = [
  createPreset(
    'minimalist-white',
    'Minimalist',
    'Clean and simple white background',
    'minimal',
    {
      background: { type: 'solid', solidColor: '#ffffff', gradientStart: '#ffffff', gradientEnd: '#ffffff', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'pill', backgroundColor: '#000000', textColor: '#ffffff', borderColor: '#000000', hasShadow: false },
      fonts: { heading: 'Inter', body: 'Inter' },
      textColors: { username: '#000000', description: '#676b5f' },
    },
    { colors: ['#ffffff', '#000000'] }
  ),
  createPreset(
    'soft-gray',
    'Soft Gray',
    'Subtle gray tones for a calm feel',
    'minimal',
    {
      background: { type: 'solid', solidColor: '#f8f9fa', gradientStart: '#f8f9fa', gradientEnd: '#f8f9fa', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'rounded', backgroundColor: '#495057', textColor: '#ffffff', borderColor: '#495057', hasShadow: true },
      fonts: { heading: 'DM Sans', body: 'Inter' },
      textColors: { username: '#212529', description: '#6c757d' },
    },
    { colors: ['#f8f9fa', '#495057'] }
  ),
  createPreset(
    'paper',
    'Paper',
    'Warm off-white like aged paper',
    'minimal',
    {
      background: { type: 'solid', solidColor: '#faf8f5', gradientStart: '#faf8f5', gradientEnd: '#faf8f5', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'rounded', backgroundColor: '#5c4033', textColor: '#ffffff', borderColor: '#5c4033', hasShadow: false },
      fonts: { heading: 'Libre Baskerville', body: 'Lora' },
      textColors: { username: '#3d2914', description: '#8b7355' },
    },
    { colors: ['#faf8f5', '#5c4033'] }
  ),
];

// ============================================
// DARK THEMES
// ============================================

export const DARK_THEMES: ThemePreset[] = [
  createPreset(
    'dark-mode',
    'Dark Mode',
    'Sleek dark theme with purple accents',
    'dark',
    {
      background: { type: 'solid', solidColor: '#0f0f0f', gradientStart: '#0f0f0f', gradientEnd: '#0f0f0f', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'rounded', backgroundColor: '#8b5cf6', textColor: '#ffffff', borderColor: '#8b5cf6', hasShadow: true },
      fonts: { heading: 'Poppins', body: 'Inter' },
      textColors: { username: '#ffffff', description: '#a8a29e' },
    },
    { colors: ['#0f0f0f', '#8b5cf6'], isDark: true }
  ),
  createPreset(
    'midnight',
    'Midnight',
    'Deep blue night sky',
    'dark',
    {
      background: { type: 'gradient', solidColor: '#0a1628', gradientStart: '#0a1628', gradientEnd: '#1a365d', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'rounded', backgroundColor: '#3182ce', textColor: '#ffffff', borderColor: '#3182ce', hasShadow: true },
      fonts: { heading: 'Space Grotesk', body: 'Inter' },
      textColors: { username: '#e2e8f0', description: '#94a3b8' },
    },
    { colors: ['#0a1628', '#3182ce'], isDark: true }
  ),
  createPreset(
    'elegant-black',
    'Elegant Black',
    'Sophisticated black and gold',
    'dark',
    {
      background: { type: 'solid', solidColor: '#000000', gradientStart: '#000000', gradientEnd: '#000000', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'square', backgroundColor: '#ffd700', textColor: '#000000', borderColor: '#ffd700', hasShadow: false },
      fonts: { heading: 'Playfair Display', body: 'Merriweather' },
      textColors: { username: '#ffffff', description: '#a8a29e' },
    },
    { colors: ['#000000', '#ffd700'], isDark: true }
  ),
  createPreset(
    'neon-nights',
    'Neon Nights',
    'Dark with vibrant neon accents',
    'dark',
    {
      background: { type: 'gradient', solidColor: '#000000', gradientStart: '#141E30', gradientEnd: '#243B55', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'rounded', backgroundColor: '#00F260', textColor: '#000000', borderColor: '#00F260', hasShadow: true },
      fonts: { heading: 'Montserrat', body: 'Roboto' },
      textColors: { username: '#ffffff', description: '#a8a29e' },
    },
    { colors: ['#141E30', '#00F260'], isDark: true }
  ),
  createPreset(
    'cyber-purple',
    'Cyber Purple',
    'Futuristic purple neon glow',
    'dark',
    {
      background: { type: 'gradient', solidColor: '#0d0015', gradientStart: '#0d0015', gradientEnd: '#1a0033', gradientDirection: 'to-br', imageUrl: '' },
      buttons: { style: 'pill', backgroundColor: '#bf00ff', textColor: '#ffffff', borderColor: '#bf00ff', hasShadow: true },
      fonts: { heading: 'Outfit', body: 'Space Grotesk' },
      textColors: { username: '#e879f9', description: '#c084fc' },
    },
    { colors: ['#0d0015', '#bf00ff'], isDark: true },
    true // PRO
  ),
];

// ============================================
// GRADIENT THEMES
// ============================================

export const GRADIENT_THEMES: ThemePreset[] = [
  createPreset(
    'sunset',
    'Sunset Vibes',
    'Warm gradient from orange to pink',
    'gradient',
    {
      background: { type: 'gradient', solidColor: '#ffffff', gradientStart: '#ff6b6b', gradientEnd: '#feca57', gradientDirection: 'to-br', imageUrl: '' },
      buttons: { style: 'pill', backgroundColor: '#ffffff', textColor: '#ff6b6b', borderColor: '#ffffff', hasShadow: true },
      fonts: { heading: 'Montserrat', body: 'Open Sans' },
      textColors: { username: '#ffffff', description: '#fff5f5' },
    },
    { colors: ['#ff6b6b', '#feca57'] }
  ),
  createPreset(
    'ocean',
    'Ocean Blue',
    'Cool blue gradient like the ocean',
    'gradient',
    {
      background: { type: 'gradient', solidColor: '#ffffff', gradientStart: '#0093E9', gradientEnd: '#80D0C7', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'rounded', backgroundColor: '#ffffff', textColor: '#0093E9', borderColor: '#ffffff', hasShadow: true },
      fonts: { heading: 'Raleway', body: 'Lato' },
      textColors: { username: '#ffffff', description: '#e0f7fa' },
    },
    { colors: ['#0093E9', '#80D0C7'] }
  ),
  createPreset(
    'lavender',
    'Lavender Fields',
    'Calming purple to pink gradient',
    'gradient',
    {
      background: { type: 'gradient', solidColor: '#ffffff', gradientStart: '#a8edea', gradientEnd: '#fed6e3', gradientDirection: 'to-r', imageUrl: '' },
      buttons: { style: 'pill', backgroundColor: '#c471ed', textColor: '#ffffff', borderColor: '#c471ed', hasShadow: true },
      fonts: { heading: 'Poppins', body: 'Nunito' },
      textColors: { username: '#4a1d6b', description: '#6b3d8a' },
    },
    { colors: ['#a8edea', '#fed6e3'] }
  ),
  createPreset(
    'fire',
    'Fire & Ice',
    'Bold red to orange gradient',
    'gradient',
    {
      background: { type: 'gradient', solidColor: '#ffffff', gradientStart: '#f12711', gradientEnd: '#f5af19', gradientDirection: 'to-br', imageUrl: '' },
      buttons: { style: 'rounded', backgroundColor: '#ffffff', textColor: '#f12711', borderColor: '#ffffff', hasShadow: true },
      fonts: { heading: 'Montserrat', body: 'Raleway' },
      textColors: { username: '#ffffff', description: '#fff5f5' },
    },
    { colors: ['#f12711', '#f5af19'] }
  ),
  createPreset(
    'aurora',
    'Aurora Borealis',
    'Magical northern lights',
    'gradient',
    {
      background: { type: 'gradient', solidColor: '#0c1445', gradientStart: '#0c1445', gradientEnd: '#1a472a', gradientDirection: 'to-br', imageUrl: '' },
      buttons: { style: 'pill', backgroundColor: '#00d4aa', textColor: '#0c1445', borderColor: '#00d4aa', hasShadow: true },
      fonts: { heading: 'Sora', body: 'Inter' },
      textColors: { username: '#7fdbca', description: '#4ecdc4' },
    },
    { colors: ['#0c1445', '#00d4aa'], isDark: true },
    true // PRO
  ),
  createPreset(
    'cotton-candy',
    'Cotton Candy',
    'Sweet pink to blue gradient',
    'gradient',
    {
      background: { type: 'gradient', solidColor: '#ffffff', gradientStart: '#ffafbd', gradientEnd: '#c3cfe2', gradientDirection: 'to-r', imageUrl: '' },
      buttons: { style: 'pill', backgroundColor: '#ff6b9d', textColor: '#ffffff', borderColor: '#ff6b9d', hasShadow: true },
      fonts: { heading: 'Nunito', body: 'Poppins' },
      textColors: { username: '#4a3f55', description: '#6b5b7a' },
    },
    { colors: ['#ffafbd', '#c3cfe2'] }
  ),
];

// ============================================
// COLORFUL THEMES
// ============================================

export const COLORFUL_THEMES: ThemePreset[] = [
  createPreset(
    'peachy',
    'Peachy Keen',
    'Warm peach to coral tones',
    'colorful',
    {
      background: { type: 'gradient', solidColor: '#ffffff', gradientStart: '#ff9a56', gradientEnd: '#ff6a88', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'pill', backgroundColor: '#ffffff', textColor: '#ff6a88', borderColor: '#ffffff', hasShadow: true },
      fonts: { heading: 'Poppins', body: 'Lato' },
      textColors: { username: '#ffffff', description: '#fff5f5' },
    },
    { colors: ['#ff9a56', '#ff6a88'] }
  ),
  createPreset(
    'pastel-dream',
    'Pastel Dream',
    'Soft pastel pink to lavender',
    'colorful',
    {
      background: { type: 'gradient', solidColor: '#ffffff', gradientStart: '#ffecd2', gradientEnd: '#fcb69f', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'pill', backgroundColor: '#ff9a9e', textColor: '#ffffff', borderColor: '#ff9a9e', hasShadow: true },
      fonts: { heading: 'Playfair Display', body: 'Lato' },
      textColors: { username: '#5c4033', description: '#8b7355' },
    },
    { colors: ['#ffecd2', '#fcb69f'] }
  ),
  createPreset(
    'tropical',
    'Tropical Paradise',
    'Vibrant tropical colors',
    'colorful',
    {
      background: { type: 'gradient', solidColor: '#ffffff', gradientStart: '#00b4db', gradientEnd: '#0083b0', gradientDirection: 'to-br', imageUrl: '' },
      buttons: { style: 'rounded', backgroundColor: '#ff6b6b', textColor: '#ffffff', borderColor: '#ff6b6b', hasShadow: true },
      fonts: { heading: 'Bebas Neue', body: 'Open Sans' },
      textColors: { username: '#ffffff', description: '#e0f7fa' },
    },
    { colors: ['#00b4db', '#ff6b6b'] }
  ),
  createPreset(
    'bubblegum',
    'Bubblegum Pop',
    'Fun and playful pink',
    'colorful',
    {
      background: { type: 'solid', solidColor: '#ff69b4', gradientStart: '#ff69b4', gradientEnd: '#ff69b4', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'pill', backgroundColor: '#ffffff', textColor: '#ff69b4', borderColor: '#ffffff', hasShadow: true },
      fonts: { heading: 'Righteous', body: 'Nunito' },
      textColors: { username: '#ffffff', description: '#fff0f5' },
    },
    { colors: ['#ff69b4', '#ffffff'] }
  ),
];

// ============================================
// PROFESSIONAL THEMES
// ============================================

export const PROFESSIONAL_THEMES: ThemePreset[] = [
  createPreset(
    'corporate-blue',
    'Corporate Blue',
    'Professional navy blue theme',
    'professional',
    {
      background: { type: 'gradient', solidColor: '#ffffff', gradientStart: '#1e3c72', gradientEnd: '#2a5298', gradientDirection: 'to-br', imageUrl: '' },
      buttons: { style: 'rounded', backgroundColor: '#ffffff', textColor: '#1e3c72', borderColor: '#ffffff', hasShadow: true },
      fonts: { heading: 'Roboto', body: 'Open Sans' },
      textColors: { username: '#ffffff', description: '#cfd8dc' },
    },
    { colors: ['#1e3c72', '#2a5298'], isDark: true }
  ),
  createPreset(
    'slate',
    'Slate Professional',
    'Modern slate gray tones',
    'professional',
    {
      background: { type: 'solid', solidColor: '#1e293b', gradientStart: '#1e293b', gradientEnd: '#1e293b', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'rounded', backgroundColor: '#0ea5e9', textColor: '#ffffff', borderColor: '#0ea5e9', hasShadow: false },
      fonts: { heading: 'Plus Jakarta Sans', body: 'Inter' },
      textColors: { username: '#f1f5f9', description: '#94a3b8' },
    },
    { colors: ['#1e293b', '#0ea5e9'], isDark: true }
  ),
  createPreset(
    'executive',
    'Executive',
    'Premium dark with gold accents',
    'professional',
    {
      background: { type: 'gradient', solidColor: '#1a1a2e', gradientStart: '#1a1a2e', gradientEnd: '#16213e', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'square', backgroundColor: '#c9a227', textColor: '#1a1a2e', borderColor: '#c9a227', hasShadow: false },
      fonts: { heading: 'Cormorant Garamond', body: 'Lato' },
      textColors: { username: '#c9a227', description: '#a0a0a0' },
    },
    { colors: ['#1a1a2e', '#c9a227'], isDark: true },
    true // PRO
  ),
];

// ============================================
// NATURE THEMES
// ============================================

export const NATURE_THEMES: ThemePreset[] = [
  createPreset(
    'nature-green',
    'Nature Green',
    'Fresh and natural green tones',
    'nature',
    {
      background: { type: 'gradient', solidColor: '#ffffff', gradientStart: '#11998e', gradientEnd: '#38ef7d', gradientDirection: 'to-br', imageUrl: '' },
      buttons: { style: 'pill', backgroundColor: '#ffffff', textColor: '#11998e', borderColor: '#ffffff', hasShadow: false },
      fonts: { heading: 'Nunito', body: 'Open Sans' },
      textColors: { username: '#ffffff', description: '#e8f5e9' },
    },
    { colors: ['#11998e', '#38ef7d'] }
  ),
  createPreset(
    'forest',
    'Deep Forest',
    'Rich forest greens',
    'nature',
    {
      background: { type: 'gradient', solidColor: '#1d3c34', gradientStart: '#1d3c34', gradientEnd: '#2d5a4e', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'rounded', backgroundColor: '#4ade80', textColor: '#1d3c34', borderColor: '#4ade80', hasShadow: true },
      fonts: { heading: 'Bitter', body: 'Lato' },
      textColors: { username: '#86efac', description: '#6ee7b7' },
    },
    { colors: ['#1d3c34', '#4ade80'], isDark: true }
  ),
  createPreset(
    'desert-sand',
    'Desert Sand',
    'Warm earth tones',
    'nature',
    {
      background: { type: 'gradient', solidColor: '#fef3e2', gradientStart: '#fef3e2', gradientEnd: '#ffe4c4', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'rounded', backgroundColor: '#cd853f', textColor: '#ffffff', borderColor: '#cd853f', hasShadow: true },
      fonts: { heading: 'EB Garamond', body: 'Lora' },
      textColors: { username: '#8b4513', description: '#a0522d' },
    },
    { colors: ['#fef3e2', '#cd853f'] }
  ),
  createPreset(
    'ocean-breeze',
    'Ocean Breeze',
    'Calming sea colors',
    'nature',
    {
      background: { type: 'gradient', solidColor: '#e0f7fa', gradientStart: '#e0f7fa', gradientEnd: '#b2ebf2', gradientDirection: 'to-b', imageUrl: '' },
      buttons: { style: 'pill', backgroundColor: '#006064', textColor: '#ffffff', borderColor: '#006064', hasShadow: true },
      fonts: { heading: 'Manrope', body: 'Inter' },
      textColors: { username: '#004d40', description: '#00695c' },
    },
    { colors: ['#e0f7fa', '#006064'] }
  ),
];

// ============================================
// ALL THEMES COMBINED
// ============================================

export const ALL_THEME_PRESETS: ThemePreset[] = [
  ...MINIMAL_THEMES,
  ...DARK_THEMES,
  ...GRADIENT_THEMES,
  ...COLORFUL_THEMES,
  ...PROFESSIONAL_THEMES,
  ...NATURE_THEMES,
];

// Get themes by category
export const getThemesByCategory = (category: ThemePreset['category']): ThemePreset[] => {
  return ALL_THEME_PRESETS.filter(theme => theme.category === category);
};

// Get free themes only
export const getFreeThemes = (): ThemePreset[] => {
  return ALL_THEME_PRESETS.filter(theme => !theme.isPro);
};

// Get pro themes only
export const getProThemes = (): ThemePreset[] => {
  return ALL_THEME_PRESETS.filter(theme => theme.isPro);
};

// Find theme by ID
export const getThemeById = (id: string): ThemePreset | undefined => {
  return ALL_THEME_PRESETS.find(theme => theme.id === id);
};

// Theme categories for display
export const THEME_CATEGORIES: { id: ThemePreset['category']; name: string; icon: string }[] = [
  { id: 'minimal', name: 'Minimal', icon: '◻️' },
  { id: 'dark', name: 'Dark', icon: '🌙' },
  { id: 'gradient', name: 'Gradient', icon: '🌈' },
  { id: 'colorful', name: 'Colorful', icon: '🎨' },
  { id: 'professional', name: 'Professional', icon: '💼' },
  { id: 'nature', name: 'Nature', icon: '🌿' },
];

