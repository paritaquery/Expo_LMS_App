import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

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
    <ScrollView contentContainerStyle={styles.container} style={styles.scroll}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Pressable onPress={handleProfileImagePick} style={styles.avatarWrap}>
            {profileImageUri ? (
              <Image contentFit="cover" source={{ uri: profileImageUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons color="#94a3b8" name="person" size={40} />
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons color="#ffffff" name="camera" size={14} />
            </View>
          </Pressable>
          <Text style={styles.userName}>{session ? session.email : 'Learner'}</Text>
          <Text style={styles.userRole}>Premium Member</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{enrolledCourseIds.length}</Text>
          <Text style={styles.statLabel}>Enrolled</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{Object.keys(bookmarks).length}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{courseCatalogQuery.data?.length ?? 0}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <View style={styles.prefGroup}>
          <View style={styles.prefRow}>
            <View style={styles.prefIconWrap}>
              <Ionicons color="#2563eb" name="notifications" size={18} />
            </View>
            <Text style={styles.prefLabel}>Push Notifications</Text>
            <Switch
              onValueChange={handleToggleNotifications}
              thumbColor={preferences?.notificationsEnabled ? '#ffffff' : '#f4f3f4'}
              trackColor={{ false: '#cbd5e1', true: '#2563eb' }}
              value={Boolean(preferences?.notificationsEnabled)}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.prefRow}>
            <View style={styles.prefIconWrap}>
              <Ionicons color="#2563eb" name="alarm" size={18} />
            </View>
            <Text style={styles.prefLabel}>24h Reminder</Text>
            <Switch
              onValueChange={handleToggleReminders}
              thumbColor={preferences?.reminderNotificationsEnabled ? '#ffffff' : '#f4f3f4'}
              trackColor={{ false: '#cbd5e1', true: '#2563eb' }}
              value={Boolean(preferences?.reminderNotificationsEnabled)}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.themeGroup}>
          {(['light', 'dark', 'system'] as const).map((theme) => (
            <Pressable
              key={theme}
              onPress={() => handleThemeChange(theme)}
              style={[
                styles.themeButton,
                preferences?.preferredTheme === theme && styles.themeButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  preferences?.preferredTheme === theme && styles.themeButtonTextActive,
                ]}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={isLoggingOut}
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed,
          isLoggingOut && styles.logoutButtonDisabled,
        ]}
      >
        <Ionicons color="#ef4444" name="log-out-outline" size={20} style={styles.logoutIcon} />
        <Text style={styles.logoutButtonText}>
          {isLoggingOut ? 'Logging out...' : 'Sign Out'}
        </Text>
      </Pressable>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
    gap: 28,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 50,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563eb',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#f8fafc',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  prefGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  prefIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  prefLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  prefValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 60,
  },
  themeGroup: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  themeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  themeButtonActive: {
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  themeButtonTextActive: {
    color: '#ffffff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutButtonDisabled: {
    opacity: 0.5,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ef4444',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#cbd5e1',
    marginTop: 16,
  },
});
