import { useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { Redirect, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState, ScreenLoader } from '@/components/feedback';
import { CourseCatalogList } from '@/features/courses/components';
import { useCourseCatalog } from '@/features/courses/hooks';
import { useAppStore, useAuthStore } from '@/store';

export default function AppHomeScreen() {
  const session = useAuthStore((state) => state.session);
  const bookmarks = useAppStore((state) => state.bookmarks);
  const isOnline = useAppStore((state) => state.isOnline);
  const toggleBookmark = useAppStore((state) => state.toggleBookmark);
  const courseCatalogQuery = useCourseCatalog();
  const bookmarkedCourseIds = useMemo(() => new Set(Object.keys(bookmarks)), [bookmarks]);

  const handlePressCourse = useCallback((courseId: string) => {
    router.push(`/(app)/course/${courseId}`);
  }, []);

  const handleRefresh = useCallback(() => {
    if (!isOnline) {
      Alert.alert('Offline', 'Reconnect to refresh the course catalog.');
      return;
    }
    void courseCatalogQuery.refetch();
  }, [isOnline, courseCatalogQuery]);

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      {courseCatalogQuery.isPending ? (
        <ScreenLoader message="Loading course catalog..." />
      ) : null}
      {courseCatalogQuery.isError ? (
        <View style={styles.errorWrap}>
          <EmptyState
            title="Unable to load courses"
            description="We could not fetch the catalog right now. Pull to refresh support is coming next."
          />
        </View>
      ) : null}
      {courseCatalogQuery.data ? (
        <CourseCatalogList
          bookmarkedCourseIds={bookmarkedCourseIds}
          courses={courseCatalogQuery.data}
          isRefreshing={courseCatalogQuery.isRefetching}
          onPressCourse={handlePressCourse}
          onRefresh={handleRefresh}
          onToggleBookmark={toggleBookmark}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  errorWrap: {
    padding: 24,
    marginTop: 24,
  },
});
