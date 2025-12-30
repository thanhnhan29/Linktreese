// src/shared/types/theme.ts
// Comprehensive theme type definitions

export type BackgroundType = 'solid' | 'gradient' | 'image';
export type ButtonStyle = 'rounded' | 'square' | 'pill';
export type GradientDirection = 'to-b' | 'to-t' | 'to-r' | 'to-l' | 'to-br' | 'to-bl';

// Background configuration
export interface BackgroundConfig {
  type: BackgroundType;
  solidColor: string;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: GradientDirection;
  imageUrl: string;
}

// Button configuration
export interface ButtonConfig {
  style: ButtonStyle;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hasShadow: boolean;
}

// Font configuration
export interface FontConfig {
  heading: string;
  body: string;
}

// Text color configuration
export interface TextColorConfig {
  username: string;
  description: string;
}

// Full theme configuration (used by Appearance component)
export interface AppearanceConfig {
  background: BackgroundConfig;
  buttons: ButtonConfig;
  fonts: FontConfig;
  textColors: TextColorConfig;
}

// Theme preset/template
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  isPro: boolean;
  config: AppearanceConfig;
  preview: {
    colors: string[];
    isDark?: boolean;
  };
}

// Theme categories
export type ThemeCategory = 
  | 'minimal'
  | 'dark'
  | 'gradient'
  | 'colorful'
  | 'professional'
  | 'nature'
  | 'seasonal';

// Google Font option
export interface FontOption {
  name: string;
  value: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
}

// Default configurations
export const DEFAULT_BACKGROUND: BackgroundConfig = {
  type: 'solid',
  solidColor: '#ffffff',
  gradientStart: '#8129d9',
  gradientEnd: '#43E660',
  gradientDirection: 'to-b',
  imageUrl: '',
};

export const DEFAULT_BUTTONS: ButtonConfig = {
  style: 'rounded',
  backgroundColor: '#8129d9',
  textColor: '#ffffff',
  borderColor: '#8129d9',
  hasShadow: true,
};

export const DEFAULT_FONTS: FontConfig = {
  heading: 'Inter',
  body: 'Inter',
};

export const DEFAULT_TEXT_COLORS: TextColorConfig = {
  username: '#000000',
  description: '#676b5f',
};

export const DEFAULT_APPEARANCE_CONFIG: AppearanceConfig = {
  background: DEFAULT_BACKGROUND,
  buttons: DEFAULT_BUTTONS,
  fonts: DEFAULT_FONTS,
  textColors: DEFAULT_TEXT_COLORS,
};

// Convert AppearanceConfig to ThemeConfig (for backward compatibility)
export function appearanceToThemeConfig(appearance: AppearanceConfig): import('./index').ThemeConfig {
  return {
    backgroundType: appearance.background.type,
    backgroundValue: appearance.background.type === 'solid' 
      ? appearance.background.solidColor 
      : appearance.background.imageUrl || appearance.background.gradientStart,
    gradientStart: appearance.background.gradientStart,
    gradientEnd: appearance.background.gradientEnd,
    gradientDirection: appearance.background.gradientDirection,
    buttonStyle: appearance.buttons.style,
    buttonColor: appearance.buttons.backgroundColor,
    buttonTextColor: appearance.buttons.textColor,
    buttonShadow: appearance.buttons.hasShadow,
    fontFamily: appearance.fonts.heading,
    textColor: appearance.textColors.username,
    usernameColor: appearance.textColors.username,
    descriptionColor: appearance.textColors.description,
  };
}

// Convert ThemeConfig to AppearanceConfig (for backward compatibility)
export function themeConfigToAppearance(theme: import('./index').ThemeConfig): AppearanceConfig {
  return {
    background: {
      type: theme.backgroundType,
      solidColor: theme.backgroundType === 'solid' ? theme.backgroundValue : '#ffffff',
      gradientStart: theme.gradientStart || '#8129d9',
      gradientEnd: theme.gradientEnd || '#43E660',
      gradientDirection: theme.gradientDirection || 'to-b',
      imageUrl: theme.backgroundType === 'image' ? theme.backgroundValue : '',
    },
    buttons: {
      style: theme.buttonStyle,
      backgroundColor: theme.buttonColor,
      textColor: theme.buttonTextColor,
      borderColor: theme.buttonColor,
      hasShadow: theme.buttonShadow,
    },
    fonts: {
      heading: theme.fontFamily.split(',')[0].trim(),
      body: theme.fontFamily.split(',')[0].trim(),
    },
    textColors: {
      username: theme.usernameColor,
      description: theme.descriptionColor,
    },
  };
}

