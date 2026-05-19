import AsyncStorage from '@react-native-async-storage/async-storage';

import type { BookmarkMap } from '@/types/bookmark';
import type { UserPreferences } from '@/types/preferences';

import { APP_STORAGE_KEYS } from './keys';

async function setItem<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function getItem<T>(key: string): Promise<T | null> {
  const rawValue = await AsyncStorage.getItem(key);

  if (!rawValue) {
    return null;
  }

  return JSON.parse(rawValue) as T;
}

async function removeItem(key: string) {
  await AsyncStorage.removeItem(key);
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  notificationsEnabled: true,
  reminderNotificationsEnabled: true,
  preferredTheme: 'system',
};

export const appStorage = {
  saveBookmarks: (bookmarks: BookmarkMap) =>
    setItem(APP_STORAGE_KEYS.bookmarks, bookmarks),
  getBookmarks: () => getItem<BookmarkMap>(APP_STORAGE_KEYS.bookmarks),
  clearBookmarks: () => removeItem(APP_STORAGE_KEYS.bookmarks),

  savePreferences: (preferences: UserPreferences) =>
    setItem(APP_STORAGE_KEYS.preferences, preferences),
  getPreferences: async () =>
    (await getItem<UserPreferences>(APP_STORAGE_KEYS.preferences)) ??
    DEFAULT_PREFERENCES,
  clearPreferences: () => removeItem(APP_STORAGE_KEYS.preferences),

  saveEnrolledCourseIds: (courseIds: string[]) =>
    setItem(APP_STORAGE_KEYS.enrolledCourses, courseIds),
  getEnrolledCourseIds: async () =>
    (await getItem<string[]>(APP_STORAGE_KEYS.enrolledCourses)) ?? [],
  clearEnrolledCourseIds: () => removeItem(APP_STORAGE_KEYS.enrolledCourses),
};
