/**
 * Dynamic color utilities for applying theme colors to inline styles
 * These functions help apply theme colors that can't be applied through StyleSheet
 */

import { Colors } from '../constants/theme';

/**
 * Get theme colors based on dark mode
 */
export function getThemeColors(isDark: boolean) {
  return isDark ? Colors.dark : Colors.light;
}

/**
 * Create a semi-transparent color (for backgrounds)
 * Converts hex color to rgba format
 */
export function toRgba(hexColor: string, alpha: number = 0.1): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Get predefined style objects with theme colors
 */
export const getThemeStyles = (isDark: boolean) => {
  const colors = getThemeColors(isDark);
  
  return {
    // Background colors with transparency
    primaryBackgroundLight: toRgba(colors.primary, 0.1),
    secondaryBackgroundLight: toRgba(colors.secondary, 0.1),
    accentBackgroundLight: toRgba(colors.accent, 0.1),
    mutedBackground: toRgba(colors.muted, 0.5),
    
    // Divider colors
    dividerColor: colors.border,
    
    // Text with emphasis
    accentText: colors.accent,
    secondaryText: colors.secondary,
    mutedText: colors.mutedForeground,
    
    // Status colors
    successColor: colors.chart3, // accent is our success color
    warningColor: colors.chart5, // orange/warm color
    errorColor: colors.destructive,
  };
};

/**
 * Map color names to theme color values
 */
export const colorMap = {
  primary: (colors: typeof Colors.light) => colors.primary,
  secondary: (colors: typeof Colors.light) => colors.secondary,
  accent: (colors: typeof Colors.light) => colors.accent,
  success: (colors: typeof Colors.light) => colors.chart3,
  warning: (colors: typeof Colors.light) => colors.chart5,
  error: (colors: typeof Colors.light) => colors.destructive,
  muted: (colors: typeof Colors.light) => colors.muted,
  foreground: (colors: typeof Colors.light) => colors.foreground,
} as const;
