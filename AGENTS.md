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

## 6. Design Identity & Airbnb Inspiration

- Keep visual similarity to Airbnb at **40% maximum**, treating this as a qualitative design limit rather than a precisely measurable score.
- Borrow general usability principles such as clear hierarchy, generous spacing, and intuitive navigation. Keep at least 60% of the visual direction rooted in Astrology in Bharat's own brand, typography, colors, imagery, layouts, and component styling.
- Do not reproduce Airbnb screens or combine its distinctive layout, typography, colors, and controls into a lookalike. When a design feels too close, strengthen our own identity before shipping.

- Preserve **fully rounded (`rounded-full`) buttons and action controls** as part of our own design identity. Prefer compact sizing; do not replace pill shapes merely to reduce Airbnb similarity.

## 7. Dashboard Color Direction (client app)

- Keep the client dashboard primarily white: `bg-white` surfaces, neutral resting borders (`border-slate-200` / `border-border`), and gray/slate text. The same direction applies to the dashboard header, sidebar, overview widgets, and all `dashboard/*` sub-pages.
- Never use orange/saffron in resting borders, and never use warm-tinted backgrounds (`orange-50/100`, `amber-50/100`, `#FFFDF9`-style paper fills, warm gradients). Icon chips, skeletons, empty states, table hovers, and tab containers stay slate/white.
- Reserve **orange/saffron (`#ff6b00`)** for important buttons, selected action states, and action text/icons (CTAs, links, focus accents). Solid orange is fine for primary/selected states; hover fills on secondary surfaces stay neutral slate.
- Use **emerald** only for subtle highlights (live-status pills, success accents, active-nav tint); avoid solid emerald fills.
- This is a design guideline, not a strict rule — tiny semantic glyphs (e.g. rating stars) may keep conventional coloring.

### Dashboard color direction (flexible guidance)

- Prefer a primarily white dashboard. Avoid warm-tinted backgrounds and orange-accented borders.
- Reserve orange/saffron for important actions, buttons, or text; use accessible darker shades for small text.
- Use emerald for subtle highlights (light tints, icons, or text), not solid emerald fills.
- Use gray/slate for default text, borders, surfaces, and other UI elements. Preserve compact, fully rounded controls.
- This is a design guideline, not a strict palette rule; adapt to usability and context.
