import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Percent } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function PaywallDiscount() {
  const router = useRouter();

  React.useEffect(() => {
    console.log('Event: discounted_paywall_view');
  }, []);

  const handleClaim = () => {
      console.log('Event: discounted_paywall_purchase');
      Alert.alert(
        "Offer Claimed!",
        "Discount applied to annual plan.",
        [
          { text: "Continue", onPress: () => router.replace('/(app)/home') }
        ]
      );
  };

  const handleDecline = () => {
      // Free mode
      router.replace('/(app)/home');
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
            <Percent size={48} color={Colors.dark.primaryForeground} />
        </View>

        <Typography variant="h1" center style={{ marginBottom: Spacing.sm }}>
            One-time offer
        </Typography>
        
        <Typography variant="body" center color={Colors.dark.textSecondary} style={{ marginBottom: Spacing.xl }}>
            Don't leave without protection. Save 40% on annual access.
        </Typography>

        <View style={styles.offerCard}>
             <Typography variant="h3" center>Annual Plan</Typography>
             <View style={styles.priceRow}>
                <Typography variant="h2" style={{ textDecorationLine: 'line-through', opacity: 0.5, fontSize: 24 }}>$99</Typography>
                <Typography variant="h1" color={Colors.dark.primary}>$59</Typography>
             </View>
             <Typography variant="caption" center color={Colors.dark.textSecondary}>
                 Billed once. Cancel anytime.
             </Typography>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Claim 40% off" 
          onPress={handleClaim}
          size="lg"
        />
        <TouchableOpacity onPress={handleDecline} style={{ marginTop: 16 }}>
            <Typography variant="body" center color={Colors.dark.textSecondary}>
                No thanks, I'll risk it
            </Typography>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.surface,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: Colors.dark.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.lg,
  },
  offerCard: {
      width: '100%',
      backgroundColor: Colors.dark.background,
      padding: Spacing.xl,
      borderRadius: Radius.lg,
      borderWidth: 2,
      borderColor: Colors.dark.primary,
      alignItems: 'center',
      gap: Spacing.sm,
  },
  priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: Spacing.md,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
