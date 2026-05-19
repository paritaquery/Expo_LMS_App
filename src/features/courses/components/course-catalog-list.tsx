import { LegendList } from '@legendapp/list';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Course } from '@/types/course';

import { CourseCard } from './course-card';

type CourseCatalogListProps = {
  courses: Course[];
  isRefreshing: boolean;
  onRefresh: () => void;
  bookmarkedCourseIds?: Set<string>;
  onToggleBookmark?: (courseId: string) => void;
  onPressCourse?: (courseId: string) => void;
};

export function CourseCatalogList({
  courses,
  isRefreshing,
  onRefresh,
  bookmarkedCourseIds,
  onToggleBookmark,
  onPressCourse,
}: CourseCatalogListProps) {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput.trim().toLowerCase());
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const filteredCourses = useMemo(() => {
    if (!searchQuery) {
      return courses;
    }

    return courses.filter((course) => {
      const haystack =
        `${course.title} ${course.description} ${course.instructorName}`.toLowerCase();
      return haystack.includes(searchQuery);
    });
  }, [courses, searchQuery]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Course Catalog</Text>
      <Text style={styles.meta}>{filteredCourses.length} results</Text>

      <TextInput
        autoCapitalize="none"
        onChangeText={setSearchInput}
        placeholder="Search courses or instructors..."
        placeholderTextColor="#94a3b8"
        style={styles.searchInput}
        value={searchInput}
      />

      {filteredCourses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No matching courses</Text>
          <Text style={styles.emptyDescription}>
            Try a different keyword or clear search to see the full catalog.
          </Text>
          <Pressable onPress={() => setSearchInput('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear search</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.listWrap}>
          <LegendList
            data={filteredCourses}
            keyExtractor={(item) => item.id}
            maintainVisibleContentPosition
            onRefresh={onRefresh}
            recycleItems
            refreshing={isRefreshing}
            renderItem={({ item }) => (
              <CourseCard
                course={item}
                isBookmarked={bookmarkedCourseIds?.has(item.id)}
                onPress={onPressCourse}
                onToggleBookmark={onToggleBookmark}
              />
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  meta: {
    fontSize: 14,
    color: '#64748b',
  },
  searchInput: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0f172a',
  },
  listWrap: {
    height: 520,
  },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    padding: 14,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyDescription: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
  },
  clearButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: 10,
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
});
