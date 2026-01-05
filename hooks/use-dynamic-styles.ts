/**
 * Hook to create dynamic styles based on the current theme
 * Combines static style definitions with dynamic color values
 */

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Colors } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export function useDynamicStyles<T extends NamedStyles<T>>(
  styleCreator: (colors: typeof Colors.light) => T
): T {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  return styleCreator(colors);
}

/**
 * Helper to create themed background and text color combinations
 */
export function getColorPair(colors: typeof Colors.light, colorKey: keyof typeof Colors.light) {
  const colorValue = colors[colorKey];
  
  // Map specific color keys to their foreground counterparts
  const colorMap: Record<string, string> = {
    'primary': colors.primaryForeground,
    'secondary': colors.secondaryForeground,
    'accent': colors.accentForeground,
    'muted': colors.mutedForeground,
    'destructive': colors.destructiveForeground,
    'card': colors.cardForeground,
  };
  
  return {
    backgroundColor: colorValue,
    color: colorMap[colorKey as string] || colors.foreground,
  };
}

/**
 * Helper to get opacity-based colors for subtle backgrounds
 */
export function getAlphaColor(color: string, alpha: number = 0.1): string {
  // This is a simple implementation; for production, consider using a color library
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
