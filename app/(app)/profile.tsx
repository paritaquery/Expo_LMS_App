import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { InfoBanner } from '@/components/feedback';
import { AppScreen } from '@/components/layout/app-screen';
import { useCourseCatalog } from '@/features/courses/hooks';
import { secureStorage } from '@/services/storage';
import { useAppStore, useAuthStore } from '@/store';

export default function ProfileScreen() {
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);
  const bookmarks = useAppStore((state) => state.bookmarks);
  const enrolledCourseIds = useAppStore((state) => state.enrolledCourseIds);
  const courseCatalogQuery = useCourseCatalog();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('Log out', 'This will clear your saved session on this device.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          setIsLoggingOut(true);

          try {
            await secureStorage.clearAuthSession();
            await queryClient.clear();
            clearSession();
          } catch (error) {
            console.log('[auth][logout] error', error);
            Alert.alert(
              'Logout failed',
              'We could not clear your saved session. Please try again.'
            );
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <AppScreen
      eyebrow="Account"
      title="Profile"
      description={session ? `Signed in as ${session.email}` : 'Learner account'}
    >
      <InfoBanner
        title="Learner Stats"
        description={`Enrolled: ${enrolledCourseIds.length}  |  Bookmarked: ${Object.keys(bookmarks).length}  |  Catalog: ${courseCatalogQuery.data?.length ?? 0}`}
        tone="info"
      />
      <Text style={styles.sectionTitle}>Progress Snapshot</Text>
      <Text style={styles.sectionBody}>
        {enrolledCourseIds.length > 0
          ? 'Great momentum. Keep going through enrolled courses and track consistency.'
          : 'You have not enrolled yet. Open any course details and tap Enroll Now to start tracking progress.'}
      </Text>
      <Pressable
        accessibilityRole="button"
        disabled={isLoggingOut}
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed ? styles.logoutButtonPressed : null,
          isLoggingOut ? styles.logoutButtonDisabled : null,
        ]}
      >
        <Text style={styles.logoutButtonText}>
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </Text>
      </Pressable>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionBody: {
    marginTop: -4,
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  logoutButton: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  logoutButtonPressed: {
    opacity: 0.92,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
