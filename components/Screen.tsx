import { Colors, Spacing } from '@/constants/theme';
import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  safeArea?: boolean;
  padding?: boolean;
}

export function Screen({ 
  children, 
  style, 
  safeArea = true,
  padding = true 
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        safeArea && {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        padding && styles.padding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  padding: {
    paddingHorizontal: Spacing.lg,
  },
});
