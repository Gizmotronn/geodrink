/**
 * Centralized style & color reference for the app.
 *
 * This file re-exports and documents every styling / color token
 * currently defined across the codebase so they can be referenced
 * from a single place for designers or devs.
 */

import { Colors, Fonts } from './theme';
import { S, getThemeStyles as getAppStylesTheme, HEADER_HEIGHT } from '../styles';
import { getThemeColors, toRgba, getThemeStyles as getUtilsThemeStyles, colorMap } from '../utils/theme-colors';

export type ColorKey = keyof typeof Colors.light;

// List of available color token keys (light/dark share the same keys)
export const ColorKeys: ColorKey[] = Object.keys(Colors.light) as ColorKey[];

// Export the raw color palettes for programmatic use
export const ColorPalettes = {
  light: Colors.light,
  dark: Colors.dark,
};

// Fonts available by platform
export const FontTokens = Fonts;

// Re-exported style-sheet map and helpers
export const AppStyles = S;
export const Helpers = {
  // From /styles.ts
  getAppStylesTheme,
  HEADER_HEIGHT,
  // From /utils/theme-colors.ts
  getThemeColors,
  toRgba,
  getUtilsThemeStyles,
  colorMap,
};

// A compact reference object summarizing common tokens and usage
export const StyleReference = {
  colors: ColorPalettes,
  colorKeys: ColorKeys,
  fonts: FontTokens,
  styles: AppStyles,
  helpers: Helpers,
};

export default StyleReference;
