---
name: Luminary OS
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#909097'
  outline-variant: '#45464d'
  surface-tint: '#bec6e0'
  primary: '#bec6e0'
  on-primary: '#283044'
  primary-container: '#0f172a'
  on-primary-container: '#798098'
  inverse-primary: '#565e74'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#2fd9f4'
  on-tertiary: '#00363e'
  tertiary-container: '#001b20'
  on-tertiary-container: '#008ea1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#a2eeff'
  tertiary-fixed-dim: '#2fd9f4'
  on-tertiary-fixed: '#001f25'
  on-tertiary-fixed-variant: '#004e5a'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
  accent-emerald: '#10B981'
  alert-red: '#EF4444'
  alert-amber: '#F59E0B'
  glass-stroke: rgba(255, 255, 255, 0.1)
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-page: 40px
  container-max: 1440px
---

## Brand & Style

The design system for this enterprise-grade library management platform is built on the narrative of **"Enlightened Intelligence."** It bridges the gap between traditional archival responsibility and futuristic AI-driven efficiency. The aesthetic is a fusion of **Corporate Modern** reliability and **Glassmorphism**, creating a workspace that feels deeply technical yet tangibly accessible.

The target audience consists of administrative librarians and system architects who require high-density data visualization without cognitive overload. The UI evokes a sense of "Quiet Power"—stable, professional, and sophisticated. Key visual motifs include micro-glows on interactive elements, semi-transparent paneling to suggest depth, and high-contrast data layers that highlight AI-detected anomalies or misplaced assets.

## Colors

The palette is anchored in a **Dark Mode** default to reduce eye strain during long administrative sessions. 
- **Primary:** The foundational "Slate/Navy" used for deep backgrounds and structural frames.
- **Secondary:** A lighter "Charcoal" used for cards, elevated panels, and surface containers.
- **Accents:** "Neon Cyan" is the primary action color, used for high-tech focal points and AI-driven suggestions. "Emerald" signifies success, system health, and verified inventory.
- **Alerts:** A dual-tier system uses "Amber" for misplaced book warnings and "Red" for critical security or system errors.

Gradients should be used sparingly, primarily as subtle glows behind primary buttons or to indicate "active" AI scanning states.

## Typography

The system utilizes **Inter** for its exceptional legibility in data-heavy enterprise environments and its neutral, "tech-first" appearance. 

- **Display & Headlines:** Use tight letter spacing (-0.02em) to maintain a modern, "locked-in" look.
- **Labels:** Uppercase styling is recommended for system labels (e.g., "ASSET ID", "SHELF LOCATION") to differentiate metadata from user-generated content.
- **Hierarchy:** Contrast is achieved through weight shifting (Regular to Semi-Bold) rather than extreme size variations to maximize information density on desktop screens.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy optimized for Desktop (1440px max-width). The grid uses 12 columns with 24px gutters, providing a rigorous structure for complex dashboards and multi-pane inventory views.

- **The 4px Rule:** All spacing between elements must be a multiple of 4px. 
- **Information Density:** For data tables and list views, use a "Compact" vertical rhythm (8px between rows) to allow for maximum visibility of library records.
- **Margins:** Side margins are generous (40px) to frame the content and provide the "Enterprise" breathing room necessary for high-tech interfaces.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** combined with **Glassmorphism**.
- **Level 0 (Base):** Dark Slate (#0F172A). The void.
- **Level 1 (Panels):** Deep Charcoal (#1E293B). Used for the sidebar and main content cards.
- **Level 2 (Modals/Popovers):** Semi-transparent Glass. Background blur (12px - 20px) with a 1px "glass-stroke" border to define edges against the dark background.

**Shadows:** Use a "Neon Bloom" effect for active AI elements rather than traditional drop shadows. This involves a soft, cyan-tinted outer glow (Blur 15px, Opacity 20%) to simulate a light-emitting interface.

## Shapes

The design system follows a **Rounded** (0.5rem / 8px) language, inspired by Material Design 3 but refined for a more professional desktop context.

- **Standard Elements:** 8px radius for buttons, input fields, and small cards.
- **Large Containers:** 16px (rounded-lg) for main dashboard sections and modals.
- **Interactive States:** Subtle expansion (1-2px) of shadows/glows rather than shape changes to maintain structural integrity.

## Components

- **Buttons:** Primary buttons use a solid Cyan background with dark text. Secondary buttons use a transparent background with a 1px Cyan border. 
- **Cards (Glass Panels):** Cards feature a 1px border (#FFFFFF 10% opacity) and a background blur. AI-highlighted cards use a subtle Emerald left-border accent.
- **Inputs:** Fields are dark-themed with a subtle bottom-border highlight that glows Cyan on focus.
- **Data Visualizations:** Charts must use high-contrast Emerald and Cyan against the Dark Slate background. Grid lines in charts should be kept at 5% opacity to minimize noise.
- **Misplaced Asset Alerts:** Use a "Pill" badge style with an Amber background and a pulsing animation to indicate real-time AI detection.
- **Status Chips:** Use monochromatic fills with high-contrast text (e.g., Emerald text on a 10% Emerald-tinted background) for a clean, non-distracting inventory status.