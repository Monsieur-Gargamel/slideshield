import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { BatteryWarning, BrainCircuit, Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const STEPS = [
  {
    icon: Clock,
    title: "Late-night scrolling kills sleep.",
    description: "Your brain thinks it's daytime, blocking melatonin.",
  },
  {
    icon: BrainCircuit,
    title: "Autopilot makes slips feel inevitable.",
    description: "It’s not willpower. It’s a dopamine loop.",
  },
  {
    icon: BatteryWarning,
    title: "You wake up tired, unfocused, and frustrated.",
    description: "The regret in the morning is the worst part.",
  },
];

export default function OnboardingSymptoms() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  React.useEffect(() => {
    console.log('Event: symptoms_view');
  }, []);

  const currentStep = STEPS[step];
  const Icon = currentStep.icon;

  const handleContinue = () => {
    if (step < STEPS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      router.push('/onboarding/how-it-works');
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon size={80} color={Colors.dark.destructive} />
        </View>

        <View style={styles.textContainer}>
          <Typography variant="h2" center style={styles.title}>
            {currentStep.title}
          </Typography>
          
          <Typography variant="body" center color={Colors.dark.textSecondary}>
            {currentStep.description}
          </Typography>
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
    borderWidth: 1,
    borderColor: Colors.dark.surfaceHighlight,
  },
  textContainer: {
    gap: Spacing.md,
  },
  title: {
    fontSize: 28,
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
