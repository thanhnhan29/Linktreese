// Re-export Block type from shared types for backward compatibility
// This file is deprecated - use @/shared/types instead
export type { Block, BlockType } from '@/shared/types';

// Legacy component - no longer used
// Block management is now unified in LinkEditor.tsx
export default function Blocks() {
  console.warn('Blocks component is deprecated. Use LinkEditor instead.');
  return null;
}