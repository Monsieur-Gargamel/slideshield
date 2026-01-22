import { Colors } from '@/constants/theme';
import { Stack } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.dark.background },
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="panic-mode" options={{ gestureEnabled: false, animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
