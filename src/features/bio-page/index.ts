// src/features/bio-page/index.ts
// Bio page feature public API

// Components
export { CreateUsernameForm } from './components/CreateUsernameForm';
export { default as Dashboard } from './components/Dashboard';

// Services
export { bioPageService } from './services/bioPageService';
export { linkService } from './services/linkService';
export { blockService } from './services/blockService';
export { themeService } from './services/themeService';
export { bioWriterService } from './services/bioWriterService';
export type { CreateBioPageInput, UpdateBioPageInput } from './services/bioPageService';
export type { CreateLinkInput, UpdateLinkInput } from './services/linkService';
export type { CreateBlockInput, UpdateBlockInput } from './services/blockService';
export type { BioStyle, BioLanguage } from './services/bioWriterService';

// Hooks
export { 
  useBioPage, 
  useLinks, 
  useBlocks, 
  useTheme,
  useBioWriter,
  useFileImage,
} from './hooks';

// Re-export types
export type { BioPage, ThemeConfig, Link, Block, BlockType } from '@/shared/types';
