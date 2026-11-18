# Shadcn UI Architecture & Usage Guide

This directory houses the centralized Shadcn component library for the monorepo (`@repo/design`).

---

## 1. Multi-Variant Architecture

Components are organized into a shared `ui/` layer and isolated primitive variant trees (`base/`, `radix/`, `aria/`):

```text
frontend/packages/design/src/shadcn/
├── ui/                      # Shared UI components (Card, Badge, Button, Input, Table, Toast, etc.)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx (if agnostic) / input.tsx / table.tsx
│   └── index.ts             # Exports all shared UI components
├── base/                    # Base UI (@base-ui/react) primitive wrappers
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── sheet.tsx
│   └── index.ts             # Exports Base primitives + re-exports ../ui
├── radix/                   # Radix UI (@radix-ui/react-*) primitives
│   ├── alert-dialog.tsx
│   └── index.ts             # Exports Radix primitives + re-exports ../ui
├── aria/                    # React Aria Components (react-aria-components) primitives
│   └── index.ts             # Exports Aria primitives + re-exports ../ui
├── index.ts                 # Default entry point (re-exports base/)
└── README.md                # Usage guide
```

---

## 2. Consuming in Applications

Consumer applications (`apps/client`, `apps/expert`) consume components via `@repo/design/shadcn`.

> **Core Import Rule:**
> * Root `@repo/design/shadcn` strictly exports from `base/` (Base UI: `@base-ui/react`) + all shared `ui/` components.
> * If an application requires a **Radix UI** or **React Aria** component, import explicitly via `/radix` or `/aria`. Both re-export the shared `ui/` components so no cross-variant imports are needed.

### Default Import (Resolves to Base UI + Shared UI)
```tsx
import { Button, Dialog, Card } from "@repo/design/shadcn";
```

### Explicit Variant Imports
Use explicit subpaths when opting into a specific primitive variant:
```tsx
// Base UI (@base-ui/react) + Shared UI
import { Dialog, Button, Card } from "@repo/design/shadcn/base";

// Radix UI (@radix-ui/react-*) + Shared UI
import { AlertDialog, Button, Card } from "@repo/design/shadcn/radix";

// React Aria Components + Shared UI
import { Dialog, Button, Card } from "@repo/design/shadcn/aria";

// Pure Shared UI components directly
import { Card, Badge, Input, Table } from "@repo/design/shadcn/ui";
```

### Deep Imports
Direct component imports map via package.json:
```tsx
import { Button } from "@repo/design/shadcn/button";
import { Progress } from "@repo/design/shadcn/progress";
```

---

## 3. Key API Differences: Base UI vs Radix UI

When writing UI or switching variants, observe these API differences:

| Feature | Base UI (`@repo/design/shadcn/base`) | Radix UI (`@repo/design/shadcn/radix`) |
| :--- | :--- | :--- |
| **Trigger Composition** | `render={<Button />}` (+ `nativeButton={false}`) | `asChild` + `<Button>` |
| **Select Data Flow** | Root `items={[...]}` array prop | Child `<SelectItem>` tags only |
| **ToggleGroup / Accordion** | `multiple` (boolean) + array `defaultValue` | `type="single" \| "multiple"` + string `defaultValue` |
| **Slider Value** | Scalar number for single thumb (`50`) | Array (`[50]`) |
| **Overlay Markup** | `Portal` -> `Positioner` -> `Popup` | `Portal` -> `Overlay` + `Content` |
| **Animation States** | `data-open`, `data-closed`, `@starting-style` | `data-[state=open]`, `data-[state=closed]` |

---

## 4. CLI Workflow: Adding Components

`components.json` is located in `frontend/packages/design/components.json`.

Always execute from repository root with `-c frontend/packages/design` or inside `frontend/packages/design`:

```bash
# Add Base UI component:
pnpm dlx shadcn@latest add dialog --base base -c frontend/packages/design

# Add Radix UI component:
pnpm dlx shadcn@latest add dialog --base radix -c frontend/packages/design

# Add React Aria component:
pnpm dlx shadcn@latest add dialog --base aria -c frontend/packages/design
```
