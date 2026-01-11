// src/features/bio-page/index.ts
// Bio page feature public API

// Components
export { CreateUsernameForm } from "./components/CreateUsernameForm";
export { default as Dashboard } from "./components/Dashboard";
export { default as PublicBioPage } from "./components/PublicBioPage";
export { default as DonateBlockView } from "./components/DonateBlockView";
export { default as ContactFormBlockView } from "./components/ContactFormBlockView";
export { default as AuthorProfileModal } from "./components/AuthorProfileModal";
export { default as BioPageCard } from "./components/BioPageCard";

// Services
export { bioPageService } from "./services/bioPageService";
export { linkService } from "./services/linkService";
export { blockService } from "./services/blockService";
export { themeService } from "./services/themeService";
export { bioWriterService } from "./services/bioWriterService";
export { ecommerceService, PLACEHOLDER_IMAGE } from "./services/ecommerceService";
export { donateService, DONATE_ERROR_MESSAGES } from "./services/donateService";
export { contactService, CONTACT_ERROR_MESSAGES } from "./services/contactService";
export { authorService } from "./services/authorService";
export type {
  CreateBioPageInput,
  UpdateBioPageInput,
} from "./services/bioPageService";
export type { CreateLinkInput, UpdateLinkInput } from "./services/linkService";
export type {
  CreateBlockInput,
  UpdateBlockInput,
} from "./services/blockService";
export type { BioStyle, BioLanguage } from "./services/bioWriterService";
export type { AuthorOverview, BioPageSummary } from "./services/authorService";

// Hooks
export {
  useBioPage,
  useLinks,
  useBlocks,
  useTheme,
  useBioWriter,
  useFileImage,
} from "./hooks";

// Re-export types
export type {
  BioPage,
  ThemeConfig,
  Link,
  Block,
  BlockType,
} from "@/shared/types";

// Re-export block types
export type {
  EcommercePlatform,
  ProductMetadata,
  EcommerceBlockData,
} from "@/shared/types/ecommerce";

export type {
  DonatePaymentMethod,
  DonateBlockData,
} from "@/shared/types/donate";

export type {
  ContactBlockData,
  ContactFormSubmission,
} from "@/shared/types/contact";
