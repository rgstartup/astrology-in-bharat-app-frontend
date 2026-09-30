# Expert App Architecture (`apps/expert`)

> **Application:** Expert Portal / Astrologer Consultation Dashboard (`apps/expert`)  
> **Framework:** Next.js 16 (App Router) + React 19 + TypeScript  
> **Port:** `:3003`

---

## 1. Core Principles

1. **Feature-First Architecture (`src/features/*`):**
   - Everything a domain/page requires stays co-located inside its respective feature module: `components/`, `hooks/`, `utils/`, `services/`, `types.ts`.
   - `src/app/` routes remain thin routing orchestrators that import and render top-level feature containers.

2. **Global State Strategy (`src/store/*`):**
   - True cross-feature / global state resides strictly in `src/store/`.
   - **No `use` prefix in file naming:** Store files named without `use` prefix (e.g., `auth.store.ts`, `consultation.store.ts`, `wallet.store.ts`, `socket.store.ts`, `ui.store.ts`).
   - Feature-local UI state stays inside `src/features/<feature>/hooks/` or `src/features/<feature>/store/`.

3. **Component Decomposition & Limits:**
   - **Single Responsibility:** 1 focused UI job per component.
   - **150–200 Lines Limit:** When component exceeds 150–200 lines or complexity rises, decompose into single-responsibility sub-components under `components/<sub-feature>/` with a barrel `index.ts`.
   - **Max 1-Layer Prop Drilling:** Prop drilling past 1 layer is forbidden; use local hook or Zustand store.

4. **Data Fetching & API Communication:**
   - Server-first paradigm with Next.js Server Components and Server Actions where applicable.
   - Client-side network requests use `@repo/safe-fetch` with Result tuple pattern: `const [data, err] = await safeFetch(...)`.
   - No TanStack Query / React Query for standard fetches.

5. **Design System & Palette:**
   - Built on shadcn/ui and `@repo/ui` primitives.
   - **White-First Surface:** Crisp white (`bg-white` / `#ffffff`), slate borders/surfaces (`border-slate-200`). No `#FFFDF9` or warm-yellow tinted fills.
   - **Accent Colors:** Saffron/orange strictly for primary action buttons, active tabs, and highlighted icons; emerald for subtle status indicators/success badges.
   - **Airbnb Design Benchmark:** Max 40% visual influence (clean typography, generous whitespace, refined cards, compact rounded controls).

---

## 2. Directory Structure

```
apps/expert/
├── docs/
│   └── architecture.md               # This document
├── messages/                         # next-intl translation dictionaries
│   ├── en/index.ts
│   └── hi/index.ts
├── public/                           # Static assets, images, icons
├── src/
│   ├── app/                          # Next.js App Router (Thin Orchestrators)
│   │   ├── (auth)/                   # Auth route group (login, register, otp)
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/              # Protected Expert Dashboard routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Overview / Home
│   │   │   ├── consultations/        # Call / Chat consultations
│   │   │   ├── earnings/             # Wallet, payouts, transaction ledger
│   │   │   ├── profile/              # KYC, bio, pricing, specializations
│   │   │   ├── schedule/             # Availability, slots, calendar
│   │   │   ├── reviews/              # Client ratings & reviews
│   │   │   └── settings/             # Account & notification preferences
│   │   ├── layout.tsx                # Root layout (i18n, providers)
│   │   └── proxy.ts                  # Reverse proxy & auth route handling
│   ├── actions/                      # Next.js Server Actions (cookies, session)
│   ├── components/                   # App-wide shared UI (Shell, Sidebar, Header)
│   │   ├── shell/
│   │   ├── sidebar/
│   │   └── header/
│   ├── features/                     # Feature-driven domain modules
│   │   ├── auth/
│   │   ├── consultations/
│   │   ├── dashboard/
│   │   ├── earnings/
│   │   ├── profile/
│   │   ├── reviews/
│   │   └── schedule/
│   ├── hooks/                        # Truly cross-cutting global hooks
│   ├── i18n/                         # next-intl configuration (routing, request)
│   ├── lib/                          # Global helpers, cn utility, constants
│   ├── store/                        # Global Zustand stores (NO 'use' prefix in filenames)
│   │   ├── auth.store.ts             # Auth session & expert credential state
│   │   ├── consultation.store.ts     # Real-time call/chat session state
│   │   ├── socket.store.ts           # WebRTC / WebSocket connection state
│   │   ├── wallet.store.ts           # Global wallet balance & payout trigger state
│   │   └── index.ts                  # Named exports barrel
│   └── styles/
│       └── index.css                 # Tailwind CSS entry & color tokens
```

---

## 3. Feature Module Anatomy (`src/features/<feature>/`)

Every feature module is strictly self-contained:

```
src/features/consultations/
├── components/                       # Feature-specific UI components
│   ├── CallRoom/
│   │   ├── CallControls.tsx
│   │   ├── CallTimer.tsx
│   │   ├── ClientKundliPreview.tsx
│   │   └── index.tsx                 # Composed CallRoom (<150 lines)
│   ├── ChatRoom/
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   └── index.tsx
│   ├── ConsultationHistoryTable.tsx
│   └── index.ts                      # Barrel export for external consumption
├── hooks/                            # Feature-specific hooks
│   ├── useCallSession.ts
│   ├── useChatMessages.ts
│   └── useKundliSummary.ts
├── services/                         # Feature API calls (@repo/safe-fetch)
│   ├── consultation.service.ts
│   └── chat.service.ts
├── utils/                            # Feature-specific transformers & helpers
│   └── formatDuration.ts
├── types.ts                          # Feature DTOs, interfaces, view models
└── index.ts                          # Feature public API entry point
```

### Feature Module Rules
- **Encapsulation:** Code needed exclusively by `consultations` MUST live in `src/features/consultations/`.
- **Public API:** External pages or other features consume modules only via `src/features/<feature>/index.ts`.
- **Promotion to Global:** Only promote a feature utility/component to `src/components/` or `src/lib/` if at least 2 other unrelated features need it.

---

## 4. State Management Standard (`src/store/*`)

### File Naming Convention
- **Forbidden:** `useAuthStore.ts`, `useWalletStore.ts`, `useConsultationStore.ts`
- **Mandatory:** `auth.store.ts`, `wallet.store.ts`, `consultation.store.ts`, `socket.store.ts`

### Store Template Pattern

```typescript
// src/store/auth.store.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ExpertUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  isVerified: boolean;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}

interface AuthState {
  expert: ExpertUser | null;
  isAuthenticated: boolean;
  setExpert: (expert: ExpertUser | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        expert: null,
        isAuthenticated: false,
        setExpert: (expert) => set({ expert, isAuthenticated: !!expert }),
        clearAuth: () => set({ expert: null, isAuthenticated: false }),
      }),
      { name: 'aib-expert-auth' }
    )
  )
);
```

### Store Consumption Rule
- Global stores handle: authentication, real-time consultation session state (call/chat status, incoming request modals), global notification badges, active socket connection.
- Local form or view state belongs in local React hooks (`use[Name]State.ts`) or feature-scoped stores.

---

## 5. Route Orchestration (`src/app/`)

Routes in `src/app/` act purely as thin orchestrators:

```tsx
// src/app/(dashboard)/consultations/page.tsx
import { ConsultationDashboardView } from '@/features/consultations';

export const metadata = {
  title: 'Consultations | Astrology in Bharat Expert',
};

export default function ConsultationsPage() {
  return <ConsultationDashboardView />;
}
```

---

## 6. Communication & Data Fetching Protocol

1. **`@repo/safe-fetch` Pattern:**
   ```typescript
   import { safeFetch } from '@repo/safe-fetch';
   import { API_ROUTES } from '@repo/routes';
   import type { ConsultationListResponseDto } from '@/features/consultations/types';

   export async function getExpertConsultations(page = 1, limit = 20) {
     const [data, error] = await safeFetch<ConsultationListResponseDto>(
       API_ROUTES.EXPERT.CONSULTATIONS.LIST({ page, limit }),
       { method: 'GET' }
     );

     if (error) {
       console.error('Failed to fetch consultations:', error);
       return null;
     }

     return data;
   }
   ```

2. **Error Boundary & Feedback:**
   - Return tuple handling: Handle `error` branch explicitly.
   - UI feedback: toast notifications via `sonner` / `@repo/ui` toast.

---

## 7. Migration Checklist from Legacy Structure

When updating legacy code in `apps/expert`:
- [ ] Move flat hooks (`src/hooks/useProducts.ts`, `useProfile.ts`, `useWallet.ts`) into their respective `src/features/<feature>/hooks/`.
- [ ] Move flat services (`src/services/products.service.ts`) into `src/features/products/services/`.
- [ ] Rename `src/store/useAuthStore.ts` -> `src/store/auth.store.ts`.
- [ ] Remove `src/providers/ReactQueryProvider.tsx` (TanStack Query banned).
- [ ] Decompose monolithic components >150 lines into sub-components.
