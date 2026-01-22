import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { BarChart3, Calendar, Shield, Zap } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

const FEATURES = [
    {
        icon: Shield,
        title: "Shield Mode Scheduling",
        desc: "Automated protection windows"
    },
    {
        icon: Zap,
        title: "Panic Mode 180s",
        desc: "Emergency reset tool"
    },
    {
        icon: Calendar,
        title: "Personalized Protocols",
        desc: "Custom plan for your triggers"
    },
    {
        icon: BarChart3,
        title: "Night Check-ins & Stats",
        desc: "Track nights saved & urges won"
    }
];

export default function OnboardingFeatures() {
  const router = useRouter();

  React.useEffect(() => {
    console.log('Event: features_view');
  }, []);

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h1" center style={{ marginBottom: Spacing.xl }}>
            What you get
        </Typography>

        <View style={styles.list}>
            {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                    <View key={i} style={styles.item}>
                        <View style={styles.iconBox}>
                            <Icon size={24} color={Colors.dark.primary} />
                        </View>
                        <View style={styles.text}>
                            <Typography variant="h3" style={{ fontSize: 18 }}>{feature.title}</Typography>
                            <Typography variant="body" color={Colors.dark.textSecondary}>{feature.desc}</Typography>
                        </View>
                    </View>
                );
            })}
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Build my plan" 
          onPress={() => router.push('/onboarding/custom-plan')}
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
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  list: {
    gap: Spacing.lg,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.dark.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.surfaceHighlight,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(214, 255, 96, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
