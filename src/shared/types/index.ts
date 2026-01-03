// src/shared/types/index.ts
// Shared type definitions

// User types
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  authProvider: "email" | "google";
  proPurchase: boolean;
  proExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  uid: string;
  email: string;
}

// Bio page types
export interface ThemeConfig {
  backgroundType: "solid" | "gradient" | "image";
  backgroundValue: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: "to-b" | "to-t" | "to-r" | "to-l" | "to-br" | "to-bl";
  buttonStyle: "rounded" | "square" | "pill";
  buttonColor: string;
  buttonTextColor: string;
  buttonShadow: boolean;
  fontFamily: string;
  textColor: string;
  usernameColor: string;
  descriptionColor: string;
}

export interface PageSettings {
  hideVielinkLogo: boolean;
  enableAnalytics: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BioPage {
  id: string;
  userId: string;
  username: string;
  displayName?: string;
  bioDescription?: string;
  avatarUrl?: string;
  isLogoHidden: boolean;
  published: boolean;
  viewCount: number;
  themeConfig: ThemeConfig;
  settings?: PageSettings;
  customDomain?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// Link types
export interface Link {
  id: string;
  title: string;
  url: string;
  type: "social" | "custom";
  platform?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  clickCount: number;
  data?: Record<string, unknown>;
  createdAt: Date;
}

// Block types
export type BlockType = "ecommerce" | "donate" | "contact" | "chat";

export interface Block {
  id: string;
  type: BlockType;
  title: string;
  isVisible: boolean;
  sortOrder: number;
  clickCount: number;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt?: Date;
}

// API types
export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}

// Default values
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  backgroundType: "solid",
  backgroundValue: "#ffffff",
  buttonStyle: "rounded",
  buttonColor: "#8129d9",
  buttonTextColor: "#ffffff",
  buttonShadow: false,
  fontFamily: "Inter, sans-serif",
  textColor: "#000000",
  usernameColor: "#000000",
  descriptionColor: "#676b5f",
};

// Re-export theme types
export * from "./theme";

// Re-export analytics types
export * from "./analytics";
