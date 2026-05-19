import type { AuthSession } from '@/types/auth';

export type AuthStatus = 'anonymous' | 'authenticated' | 'bootstrapping';

export type AuthState = {
  status: AuthStatus;
  session: AuthSession | null;
};
