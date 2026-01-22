import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useRouter } from 'expo-router';
import { Check, Shield, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function Paywall() {
  const router = useRouter();
  const { answers } = useOnboardingStore();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  const trigger = (answers.trigger as string) || "Habit";

  React.useEffect(() => {
    console.log('Event: paywall_view');
  }, []);

  const handlePurchase = () => {
    console.log('Event: paywall_purchase');
    console.log('Event: trial_start');
    // In a real app, this would trigger IAP
    Alert.alert(
      "Subscription Successful",
      "Welcome to NightShield Premium.",
      [
        { text: "Continue", onPress: () => router.replace('/(app)/home') }
      ]
    );
  };

  const handleClose = () => {
      // Log intent
      console.log('Event: paywall_close_intent');
      router.push('/onboarding/paywall-discount');
  };

  return (
    <Screen style={styles.container} padding={false}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color={Colors.dark.textSecondary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Shield size={64} color={Colors.dark.primary} fill={Colors.dark.surface} />
          <Typography variant="h1" center style={styles.title}>
            Cut the pipeline tonight.
          </Typography>
        </View>

        <View style={styles.features}>
           <FeatureRow text="Shield Mode during your risk window" />
           <FeatureRow text="Panic Mode 180s when urges hit" />
           <FeatureRow text={`Personalized plan for ${trigger}`} />
        </View>

        <View style={styles.plans}>
          <TouchableOpacity 
            style={[styles.planCard, selectedPlan === 'yearly' && styles.selectedPlan]}
            onPress={() => setSelectedPlan('yearly')}
          >
             <View style={styles.planHeader}>
               <Typography variant="h3">Yearly</Typography>
               <View style={styles.badge}>
                 <Typography variant="caption" style={styles.badgeText}>SAVE 50%</Typography>
               </View>
             </View>
             <Typography variant="h2">$99.00<Typography variant="caption">/year</Typography></Typography>
             <Typography variant="caption" color={Colors.dark.textSecondary}>Just $8.25/month</Typography>
             
             {selectedPlan === 'yearly' && (
               <View style={styles.checkbox}>
                 <Check size={16} color={Colors.dark.primaryForeground} />
               </View>
             )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.planCard, selectedPlan === 'monthly' && styles.selectedPlan]}
            onPress={() => setSelectedPlan('monthly')}
          >
             <View style={styles.planHeader}>
               <Typography variant="h3">Monthly</Typography>
             </View>
             <Typography variant="h2">$19.99<Typography variant="caption">/month</Typography></Typography>
             
             {selectedPlan === 'monthly' && (
               <View style={styles.checkbox}>
                 <Check size={16} color={Colors.dark.primaryForeground} />
               </View>
             )}
          </TouchableOpacity>
        </View>

        <Typography variant="caption" center style={{ marginTop: Spacing.md, opacity: 0.6 }}>
            Includes 7-day free trial
        </Typography>

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Start free trial"
          onPress={handlePurchase}
          size="lg"
        />
        <TouchableOpacity onPress={() => router.replace('/(app)/home')} style={{ marginTop: 12 }}>
           <Typography variant="caption" center style={{ opacity: 0.5 }}>
             Restore Purchases
           </Typography>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.iconBox}>
        <Check size={16} color={Colors.dark.primaryForeground} />
      </View>
      <Typography variant="body" style={{ flex: 1 }}>{text}</Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 150,
  },
  closeButton: {
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 10,
      padding: 10,
  },
  header: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
    marginTop: Spacing.xl * 2,
    gap: Spacing.md,
  },
  title: {
    fontSize: 32,
  },
  features: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plans: {
    gap: Spacing.md,
  },
  planCard: {
    backgroundColor: Colors.dark.background,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPlan: {
    borderColor: Colors.dark.primary,
    backgroundColor: Colors.dark.background,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badge: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  badgeText: {
    color: Colors.dark.primaryForeground,
    fontWeight: '700',
    fontSize: 10,
  },
  checkbox: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl + 10,
    backgroundColor: Colors.dark.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.surfaceHighlight,
  },
});
