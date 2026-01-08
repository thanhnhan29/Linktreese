// src/app/providers/index.tsx
// Root provider composition

import { ReactNode } from "react";
import { AuthProvider } from "./AuthProvider";
import { DomainProvider } from "@/shared/contexts/DomainContext";
import { Toaster } from "@/shared/components/ui/sonner";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <DomainProvider>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </DomainProvider>
  );
}
