// src/features/custom-domain/index.ts
// Custom Domain feature public API

export { customDomainService } from "./services/customDomainService";
export { useCustomDomain } from "./hooks/useCustomDomain";
export type {
  CustomDomain,
  DomainStatus,
  CreateDomainInput,
  VerifyDomainInput,
  DeleteDomainInput,
} from "@/shared/types/customDomain";
