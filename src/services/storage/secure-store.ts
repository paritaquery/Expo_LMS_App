import * as SecureStore from 'expo-secure-store';

import type { AuthSession } from '@/types/auth';

import { SECURE_STORAGE_KEYS } from './keys';

async function setItem<T>(key: string, value: T) {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

async function getItem<T>(key: string): Promise<T | null> {
  const rawValue = await SecureStore.getItemAsync(key);

  if (!rawValue) {
    return null;
  }

  return JSON.parse(rawValue) as T;
}

async function removeItem(key: string) {
  await SecureStore.deleteItemAsync(key);
}

export const secureStorage = {
  saveAuthSession: (session: AuthSession) =>
    setItem(SECURE_STORAGE_KEYS.authSession, session),
  getAuthSession: () => getItem<AuthSession>(SECURE_STORAGE_KEYS.authSession),
  clearAuthSession: () => removeItem(SECURE_STORAGE_KEYS.authSession),
};
