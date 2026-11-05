"use client";

import React, { createContext, useContext } from "react";
import type { ConsultationPrepController } from "./types";

const ConsultationPrepControllerContext =
  createContext<ConsultationPrepController | null>(null);

/**
 * Provides the `useConsultationPrep` controller object to the whole prep
 * modal tree so consumers read state/actions from context instead of
 * receiving them as drilled props.
 */
export function ConsultationPrepControllerProvider({
  value,
  children,
}: {
  value: ConsultationPrepController;
  children: React.ReactNode;
}) {
  return (
    <ConsultationPrepControllerContext.Provider value={value}>
      {children}
    </ConsultationPrepControllerContext.Provider>
  );
}

/**
 * Access the consultation prep controller.
 *
 * @throws When rendered outside `ConsultationPrepControllerProvider`.
 */
export function useConsultationPrepController(): ConsultationPrepController {
  const context = useContext(ConsultationPrepControllerContext);
  if (!context) {
    throw new Error(
      "useConsultationPrepController must be used within ConsultationPrepControllerProvider",
    );
  }
  return context;
}
