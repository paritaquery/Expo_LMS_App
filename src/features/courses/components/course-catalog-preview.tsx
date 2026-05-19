import { StyleSheet, Text, View } from 'react-native';

import type { Course } from '@/types/course';

import { CourseCard } from './course-card';

type CourseCatalogPreviewProps = {
  courses: Course[];
};

export function CourseCatalogPreview({ courses }: CourseCatalogPreviewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Course Catalog</Text>
      <Text style={styles.meta}>{courses.length} courses available</Text>
      <View style={styles.list}>
        {courses.slice(0, 6).map((course) => (
          <CourseCard course={course} key={course.id} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
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
  list: {
    gap: 12,
    marginTop: 4,
  },
});
