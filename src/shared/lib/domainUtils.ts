// src/shared/lib/domainUtils.ts
// Domain classification utility for multi-tenant routing

/**
 * Platform domains - full app access (dashboard, login, admin)
 */
const PLATFORM_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "vielink.vn",
  "www.vielink.vn",
];

/**
 * Check if current hostname is a platform domain
 * Platform domains get full app access
 */
export function isPlatformDomain(hostname?: string): boolean {
  const host = (hostname || window.location.hostname).toLowerCase();

  // Exact match
  if (PLATFORM_DOMAINS.includes(host)) {
    return true;
  }

  // Check if it's localhost with port
  if (host.startsWith("localhost:") || host.startsWith("127.0.0.1:")) {
    return true;
  }

  return false;
}

/**
 * Check if current hostname is a custom domain
 * Custom domains only get bio page access
 */
export function isCustomDomain(hostname?: string): boolean {
  return !isPlatformDomain(hostname);
}

/**
 * Get domain type for routing decisions
 */
export type DomainType = "platform" | "custom";

export function getDomainType(hostname?: string): DomainType {
  return isPlatformDomain(hostname) ? "platform" : "custom";
}

/**
 * Get current hostname (normalized)
 */
export function getCurrentHostname(): string {
  return window.location.hostname.toLowerCase();
}

/**
 * Check if route should be blocked on custom domains
 */
export function isPlatformRoute(path: string): boolean {
  const platformRoutes = [
    "/dashboard",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/create-username",
    "/admin",
    "/settings", // Settings is part of dashboard
  ];

  return platformRoutes.some((route) => path.startsWith(route));
}
