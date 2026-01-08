// src/features/custom-domain/hooks/useCustomDomain.ts
// React hooks for custom domain management

import { useState, useEffect, useCallback } from "react";
import { customDomainService } from "../services/customDomainService";
import type { CustomDomain } from "@/shared/types/customDomain";

interface UseCustomDomainOptions {
  userId?: string;
  bioPageId?: string;
  enabled?: boolean;
}

interface UseCustomDomainReturn {
  domain: CustomDomain | null;
  domains: CustomDomain[];
  loading: boolean;
  error: Error | null;
  createDomain: (
    domain: string,
    bioPageId?: string
  ) => Promise<{ success: boolean; domainId?: string; error?: string }>;
  verifyDomain: (
    domainId: string
  ) => Promise<{ success: boolean; error?: string }>;
  deleteDomain: (
    domainId: string
  ) => Promise<{ success: boolean; error?: string }>;
  refetch: () => void;
}

export function useCustomDomain({
  userId,
  bioPageId,
  enabled = true,
}: UseCustomDomainOptions): UseCustomDomainReturn {
  const [domain, setDomain] = useState<CustomDomain | null>(null);
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDomains = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      let userDomains: CustomDomain[] = [];

      // Priority 1: If bioPageId is provided, get ALL domains for that bio page
      if (bioPageId) {
        userDomains = await customDomainService.getBioPageDomains(bioPageId);
        // Set the active domain if exists
        const activeDomain = userDomains.find((d) => d.status === "active");
        setDomain(activeDomain || null);
      }
      // Priority 2: Fall back to getting all user domains (for backwards compatibility)
      else if (userId) {
        userDomains = await customDomainService.getUserDomains(userId);
        if (userDomains.length > 0) {
          setDomain(userDomains[0]); // Default to first domain
        }
      }

      setDomains(userDomains);
    } catch (err: any) {
      setError(err);
      console.error("Error fetching domains:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, bioPageId, enabled]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const createDomain = useCallback(
    async (domainName: string, targetBioPageId?: string) => {
      if (!userId) {
        return { success: false, error: "Missing user ID" };
      }

      // Use provided bioPageId or fall back to hook's bioPageId
      const pageId = targetBioPageId || bioPageId;
      if (!pageId) {
        return { success: false, error: "Missing bio page ID" };
      }

      const result = await customDomainService.createDomain(userId, {
        bioPageId: pageId,
        domain: domainName,
      });

      if (result.success) {
        await fetchDomains();
      }

      return result;
    },
    [userId, bioPageId, fetchDomains]
  );

  const verifyDomain = useCallback(
    async (domainId: string) => {
      const result = await customDomainService.verifyDomain({ domainId });

      if (result.success) {
        await fetchDomains();
      }

      return result;
    },
    [fetchDomains]
  );

  const deleteDomain = useCallback(
    async (domainId: string) => {
      if (!userId) {
        return { success: false, error: "Missing user ID" };
      }

      const result = await customDomainService.deleteDomain(userId, {
        domainId,
      });

      if (result.success) {
        await fetchDomains();
      }

      return result;
    },
    [userId, fetchDomains]
  );

  return {
    domain,
    domains,
    loading,
    error,
    createDomain,
    verifyDomain,
    deleteDomain,
    refetch: fetchDomains,
  };
}
