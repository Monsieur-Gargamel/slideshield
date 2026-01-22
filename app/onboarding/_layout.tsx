import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.dark.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="analysis" options={{ animation: 'fade' }} />
      <Stack.Screen name="results" />
      <Stack.Screen name="symptoms" />
      <Stack.Screen name="how-it-works" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="features" />
      <Stack.Screen name="custom-plan" />
      <Stack.Screen name="paywall" options={{ gestureEnabled: false }} />
      <Stack.Screen name="paywall-discount" options={{ presentation: 'modal', gestureEnabled: false }} />
    </Stack>
  );
}
