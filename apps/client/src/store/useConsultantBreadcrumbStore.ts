import { create } from "zustand";

interface ConsultantBreadcrumbStore {
  consultantName: string | null;
  setConsultantName: (name: string | null) => void;
}

export const useConsultantBreadcrumbStore = create<ConsultantBreadcrumbStore>(
  (set) => ({
    consultantName: null,
    setConsultantName: (consultantName) => set({ consultantName }),
  }),
);
