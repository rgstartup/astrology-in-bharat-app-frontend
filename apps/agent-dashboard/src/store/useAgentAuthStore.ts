import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AgentUser {
    id: number;
    agent_id: string;   // e.g. AGT-0001
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    status: "active" | "inactive" | "suspended";
}

interface AuthState {
    agent: AgentUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (agent: AgentUser, token: string) => void;
    logout: () => void;
    setAgent: (agent: AgentUser) => void;
}

export const useAgentAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            agent: null,
            token: null,
            isAuthenticated: false,

            login: (agent, token) =>
                set({ agent, token, isAuthenticated: true }),

            logout: () =>
                set({ agent: null, token: null, isAuthenticated: false }),

            setAgent: (agent) =>
                set({ agent }),
        }),
        { name: "agent-auth" }   // persisted in localStorage
    )
);
