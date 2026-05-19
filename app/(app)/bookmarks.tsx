import { useMemo, useCallback } from 'react';
import { Redirect, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/feedback';
import { CourseCatalogList } from '@/features/courses/components';
import { useCourseCatalog } from '@/features/courses/hooks';
import { useAppStore, useAuthStore } from '@/store';

export default function BookmarksScreen() {
  const session = useAuthStore((state) => state.session);
  const bookmarks = useAppStore((state) => state.bookmarks);
  const toggleBookmark = useAppStore((state) => state.toggleBookmark);
  const courseCatalogQuery = useCourseCatalog();

  if (!session) {
    return <Redirect href="/login" />;
  }

  const bookmarkIds = useMemo(() => new Set(Object.keys(bookmarks)), [bookmarks]);
  const bookmarkedCourses = useMemo(
    () => courseCatalogQuery.data?.filter((course) => bookmarkIds.has(course.id)) ?? [],
    [courseCatalogQuery.data, bookmarkIds]
  );

  const handlePressCourse = useCallback((courseId: string) => {
    router.push(`/(app)/course/${courseId}`);
  }, []);

  const handleRefresh = useCallback(() => {
    void courseCatalogQuery.refetch();
  }, [courseCatalogQuery]);

  return (
    <View style={styles.container}>
      {bookmarkedCourses.length > 0 ? (
        <CourseCatalogList
          bookmarkedCourseIds={bookmarkIds}
          courses={bookmarkedCourses}
          headerMetaSuffix="saved courses"
          headerTitle="Your Bookmarks"
          isRefreshing={courseCatalogQuery.isRefetching}
          onPressCourse={handlePressCourse}
          onRefresh={handleRefresh}
          onToggleBookmark={toggleBookmark}
        />
      ) : (
        <View style={styles.emptyWrap}>
          <EmptyState
            description="Browse courses from Home and tap the star icon to save courses here."
            title="No bookmarks yet"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  emptyWrap: {
    padding: 24,
    marginTop: 24,
  },
});
