import { LegendList } from '@legendapp/list';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { Course } from '@/types/course';

import { CourseCard } from './course-card';

type CourseCatalogListProps = {
  courses: Course[];
  isRefreshing: boolean;
  onRefresh: () => void;
  bookmarkedCourseIds?: Set<string>;
  onToggleBookmark?: (courseId: string) => void;
  onPressCourse?: (courseId: string) => void;
  headerTitle?: string;
  headerMetaSuffix?: string;
};

export function CourseCatalogList({
  courses,
  isRefreshing,
  onRefresh,
  bookmarkedCourseIds,
  onToggleBookmark,
  onPressCourse,
  headerTitle = 'Explore Courses',
  headerMetaSuffix = 'available right now',
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
      <View style={styles.header}>
        <Text style={styles.title}>{headerTitle}</Text>
        <Text style={styles.meta}>
          {filteredCourses.length} {headerMetaSuffix}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons color="#94a3b8" name="search" size={20} style={styles.searchIcon} />
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearchInput}
          placeholder="Search courses or instructors..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
          value={searchInput}
        />
        {searchInput ? (
          <Pressable onPress={() => setSearchInput('')} style={styles.clearIcon}>
            <Ionicons color="#cbd5e1" name="close-circle" size={20} />
          </Pressable>
        ) : null}
      </View>

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
        <LegendList
          contentContainerStyle={styles.listContent}
          data={filteredCourses}
          estimatedItemSize={300}
          extraData={bookmarkedCourseIds}
          keyExtractor={(item) => item.id}
          maintainVisibleContentPosition
          onRefresh={onRefresh}
          recycleItems
          refreshControl={
            <RefreshControl
              colors={['#2563eb']}
              onRefresh={onRefresh}
              refreshing={isRefreshing}
              tintColor="#2563eb"
            />
          }
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  meta: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  searchIcon: {
    paddingLeft: 16,
  },
  searchInput: {
    flex: 1,
    minHeight: 52,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#0f172a',
  },
  clearIcon: {
    padding: 12,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    paddingTop: 8,
  },
  emptyState: {
    marginHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyDescription: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    color: '#475569',
  },
  clearButton: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
