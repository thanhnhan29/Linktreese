// src/features/bio-page/services/themeService.ts
// Theme business logic service

import { bioPageRepository } from '@/infrastructure/repositories';
import { NotFoundError } from '@/shared/lib/errors';
import { 
  ALL_THEME_PRESETS, 
  getThemeById, 
  getThemesByCategory,
  getFreeThemes,
  getProThemes,
  THEME_CATEGORIES,
} from '@/shared/lib/theme/presets';
import { GOOGLE_FONTS, FONT_PAIRINGS, generateGoogleFontsUrl } from '@/shared/lib/theme/fonts';
import type { 
  AppearanceConfig, 
  ThemePreset, 
  ThemeCategory,
} from '@/shared/types/theme';
import { appearanceToThemeConfig, themeConfigToAppearance } from '@/shared/types/theme';

class ThemeService {
  // ============================================
  // THEME PRESETS
  // ============================================

  /**
   * Get all available theme presets
   */
  getAllPresets(): ThemePreset[] {
    return ALL_THEME_PRESETS;
  }

  /**
   * Get theme presets by category
   */
  getPresetsByCategory(category: ThemeCategory): ThemePreset[] {
    return getThemesByCategory(category);
  }

  /**
   * Get only free theme presets
   */
  getFreePresets(): ThemePreset[] {
    return getFreeThemes();
  }

  /**
   * Get only pro theme presets
   */
  getProPresets(): ThemePreset[] {
    return getProThemes();
  }

  /**
   * Get a specific theme preset by ID
   */
  getPresetById(id: string): ThemePreset | undefined {
    return getThemeById(id);
  }

  /**
   * Get all theme categories
   */
  getCategories() {
    return THEME_CATEGORIES;
  }

  // ============================================
  // FONTS
  // ============================================

  /**
   * Get all available fonts
   */
  getAllFonts() {
    return GOOGLE_FONTS;
  }

  /**
   * Get recommended font pairings
   */
  getFontPairings() {
    return FONT_PAIRINGS;
  }

  /**
   * Generate Google Fonts URL for given fonts
   */
  generateFontsUrl(fonts: string[]): string {
    return generateGoogleFontsUrl(fonts);
  }

  // ============================================
  // THEME PERSISTENCE
  // ============================================

  /**
   * Apply a theme preset to a bio page
   */
  async applyPreset(bioPageId: string, presetId: string): Promise<void> {
    const preset = getThemeById(presetId);
    if (!preset) {
      throw new NotFoundError('Theme preset');
    }

    const themeConfig = appearanceToThemeConfig(preset.config);
    
    await bioPageRepository.update(bioPageId, {
      themeConfig,
    });
  }

  /**
   * Save custom theme configuration to a bio page
   */
  async saveTheme(bioPageId: string, config: AppearanceConfig): Promise<void> {
    const themeConfig = appearanceToThemeConfig(config);
    
    await bioPageRepository.update(bioPageId, {
      themeConfig,
    });
  }

  /**
   * Get current theme for a bio page as AppearanceConfig
   */
  async getTheme(bioPageId: string): Promise<AppearanceConfig | null> {
    const bioPage = await bioPageRepository.findById(bioPageId);
    if (!bioPage) {
      return null;
    }

    return themeConfigToAppearance(bioPage.themeConfig);
  }

  /**
   * Reset theme to default
   */
  async resetTheme(bioPageId: string): Promise<void> {
    const { DEFAULT_APPEARANCE_CONFIG } = await import('@/shared/types/theme');
    const themeConfig = appearanceToThemeConfig(DEFAULT_APPEARANCE_CONFIG);
    
    await bioPageRepository.update(bioPageId, {
      themeConfig,
    });
  }

  // ============================================
  // LOCAL STORAGE (for preview/draft)
  // ============================================

  /**
   * Save theme draft to local storage
   */
  saveDraft(username: string, config: AppearanceConfig): void {
    localStorage.setItem(`theme_draft_${username}`, JSON.stringify(config));
  }

  /**
   * Get theme draft from local storage
   */
  getDraft(username: string): AppearanceConfig | null {
    const saved = localStorage.getItem(`theme_draft_${username}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Clear theme draft
   */
  clearDraft(username: string): void {
    localStorage.removeItem(`theme_draft_${username}`);
  }

  // ============================================
  // THEME UTILITIES
  // ============================================

  /**
   * Check if a color is dark (for text contrast)
   */
  isColorDark(hexColor: string): boolean {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance < 0.5;
  }

  /**
   * Get contrast color (black or white) for a given background
   */
  getContrastColor(hexColor: string): string {
    return this.isColorDark(hexColor) ? '#ffffff' : '#000000';
  }

  /**
   * Generate CSS for a theme
   */
  generateThemeCSS(config: AppearanceConfig): string {
    const { background, buttons, fonts, textColors } = config;

    let backgroundCSS = '';
    if (background.type === 'solid') {
      backgroundCSS = `background-color: ${background.solidColor};`;
    } else if (background.type === 'gradient') {
      const direction = background.gradientDirection.replace('to-', 'to ').replace('-', ' ');
      backgroundCSS = `background: linear-gradient(${direction}, ${background.gradientStart}, ${background.gradientEnd});`;
    } else if (background.type === 'image' && background.imageUrl) {
      backgroundCSS = `background-image: url(${background.imageUrl}); background-size: cover; background-position: center;`;
    }

    let buttonRadius = '8px';
    if (buttons.style === 'square') buttonRadius = '0px';
    if (buttons.style === 'pill') buttonRadius = '50px';

    return `
      .theme-background { ${backgroundCSS} }
      .theme-button {
        background-color: ${buttons.backgroundColor};
        color: ${buttons.textColor};
        border: 2px solid ${buttons.borderColor};
        border-radius: ${buttonRadius};
        ${buttons.hasShadow ? 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);' : ''}
      }
      .theme-heading { font-family: '${fonts.heading}', sans-serif; }
      .theme-body { font-family: '${fonts.body}', sans-serif; }
      .theme-username { color: ${textColors.username}; }
      .theme-description { color: ${textColors.description}; }
    `;
  }
}

export const themeService = new ThemeService();

