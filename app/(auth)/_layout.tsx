import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store';

export default function AuthLayout() {
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);

  if (status === 'bootstrapping') {
    return null;
  }

  if (status === 'authenticated' && session) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
