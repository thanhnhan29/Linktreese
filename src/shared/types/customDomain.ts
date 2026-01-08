// src/shared/types/customDomain.ts
// Custom Domain type definitions

export type DomainStatus = "pending" | "verified" | "active" | "failed";

export interface CustomDomain {
  id: string;
  userId: string;
  bioPageId: string;
  domain: string; // e.g., "mysite.com" or "links.mysite.com"
  status: DomainStatus;
  verificationToken: string; // TXT record value for verification
  verificationMethod: "txt" | "cname"; // DNS verification method
  verifiedAt?: Date;
  sslEnabled: boolean;
  sslIssuedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Error tracking
  lastError?: string;
}

export interface CreateDomainInput {
  bioPageId: string;
  domain: string;
}

export interface VerifyDomainInput {
  domainId: string;
}

export interface DeleteDomainInput {
  domainId: string;
}
