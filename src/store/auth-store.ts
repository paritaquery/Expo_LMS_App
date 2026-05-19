import { create } from 'zustand';

import type { AuthSession } from '@/types/auth';

export type AuthStatus = 'anonymous' | 'authenticated' | 'bootstrapping';

type AuthStoreState = {
  status: AuthStatus;
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  updateTokens: (tokens: AuthSession['tokens']) => void;
  clearSession: () => void;
  setStatus: (status: AuthStatus) => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  status: 'anonymous',
  session: null,
  setSession: (session) =>
    set({
      status: 'authenticated',
      session,
    }),
  updateTokens: (tokens) =>
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          tokens,
        },
      };
    }),
  clearSession: () =>
    set({
      status: 'anonymous',
      session: null,
    }),
  setStatus: (status) => set({ status }),
}));
