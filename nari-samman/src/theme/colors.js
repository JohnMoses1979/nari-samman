// ─── Color Theme: Dark Navy + Lime Green (from brand design)
// Primary background: #1C2437 (deep navy)
// Card background:    #131D29 (darker navy)
// Accent lime-green:  #9DCD43 (brand lime)
// Light lime:         #B4E065
// White text:         #FFFFFF
// Subtext:            #8A94A8

export const COLORS = {
  // Primary Brand — Lime Green Accent
  primary: '#9DCD43', // bright lime green (brand accent)
  primaryLight: '#B4E065', // lighter lime
  primaryDark: '#7AAF2A', // deeper lime

  // Legacy aliases (kept for backward compat)
  saffron: '#9DCD43',
  saffronLight: '#B4E065',
  saffronDark: '#7AAF2A',
  gold: '#B4E065',
  goldLight: '#C8EF7A',
  goldDark: '#7AAF2A',

  // Background — Dark Navy
  dark: '#1C2437', // main bg
  darkCard: '#131D29', // card bg
  darkBorder: '#2A3550', // border/separator
  darkDeep: '#0F1822', // deepest bg

  // Legacy green aliases
  green: '#2A7A4A',
  greenLight: '#3A9A5A',
  greenDark: '#1A4A2A',
  mint: '#9DCD43',

  // Surfaces / backgrounds
  cream: '#E8EDF8', // light surface
  creamDark: '#D0D8EC',
  white: '#FFFFFF',
  warmWhite: '#F0F4FF',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#C8D0E4',
  textMuted: '#8A94A8',
  textLight: '#FFFFFF',
  textDark: '#1C2437',

  // Status
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3B82F6',

  // Accent
  bengalRed: '#E74C3C',
  purple: '#7C3AED',
  teal: '#0EA5A0',

  // Gradients (used as arrays)
  gradientSaffron: ['#9DCD43', '#B4E065'],
  gradientGreen: ['#0F1822', '#1C2437'],
  gradientDark: ['#0F1822', '#1C2437'],
  gradientCream: ['#1C2437', '#243050'],
  gradientHero: ['#0F1822', '#1C2437', '#243050'],
  gradientCard: ['#131D29', '#1C2437'],
  gradientAccent: ['#7AAF2A', '#9DCD43']
};

export const SHADOWS = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.30,
    shadowRadius: 4,
    elevation: 2
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 8,
    elevation: 5
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.50,
    shadowRadius: 16,
    elevation: 10
  }
};