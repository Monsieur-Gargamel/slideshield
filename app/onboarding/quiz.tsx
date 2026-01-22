import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Spacing } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const QUESTIONS = [
  {
    id: 'time_window',
    question: "When does it usually slide?",
    type: 'single',
    options: [
      { label: "11pm–1am", value: "11pm-1am" },
      { label: "1am–3am", value: "1am-3am" },
      { label: "I wake up at night", value: "wakeup" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: 'pipeline_apps',
    question: "Which apps pull you into autopilot?",
    type: 'multi',
    options: [
      { label: "TikTok", value: "tiktok" },
      { label: "Instagram Reels", value: "instagram" },
      { label: "X (Twitter)", value: "twitter" },
      { label: "Reddit", value: "reddit" },
      { label: "Safari / Browser", value: "browser" },
      { label: "Other", value: "other" },
    ],
  },
  {
    id: 'trigger',
    question: "What’s your main trigger at night?",
    type: 'single',
    options: [
      { label: "Boredom", value: "boredom" },
      { label: "Stress", value: "stress" },
      { label: "Loneliness", value: "loneliness" },
      { label: "Fatigue", value: "fatigue" },
      { label: "Habit", value: "habit" },
    ],
  },
  {
    id: 'goal',
    question: "What do you want most?",
    type: 'single',
    options: [
      { label: "Sleep better", value: "sleep" },
      { label: "More focus", value: "focus" },
      { label: "More confidence", value: "confidence" },
      { label: "Better relationship", value: "relationship" },
      { label: "Stop autopilot", value: "autopilot" },
    ],
  },
];

export default function OnboardingQuiz() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const { setAnswer, answers } = useOnboardingStore();
  
  // Local state for multi-select
  const [multiSelections, setMultiSelections] = useState<string[]>([]);

  const currentQuestion = QUESTIONS[currentStep];
  const isLastStep = currentStep === QUESTIONS.length - 1;

  const handleOptionSelect = (value: string) => {
    if (currentQuestion.type === 'single') {
      setAnswer(currentQuestion.id, value);
      goNext();
    } else {
      // Multi select logic
      setMultiSelections(prev => {
        if (prev.includes(value)) {
          return prev.filter(item => item !== value);
        }
        return [...prev, value];
      });
    }
  };

  const confirmMultiSelect = () => {
    setAnswer(currentQuestion.id, multiSelections);
    setMultiSelections([]); // Reset for next potential multi-select (though we only have one)
    goNext();
  };

  const goNext = () => {
    if (isLastStep) {
      console.log('Event: quiz_completed', answers);
      router.push('/onboarding/analysis');
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      // We might want to restore previous selection state here if we wanted to be perfect, 
      // but for MVP resetting local multi-select state is acceptable.
      setMultiSelections([]);
    } else {
      router.back();
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft color={Colors.dark.textSecondary} size={28} />
        </TouchableOpacity>
        <ProgressBar 
          progress={currentStep + 1} 
          total={QUESTIONS.length} 
          style={styles.progress}
        />
        <View style={{ width: 28 }} /> 
      </View>

      <View style={styles.content}>
        <Typography variant="h2" style={styles.question}>
          {currentQuestion.question}
        </Typography>

        <ScrollView contentContainerStyle={styles.options} showsVerticalScrollIndicator={false}>
          {currentQuestion.options.map((option) => {
            const isSelected = currentQuestion.type === 'single' 
              ? false // We navigate immediately, so no visual selection state needed really, but could add if we delayed
              : multiSelections.includes(option.value);

            return (
              <Button
                key={option.value}
                title={option.label}
                variant={isSelected ? "primary" : "outline"}
                onPress={() => handleOptionSelect(option.value)}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOption
                ]}
                textStyle={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText
                ]}
              />
            );
          })}
        </ScrollView>

        {currentQuestion.type === 'multi' && (
          <View style={styles.footer}>
            <Button 
              title="Continue" 
              onPress={confirmMultiSelect}
              disabled={multiSelections.length === 0}
              size="lg"
            />
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  progress: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: Spacing.xl,
  },
  question: {
    marginTop: Spacing.md,
    textAlign: 'left',
  },
  options: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  optionButton: {
    justifyContent: 'flex-start',
    paddingVertical: 18,
    backgroundColor: Colors.dark.surface,
    borderColor: Colors.dark.surfaceHighlight,
  },
  selectedOption: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  optionText: {
    fontSize: 18,
  },
  selectedOptionText: {
    color: Colors.dark.primaryForeground,
  },
  footer: {
    paddingBottom: Spacing.lg,
  }
});
