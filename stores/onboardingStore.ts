import { create } from 'zustand';

interface OnboardingState {
  answers: Record<string, string | string[]>;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  answers: {},
  setAnswer: (questionId, answer) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
  reset: () => set({ answers: {} }),
}));
