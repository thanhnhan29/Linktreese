// src/features/bio-page/hooks/useTheme.ts
// Hook for managing theme state and actions

import { useState, useEffect, useCallback, useMemo } from 'react';
import { themeService } from '../services/themeService';
import { 
  DEFAULT_APPEARANCE_CONFIG, 
  themeConfigToAppearance,
  type AppearanceConfig,
  type ThemePreset,
  type ThemeCategory,
} from '@/shared/types/theme';
import type { BioPage } from '@/shared/types';
import { toast } from 'sonner';

interface UseThemeReturn {
  // Current theme config
  config: AppearanceConfig;
  
  // Theme presets
  presets: ThemePreset[];
  categories: { id: ThemeCategory; name: string; icon: string }[];
  selectedPresetId: string | null;
  
  // Fonts
  fonts: ReturnType<typeof themeService.getAllFonts>;
  fontPairings: ReturnType<typeof themeService.getFontPairings>;
  
  // Loading state
  loading: boolean;
  saving: boolean;
  
  // Actions
  updateBackground: (updates: Partial<AppearanceConfig['background']>) => void;
  updateButtons: (updates: Partial<AppearanceConfig['buttons']>) => void;
  updateFonts: (updates: Partial<AppearanceConfig['fonts']>) => void;
  updateTextColors: (updates: Partial<AppearanceConfig['textColors']>) => void;
  
  applyPreset: (presetId: string) => void;
  saveTheme: () => Promise<void>;
  resetTheme: () => void;
  
  // Utilities
  getPresetsByCategory: (category: ThemeCategory) => ThemePreset[];
  isColorDark: (color: string) => boolean;
  getContrastColor: (color: string) => string;
}

export function useTheme(
  bioPage: BioPage | null,
  onConfigChange?: (config: AppearanceConfig) => void
): UseThemeReturn {
  const [config, setConfig] = useState<AppearanceConfig>(DEFAULT_APPEARANCE_CONFIG);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load fonts data
  const fonts = useMemo(() => themeService.getAllFonts(), []);
  const fontPairings = useMemo(() => themeService.getFontPairings(), []);
  const presets = useMemo(() => themeService.getAllPresets(), []);
  const categories = useMemo(() => themeService.getCategories(), []);

  // Load theme from bio page or local draft
  useEffect(() => {
    if (!bioPage) {
      setLoading(false);
      return;
    }

    // First try to load draft from localStorage
    const draft = themeService.getDraft(bioPage.username);
    if (draft) {
      setConfig(draft);
      setLoading(false);
      return;
    }

    // Otherwise, load from bio page's themeConfig
    if (bioPage.themeConfig) {
      const appearanceConfig = themeConfigToAppearance(bioPage.themeConfig);
      setConfig(appearanceConfig);
    }
    
    setLoading(false);
  }, [bioPage]);

  // Load Google Fonts
  useEffect(() => {
    const fontsToLoad = [config.fonts.heading, config.fonts.body];
    const fontsUrl = themeService.generateFontsUrl(fontsToLoad);
    
    // Check if link already exists
    const existingLink = document.querySelector(`link[href="${fontsUrl}"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontsUrl;
      document.head.appendChild(link);
    }
  }, [config.fonts]);

  // Update functions
  const updateConfig = useCallback((updates: Partial<AppearanceConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      
      // Save draft to localStorage
      if (bioPage) {
        themeService.saveDraft(bioPage.username, newConfig);
      }
      
      // Notify parent of change
      onConfigChange?.(newConfig);
      
      // Clear selected preset since user is customizing
      setSelectedPresetId(null);
      
      return newConfig;
    });
  }, [bioPage, onConfigChange]);

  const updateBackground = useCallback((updates: Partial<AppearanceConfig['background']>) => {
    updateConfig({ background: { ...config.background, ...updates } });
  }, [config.background, updateConfig]);

  const updateButtons = useCallback((updates: Partial<AppearanceConfig['buttons']>) => {
    updateConfig({ buttons: { ...config.buttons, ...updates } });
  }, [config.buttons, updateConfig]);

  const updateFonts = useCallback((updates: Partial<AppearanceConfig['fonts']>) => {
    updateConfig({ fonts: { ...config.fonts, ...updates } });
  }, [config.fonts, updateConfig]);

  const updateTextColors = useCallback((updates: Partial<AppearanceConfig['textColors']>) => {
    updateConfig({ textColors: { ...config.textColors, ...updates } });
  }, [config.textColors, updateConfig]);

  // Apply preset
  const applyPreset = useCallback((presetId: string) => {
    const preset = themeService.getPresetById(presetId);
    if (!preset) {
      toast.error('Theme preset not found');
      return;
    }

    setConfig(preset.config);
    setSelectedPresetId(presetId);
    
    // Save draft to localStorage
    if (bioPage) {
      themeService.saveDraft(bioPage.username, preset.config);
    }
    
    // Notify parent of change
    onConfigChange?.(preset.config);
    
    toast.success(`Applied "${preset.name}" theme`);
  }, [bioPage, onConfigChange]);

  // Save theme to Firestore
  const saveTheme = useCallback(async () => {
    if (!bioPage?.id) {
      toast.error('No bio page selected');
      return;
    }

    setSaving(true);
    try {
      await themeService.saveTheme(bioPage.id, config);
      
      // Clear draft after successful save
      themeService.clearDraft(bioPage.username);
      
      toast.success('Theme saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save theme');
      throw error;
    } finally {
      setSaving(false);
    }
  }, [bioPage, config]);

  // Reset theme
  const resetTheme = useCallback(() => {
    setConfig(DEFAULT_APPEARANCE_CONFIG);
    setSelectedPresetId(null);
    
    if (bioPage) {
      themeService.clearDraft(bioPage.username);
    }
    
    onConfigChange?.(DEFAULT_APPEARANCE_CONFIG);
    toast.success('Theme reset to default');
  }, [bioPage, onConfigChange]);

  // Get presets by category
  const getPresetsByCategory = useCallback((category: ThemeCategory) => {
    return themeService.getPresetsByCategory(category);
  }, []);

  // Utility functions
  const isColorDark = useCallback((color: string) => {
    return themeService.isColorDark(color);
  }, []);

  const getContrastColor = useCallback((color: string) => {
    return themeService.getContrastColor(color);
  }, []);

  return {
    config,
    presets,
    categories,
    selectedPresetId,
    fonts,
    fontPairings,
    loading,
    saving,
    updateBackground,
    updateButtons,
    updateFonts,
    updateTextColors,
    applyPreset,
    saveTheme,
    resetTheme,
    getPresetsByCategory,
    isColorDark,
    getContrastColor,
  };
}

