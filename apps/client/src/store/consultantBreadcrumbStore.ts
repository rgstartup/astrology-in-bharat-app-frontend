import { create } from "zustand";

interface ConsultantBreadcrumbStore {
  consultantName: string | null;
  setConsultantName: (name: string | null) => void;
}

export const consultantBreadcrumbStore = create<ConsultantBreadcrumbStore>(
  (set) => ({
    consultantName: null,
    setConsultantName: (consultantName) => set({ consultantName }),
  }),
);

export const useConsultantBreadcrumbStore = consultantBreadcrumbStore;
export default consultantBreadcrumbStore;
