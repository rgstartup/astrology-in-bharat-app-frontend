# Vedic Heritage Design Theme

A rich, classic temple aesthetic inspired by sacred bhagwa, deep maroon, warm cream backgrounds, and pure temple gold.

---

## 1. Visual Identity

- **Theme Key:** `vedic`
- **Activation:** `<html data-theme="vedic">` or `class="theme-vedic"`
- **Base Canvas:** Warm cream (`#FFF9F4` / `#FCF8F4`) with delicate cream-muted hairlines (`#E8D5C0`).
- **Base Radius:** Classic rounded `0.75rem` (`12px`).

---

## 2. Palette & Primitives

### Primary Brand Colors
| Token | Value | Description |
| :--- | :--- | :--- |
| `saffron[500]` | `#FF6B00` | Sacred Bhagwa / Orange Primary |
| `saffron[600]` | `#EA580C` | Bhagwa Action Hover |
| `brown[700]` | `#4A1D1F` | Classic Maroon Secondary |
| `brown[900]` | `#301118` | Deep Earth Foreground Typography |
| `gold[500]` | `#D4AF37` | Vedic Temple Gold |
| `gold[300]` | `#F2E2B0` | Subtle Gold Accent Wash |
| `cream` | `#FFF9F4` | Heritage Canvas Ground |
| `creamLight` | `#FCF8F4` | Floating Card / Muted Plate Ground |
| `creamMuted` | `#E8D5C0` | Hairline Decorative Border |

### Typography
- **Serif / Display:** Classic serif and display typography
- **Hindi / Devanagari:** `Noto Sans Devanagari`, sans-serif

---

## 3. Usage

### Direct Import
```tsx
import { vedicTheme } from "@repo/design/themes/vedic";
import { colors, radii, shadows } from "@repo/design/themes/vedic";
```

### Global Configuration
```tsx
import { themes } from "@repo/design/themes";

const activeTheme = themes.vedic;
```
