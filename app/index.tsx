import { Redirect } from 'expo-router';

export default function Index() {
  // For MVP, always start with onboarding
  // In real app, check auth/onboarding state
  return <Redirect href="/onboarding" />;
}
