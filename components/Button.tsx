import { Colors, Radius, Spacing } from '@/constants/theme';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? Colors.dark.text : Colors.dark.primaryForeground} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              styles.textBase,
              styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles],
              styles[`textSize${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    gap: Spacing.sm,
  },
  // Variants
  primary: {
    backgroundColor: Colors.dark.primary,
  },
  secondary: {
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  // Text Styles
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textPrimary: {
    color: Colors.dark.primaryForeground,
  },
  textSecondary: {
    color: Colors.dark.text,
  },
  textOutline: {
    color: Colors.dark.text,
  },
  textGhost: {
    color: Colors.dark.textSecondary,
  },
  textSizeSm: {
    fontSize: 14,
  },
  textSizeMd: {
    fontSize: 16,
  },
  textSizeLg: {
    fontSize: 18,
  },
});
