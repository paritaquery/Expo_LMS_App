import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store';

export default function IndexScreen() {
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);

  if (status === 'bootstrapping') {
    return null;
  }

  return <Redirect href={session ? '/(app)' : '/login'} />;
}
