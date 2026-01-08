// src/shared/contexts/DomainContext.tsx
// Domain context for multi-tenant routing

import { createContext, useContext, ReactNode, useMemo } from "react";
import {
  getDomainType,
  getCurrentHostname,
  type DomainType,
} from "../lib/domainUtils";

interface DomainContextValue {
  domainType: DomainType;
  hostname: string;
  isPlatform: boolean;
  isCustom: boolean;
}

const DomainContext = createContext<DomainContextValue | undefined>(undefined);

export function DomainProvider({ children }: { children: ReactNode }) {
  const value = useMemo<DomainContextValue>(() => {
    const hostname = getCurrentHostname();
    const domainType = getDomainType(hostname);

    return {
      domainType,
      hostname,
      isPlatform: domainType === "platform",
      isCustom: domainType === "custom",
    };
  }, []);

  return (
    <DomainContext.Provider value={value}>{children}</DomainContext.Provider>
  );
}

export function useDomain() {
  const context = useContext(DomainContext);
  if (!context) {
    throw new Error("useDomain must be used within DomainProvider");
  }
  return context;
}
