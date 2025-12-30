// src/features/bio-page/hooks/useBioWriter.ts
// Hook for AI-powered bio writing

import { useState, useCallback } from 'react';
import { bioWriterService, type BioStyle, type BioLanguage } from '../services/bioWriterService';

interface BioSuggestion {
  text: string;
  style: BioStyle;
}

interface UseBioWriterReturn {
  // State
  isGenerating: boolean;
  suggestion: string | null;
  suggestions: BioSuggestion[];
  error: string | null;
  isAvailable: boolean;
  
  // Actions
  improveBio: (bio: string, style?: BioStyle, language?: BioLanguage) => Promise<void>;
  generateBio: (keywords?: string[], style?: BioStyle, language?: BioLanguage) => Promise<void>;
  generateSuggestions: (bio: string, language?: BioLanguage) => Promise<void>;
  translateBio: (bio: string, targetLanguage: BioLanguage) => Promise<string | null>;
  clearSuggestion: () => void;
  clearSuggestions: () => void;
}

export function useBioWriter(): UseBioWriterReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<BioSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isAvailable = bioWriterService.isAvailable();

  const improveBio = useCallback(async (
    bio: string, 
    style: BioStyle = 'professional',
    language: BioLanguage = 'en'
  ) => {
    if (!bio.trim()) {
      setError('Please enter a bio first.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await bioWriterService.improveBio({
        currentBio: bio,
        style,
        language,
      });
      setSuggestion(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate bio';
      setError(message);
      console.error('Bio improvement error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateBio = useCallback(async (
    keywords: string[] = [],
    style: BioStyle = 'professional',
    language: BioLanguage = 'en'
  ) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await bioWriterService.generateBio({
        keywords,
        style,
        language,
      });
      setSuggestion(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate bio';
      setError(message);
      console.error('Bio generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateSuggestions = useCallback(async (
    bio: string,
    language: BioLanguage = 'en'
  ) => {
    if (!bio.trim()) {
      setError('Please enter a bio first.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const results = await bioWriterService.generateSuggestions(bio, language);
      setSuggestions(results);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate suggestions';
      setError(message);
      console.error('Suggestions generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const translateBio = useCallback(async (
    bio: string,
    targetLanguage: BioLanguage
  ): Promise<string | null> => {
    if (!bio.trim()) {
      setError('Please enter a bio first.');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await bioWriterService.translateBio(bio, targetLanguage);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to translate bio';
      setError(message);
      console.error('Translation error:', err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearSuggestion = useCallback(() => {
    setSuggestion(null);
    setError(null);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    isGenerating,
    suggestion,
    suggestions,
    error,
    isAvailable,
    improveBio,
    generateBio,
    generateSuggestions,
    translateBio,
    clearSuggestion,
    clearSuggestions,
  };
}

