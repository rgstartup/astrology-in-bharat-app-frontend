# Bharat Saffron Design Theme

The canonical default theme for the platform, inspired by vibrant saffron, royal emerald, and deep earth tones.

---

## 1. Visual Identity

- **Theme Key:** `bharat`
- **Activation:** `<html data-theme="bharat">` or `class="theme-bharat"`
- **Base Canvas:** Pure white (`#ffffff`) with warm subtle hairlines (`#e5e7eb`).
- **Base Radius:** `0.625rem` (`10px`).

---

## 2. Palette & Primitives

### Primary Brand Colors
| Token | Value | Description |
| :--- | :--- | :--- |
| `saffron[500]` | `#ff6b00` | Signature Brand Saffron |
| `saffron[700]` | `#c2410c` | Primary Action Button / Accent Strong |
| `saffron[800]` | `#9a3412` | Primary Action Hover |
| `emerald[700]` | `#047857` | Royal Emerald Accent |
| `brown[900]` | `#301118` | Deep Earth Foreground Typography |
| `brown[500]` | `#75666a` | Muted Secondary Foreground |
| `gold[500]` | `#d4af37` | Accent Gold Badge & Rating Star |

### Typography
- **Display:** `Outfit`, sans-serif
- **Body / Sans:** `Inter`, sans-serif
- **Hindi / Devanagari:** `Noto Sans Devanagari`, sans-serif

---

## 3. Usage

### Direct Import
```tsx
import { bharatTheme } from "@repo/design/themes/bharat";
import { colors, radii, shadows } from "@repo/design/themes/bharat";
```

### Global Configuration
```tsx
import { defaultTheme, themes } from "@repo/design/themes";

const activeTheme = themes.bharat;
```
