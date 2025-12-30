// src/features/bio-page/services/bioWriterService.ts
// AI-powered bio writing service using Google Gemini

import { GoogleGenAI } from '@google/genai';

export type BioStyle = 
  | 'professional' 
  | 'creative' 
  | 'casual' 
  | 'funny' 
  | 'minimal' 
  | 'inspiring';

export type BioLanguage = 'en' | 'vi';

interface GenerateBioOptions {
  currentBio?: string;
  style?: BioStyle;
  language?: BioLanguage;
  keywords?: string[];
  maxLength?: number;
}

interface BioSuggestion {
  text: string;
  style: BioStyle;
}

const STYLE_PROMPTS: Record<BioStyle, Record<BioLanguage, string>> = {
  professional: {
    en: 'Write a professional, business-focused bio that highlights expertise and credibility.',
    vi: 'Viết bio chuyên nghiệp, tập trung vào kinh nghiệm và uy tín trong công việc.',
  },
  creative: {
    en: 'Write a creative, artistic bio that showcases uniqueness and personality.',
    vi: 'Viết bio sáng tạo, nghệ thuật, thể hiện sự độc đáo và cá tính.',
  },
  casual: {
    en: 'Write a friendly, approachable bio that feels relaxed and genuine.',
    vi: 'Viết bio thân thiện, dễ gần, tự nhiên và chân thực.',
  },
  funny: {
    en: 'Write a humorous, witty bio that makes people smile.',
    vi: 'Viết bio hài hước, dí dỏm, khiến người đọc mỉm cười.',
  },
  minimal: {
    en: 'Write a short, concise bio that gets straight to the point.',
    vi: 'Viết bio ngắn gọn, súc tích, đi thẳng vào vấn đề.',
  },
  inspiring: {
    en: 'Write an inspiring, motivational bio that encourages and uplifts.',
    vi: 'Viết bio truyền cảm hứng, tạo động lực cho người đọc.',
  },
};

class BioWriterService {
  private ai: GoogleGenAI | null = null;
  private modelName = 'gemini-2.5-flash';

  private getAI(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
      }
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  /**
   * Check if AI bio writing is available
   */
  isAvailable(): boolean {
    return !!import.meta.env.VITE_GEMINI_API_KEY;
  }

  /**
   * Improve an existing bio using AI
   */
  async improveBio(options: GenerateBioOptions): Promise<string> {
    const { 
      currentBio, 
      style = 'professional', 
      language = 'en',
      maxLength = 200 
    } = options;

    if (!currentBio?.trim()) {
      throw new Error('Please provide a bio to improve.');
    }

    const ai = this.getAI();
    const stylePrompt = STYLE_PROMPTS[style][language];

    const prompt = language === 'vi'
      ? `${stylePrompt}

Viết lại bio sau đây cho hấp dẫn và cuốn hút hơn. Giữ ý nghĩa cốt lõi nhưng làm cho nó thú vị hơn.
Giới hạn: tối đa ${maxLength} ký tự.
Chỉ trả về bio mới, không giải thích gì thêm.

Bio hiện tại: "${currentBio}"`
      : `${stylePrompt}

Rewrite the following bio to make it more engaging and compelling. Keep the core meaning but make it more interesting.
Limit: maximum ${maxLength} characters.
Only return the new bio, no explanations.

Current bio: "${currentBio}"`;

    const response = await ai.models.generateContent({
      model: this.modelName,
      contents: prompt,
    });

    let result = (response.text || '').trim();
    // Remove surrounding quotes if present
    result = result.replace(/^["']|["']$/g, '');
    
    // Ensure it's within the max length
    if (result.length > maxLength) {
      result = result.substring(0, maxLength - 3) + '...';
    }

    return result;
  }

  /**
   * Generate a new bio from scratch
   */
  async generateBio(options: GenerateBioOptions): Promise<string> {
    const { 
      style = 'professional', 
      language = 'en',
      keywords = [],
      maxLength = 200 
    } = options;

    const ai = this.getAI();
    const stylePrompt = STYLE_PROMPTS[style][language];

    const keywordText = keywords.length > 0 
      ? (language === 'vi' 
          ? `Từ khóa để bao gồm: ${keywords.join(', ')}` 
          : `Keywords to include: ${keywords.join(', ')}`)
      : '';

    const prompt = language === 'vi'
      ? `${stylePrompt}

Tạo một bio Linktree mới. ${keywordText}
Giới hạn: tối đa ${maxLength} ký tự.
Chỉ trả về bio, không giải thích gì thêm.`
      : `${stylePrompt}

Create a new Linktree bio. ${keywordText}
Limit: maximum ${maxLength} characters.
Only return the bio, no explanations.`;

    const response = await ai.models.generateContent({
      model: this.modelName,
      contents: prompt,
    });

    let result = (response.text || '').trim();
    result = result.replace(/^["']|["']$/g, '');
    
    if (result.length > maxLength) {
      result = result.substring(0, maxLength - 3) + '...';
    }

    return result;
  }

  /**
   * Generate multiple bio suggestions in different styles
   */
  async generateSuggestions(
    currentBio: string,
    language: BioLanguage = 'en',
    maxLength: number = 200
  ): Promise<BioSuggestion[]> {
    const styles: BioStyle[] = ['professional', 'creative', 'casual'];
    const suggestions: BioSuggestion[] = [];

    for (const style of styles) {
      try {
        const text = await this.improveBio({
          currentBio,
          style,
          language,
          maxLength,
        });
        suggestions.push({ text, style });
      } catch (error) {
        console.error(`Failed to generate ${style} suggestion:`, error);
      }
    }

    return suggestions;
  }

  /**
   * Translate a bio to another language
   */
  async translateBio(bio: string, targetLanguage: BioLanguage): Promise<string> {
    const ai = this.getAI();

    const prompt = targetLanguage === 'vi'
      ? `Dịch bio sau sang tiếng Việt, giữ nguyên phong cách và ý nghĩa. Chỉ trả về bản dịch, không giải thích.

Bio: "${bio}"`
      : `Translate the following bio to English, keeping the style and meaning. Only return the translation, no explanations.

Bio: "${bio}"`;

    const response = await ai.models.generateContent({
      model: this.modelName,
      contents: prompt,
    });

    let result = (response.text || '').trim();
    result = result.replace(/^["']|["']$/g, '');

    return result;
  }
}

// Export singleton instance
export const bioWriterService = new BioWriterService();

