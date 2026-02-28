/**
 * Palette Generator
 *
 * Define 3 base colors. The entire app palette is derived mathematically.
 * Change these 3 values to re-skin the entire app.
 *
 * Algorithm:
 *   1. Parse hex → RGB → HSL
 *   2. Generate tonal scale per color (light, soft, muted, dark variants)
 *   3. Derive neutral scale from primary hue
 *   4. Map everything to semantic tokens
 */

// ━━━ CHANGE THESE 3 COLORS TO RE-THEME THE APP ━━━━━━━━━━━
export const BASE = {
  primary: '#C9A84C',     // Gold — brand accent, CTAs, active states
  secondary: '#34D399',   // Green — success, positive metrics, growth
  tertiary: '#60A5FA',    // Blue — info, links, secondary actions
} as const;

// ━━━ Dark mode surface base (change for light mode) ━━━━━━━
export const MODE = {
  bg: '#0A0A0A',          // App background
  isDark: true,
} as const;

// ━━━ COLOR MATH ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, c)))
      .toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

/** Generate a tonal scale from a single hex color */
function generateScale(hex: string) {
  const [h, s, l] = getHsl(hex);
  return {
    base: hex,
    light: hslToHex(h, Math.min(s + 10, 100), Math.min(l + 20, 90)),
    dark: hslToHex(h, s, Math.max(l - 20, 10)),
    soft: `rgba(${hexToRgb(hex).join(',')},0.12)`,
    muted: `rgba(${hexToRgb(hex).join(',')},0.25)`,
    contrast: l > 55 ? '#0A0A0A' : '#FFFFFF',
  };
}

/** Generate neutral scale from primary hue for a dark mode UI */
function generateNeutrals(primaryHex: string) {
  const [h] = getHsl(primaryHex);
  // Inject a tiny hint of the primary hue into the neutrals
  const hueShift = h;
  const sat = 4; // very desaturated

  return {
    bg:         MODE.bg,
    surface:    hslToHex(hueShift, sat, 8),
    elevated:   hslToHex(hueShift, sat, 11),
    hover:      hslToHex(hueShift, sat, 14),
    border:     hslToHex(hueShift, sat, 18),
    borderLight: hslToHex(hueShift, sat, 11),
    textPrimary:   hslToHex(hueShift, sat, 96),
    textSecondary: hslToHex(hueShift, sat, 56),
    textTertiary:  hslToHex(hueShift, sat, 40),
    textMuted:     hslToHex(hueShift, sat, 29),
  };
}

// ━━━ GENERATED PALETTE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const primary = generateScale(BASE.primary);
export const secondary = generateScale(BASE.secondary);
export const tertiary = generateScale(BASE.tertiary);
export const neutral = generateNeutrals(BASE.primary);

// Semantic error/warning derived from secondary/tertiary
const errorHex = '#F87171';
const warningHex = '#FBBF24';
export const error = generateScale(errorHex);
export const warning = generateScale(warningHex);

/**
 * Full derived palette object.
 * Everything below is computed from BASE.primary, BASE.secondary, BASE.tertiary.
 */
export const palette = {
  primary,
  secondary,
  tertiary,
  error,
  warning,
  neutral,
} as const;
