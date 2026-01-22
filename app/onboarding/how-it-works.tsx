import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Shield, Zap } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

const STEPS = [
  {
    id: 'shield',
    title: "Shield Mode cuts the pipeline.",
    bullets: [
        "Adds smart friction",
        "Reduces autopilot",
        "Works during your risk window"
    ],
    icon: Shield,
    color: Colors.dark.primary,
  },
  {
    id: 'panic',
    title: "Panic Mode = 180s reset.",
    bullets: [
        "Guided steps",
        "Ride the urge",
        "Back to sleep"
    ],
    icon: Zap,
    color: Colors.dark.destructive,
  },
];

export default function OnboardingHowItWorks() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  React.useEffect(() => {
    console.log('Event: help_view');
  }, []);

  const currentStep = STEPS[step];
  const Icon = currentStep.icon;

  const handleContinue = () => {
    if (step < STEPS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      router.push('/onboarding/reviews');
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { borderColor: currentStep.color }]}>
          <Icon size={80} color={currentStep.color} fill={Colors.dark.surface} />
        </View>

        <Typography variant="h2" center style={styles.title}>
            {currentStep.title}
        </Typography>

        <View style={styles.bullets}>
            {currentStep.bullets.map((bullet, i) => (
                <View key={i} style={styles.bulletRow}>
                    <View style={[styles.bulletDot, { backgroundColor: currentStep.color }]} />
                    <Typography variant="body" style={{ fontSize: 18 }}>{bullet}</Typography>
                </View>
            ))}
        </View>

        <View style={styles.pagination}>
            {STEPS.map((_, i) => (
                <View 
                    key={i} 
                    style={[
                        styles.dot, 
                        i === step ? styles.activeDot : styles.inactiveDot
                    ]} 
                />
            ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={handleContinue}
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
    gap: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
  },
  title: {
    fontSize: 32,
    marginBottom: Spacing.md,
  },
  bullets: {
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pagination: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: Colors.dark.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
