import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

export default function OnboardingResults() {
  const router = useRouter();
  const { answers } = useOnboardingStore();

  React.useEffect(() => {
    console.log('Event: results_view');
  }, []);

  const timeWindow = (answers.time_window as string) || "11pm-1am";
  const apps = Array.isArray(answers.pipeline_apps) ? answers.pipeline_apps.length : 1;
  const trigger = (answers.trigger as string) || "Habit";

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <Typography variant="caption" color={Colors.dark.textSecondary} center style={styles.eyebrow}>
                YOUR PROFILE
            </Typography>
            <Typography variant="h1" center style={styles.title}>
            Night Scroller
            </Typography>
        </View>

        <View style={styles.scoreCard}>
            <Typography variant="body" color={Colors.dark.textSecondary}>Risk tonight</Typography>
            <View style={styles.scoreBarContainer}>
                <View style={styles.scoreBarFill} />
            </View>
            <Typography variant="h1" style={styles.scoreText}>71%</Typography>
        </View>

        <View style={styles.chipsContainer}>
            <Chip label={timeWindow} />
            <Chip label={`${apps} Apps`} />
            <Chip label={trigger} />
        </View>

        <View style={styles.messageBox}>
            <Typography variant="body">
                Your biggest risk is <Typography variant="body" style={{fontWeight: 'bold', color: Colors.dark.primary}}>{trigger}</Typography> triggering autopilot on <Typography variant="body" style={{fontWeight: 'bold', color: Colors.dark.primary}}>{apps} apps</Typography> after <Typography variant="body" style={{fontWeight: 'bold', color: Colors.dark.primary}}>{timeWindow}</Typography>.
            </Typography>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={() => router.push('/onboarding/symptoms')}
          size="lg"
        />
      </View>
    </Screen>
  );
}

function Chip({ label }: { label: string }) {
    return (
        <View style={styles.chip}>
            <Typography variant="caption" style={{fontWeight: '600'}}>{label}</Typography>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 0,
  },
  scrollContent: {
    paddingBottom: 100,
    gap: Spacing.xl,
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  header: {
    gap: Spacing.xs,
    alignItems: 'center',
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
  },
  scoreCard: {
    width: '100%',
    backgroundColor: Colors.dark.surface,
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.surfaceHighlight,
  },
  scoreBarContainer: {
    height: 12,
    width: '100%',
    backgroundColor: Colors.dark.background,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    width: '71%',
    backgroundColor: Colors.dark.destructive,
  },
  scoreText: {
    color: Colors.dark.destructive,
    fontSize: 48,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.dark.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.dark.surfaceHighlight,
  },
  messageBox: {
    backgroundColor: 'rgba(214, 255, 96, 0.1)', // low opacity primary
    padding: Spacing.lg,
    borderRadius: Radius.md,
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.dark.background,
  },
});
