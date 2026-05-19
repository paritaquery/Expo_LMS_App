import { PropsWithChildren, useEffect } from 'react';

import { secureStorage } from '@/services/storage';
import { useAuthStore } from '@/store';

export function AuthBootstrap({ children }: PropsWithChildren) {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setStatus = useAuthStore((state) => state.setStatus);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      setStatus('bootstrapping');

      try {
        const session = await secureStorage.getAuthSession();

        if (!isMounted) {
          return;
        }

        if (session?.tokens.accessToken) {
          console.log('[auth][bootstrap] restored session', {
            email: session.email,
            userId: session.userId,
          });
          setSession(session);
          return;
        }

        console.log('[auth][bootstrap] no stored session found');
        clearSession();
      } catch (error) {
        console.log('[auth][bootstrap] restore error', error);
        clearSession();
      }
    }

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [clearSession, setSession, setStatus]);

  return children;
}
