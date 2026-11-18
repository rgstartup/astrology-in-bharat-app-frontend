# Shadcn UI Architecture & Usage Guide

This directory houses the centralized Shadcn component library for the monorepo (`@repo/design`).

---

## 1. Multi-Variant Architecture

Components are split into primitive-specific variants and primitive-agnostic common components:

```text
frontend/packages/design/src/shadcn/
├── base/                    # Base UI (@base-ui/react) component sources
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── button.tsx
│   └── index.ts
├── radix/                   # Radix UI (@radix-ui/react-*) primitives
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   └── index.ts
├── aria/                    # React Aria Components (react-aria-components) primitives
│   ├── dialog.tsx
│   └── index.ts
├── common/                  # Re-exports primitive-agnostic components
│   └── index.ts
├── index.ts                 # Default entry point (re-exports base/)
└── README.md                # Usage guide
```

---

## 2. Consuming in Applications

Consumer applications (`apps/client`, `apps/expert`) consume components via `@repo/design/shadcn`.

### Default Import (Base UI)
```tsx
import { Button, Dialog, Card } from "@repo/design/shadcn";
```

### Explicit Variant Imports
Choose primitive engine explicitly:
```tsx
// Base UI (@base-ui/react)
import { Dialog, Button, Card } from "@repo/design/shadcn/base";

// Radix UI (@radix-ui/react-*)
import { Dialog, Button, Card } from "@repo/design/shadcn/radix";

// React Aria Components
import { Dialog, Button, Card } from "@repo/design/shadcn/aria";

// Pure Common (agnostic)
import { Card, Badge, Input, Table } from "@repo/design/shadcn/common";
```

### Deep Imports
Direct component imports map to `base/` via package.json:
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

### Composition Example

**Base UI:**
```tsx
<DialogTrigger render={<Button />}>Open</DialogTrigger>
```

**Radix UI:**
```tsx
<DialogTrigger asChild>
  <Button>Open</Button>
</DialogTrigger>
```

---

## 4. CLI Workflow: Adding Components

`components.json` is located in `frontend/packages/design/components.json`. **Never run `shadcn add` inside `apps/*`.**

Always execute from repository root with `-c frontend/packages/design` or inside `frontend/packages/design`:

```bash
# Add Base UI component:
pnpm dlx shadcn@latest add dialog --base base -c frontend/packages/design

# Add Radix UI component:
pnpm dlx shadcn@latest add dialog --base radix -c frontend/packages/design

# Add React Aria component:
pnpm dlx shadcn@latest add dialog --base aria -c frontend/packages/design

# Add from 3rd-party/custom registry:
pnpm dlx shadcn@latest add @magicui/shimmer-button -c frontend/packages/design
```

### Organization Rules After Adding:
1. Primitive-agnostic component (no overlay/trigger engine) -> Place in `src/shadcn/common/` and export in `common/index.ts`.
2. Engine-specific component -> Place in `src/shadcn/base/`, `src/shadcn/radix/`, or `src/shadcn/aria/` and export in respective `index.ts`.
3. Consumer apps import from `@repo/design/shadcn` (default base) or explicit variant `@repo/design/shadcn/<variant>`. Deep imports map to `base/` via package.json.
