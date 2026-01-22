import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';
import { Bell, Lock, Moon, Settings, Shield, Zap, Check, X } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';

export default function AppDashboard() {
  const router = useRouter();
  const { isPro, setPro, startPanic, lockUntil } = useAppStore();
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [lockTimer, setLockTimer] = useState<string | null>(null);

  useEffect(() => {
    if (!lockUntil) {
        setLockTimer(null);
        return;
    }

    const updateTimer = () => {
        const now = Date.now();
        const diff = lockUntil - now;
        if (diff <= 0) {
            setLockTimer(null);
            return;
        }
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setLockTimer(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lockUntil]);

  const toggleShield = () => {
    if (!isPro) {
      setShowUpsell(true);
      return;
    }
    setIsShieldActive(!isShieldActive);
  };

  const handlePanicPress = () => {
    if (!isPro) {
      setShowUpsell(true);
      return;
    }
    startPanic();
    router.push('/panic-mode');
  };

  const handlePurchase = () => {
    // Simulate purchase
    setPro(true);
    setShowUpsell(false);
    
    // Auto-start panic if that was the intent?
    // The prompt says: "If user purchases successfully → set isPro=true, close upsell, navigate to PanicModeScreen and auto-start."
    // However, we don't know if they clicked Shield or Panic.
    // Let's assume for MVP if they convert on this screen, we just unlock.
    // Ideally we track intent, but for now let's just unlock.
    // Actually, prompt says: "If user purchases successfully -> ... navigate to PanicModeScreen" (specifically for Panic tap).
    // Let's handle it by checking what triggered it? Or just navigate to Panic Mode anyway as a "Thank you"?
    // Let's keep it simple: Unlock. If they want Panic, they tap it again. 
    // Wait, prompt is specific: "navigate to PanicModeScreen and auto-start".
    // I'll add a simple state to track intent.
  };

  const [upsellIntent, setUpsellIntent] = useState<'shield' | 'panic' | null>(null);

  const onPanicPress = () => {
      if (isPro) {
          startPanic();
          router.push('/panic-mode');
      } else {
          setUpsellIntent('panic');
          setShowUpsell(true);
      }
  };

  const onShieldPress = () => {
      if (isPro) {
          setIsShieldActive(!isShieldActive);
      } else {
          setUpsellIntent('shield');
          setShowUpsell(true);
      }
  };

  const onPurchaseComplete = () => {
      setPro(true);
      setShowUpsell(false);
      
      if (upsellIntent === 'panic') {
          startPanic();
          router.push('/panic-mode');
      } else if (upsellIntent === 'shield') {
          setIsShieldActive(true);
      }
      setUpsellIntent(null);
  };


  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <View>
          <Typography variant="caption" color={Colors.dark.textSecondary}>Good Evening,</Typography>
          <Typography variant="h2">NightShield</Typography>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainAction}>
        <TouchableOpacity 
          style={[styles.shieldButton, isShieldActive && styles.shieldActive]} 
          onPress={onShieldPress}
          activeOpacity={0.8}
        >
          <Shield 
            size={80} 
            color={isShieldActive ? Colors.dark.primaryForeground : Colors.dark.textSecondary} 
            fill={isShieldActive ? Colors.dark.primaryForeground : "transparent"}
          />
          <Typography 
            variant="h3" 
            style={{ marginTop: Spacing.md }}
            color={isShieldActive || lockTimer ? Colors.dark.primaryForeground : Colors.dark.textSecondary}
          >
            {lockTimer ? `LOCKED ${lockTimer}` : (isShieldActive ? "PROTECTED" : "UNPROTECTED")}
          </Typography>
          <Typography 
            variant="caption" 
            color={isShieldActive || lockTimer ? 'rgba(19, 21, 26, 0.7)' : Colors.dark.textSecondary}
          >
            {lockTimer ? "App blocking active" : (isShieldActive ? "Doomscrolling Blocked" : "Tap to activate shield")}
          </Typography>
          
          {/* Lock icon for free users */}
          {!isPro && (
              <View style={styles.lockBadge}>
                  <Lock size={16} color={Colors.dark.text} />
              </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
          <Button 
            title="Start Panic Mode"
            onPress={onPanicPress}
            variant="outline"
            icon={isPro ? <Zap size={20} color={Colors.dark.destructive} /> : <Lock size={20} color={Colors.dark.destructive} />}
            style={{ borderColor: Colors.dark.destructive }}
            textStyle={{ color: Colors.dark.destructive }}
          />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Moon size={24} color={Colors.dark.primary} />
          <Typography variant="h2" style={{ marginTop: Spacing.sm }}>7h 12m</Typography>
          <Typography variant="caption" color={Colors.dark.textSecondary}>Sleep Goal</Typography>
        </View>
        <View style={styles.statCard}>
          <Zap size={24} color={Colors.dark.accent} />
          <Typography variant="h2" style={{ marginTop: Spacing.sm }}>12</Typography>
          <Typography variant="caption" color={Colors.dark.textSecondary}>Streaks</Typography>
        </View>
      </View>

      {/* Upsell Banner (Free Mode) - Show only if not Pro and Shield inactive */}
      {!isPro && (
          <View style={styles.upsell}>
              <Typography variant="body" style={{ flex: 1, fontWeight: 'bold' }}>
                  Unlock Shield + Panic Mode
              </Typography>
              <Button title="Upgrade" onPress={() => setShowUpsell(true)} size="sm" style={{ paddingVertical: 8 }} />
          </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showUpsell}
        onRequestClose={() => setShowUpsell(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <TouchableOpacity 
                    style={styles.closeModal} 
                    onPress={() => setShowUpsell(false)}
                >
                    <X size={24} color={Colors.dark.textSecondary} />
                </TouchableOpacity>

                <Typography variant="h2" style={{ marginBottom: Spacing.md, textAlign: 'center' }}>
                    Unlock Panic Mode
                </Typography>

                <View style={styles.benefitsList}>
                    {[
                        "180s guided reset",
                        "Reduce urges fast",
                        "Back to sleep"
                    ].map((benefit, i) => (
                        <View key={i} style={styles.benefitItem}>
                            <Check size={20} color={Colors.dark.primary} />
                            <Typography variant="body">{benefit}</Typography>
                        </View>
                    ))}
                </View>

                <Button 
                    title="Start free trial" 
                    onPress={onPurchaseComplete}
                    style={{ width: '100%', marginTop: Spacing.xl }}
                />
                
                <TouchableOpacity 
                    style={{ marginTop: Spacing.md, padding: Spacing.sm }}
                    onPress={() => setShowUpsell(false)}
                >
                    <Typography variant="caption" color={Colors.dark.textSecondary}>Not now</Typography>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>


    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.full,
  },
  mainAction: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  shieldButton: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.dark.surfaceHighlight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  lockBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: Colors.dark.surfaceHighlight,
    padding: 8,
    borderRadius: Radius.full,
  },
  shieldActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary, 
    shadowColor: Colors.dark.primary,
  },
  actionRow: {
      paddingHorizontal: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  upsell: {
      backgroundColor: Colors.dark.surfaceHighlight,
      padding: Spacing.md,
      borderRadius: Radius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      marginTop: Spacing.lg,
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.lg,
  },
  modalContent: {
      backgroundColor: Colors.dark.surface,
      borderRadius: Radius.xl,
      padding: Spacing.xl,
      width: '100%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.dark.surfaceHighlight,
  },
  closeModal: {
      position: 'absolute',
      top: Spacing.md,
      right: Spacing.md,
      padding: Spacing.xs,
  },
  benefitsList: {
      width: '100%',
      gap: Spacing.md,
      marginTop: Spacing.md,
  },
  benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
  }
});
