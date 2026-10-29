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

## 8. React Component Decomposition & Refactoring

### Objective

Analyze the existing React/Next.js codebase and identify components that should be decomposed into smaller components based on **single responsibility, code complexity, state ownership, rendering logic, and maintainability**.

Refactor only where it provides a meaningful architectural benefit. Do not blindly split components based on line count or enforce arbitrary component-size limits.

### 8.1 Analyze Before Refactoring

Inspect the target component and its surrounding code, including:

- Parent and child component relationships.
- Business logic mixed with presentation logic.
- State ownership, state updates, and derived state.
- Conditional rendering and branching complexity.
- Event handlers and callback complexity.
- Data fetching, mutations, and side effects.
- Forms, validation, and submission workflows.
- Repeated JSX, duplicated logic, and reusable UI patterns.
- Dependencies, props, and coupling between responsibilities.
- Existing project conventions and component organization.

Understand the component's actual purpose before proposing changes.

### 8.2 Identify Decomposition Opportunities

Evaluate each component against these criteria.

#### A. Responsibility separation

Extract a component when a distinct UI section has its own responsibility, behavior, or meaningful internal structure.

Examples:
- A consultation room containing a header, conversation panel, participant controls, and sidebar.
- A dashboard containing independent summary cards, charts, and data tables.
- A form containing logically independent sections with their own validation or behavior.

Do not extract every `div`, heading, button, or small JSX fragment into a separate component.

#### B. Complexity and cognitive load

Look for components that are difficult to understand because they combine multiple concerns, including:

- Deeply nested JSX.
- Numerous conditional branches.
- Multiple independent interaction workflows.
- Complex event handlers.
- Extensive state and effect management.
- Large amounts of unrelated business logic.
- Difficult-to-follow rendering decisions.

Prioritize reducing cognitive load over reducing lines of code.

#### C. State ownership

Determine whether state belongs in:

- The current component.
- A smaller child component.
- A shared parent.
- A custom hook.
- An existing application-level store.

Keep state close to the components that use it, unless multiple components genuinely need to coordinate around that state.

Do not move state upward unnecessarily or duplicate state across components.

#### D. Logic extraction

Extract non-visual logic into a custom hook or a separate module when it represents a coherent behavioral responsibility.

Examples:
- Form submission and validation workflows.
- RTC device and connection lifecycle management.
- Consultation timer calculations.
- Complex filtering, sorting, or derived data.
- Reusable keyboard interaction logic.

Keep simple calculations and straightforward event handlers inline when extraction would add indirection without improving clarity.

Custom hooks should encapsulate behavior, not merely relocate code to another file.

#### E. Reusability and coupling

Extract shared components when multiple consumers need the same meaningful UI or behavior.

Prefer a component specific to its feature over a premature generic abstraction. Introduce shared components only when their API and responsibility are clear.

#### F. Rendering and performance

Check whether decomposition could affect:

- Unnecessary re-renders.
- State update propagation.
- Referential stability of callbacks and objects.
- Expensive computations.
- Component identity and state preservation.
- Memoization boundaries.

Do not introduce `memo`, `useMemo`, or `useCallback` automatically. Optimize only when justified by actual rendering behavior or a clear performance requirement.

### 8.3 Decomposition Thresholds

Treat the following as investigation signals, not mandatory limits:

- **Under 100 lines:** Usually leave intact unless responsibilities are clearly mixed.
- **100–200 lines:** Review responsibility separation, branching, and state ownership.
- **Over 200 lines:** Inspect carefully for multiple responsibilities and excessive cognitive load.
- **Complexity matters more than size:** A 70-line component with deeply nested conditions may need decomposition, while a 300-line component with a coherent, straightforward responsibility may be acceptable.

Also consider the number of independent state variables, effects, event handlers, conditional branches, and distinct UI sections.

Do not optimize for line count alone.

### 8.4 Decomposition Rules

When refactoring:

1. Give each component one clear, coherent responsibility.
2. Use descriptive names that communicate purpose.
3. Keep components focused and their public props minimal.
4. Keep business rules out of presentational components when doing so improves separation.
5. Prefer composition over giant components with many boolean props.
6. Avoid excessive prop drilling; use existing context or state management only when appropriate.
7. Avoid introducing global state for local UI concerns.
8. Avoid creating a custom hook for trivial logic.
9. Avoid unnecessary wrapper components, abstraction layers, and pass-through props.
10. Preserve existing behavior, accessibility, styling, and responsive layouts.
11. Preserve loading, error, empty, and success states.
12. Preserve existing API contracts, event flows, and side-effect semantics.
13. Follow the repository's existing naming, folder, import, and styling conventions.
14. Do not refactor unrelated code or introduce new dependencies without a concrete need.

For Next.js, respect Server Component and Client Component boundaries. Do not add `"use client"` to a component or move server-only logic into client code without justification.

### 8.5 Recommended Refactoring Workflow

#### Step 1 — Inventory

Inspect the target component and relevant dependencies. Identify its responsibilities, state, side effects, and major rendering branches.

#### Step 2 — Assess

For each potential extraction, record:

- Current responsibility.
- Identified complexity or maintenance problem.
- Proposed component or hook.
- Reason extraction improves the design.
- Risks to behavior or state ownership.

#### Step 3 — Plan

Create a concise decomposition plan. Identify the intended component hierarchy and which state and logic remain in the original component.

Prefer the smallest refactoring that resolves the identified problems.

#### Step 4 — Refactor

Extract components and hooks incrementally. Keep the original public interface stable unless a change is necessary and explicitly justified.

Avoid mixing architectural refactoring with unrelated redesigns or business-rule changes.

#### Step 5 — Validate

Run the relevant project checks where available:

- TypeScript type checking.
- ESLint.
- Existing unit and integration tests.
- Production build when practical.

Inspect the diff for accidental behavior changes, redundant abstractions, circular dependencies, and unnecessary files.

If a check cannot run, explain why instead of claiming it passed.

### 8.6 Important Constraints

- Do not split components merely because they are large.
- Do not create one component per JSX element.
- Do not create abstractions that are harder to understand than the original implementation.
- Do not change product behavior to make the refactor easier.
- Do not perform speculative performance optimizations.
- Do not stop at recommendations: implement the justified refactoring when the task permits code changes.
- If the component is already well-structured, explain why and leave it unchanged.

### Success Criterion

The resulting code should be easier to understand, test, maintain, and extend, with clear responsibility boundaries and no unnecessary architectural complexity.

## 9. API Client Migration (`api` → `apiV2`)

- We are migrating from `api` to `apiV2`. New code must use `apiV2`.
- When updating or modifying any client component or server action that fetches data with `api`, replace it with `apiV2` in the same change (including its response-unwrap/error-handling adjustments).

## 10. TypeScript Strictness (`any` Ban)

- NEVER use `any` in new or touched code — no `as any`, no `Record<string, any>`, no implicit `any` params.
- Type `apiV2.get<T>` / `apiV2.post<T>` with the existing contract (`IExpert`, DTO interfaces, `@repo/lib` types) and consume `res.data` directly. If the runtime shape disagrees with the contract, fix the contract or the backend — do not paper over it with a cast.
- For genuinely unknown JSON (error bodies with extra fields), extend `ApiErrorBody` and pass it as the second generic — never cast, never `any`:
  ```ts
  interface InitiateChatErrorBody extends ApiErrorBody {
    existingConsultationId?: number;
  }
  const res = await apiV2.post<Data, InitiateChatErrorBody>(url, payload);
  if (!res.ok) res.error.body?.existingConsultationId; // typed, no cast
  ```
- `unknown` + narrowing is the escape hatch when no contract exists yet. `any` is never the answer.

## 11. Render Branching: Waterfall Early Returns (Ternary Ban)

- NEVER use nested ternary operators for render branching. Use sequential early returns (waterfall style) so each state reads top-to-bottom:
  ```tsx
  if (loading) return <PrepSkeleton />;
  if (!expert) return <ExpertNotFound onClose={onClose} />;
  if (step === "recharge") return <RechargeStep ... />;
  return <DetailsStep ... />;
  ```
- Each branch must return its own single-responsibility sub-component — no inline JSX blocks inside the branching component.
- When waterfall branching produces sub-components, colocate them: create a directory named after the main component and put the main component plus all its sub-components there, with a barrel `index.ts`:
  ```
  components/chat-prep-modal/
  ├── index.ts
  ├── chat-prep-modal.component.tsx
  ├── modal-body.component.tsx
  ├── details-step.component.tsx
  └── ...
  ```
- This rule complements §8: §8 triggers on file size, this rule triggers on branching shape — even small components with 3+ render branches get decomposed.

## 13. Feature-Based Architecture & Folder Structure

Organize code around business features rather than grouping all files globally by type. Routes compose features and page-level components. Adapt the structure below to this repo's existing conventions — do not create empty folders or boilerplate preemptively, and do not move files merely for structural consistency when their current location is appropriate.

### 13.1 Recommended Folder Structure

```text
src/
├── app/                         # Next.js App Router: routes, layouts, loading/error boundaries
├── features/                    # Business feature modules
│   ├── <feature>/
│   │   ├── components/          # Feature-specific UI components
│   │   ├── hooks/               # Feature-specific hooks
│   │   ├── api/                 # Feature API functions (apiV2)
│   │   ├── store/               # Feature-scoped Zustand stores
│   │   ├── types/               # Feature-specific types & schemas
│   │   ├── utils/               # Feature-specific transformers & helpers
│   │   ├── __tests__/           # Feature-specific tests
│   │   └── index.ts             # Feature public API (deliberate, not mandatory)
│   ...
├── components/
│   ├── ui/                      # Globally reusable UI primitives (@repo/ui)
│   └── layout/                  # Shared application layouts
├── hooks/                       # Hooks shared across unrelated features
├── lib/                         # Cross-feature utilities & infrastructure
├── store/                       # Genuinely cross-feature client state (@repo/store)
├── types/                       # Application-wide types (genuinely shared only)
└── config/                      # App configuration
```

### 13.2 Placement Rules

- Keep feature-specific components, hooks, API functions, schemas, types, and tests inside their owning feature (`src/features/<feature>/`).
- Keep globally reusable UI primitives in `components/ui/` (backed by `@repo/ui`). Shared UI primitives must not depend on business-specific features.
- Keep cross-feature utilities in `lib/` and genuinely shared hooks in `hooks/`.
- Introduce subdirectories only when a feature's complexity justifies them.

### 13.3 Feature Boundaries & Dependencies

- Routes compose features and page-level components.
- Features may use shared UI primitives and shared infrastructure (`@repo/ui`, `@repo/lib`, `@repo/store`, `@repo/routes`).
- Shared UI primitives and shared infrastructure must not depend on business-specific features.
- A feature must not import another feature's private implementation files; consume only via the owning feature's public `index.ts`.
- Cross-feature communication should use explicit public APIs, shared contracts, or appropriately scoped state.
- Avoid circular dependencies.
- Use feature-level `index.ts` files as deliberate public interfaces, not mandatory barrel files for every directory.
- Do not introduce a new state-management library, dependency-injection framework, event system, or architectural pattern solely to facilitate a refactor. Preserve existing conventions: `@tanstack/react-query` for server state, Zustand for client UI state, `@repo/store` for shared stores.

### 13.4 Separation of Responsibilities

Keep these concerns distinct where doing so improves clarity:

- **Presentation:** rendering UI and handling visual states.
- **Feature orchestration:** coordinating related components and user interactions (routes, page containers).
- **Business logic:** domain rules, calculations, decisions.
- **Data access:** API requests, caching, response handling (keep API functions near the feature that owns them, using `apiV2` per §9).
- **State management:** owning and coordinating state.
- **Infrastructure:** shared clients, configuration, generic utilities.

Keep domain rules out of presentational components. Keep feature-specific schemas and types inside the feature; extract application-wide types only when genuinely shared. Avoid duplicating API request logic and business calculations.

### 13.5 State Ownership

Use the narrowest state scope that correctly supports the required behavior:

- **Local component state:** `useState`/`useReducer` for state owned by one component (e.g. dropdown visibility, local form interaction).
- **Feature-level state:** lift to the nearest common owner or a feature hook/store when multiple related components need coordinated behavior.
- **Global state:** shared Zustand stores (`@repo/store`, `src/store/`) only when state must be shared across independent parts of the app (e.g. authenticated user info, wallet balance).

State-management rules:

- Do not move all state to a top-level component.
- Do not place every state variable in a global store.
- Do not duplicate the same source of truth across components or stores.
- Keep derived values derived instead of storing redundant state.
- Prefer explicit props for straightforward parent-child communication.
- Use context or a store when prop drilling becomes genuinely problematic or when state is inherently shared.
- Keep transient UI state local unless another component must coordinate it.
- Preserve existing state libraries and conventions unless there is a clear reason to change them.

### 13.6 Component Decomposition

Component decomposition is covered by the existing guideline in **§8 React Component Decomposition & Refactoring** (analyze before refactoring, decomposition opportunities, thresholds, rules, workflow, constraints). Do not duplicate it here. Extract components and hooks per §8 only where it provides a meaningful architectural benefit — do not blindly split components based on line count or create one component per JSX element.

### 13.7 Next.js Considerations

- Keep `app/` route files focused on routing, composition, and framework conventions.
- Avoid marking entire pages or layouts as Client Components unnecessarily.
- Keep server-only logic out of client bundles.
- Place client-side interactive feature components within their owning feature.
- Preserve route groups, layouts, loading states, error boundaries, metadata, and navigation behavior.
- Respect Server Component and Client Component boundaries. Do not add `"use client"` or move server-only logic into client code without justification.
- Page props (`params`, `searchParams`) and cookies/headers are async — await them per §1.

### 13.8 Testing & Behavior Preservation

- Preserve public component interfaces, behavior, accessibility, responsive layouts, loading states, and error handling.
- Update tests affected by intentional structural changes; add focused tests for extracted business logic.
- Run type checks, ESLint, and relevant tests; report any checks that could not be completed.
- Do not silently change business rules, API contracts, or user-facing behavior.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
