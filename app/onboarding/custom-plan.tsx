import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useRouter } from 'expo-router';
import { ArrowRight, CheckCircle2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

export default function OnboardingCustomPlan() {
  const router = useRouter();
  const { answers } = useOnboardingStore();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    console.log('Event: plan_view');
  }, []);

  const timeWindow = (answers.time_window as string) || "22:30–06:30";
  const apps = Array.isArray(answers.pipeline_apps) ? answers.pipeline_apps.length : 1;
  const trigger = (answers.trigger as string) || "Habit";

  const handleActivate = () => {
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          router.push('/onboarding/paywall');
      }, 1500);
  };

  if (loading) {
      return (
          <Screen style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="large" color={Colors.dark.primary} />
              <Typography variant="h3" style={{ marginTop: Spacing.lg }}>Generating plan...</Typography>
          </Screen>
      )
  }

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h1" center style={{ marginBottom: Spacing.xl }}>
            Your NightShield Plan
        </Typography>

        <View style={styles.card}>
            <PlanItem label="Target Window" value={timeWindow} />
            <Divider />
            <PlanItem label="Blocked Apps" value={`${apps} Selected Apps`} />
            <Divider />
            <PlanItem label="Primary Trigger" value={trigger} />
            <Divider />
            <PlanItem label="Protocol" value={`${trigger} Response`} highlight />
        </View>

        <View style={styles.goalBox}>
            <CheckCircle2 size={24} color={Colors.dark.primary} />
            <Typography variant="body" style={{ flex: 1 }}>
                Goal: <Typography variant="body" style={{ fontWeight: 'bold' }}>5 nights without relapse</Typography>
            </Typography>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Activate my plan" 
          onPress={handleActivate}
          size="lg"
          icon={<ArrowRight size={20} color={Colors.dark.primaryForeground} />}
          iconPosition="right"
        />
      </View>
    </Screen>
  );
}

function PlanItem({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
    return (
        <View style={styles.planItem}>
            <Typography variant="body" color={Colors.dark.textSecondary}>{label}</Typography>
            <Typography variant="h3" color={highlight ? Colors.dark.primary : Colors.dark.text}>{value}</Typography>
        </View>
    )
}

function Divider() {
    return <View style={styles.divider} />
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.surfaceHighlight,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  planItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  goalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(214, 255, 96, 0.1)',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(214, 255, 96, 0.2)',
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
