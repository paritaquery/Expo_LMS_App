import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import * as Network from 'expo-network';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { refreshAuthTokens } from '@/features/auth/api';
import { apiClient } from '@/services/api';
import { appStorage, secureStorage } from '@/services/storage';
import { useAppStore, useAuthStore } from '@/store';

import { AuthBootstrap } from './auth-bootstrap';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30 * 1000,
            refetchOnReconnect: true,
          },
        },
      })
  );
  const session = useAuthStore((state) => state.session);
  const updateTokens = useAuthStore((state) => state.updateTokens);
  const clearSession = useAuthStore((state) => state.clearSession);
  const bookmarks = useAppStore((state) => state.bookmarks);
  const enrolledCourseIds = useAppStore((state) => state.enrolledCourseIds);
  const setBookmarks = useAppStore((state) => state.setBookmarks);
  const setEnrolledCourseIds = useAppStore((state) => state.setEnrolledCourseIds);
  const setOnlineStatus = useAppStore((state) => state.setOnlineStatus);
  const isExpoGo = Constants.appOwnership === 'expo';
  const bookmarkNotificationSentRef = useRef(false);
  const reminderNotificationIdRef = useRef<string | null>(null);

  useEffect(() => {
    async function requestNotificationPermission() {
      if (isExpoGo) {
        return;
      }

      const Notifications = await import('expo-notifications');

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });

      const current = await Notifications.getPermissionsAsync();
      if (current.granted) {
        return;
      }

      await Notifications.requestPermissionsAsync();
    }

    void requestNotificationPermission();
  }, [isExpoGo]);

  useEffect(() => {
    let mounted = true;

    async function syncInitialNetworkState() {
      const state = await Network.getNetworkStateAsync();
      if (!mounted) {
        return;
      }

      setOnlineStatus(Boolean(state.isConnected && state.isInternetReachable !== false));
    }

    void syncInitialNetworkState();

    const subscription = Network.addNetworkStateListener((state) => {
      setOnlineStatus(Boolean(state.isConnected && state.isInternetReachable !== false));
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [setOnlineStatus]);

  useEffect(() => {
    let mounted = true;

    async function bootstrapBookmarks() {
      const restored = (await appStorage.getBookmarks()) ?? {};
      if (mounted) {
        setBookmarks(restored);
      }
    }

    void bootstrapBookmarks();

    return () => {
      mounted = false;
    };
  }, [setBookmarks]);

  useEffect(() => {
    void appStorage.saveBookmarks(bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    if (isExpoGo) {
      return;
    }

    const bookmarkCount = Object.keys(bookmarks).length;

    if (bookmarkCount < 5) {
      bookmarkNotificationSentRef.current = false;
      return;
    }

    if (bookmarkNotificationSentRef.current) {
      return;
    }

    async function notifyBookmarkMilestone() {
      const Notifications = await import('expo-notifications');

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Great progress!',
          body: `You have bookmarked ${bookmarkCount} courses. Keep learning!`,
        },
        trigger: null,
      });

      bookmarkNotificationSentRef.current = true;
    }

    void notifyBookmarkMilestone();
  }, [bookmarks, isExpoGo]);

  useEffect(() => {
    let mounted = true;

    async function bootstrapEnrolledCourseIds() {
      const restored = await appStorage.getEnrolledCourseIds();
      if (mounted) {
        setEnrolledCourseIds(restored);
      }
    }

    void bootstrapEnrolledCourseIds();

    return () => {
      mounted = false;
    };
  }, [setEnrolledCourseIds]);

  useEffect(() => {
    void appStorage.saveEnrolledCourseIds(enrolledCourseIds);
  }, [enrolledCourseIds]);

  useEffect(() => {
    if (isExpoGo) {
      return;
    }

    async function rescheduleReminderNotification() {
      const Notifications = await import('expo-notifications');

      if (reminderNotificationIdRef.current) {
        await Notifications.cancelScheduledNotificationAsync(
          reminderNotificationIdRef.current
        );
      }

      const reminderId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Ready for a learning session?',
          body: 'It has been a while. Open Mini LMS and continue your progress.',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 24 * 60 * 60,
          repeats: false,
        },
      });

      reminderNotificationIdRef.current = reminderId;
    }

    void rescheduleReminderNotification();
  }, [bookmarks, enrolledCourseIds, isExpoGo, session?.userId]);

  useEffect(() => {
    apiClient.setRefreshTokenHandler(async (expiredAccessToken) => {
      if (!session?.tokens.refreshToken) {
        return null;
      }

      if (session.tokens.accessToken !== expiredAccessToken) {
        return session.tokens.accessToken;
      }

      try {
        const nextTokens = await refreshAuthTokens({
          refreshToken: session.tokens.refreshToken,
        });

        updateTokens(nextTokens);
        await secureStorage.saveAuthSession({
          ...session,
          tokens: nextTokens,
        });

        return nextTokens.accessToken;
      } catch (error) {
        console.log('[auth][refresh] failed', error);
        await secureStorage.clearAuthSession();
        clearSession();
        return null;
      }
    });

    return () => {
      apiClient.setRefreshTokenHandler(null);
    };
  }, [clearSession, session, updateTokens]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>{children}</AuthBootstrap>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
