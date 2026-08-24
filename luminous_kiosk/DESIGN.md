---
name: Luminous Kiosk
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#3b494c'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#6b7a7d'
  outline-variant: '#bac9cc'
  surface-tint: '#006875'
  primary: '#006875'
  on-primary: '#ffffff'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#00daf3'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#5c5f60'
  on-tertiary: '#ffffff'
  tertiary-container: '#cfd0d1'
  on-tertiary-container: '#57595a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 28px
  label-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.02em
  button-text:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  touch-target-min: 64px
  gutter: 32px
  margin-page: 48px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 40px
---

## Brand & Style
The design system is engineered for high-traffic physical environments where speed of thought and ease of interaction are paramount. It follows a **Modern/Minimalist** aesthetic with a strong emphasis on **Tactile Accessibility**. 

The brand personality is welcoming and dependable, utilizing a high-key light palette to ensure the kiosk feels like a clean, helpful utility rather than a complex machine. By combining expansive whitespace with vibrant, saturated touch targets, the UI provides an effortless mental model for users of all technical abilities. The emotional response should be one of confidence and clarity—reducing the "interface friction" inherent in public kiosks.

## Colors
The palette is optimized for visibility under varying indoor lighting conditions.
- **Primary (Cyan):** Used exclusively for primary action buttons, focus states, and active navigation. Its high vibrancy ensures touch targets are unmistakable.
- **Secondary (Emerald):** Reserved for "Success" states, completion indicators, and positive progress. It provides a harmonious but distinct contrast to the primary Cyan.
- **Backgrounds:** The interface uses a tiered neutral system. The base layer is pure white (#FFFFFF), while the "Tertiary" Light Grey (#F9FAFB) is used for secondary containers and input backgrounds to provide subtle depth.
- **Typography:** Deep "Neutral" (#111827) is used for all text to maintain a high contrast ratio exceeding WCAG AA standards for accessibility.

## Typography
The design system utilizes **Inter** for its exceptional legibility and neutral, modern character. Font sizes are intentionally oversized to accommodate standing viewing distances and varying visual acuity. 

- **Headlines:** Use Bold (700) or Semi-Bold (600) to create a clear information hierarchy.
- **Body Text:** Standardized at 20px-24px to ensure readability for elderly users or those with visual impairments.
- **Line Heights:** Generous line heights are maintained to prevent visual crowding on bright kiosk screens.

## Layout & Spacing
This design system utilizes a **Fixed Grid** model centered within the kiosk display to prevent extreme neck movement for the user. 
- **The 8px Grid:** All spacing is derived from an 8px base unit.
- **Touch Zones:** All interactive elements must maintain a minimum touch target area of 64px to account for parallax on thick kiosk glass.
- **Safe Margins:** A 48px global margin ensures content is never clipped by the physical bezel of the kiosk housing.
- **Vertical Rhythm:** Content is stacked using `stack-md` (24px) for related items and `stack-lg` (40px) for distinct sections.

## Elevation & Depth
Depth is conveyed through **Tonal Layering** rather than heavy shadows to maintain the "Light/Clean" brand promise.
- **Flat Surfaces:** Most containers use a 1px soft grey border (#E5E7EB) instead of shadows to define boundaries.
- **Interactive Depth:** Only the primary action buttons utilize a soft, diffused "Ambient Shadow" (10% opacity of the Primary Color) to suggest pressability.
- **Overlays:** Modals and pop-overs use a backdrop blur (12px) to dim the background, focusing the user's attention entirely on the task at hand.

## Shapes
The shape language is defined by a friendly, **Rounded** profile. 
- **Standard UI:** Elements like input fields and cards use a 16px (1rem) radius.
- **Buttons:** All buttons use a consistent 16px radius to appear approachable and soft.
- **Status Pills:** Small indicators for status use a fully pill-shaped (rounded-full) geometry to differentiate them from interactive buttons.

## Components
- **Buttons:** Large format (min-height: 64px). Primary buttons use the Cyan background with white text. Secondary buttons use a thick 2px outline of the primary color.
- **Chips & Tags:** Used for category selection; they feature 12px padding and 16px rounded corners.
- **Input Fields:** Large, 72px height fields with 24px internal padding. The active state features a 3px Cyan border.
- **Progress Steppers:** Located at the top of the screen, using Emerald for completed steps and Cyan for the current step. Steps are represented by large 40px circles with clear numerical labels.
- **Cards:** High-contrast containers with white backgrounds and a 1px neutral-200 border. Content inside cards should be center-aligned or left-aligned with a minimum of 32px padding.
- **Status Indicators:** Use Emerald for "Ready/Success," Amber for "Processing/Wait," and Red for "Error/Help Needed." These are always accompanied by an icon for color-blind accessibility.