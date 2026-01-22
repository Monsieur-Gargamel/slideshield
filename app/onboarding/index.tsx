import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Moon, Shield } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function OnboardingWelcome() {
  const router = useRouter();

  React.useEffect(() => {
    console.log('Event: onboarding_start');
  }, []);

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Moon size={64} color={Colors.dark.primary} />
          <View style={styles.badge}>
            <Shield size={24} color={Colors.dark.primaryForeground} fill={Colors.dark.primary} />
          </View>
        </View>

        <Typography variant="h1" center style={styles.title}>
          Stop the slide tonight.
        </Typography>
        
        <Typography variant="body" center color={Colors.dark.textSecondary} style={styles.subtitle}>
          A night mode that breaks scrolling → urges → relapse.
        </Typography>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Get started" 
          onPress={() => router.push('/onboarding/quiz')}
          size="lg"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: Spacing.xl,
  },
  badge: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: Colors.dark.surface,
    borderRadius: 999,
    padding: 4,
  },
  title: {
    fontSize: 42,
    marginTop: Spacing.md,
  },
  subtitle: {
    maxWidth: '80%',
    lineHeight: 28,
    fontSize: 18,
  },
  footer: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
