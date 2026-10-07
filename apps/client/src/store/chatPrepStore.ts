import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ChatPrepState = {
  expertId: string | null;
  isOpen: boolean;
  /** Expert picked while logged out; reopened automatically after login. */
  pendingExpertId: string | null;
  openChatPrep: (expertId: string) => void;
  closeChatPrep: () => void;
  setChatPrepOpen: (open: boolean) => void;
  setPendingExpert: (expertId: string | null) => void;
};

export const useChatPrepStore = create<ChatPrepState>()(
  persist(
    (set) => ({
      expertId: null,
      isOpen: false,
      pendingExpertId: null,
      openChatPrep: (expertId) =>
        set({ expertId, isOpen: true, pendingExpertId: null }),
      closeChatPrep: () => set({ isOpen: false, expertId: null }),
      setChatPrepOpen: (open) =>
        set(open ? { isOpen: true } : { isOpen: false, expertId: null }),
      setPendingExpert: (pendingExpertId) => set({ pendingExpertId }),
    }),
    {
      name: "chat-prep",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ pendingExpertId: s.pendingExpertId }),
    },
  ),
);
