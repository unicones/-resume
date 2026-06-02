# Design Tokens & Guidelines

This document specifies the official fonts and color tokens for the MEC Resume project.

---

## 1. Typography

- **English Font:** `Inter` (weights: 300, 400, 500, 600, 700, 800)
- **Thai Font:** `Sarabun` (weights: 400, 500, 600, 700)
- **CSS Import URL:**
  `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Sarabun:wght@400;500;600;700&display=swap`

- **Fallback Fonts:** `sans-serif`

---

## 2. Color Palette (Light Corporate Theme)

| Token Name | Hex Code | Utility / Description |
| :--- | :--- | :--- |
| **Primary** | `#2563eb` (Blue 600) | Primary buttons, active state, core accents |
| **Primary Hover** | `#1d4ed8` (Blue 700) | Button hover states |
| **Secondary (Sky)** | `#0284c7` (Sky 600) | Secondary highlighting, links, text accents |
| **Secondary (Purple)**| `#7c3aed` (Purple 600) | Featured accent labels, interactive effects |
| **Background** | `#f8fafc` (Slate 50) | Main application layout background |
| **Foreground Text** | `#0f172a` (Slate 900) | Main body text color |
| **Card Background** | `#ffffff` | Panel backgrounds |
| **Border Light** | `#e2e8f0` (Slate 200) | Normal card borders |
| **Border Active** | `#cbd5e1` (Slate 300) | Focused or hovered card borders |

---

## 3. UI Implementation Rules

1. **Font Application:**
   Always apply `var(--font-sans)` for body text and `var(--font-heading)` or `.font-heading` for headings, which maps to `Inter` for English and `Sarabun` for Thai.
2. **Color Constraints:**
   Never invent or hardcode color hex values outside the specified color palette. Use tailwind utility classes corresponding to these colors (e.g., `text-blue-600`, `bg-slate-50`, `border-slate-200`).
