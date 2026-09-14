"use client";

import React, { createContext, useContext } from "react";
import { useExploreExperts } from "../hooks/useExploreExperts";
import type { Expert } from "@repo/lib";

export type ExploreExpertsContextType = ReturnType<typeof useExploreExperts>;

const ExploreExpertsContext = createContext<ExploreExpertsContextType | null>(
  null,
);

export interface ExploreExpertsProviderProps {
  children: React.ReactNode;
  initialExperts?: Expert[];
  initialTotal?: number;
  initialHasNextPage?: boolean;
}

export function ExploreExpertsProvider({
  children,
  initialExperts,
}: ExploreExpertsProviderProps) {
  const value = useExploreExperts(initialExperts);

  return (
    <ExploreExpertsContext.Provider value={value}>
      {children}
    </ExploreExpertsContext.Provider>
  );
}

export function useExploreExpertsContext(): ExploreExpertsContextType {
  const context = useContext(ExploreExpertsContext);
  if (!context) {
    throw new Error(
      "useExploreExpertsContext must be used within an ExploreExpertsProvider",
    );
  }
  return context;
}
