import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AgentUser {
    id: string;
    uid: string;   // e.g. AIB-AGT-A8K2XP
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    status: "active" | "inactive" | "suspended";
}

interface AuthState {
    agent: AgentUser | null;
    isAuthenticated: boolean;
    login: (agent: AgentUser) => void;
    logout: () => void;
    setAgent: (agent: AgentUser) => void;
}

export const useAgentAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            agent: null,
            isAuthenticated: false,

            login: (agent) =>
                set({ agent, isAuthenticated: true }),

            logout: () =>
                set({ agent: null, isAuthenticated: false }),

            setAgent: (agent) =>
                set({ agent }),
        }),
        { name: "agent-auth" }   // persisted in localStorage
    )
);
