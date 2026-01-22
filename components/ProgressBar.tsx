import { Colors, Radius } from '@/constants/theme';
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  total?: number; // if provided, progress is current step (1-based)
  style?: ViewStyle;
}

export function ProgressBar({ progress, total, style }: ProgressBarProps) {
  const fill = total ? progress / total : progress;
  
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.fill, { width: `${Math.min(100, Math.max(0, fill * 100))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 6,
    backgroundColor: Colors.dark.surfaceHighlight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: Radius.full,
  },
});
