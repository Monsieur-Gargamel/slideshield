import { Colors } from '@/constants/theme';
import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: string;
  center?: boolean;
}

export function Typography({
  children,
  variant = 'body',
  color = Colors.dark.text,
  center,
  style,
  ...props
}: TypographyProps) {
  return (
    <Text
      style={[
        styles[variant],
        { color, textAlign: center ? 'center' : 'auto' },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: Colors.dark.textSecondary,
  },
});
