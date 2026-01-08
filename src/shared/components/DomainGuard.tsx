// src/shared/components/DomainGuard.tsx
// Route guard based on domain type

import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDomain } from "../contexts/DomainContext";
import { isPlatformRoute } from "../lib/domainUtils";

interface DomainGuardProps {
  children: ReactNode;
}

/**
 * DomainGuard - Blocks platform routes on custom domains
 *
 * Architecture:
 * - Platform domain (localhost, vielink.vn) → Full app access
 * - Custom domain (tunnel, user domain) → Only bio pages
 *
 * This prevents:
 * - User domains accessing /dashboard
 * - User domains accessing /login
 * - Security leaks via custom domains
 */
export function DomainGuard({ children }: DomainGuardProps) {
  const { isCustom } = useDomain();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If accessing from custom domain and trying to access platform routes
    if (isCustom && isPlatformRoute(location.pathname)) {
      console.warn("[DomainGuard] Blocking platform route on custom domain:", {
        path: location.pathname,
        action: "redirect to 404",
      });

      // Redirect to 404 or show custom domain landing
      navigate("/", { replace: true });
    }
  }, [isCustom, location.pathname, navigate]);

  return <>{children}</>;
}
