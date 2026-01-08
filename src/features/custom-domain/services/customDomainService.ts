// src/features/custom-domain/services/customDomainService.ts
// Custom Domain business logic service

import { customDomainRepository } from "@/infrastructure/repositories/customDomainRepository";
import type {
  CustomDomain,
  CreateDomainInput,
  VerifyDomainInput,
  DeleteDomainInput,
} from "@/shared/types/customDomain";

class CustomDomainService {
  /**
   * Generate a random verification token
   */
  private generateVerificationToken(): string {
    return `vielink-verify-${Math.random()
      .toString(36)
      .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Validate domain format
   */
  private validateDomain(domain: string): { valid: boolean; error?: string } {
    const trimmed = domain.toLowerCase().trim();

    // Basic domain validation regex
    const domainRegex =
      /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;

    if (!domainRegex.test(trimmed)) {
      return { valid: false, error: "Invalid domain format" };
    }

    // Block common subdomains that might conflict
    if (trimmed.includes("vielink.vn") || trimmed.includes("localhost")) {
      return { valid: false, error: "Cannot use this domain" };
    }

    return { valid: true };
  }

  /**
   * Check if domain is already taken
   */
  async isDomainAvailable(domain: string): Promise<boolean> {
    const existing = await customDomainRepository.getDomainByName(domain);
    return existing === null;
  }

  /**
   * Create a new custom domain
   */
  async createDomain(
    userId: string,
    input: CreateDomainInput
  ): Promise<{ success: boolean; domainId?: string; error?: string }> {
    try {
      // Validate domain format
      const validation = this.validateDomain(input.domain);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Check if domain is available
      const available = await this.isDomainAvailable(input.domain);
      if (!available) {
        return { success: false, error: "Domain is already in use" };
      }

      // Generate verification token
      const verificationToken = this.generateVerificationToken();

      // Create domain record
      const domainId = await customDomainRepository.createDomain({
        userId,
        bioPageId: input.bioPageId,
        domain: input.domain,
        verificationToken,
        verificationMethod: "txt", // Default to TXT record
      });

      return { success: true, domainId };
    } catch (error: any) {
      console.error("Error creating domain:", error);
      return {
        success: false,
        error: error.message || "Failed to create domain",
      };
    }
  }

  /**
   * Activate domain for self-hosted/tunnel use case
   * No DNS verification needed - user controls the tunnel directly
   * Domain mapping just links tunnel URL → bioPageId in Firestore
   */
  async verifyDomain(
    input: VerifyDomainInput
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const domain = await customDomainRepository.getDomainById(input.domainId);

      if (!domain) {
        return { success: false, error: "Domain not found" };
      }

      if (domain.status === "active") {
        return { success: true };
      }

      // SELF-HOSTED/TUNNEL MODE:
      // - User runs localhost + tunnel (ngrok/cloudflared)
      // - Tunnel URL points to their machine
      // - We just save domain → bioPageId mapping
      // - When visitor hits tunnel URL, request comes to localhost
      // - PublicBioPage checks hostname, looks up bioPageId from Firestore

      console.log(`[Custom Domain] Activating: ${domain.domain}`);
      console.log(`[Custom Domain] Mapped to bioPageId: ${domain.bioPageId}`);

      // Immediately mark as active (no DNS verification needed)
      await customDomainRepository.updateDomainStatus(input.domainId, "active");

      // SSL is handled by tunnel service (ngrok/cloudflared provide HTTPS)
      await customDomainRepository.updateSSLStatus(input.domainId, true);

      return { success: true };
    } catch (error: any) {
      console.error("Error activating domain:", error);
      await customDomainRepository.updateDomainStatus(
        input.domainId,
        "failed",
        error.message
      );
      return { success: false, error: error.message || "Activation failed" };
    }
  }

  /**
   * Get domain by ID
   */
  async getDomainById(domainId: string): Promise<CustomDomain | null> {
    return await customDomainRepository.getDomainById(domainId);
  }

  /**
   * Get domains for a user
   */
  async getUserDomains(userId: string): Promise<CustomDomain[]> {
    return await customDomainRepository.getDomainsByUserId(userId);
  }

  /**
   * Get active domain for a bio page
   */
  async getBioPageDomain(bioPageId: string): Promise<CustomDomain | null> {
    return await customDomainRepository.getDomainByBioPageId(bioPageId);
  }

  /**
   * Get bio page by custom domain
   */
  async getBioPageByDomain(domain: string): Promise<string | null> {
    console.log("[customDomainService] Looking up domain:", domain);
    const domainRecord = await customDomainRepository.getDomainByName(domain);

    console.log("[customDomainService] Domain record:", {
      found: !!domainRecord,
      status: domainRecord?.status,
      bioPageId: domainRecord?.bioPageId,
      domain: domainRecord?.domain,
    });

    if (!domainRecord || domainRecord.status !== "active") {
      console.error("[customDomainService] Domain not found or not active");
      return null;
    }

    return domainRecord.bioPageId;
  }

  /**
   * Delete a domain
   */
  async deleteDomain(
    userId: string,
    input: DeleteDomainInput
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const domain = await customDomainRepository.getDomainById(input.domainId);

      if (!domain) {
        return { success: false, error: "Domain not found" };
      }

      // Verify ownership
      if (domain.userId !== userId) {
        return { success: false, error: "Unauthorized" };
      }

      await customDomainRepository.deleteDomain(input.domainId);
      return { success: true };
    } catch (error: any) {
      console.error("Error deleting domain:", error);
      return {
        success: false,
        error: error.message || "Failed to delete domain",
      };
    }
  }
}

export const customDomainService = new CustomDomainService();
