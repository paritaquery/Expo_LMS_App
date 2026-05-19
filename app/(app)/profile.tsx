import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

import { InfoBanner } from '@/components/feedback';
import { AppScreen } from '@/components/layout/app-screen';
import { useCourseCatalog } from '@/features/courses/hooks';
import { appStorage, secureStorage } from '@/services/storage';
import { useAppStore, useAuthStore } from '@/store';
import type { UserPreferences } from '@/types/preferences';

export default function ProfileScreen() {
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);
  const bookmarks = useAppStore((state) => state.bookmarks);
  const enrolledCourseIds = useAppStore((state) => state.enrolledCourseIds);
  const courseCatalogQuery = useCourseCatalog();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    void (async () => {
      const restoredPreferences = await appStorage.getPreferences();
      setPreferences(restoredPreferences);
      setProfileImageUri(restoredPreferences.profileImageUri ?? null);
    })();
  }, []);

  const updatePreferences = async (next: UserPreferences) => {
    setPreferences(next);
    await appStorage.savePreferences(next);
  };

  const handleProfileImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]?.uri) {
      return;
    }

    const nextUri = result.assets[0].uri;
    setProfileImageUri(nextUri);

    const current = preferences ?? (await appStorage.getPreferences());
    await updatePreferences({
      ...current,
      profileImageUri: nextUri,
    });
  };

  const handleProfileImageRemove = async () => {
    setProfileImageUri(null);
    const current = preferences ?? (await appStorage.getPreferences());
    await updatePreferences({
      ...current,
      profileImageUri: undefined,
    });
  };

  const handleToggleNotifications = async () => {
    const current = preferences ?? (await appStorage.getPreferences());
    await updatePreferences({
      ...current,
      notificationsEnabled: !current.notificationsEnabled,
    });
  };

  const handleToggleReminders = async () => {
    const current = preferences ?? (await appStorage.getPreferences());
    await updatePreferences({
      ...current,
      reminderNotificationsEnabled: !current.reminderNotificationsEnabled,
    });
  };

  const handleThemeChange = async (theme: UserPreferences['preferredTheme']) => {
    const current = preferences ?? (await appStorage.getPreferences());
    await updatePreferences({
      ...current,
      preferredTheme: theme,
    });
  };

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
      <Pressable onPress={handleProfileImagePick} style={styles.avatarWrap}>
        {profileImageUri ? (
          <Image contentFit="cover" source={{ uri: profileImageUri }} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarPlaceholder}>Add Photo</Text>
        )}
      </Pressable>
      {profileImageUri ? (
        <Pressable onPress={handleProfileImageRemove} style={styles.removePhotoButton}>
          <Text style={styles.removePhotoText}>Remove photo</Text>
        </Pressable>
      ) : null}
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
      <Text style={styles.sectionTitle}>Preferences</Text>
      <Pressable onPress={handleToggleNotifications} style={styles.prefButton}>
        <Text style={styles.prefLabel}>Notifications</Text>
        <Text style={styles.prefValue}>
          {preferences?.notificationsEnabled ? 'On' : 'Off'}
        </Text>
      </Pressable>
      <Pressable onPress={handleToggleReminders} style={styles.prefButton}>
        <Text style={styles.prefLabel}>24h Reminder</Text>
        <Text style={styles.prefValue}>
          {preferences?.reminderNotificationsEnabled ? 'On' : 'Off'}
        </Text>
      </Pressable>
      <Text style={styles.themeTitle}>Theme Preference</Text>
      <Pressable
        onPress={() => handleThemeChange('light')}
        style={[
          styles.themeButton,
          preferences?.preferredTheme === 'light' ? styles.themeButtonActive : null,
        ]}
      >
        <Text style={styles.themeButtonText}>Light</Text>
      </Pressable>
      <Pressable
        onPress={() => handleThemeChange('dark')}
        style={[
          styles.themeButton,
          preferences?.preferredTheme === 'dark' ? styles.themeButtonActive : null,
        ]}
      >
        <Text style={styles.themeButtonText}>Dark</Text>
      </Pressable>
      <Pressable
        onPress={() => handleThemeChange('system')}
        style={[
          styles.themeButton,
          preferences?.preferredTheme === 'system' ? styles.themeButtonActive : null,
        ]}
      >
        <Text style={styles.themeButtonText}>System</Text>
      </Pressable>
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
  avatarWrap: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  removePhotoButton: {
    alignSelf: 'center',
    marginTop: -4,
  },
  removePhotoText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
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
  prefButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prefLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  prefValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  themeTitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  themeButton: {
    minHeight: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dbe1ea',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  themeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
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
