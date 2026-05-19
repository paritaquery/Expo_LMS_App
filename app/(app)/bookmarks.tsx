import { useMemo, useCallback } from 'react';
import { Redirect, router } from 'expo-router';

import { EmptyState } from '@/components/feedback';
import { AppScreen } from '@/components/layout/app-screen';
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
    <AppScreen
      eyebrow="Library"
      title="Bookmarks"
      description="Your saved courses will be listed here for quick access."
      scrollEnabled={false}
    >
      {bookmarkedCourses.length > 0 ? (
        <CourseCatalogList
          bookmarkedCourseIds={bookmarkIds}
          courses={bookmarkedCourses}
          isRefreshing={courseCatalogQuery.isRefetching}
          onPressCourse={handlePressCourse}
          onRefresh={handleRefresh}
          onToggleBookmark={toggleBookmark}
        />
      ) : (
        <EmptyState
          title="No bookmarks yet"
          description="Browse courses from Home and tap the star icon to save courses here."
        />
      )}
    </AppScreen>
  );
}
