# React & Next.js Guidelines (Next.js 16 & React 19)

## 1. Async Next.js 16 & React 19 Conventions

- **Page Props**: `params` and `searchParams` in Next.js 16 page/layout components are promises. Always await them:
  ```tsx
  export default async function Page({
    params,
    searchParams,
  }: {
    params: Promise<{ locale: string; [key: string]: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }) {
    const { locale } = await params;
    const sp = await searchParams;
    // ...
  }
  ```
- **Cookies & Headers**: `cookies()` and `headers()` from `next/headers` are asynchronous:
  ```tsx
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  ```

## 2. Component Boundaries & Server Actions

- **Directive Invariants**:
  - Always place `"use client";` at the very top of interactive components (hooks, state, event handlers).
  - Always place `"use server";` at the very top of server action files (`src/actions/*`).
- **Data Fetching & Auth**:
  - Sensitive operations (credentials, login, register, token exchange) must execute in Server Actions or API routes so credentials and server tokens are not exposed to the client.
  - Authentication tokens (`accessToken`, `refreshToken`) must be stored in HTTP-only cookies via Server Actions.

## 3. Localization & Navigation (`next-intl`)

- In `apps/main` (and other localized apps), routes are wrapped in `[locale]`.
- Always import navigation primitives (`Link`, `useRouter`, `usePathname`, `redirect`) from `@/i18n/navigation` rather than `next/link` or `next/navigation` so locale prefixes are correctly preserved.
- When full session reset or cookie re-evaluation is necessary post-auth, use `window.location.href` to trigger a clean server refresh.

## 4. Turborepo Monorepo Packages

- Use `@repo/ui` for shared UI elements (`Button`, `Loading`, `CloseButton`, etc.).
- Use `@repo/lib` for helper functions, error handling (`getErrorMessage`), and token decoding.
- Use `@repo/safe-fetch` (`createSafeFetchInstance`) for API clients with type-safe response wrappers `[data, error]`.
- Use `@repo/store` for shared Zustand store definitions.
- Use `@repo/routes` for shared path constants (`PATHS`).

## 5. UI, Styling & State Management

- Style with **Tailwind CSS v4** utility classes.
- Standard toast notifications: `react-toastify` (`toast.error(...)`, `toast.success(...)`).
- Icons: Prefer `lucide-react` or `react-icons`.
- Server state: Use TanStack React Query (`@tanstack/react-query`). Client UI state: Zustand.
