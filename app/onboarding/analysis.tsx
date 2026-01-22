import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

export default function OnboardingAnalysis() {
  const router = useRouter();

  useEffect(() => {
    // 2 seconds analysis simulation
    const timer = setTimeout(() => {
      router.replace('/onboarding/results');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
        <Typography variant="h2" center style={{ marginTop: Spacing.xl }}>
          Analyzing your night pattern…
        </Typography>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
