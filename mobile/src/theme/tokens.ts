/**
 * Design Tokens — derived from 3 base colors in palette.ts
 *
 * To re-theme the app:
 *   1. Open palette.ts
 *   2. Change BASE.primary, BASE.secondary, BASE.tertiary
 *   3. Everything here recalculates automatically
 */

import { palette, primary, secondary, tertiary, error, warning, neutral } from './palette';

// ─── Semantic Tokens ──────────────────────────────────────
export const tokens = {

  // ── Colors ────────────────────────────────────────────
  color: {
    // Backgrounds (derived from primary hue)
    bg: neutral.bg,
    bgCard: neutral.surface,
    bgElevated: neutral.elevated,
    bgHover: neutral.hover,

    // Text (derived from primary hue)
    textPrimary: neutral.textPrimary,
    textSecondary: neutral.textSecondary,
    textTertiary: neutral.textTertiary,
    textMuted: neutral.textMuted,

    // Borders (derived from primary hue)
    border: neutral.border,
    borderLight: neutral.borderLight,

    // Brand / Accent (= primary)
    accent: primary.base,
    accentLight: primary.light,
    accentSoft: primary.soft,

    // Interactive (buttons)
    buttonPrimaryBg: '#FFFFFF',
    buttonPrimaryText: neutral.bg,
    buttonSecondaryBg: primary.base,
    buttonSecondaryText: primary.contrast,
    buttonOutlineBorder: neutral.border,
    buttonOutlineText: neutral.textPrimary,

    // Semantic (success = secondary, info = tertiary)
    success: secondary.base,
    successSoft: secondary.soft,
    warning: warning.base,
    warningSoft: warning.soft,
    error: error.base,
    errorSoft: error.soft,
    info: tertiary.base,
    infoSoft: tertiary.soft,

    // Tab bar
    tabActive: primary.base,
    tabInactive: neutral.textTertiary,
    tabBg: neutral.bg,
    tabBorder: neutral.border,

    // Input
    inputBg: neutral.elevated,
    inputBorder: neutral.border,
    inputText: neutral.textPrimary,
    inputPlaceholder: neutral.textTertiary,
    inputLabel: neutral.textPrimary,
    inputError: error.base,
  },

  // ── Typography ────────────────────────────────────────
  font: {
    // Font family — maps to loaded Google Fonts
    family: {
      light: 'Inter_300Light',
      regular: 'Inter_400Regular',
      medium: 'Inter_500Medium',
      semibold: 'Inter_600SemiBold',
      bold: 'Inter_700Bold',
      heavy: 'Inter_800ExtraBold',
    },
    size: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 17,
      xl: 20,
      xxl: 28,
      hero: 34,
    },
    weight: {
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
      heavy: '800' as const,
    },
    letterSpacing: {
      tight: -1,
      normal: 0,
      wide: 1,
      wider: 2,
    },
  },

  // ── Spacing ───────────────────────────────────────────
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // ── Radius ────────────────────────────────────────────
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    full: 9999,
  },

  // ── Shadows ───────────────────────────────────────────
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 5,
    },
  },

  // ── Component-specific ────────────────────────────────
  component: {
    card: {
      bg: neutral.surface,
      border: neutral.border,
      radius: 16,
      padding: 16,
    },
    avatar: {
      size: 44,
      borderColor: neutral.border,
    },
    iconButton: {
      size: 36,
      borderColor: neutral.border,
    },
    iconBox: {
      size: 40,
      bg: neutral.elevated,
      radius: 8,
    },
    statusDot: {
      size: 6,
    },
  },
};

// ─── Backward-compatible exports ──────────────────────────
// Existing components import { colors, spacing, ... } from theme.
// These map to the token system so nothing breaks.
export const colors = {
  primary: tokens.color.buttonPrimaryBg,
  primaryMuted: 'rgba(255,255,255,0.7)',
  accent: tokens.color.accent,
  accentLight: tokens.color.accentLight,
  accentSoft: tokens.color.accentSoft,
  success: tokens.color.success,
  successSoft: tokens.color.successSoft,
  warning: tokens.color.warning,
  warningSoft: tokens.color.warningSoft,
  error: tokens.color.error,
  errorSoft: tokens.color.errorSoft,
  info: tokens.color.info,
  infoSoft: tokens.color.infoSoft,
  background: tokens.color.bg,
  surface: tokens.color.bgCard,
  surfaceLight: tokens.color.bgElevated,
  surfaceHover: tokens.color.bgHover,
  card: tokens.color.bgCard,
  text: tokens.color.textPrimary,
  textSecondary: tokens.color.textSecondary,
  textLight: tokens.color.textTertiary,
  textMuted: tokens.color.textMuted,
  border: tokens.color.border,
  borderLight: tokens.color.borderLight,
};

export const spacing = tokens.space;
export const fontSize = tokens.font.size;
export const borderRadius = tokens.radius;
export const shadows = tokens.shadow;
