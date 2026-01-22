import { create } from 'zustand';

export type PanicStep = 'trigger' | 'breathing' | 'urge' | 'action';

interface PanicState {
  status: 'idle' | 'running' | 'paused' | 'complete';
  stepIndex: number;
  stepRemainingSec: number;
  selectedTrigger?: string;
  urgeStart?: number;
  urgeEnd?: number;
  selectedExitAction?: string;
  startedAt?: number;
  completedAt?: number;
}

interface AppState {
  isPro: boolean;
  panic: PanicState;
  lockUntil: number | null;
  
  setPro: (isPro: boolean) => void;
  setLockUntil: (timestamp: number | null) => void;
  
  // Panic actions
  startPanic: () => void;
  pausePanic: () => void;
  resumePanic: () => void;
  stopPanic: () => void; // Abort/Exit
  completePanic: () => void;
  setPanicStep: (index: number) => void;
  setPanicStepRemaining: (sec: number) => void;
  setPanicTrigger: (trigger: string) => void;
  setUrgeRating: (rating: number, type: 'start' | 'end') => void;
  setExitAction: (action: string) => void;
  resetPanic: () => void;
}

const INITIAL_PANIC_STATE: PanicState = {
  status: 'idle',
  stepIndex: 0,
  stepRemainingSec: 0,
  selectedTrigger: undefined,
  urgeStart: undefined,
  urgeEnd: undefined,
  selectedExitAction: undefined,
  startedAt: undefined,
  completedAt: undefined,
};

export const useAppStore = create<AppState>((set) => ({
  isPro: false, // Default to false as requested for MVP gating testing, or maybe I should expose a way to toggle
  panic: { ...INITIAL_PANIC_STATE },
  lockUntil: null,

  setPro: (isPro) => set({ isPro }),
  setLockUntil: (lockUntil) => set({ lockUntil }),

  startPanic: () => set({ 
    panic: { 
      ...INITIAL_PANIC_STATE, 
      status: 'running', 
      startedAt: Date.now(),
      // Initial step setup will be handled by the component or we can init here.
      // But component logic handles duration per step usually. 
      // Let's just set status to running.
    } 
  }),
  pausePanic: () => set((state) => ({ panic: { ...state.panic, status: 'paused' } })),
  resumePanic: () => set((state) => ({ panic: { ...state.panic, status: 'running' } })),
  stopPanic: () => set({ panic: { ...INITIAL_PANIC_STATE } }), // Reset to idle
  completePanic: () => set((state) => ({ 
    panic: { ...state.panic, status: 'complete', completedAt: Date.now() } 
  })),
  
  setPanicStep: (index) => set((state) => ({ panic: { ...state.panic, stepIndex: index } })),
  setPanicStepRemaining: (sec) => set((state) => ({ panic: { ...state.panic, stepRemainingSec: sec } })),
  setPanicTrigger: (trigger) => set((state) => ({ panic: { ...state.panic, selectedTrigger: trigger } })),
  setUrgeRating: (rating, type) => set((state) => ({ 
    panic: { 
      ...state.panic, 
      [type === 'start' ? 'urgeStart' : 'urgeEnd']: rating 
    } 
  })),
  setExitAction: (action) => set((state) => ({ panic: { ...state.panic, selectedExitAction: action } })),
  resetPanic: () => set({ panic: { ...INITIAL_PANIC_STATE } }),
}));
