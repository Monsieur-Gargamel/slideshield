import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

const REVIEWS = [
    {
        name: "Alex M.",
        text: "I stopped late-night slips in the first week. Simple and effective.",
        stars: 5
    },
    {
        name: "Jordan T.",
        text: "The 3-minute reset actually works. Saved my sleep schedule.",
        stars: 5
    },
    {
        name: "Chris K.",
        text: "Finally an app that doesn't shame you, just helps you stop.",
        stars: 5
    },
    {
        name: "Sam R.",
        text: "Waking up without brain fog is a game changer.",
        stars: 5
    }
];

export default function OnboardingReviews() {
  const router = useRouter();

  React.useEffect(() => {
    console.log('Event: reviews_view');
  }, []);

  return (
    <Screen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Typography variant="h2" center style={{ marginBottom: Spacing.lg }}>
            Community Results
        </Typography>

        {REVIEWS.map((review, i) => (
            <View key={i} style={styles.card}>
                <View style={styles.stars}>
                    {[...Array(review.stars)].map((_, k) => (
                        <Star key={k} size={16} fill={Colors.dark.primary} color={Colors.dark.primary} />
                    ))}
                </View>
                <Typography variant="body" style={styles.reviewText}>"{review.text}"</Typography>
                <Typography variant="caption" color={Colors.dark.textSecondary}>{review.name}</Typography>
            </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Continue" 
          onPress={() => router.push('/onboarding/features')}
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
    padding: Spacing.lg,
    paddingBottom: 120,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.surfaceHighlight,
    gap: Spacing.sm,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontStyle: 'italic',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.surfaceHighlight,
  },
});
