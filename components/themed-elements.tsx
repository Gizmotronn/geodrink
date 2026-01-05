/**
 * Styled component wrappers that apply theme colors dynamically
 * These wrap common styled elements with theme-aware backgrounds and borders
 */

import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useThemeColor } from '../hooks/use-theme-color';

interface ThemedCardProps extends ViewProps {
  variant?: 'default' | 'muted' | 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
}

/**
 * A card component that applies theme-aware background and border colors
 */
export function ThemedCard({
  variant = 'default',
  style,
  children,
  ...props
}: ThemedCardProps) {
  const bgColor = useThemeColor(
    {},
    variant === 'muted' ? 'muted' :
    variant === 'primary' ? 'primary' :
    variant === 'secondary' ? 'secondary' :
    variant === 'accent' ? 'accent' : 'card'
  );
  
  const borderColor = useThemeColor({}, 'border');

  const cardStyle: ViewStyle = {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: variant === 'default' ? borderColor : 'transparent',
    backgroundColor: bgColor,
  };

  return (
    <View style={[cardStyle, style]} {...props}>
      {children}
    </View>
  );
}

interface ThemedButtonProps extends ViewProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  children: React.ReactNode;
}

/**
 * A button container that applies theme-aware background colors
 */
export function ThemedButton({
  variant = 'primary',
  style,
  children,
  ...props
}: ThemedButtonProps) {
  const bgColor = useThemeColor(
    {},
    variant === 'secondary' ? 'secondary' :
    variant === 'accent' ? 'accent' : 'primary'
  );
  
  const borderColor = useThemeColor({}, 'primary');

  const buttonStyle: ViewStyle = {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: variant === 'ghost' ? 'transparent' : bgColor,
    borderWidth: variant === 'ghost' ? 2 : 0,
    borderColor: variant === 'ghost' ? borderColor : 'transparent',
  };

  return (
    <View style={[buttonStyle, style]} {...props}>
      {children}
    </View>
  );
}

interface ThemedPillProps extends ViewProps {
  children: React.ReactNode;
}

/**
 * A pill-shaped badge component with theme-aware colors
 */
export function ThemedPill({
  style,
  children,
  ...props
}: ThemedPillProps) {
  const bgColor = useThemeColor({}, 'muted');

  const pillStyle: ViewStyle = {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: bgColor,
  };

  return (
    <View style={[pillStyle, style]} {...props}>
      {children}
    </View>
  );
}
