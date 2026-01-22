import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Typography } from '@/components/Typography';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppStore } from '@/stores/appStore';
import { useRouter } from 'expo-router';
import { 
  X, 
  Pause, 
  Play, 
  Wind, 
  Waves, 
  CheckCircle, 
  LogOut, 
  ChevronRight,
  Lock
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Animated, 
  Easing,
  BackHandler,
  AppState
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Constants
const STEPS = [
  { id: 'trigger', duration: 20, title: 'Name it' },
  { id: 'breathing', duration: 60, title: 'Downshift' },
  { id: 'urge', duration: 60, title: 'Urge surfing' },
  { id: 'action', duration: 40, title: 'Exit action' },
];

const TRIGGERS = ['Boredom', 'Stress', 'Loneliness', 'Fatigue', 'Habit'];
const EXIT_ACTIONS = [
  { id: 'phone', label: 'Put phone away (2m)' },
  { id: 'water', label: 'Stand up + water' },
  { id: 'light', label: 'Turn on a light (10s)' },
];

export default function PanicModeScreen() {
  const router = useRouter();
  const { 
    panic, 
    setPanicStep, 
    setPanicStepRemaining, 
    setPanicTrigger, 
    setUrgeRating, 
    setExitAction,
    pausePanic, 
    resumePanic, 
    stopPanic, 
    completePanic,
    setLockUntil
  } = useAppStore();

  const [timerDisplay, setTimerDisplay] = useState("00:00");
  
  // Local state for animations and interactions
  const breathingAnim = useRef(new Animated.Value(0)).current;
  const [localUrgeRating, setLocalUrgeRating] = useState(5);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      handleExit();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [panic.status]);

  // Handle AppState (Background/Foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState.match(/inactive|background/) && panic.status === 'running') {
        pausePanic();
        console.log('App went background, pausing panic');
      }
    });

    return () => {
      subscription.remove();
    };
  }, [panic.status]);

  // Timer Logic
  useEffect(() => {
    if (panic.status === 'running') {
      timerRef.current = setInterval(() => {
        // Step 4: Don't tick if action not selected yet
        if (panic.stepIndex === 3 && !panic.selectedExitAction) {
             return;
        }

        if (panic.stepRemainingSec > 0) {
          setPanicStepRemaining(panic.stepRemainingSec - 1);
        } else {
          handleStepComplete();
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [panic.status, panic.stepRemainingSec, panic.stepIndex]);

  // Format timer
  useEffect(() => {
    const mins = Math.floor(panic.stepRemainingSec / 60);
    const secs = panic.stepRemainingSec % 60;
    setTimerDisplay(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
  }, [panic.stepRemainingSec]);

  // Initial Setup
  useEffect(() => {
    if (panic.status === 'idle') {
      // Should actially be started by store, but if we land here without start, redirect or start
      // Assuming store.startPanic() was called before nav.
      // If we need to init specific step duration:
      if (panic.stepIndex === 0 && panic.stepRemainingSec === 0) {
        setPanicStepRemaining(STEPS[0].duration);
      }
    }
  }, []);

  // Breathing Animation for Step 2
  useEffect(() => {
    if (panic.stepIndex === 1 && panic.status === 'running') {
      // 4s in, 4s hold, 6s out = 14s cycle
      const cycle = Animated.sequence([
        Animated.timing(breathingAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(4000),
        Animated.timing(breathingAnim, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]);
      
      const loop = Animated.loop(cycle);
      loop.start();

      return () => {
        loop.stop();
        breathingAnim.setValue(0);
      };
    }
  }, [panic.stepIndex, panic.status]);

  const handleStepComplete = () => {
    // Check requirements for auto-advance
    if (panic.stepIndex === 0 && !panic.selectedTrigger) {
      // Wait for trigger selection. Timer stays at 0.
      return; 
    }
    
    if (panic.stepIndex === 3 && !panic.selectedExitAction) {
       // Wait for action selection
       return;
    }

    if (panic.stepIndex < STEPS.length - 1) {
      const nextIndex = panic.stepIndex + 1;
      setPanicStep(nextIndex);
      setPanicStepRemaining(STEPS[nextIndex].duration);
      
      // Log step completion
      console.log(`panic_step_complete: ${panic.stepIndex}`);
      
      // Special logic for step 3 (Urge rating)
      if (nextIndex === 2) {
         setUrgeRating(localUrgeRating, 'start');
      }

      // Special logic for step 4 (Exit action) - pause timer initially?
      // The timer logic handles the "wait for action" check, but we need to ensure duration is set correctly if we want 40s AFTER selection.
      // We can set it to a dummy value or just 40, but prevent ticking.
      
      setPanicStep(nextIndex);
      setPanicStepRemaining(STEPS[nextIndex].duration);
      
      // Log step completion
      console.log(`panic_step_complete: ${panic.stepIndex}`);
      
      // Special logic for step 3 (Urge rating) - logging end of previous step (which was 2?) 
      // No, panic.stepIndex is currently the OLD index.
      if (panic.stepIndex === 2) {
        setUrgeRating(localUrgeRating, 'end');
      }

    } else {
      completePanic();
      console.log('panic_complete');
    }
  };

  const handleExit = () => {
    if (panic.status === 'complete') {
      stopPanic();
      router.back();
      return;
    }

    pausePanic();
    Alert.alert(
      "Exit Panic Mode?",
      "You're in the middle of a reset.",
      [
        {
          text: "Continue",
          onPress: () => resumePanic(),
          style: "cancel"
        },
        { 
          text: "Exit", 
          onPress: () => {
            console.log('panic_abandoned');
            stopPanic();
            router.back();
          },
          style: "destructive"
        }
      ]
    );
  };

  const skipStep = () => {
    console.log('panic_step_skipped');
    handleStepComplete();
  };

  const handleTriggerSelect = (trigger: string) => {
    setPanicTrigger(trigger);
    console.log(`panic_step1_trigger_selected: ${trigger}`);
    // If timer is 0, auto advance now
    if (panic.stepRemainingSec === 0) {
        // small delay for UX
        setTimeout(() => handleStepComplete(), 500);
    }
  };
  
  const handleActionSelect = (actionId: string) => {
      setExitAction(actionId);
      console.log(`panic_exit_action_selected: ${actionId}`);
      // Set timer to 40s now that action is selected
      setPanicStepRemaining(40);
  };

  const handleLock10Min = () => {
      const lockTime = Date.now() + 10 * 60 * 1000;
      setLockUntil(lockTime);
      console.log('panic_lock10m_enable');
      Alert.alert("Locked", "Apps locked for 10 minutes (Simulated)");
  };

  // Render Content based on step
  const renderContent = () => {
    if (panic.status === 'complete') {
      return (
        <View style={styles.stepContainer}>
          <CheckCircle size={64} color={Colors.dark.primary} />
          <Typography variant="h2" style={styles.centerText}>Nice. You interrupted autopilot.</Typography>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Typography variant="body" color={Colors.dark.textSecondary}>Trigger:</Typography>
              <Typography variant="h3">{panic.selectedTrigger || "Unknown"}</Typography>
            </View>
            <View style={styles.separator} />
            <View style={styles.summaryRow}>
               <Typography variant="body" color={Colors.dark.textSecondary}>Time saved:</Typography>
               <Typography variant="h3">3 min</Typography>
            </View>
          </View>

          <View style={styles.actionsContainer}>
             <Button 
                title="Lock apps for 10 minutes" 
                onPress={handleLock10Min}
                variant="outline"
                icon={<Lock size={20} color={Colors.dark.text} />}
             />
             <Button 
                title="Go to Sleep" 
                onPress={() => {
                    stopPanic();
                    router.back();
                }}
             />
          </View>
        </View>
      );
    }

    switch (panic.stepIndex) {
      case 0: // Name it
        return (
          <View style={styles.stepContainer}>
             <Typography variant="h2" style={styles.centerText}>Name it</Typography>
             <Typography variant="body" style={styles.centerText} color={Colors.dark.textSecondary}>
                Pick what you’re feeling right now.
             </Typography>
             
             <View style={styles.chipsContainer}>
                {TRIGGERS.map((t) => (
                    <TouchableOpacity 
                        key={t}
                        style={[
                            styles.chip,
                            panic.selectedTrigger === t && styles.chipSelected
                        ]}
                        onPress={() => handleTriggerSelect(t)}
                    >
                        <Typography 
                            variant="body"
                            color={panic.selectedTrigger === t ? Colors.dark.background : Colors.dark.text}
                        >
                            {t}
                        </Typography>
                    </TouchableOpacity>
                ))}
             </View>
          </View>
        );
      case 1: // Downshift
        const scale = breathingAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.5]
        });
        return (
          <View style={styles.stepContainer}>
            <Typography variant="h2" style={styles.centerText}>Downshift</Typography>
            <Typography variant="body" style={styles.centerText} color={Colors.dark.textSecondary}>
               Breathe in 4 • hold 4 • out 6
            </Typography>

            <View style={styles.breathingContainer}>
                <Animated.View style={[styles.breathingCircle, { transform: [{ scale }] }]} />
                <Typography variant="caption" style={{ marginTop: Spacing.xl }}>Follow the rhythm</Typography>
            </View>
          </View>
        );
      case 2: // Urge Surfing
        return (
          <View style={styles.stepContainer}>
             <Typography variant="h2" style={styles.centerText}>Urge surfing</Typography>
             <Typography variant="body" style={styles.centerText} color={Colors.dark.textSecondary}>
               Notice the urge like a wave. Don’t fight it.
             </Typography>
             
             <View style={styles.waveContainer}>
                <Waves size={80} color={Colors.dark.accent} />
             </View>

             <Typography variant="body" style={{ marginTop: Spacing.xl }}>Rate urge intensity: {localUrgeRating}</Typography>
             {/* Simple slider simulation since we don't have a slider component yet */}
             <View style={styles.ratingRow}>
                {[1, 3, 5, 7, 9].map(r => (
                    <TouchableOpacity 
                        key={r} 
                        style={[styles.ratingBtn, localUrgeRating === r && styles.ratingBtnSelected]}
                        onPress={() => setLocalUrgeRating(r)}
                    >
                        <Typography color={localUrgeRating === r ? Colors.dark.background : Colors.dark.text}>{r.toString()}</Typography>
                    </TouchableOpacity>
                ))}
             </View>
          </View>
        );
      case 3: // Exit Action
        return (
          <View style={styles.stepContainer}>
              <Typography variant="h2" style={styles.centerText}>Exit action</Typography>
              <Typography variant="body" style={styles.centerText} color={Colors.dark.textSecondary}>
                 Do one action now.
              </Typography>

              {!panic.selectedExitAction ? (
                  <View style={styles.optionsContainer}>
                    {EXIT_ACTIONS.map(a => (
                        <TouchableOpacity 
                            key={a.id}
                            style={styles.optionCard}
                            onPress={() => handleActionSelect(a.id)}
                        >
                            <Typography variant="h3">{a.label}</Typography>
                            <ChevronRight size={24} color={Colors.dark.textSecondary} />
                        </TouchableOpacity>
                    ))}
                  </View>
              ) : (
                  <View style={styles.doingActionContainer}>
                      <Typography variant="h1" color={Colors.dark.primary}>{timerDisplay}</Typography>
                      <Typography variant="h3" style={{ marginTop: Spacing.md }}>
                          {EXIT_ACTIONS.find(a => a.id === panic.selectedExitAction)?.label}
                      </Typography>
                      <Typography variant="body" color={Colors.dark.textSecondary} style={{ marginTop: Spacing.sm }}>
                          Do it now. Small win.
                      </Typography>
                  </View>
              )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
         <View>
            <Typography variant="h3">Panic Mode</Typography>
            <Typography variant="caption" color={Colors.dark.textSecondary}>180-second reset</Typography>
         </View>
         <TouchableOpacity onPress={handleExit} style={styles.closeBtn}>
            <X size={24} color={Colors.dark.text} />
         </TouchableOpacity>
      </View>

      {/* Progress */}
      {panic.status !== 'complete' && (
          <View style={styles.progressContainer}>
             {STEPS.map((step, idx) => (
                 <View 
                    key={step.id} 
                    style={[
                        styles.progressSegment,
                        idx <= panic.stepIndex ? styles.progressActive : styles.progressInactive
                    ]} 
                 />
             ))}
          </View>
      )}

      {/* Main Content */}
      <View style={styles.content}>
         {/* Timer (Except for step 4 pre-selection and completion) */}
         {panic.status !== 'complete' && !(panic.stepIndex === 3 && !panic.selectedExitAction) && (
             <View style={styles.timerContainer}>
                <Typography variant="display" style={{ fontSize: 64, lineHeight: 70 }}>
                    {timerDisplay}
                </Typography>
             </View>
         )}

         {renderContent()}
      </View>

      {/* Controls */}
      {panic.status !== 'complete' && (
        <View style={styles.controls}>
            {panic.status === 'paused' ? (
                <Button 
                    title="Resume" 
                    onPress={resumePanic}
                    icon={<Play size={20} color={Colors.dark.background} />}
                />
            ) : (
                <Button 
                    title="Pause" 
                    onPress={pausePanic}
                    variant="outline"
                    icon={<Pause size={20} color={Colors.dark.text} />}
                />
            )}
            
            <TouchableOpacity onPress={skipStep} style={styles.skipBtn}>
                <Typography variant="caption" color={Colors.dark.textSecondary}>Skip step</Typography>
            </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  closeBtn: {
    padding: Spacing.xs,
    backgroundColor: Colors.dark.surface,
    borderRadius: Radius.full,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: 4,
    marginTop: Spacing.sm,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: Radius.full,
  },
  progressActive: {
    backgroundColor: Colors.dark.primary,
  },
  progressInactive: {
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  timerContainer: {
    marginBottom: Spacing.xl,
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.surfaceHighlight,
  },
  chipSelected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  breathingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  breathingCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(214, 255, 96, 0.2)', // brand accent with opacity
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  waveContainer: {
     marginVertical: Spacing.xl,
  },
  ratingRow: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginTop: Spacing.lg,
  },
  ratingBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.dark.surface,
      justifyContent: 'center',
      alignItems: 'center',
  },
  ratingBtnSelected: {
      backgroundColor: Colors.dark.primary,
  },
  optionsContainer: {
      width: '100%',
      marginTop: Spacing.lg,
      gap: Spacing.md,
  },
  optionCard: {
      padding: Spacing.lg,
      backgroundColor: Colors.dark.surface,
      borderRadius: Radius.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  doingActionContainer: {
      alignItems: 'center',
      marginTop: Spacing.lg,
  },
  summaryCard: {
      backgroundColor: Colors.dark.surface,
      padding: Spacing.lg,
      borderRadius: Radius.lg,
      width: '100%',
      marginTop: Spacing.xl,
  },
  summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
  },
  separator: {
      height: 1,
      backgroundColor: Colors.dark.surfaceHighlight,
      marginVertical: Spacing.sm,
  },
  actionsContainer: {
      width: '100%',
      gap: Spacing.md,
      marginTop: Spacing.xl,
  },
  controls: {
    padding: Spacing.lg,
    gap: Spacing.sm,
    alignItems: 'center',
  },
  skipBtn: {
      padding: Spacing.sm,
  }
});
