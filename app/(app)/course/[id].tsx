import { Image } from 'expo-image';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState, ScreenLoader } from '@/components/feedback';
import { useCourseCatalog } from '@/features/courses/hooks';
import { useAppStore, useAuthStore } from '@/store';

export default function CourseDetailsScreen() {
  const session = useAuthStore((state) => state.session);
  const bookmarks = useAppStore((state) => state.bookmarks);
  const isOnline = useAppStore((state) => state.isOnline);
  const enrolledCourseIds = useAppStore((state) => state.enrolledCourseIds);
  const toggleBookmark = useAppStore((state) => state.toggleBookmark);
  const toggleEnrollment = useAppStore((state) => state.toggleEnrollment);
  const params = useLocalSearchParams<{ id?: string }>();
  const courseCatalogQuery = useCourseCatalog();

  if (!session) {
    return <Redirect href="/login" />;
  }

  if (courseCatalogQuery.isPending) {
    return (
      <View style={styles.centerWrap}>
        <ScreenLoader message="Loading course details..." />
      </View>
    );
  }

  if (!params.id || !courseCatalogQuery.data) {
    return (
      <View style={styles.centerWrap}>
        <EmptyState
          title="Course not found"
          description="This course could not be loaded. Please go back and try again."
        />
      </View>
    );
  }

  const course = courseCatalogQuery.data.find((item) => item.id === params.id);

  if (!course) {
    return (
      <View style={styles.centerWrap}>
        <EmptyState
          title="Course not found"
          description="This course may have been removed from the catalog feed."
        />
      </View>
    );
  }

  const isBookmarked = Boolean(bookmarks[course.id]);
  const isEnrolled = enrolledCourseIds.includes(course.id);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} style={styles.container}>
      <Image contentFit="cover" source={{ uri: course.thumbnailUrl }} style={styles.hero} />
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.instructor}>Instructor: {course.instructorName}</Text>
      {course.category ? <Text style={styles.meta}>Category: {course.category}</Text> : null}
      {typeof course.rating === 'number' ? (
        <Text style={styles.meta}>Rating: {course.rating.toFixed(1)}</Text>
      ) : null}
      {typeof course.price === 'number' ? (
        <Text style={styles.meta}>Price: ${course.price}</Text>
      ) : null}
      <View style={styles.actions}>
        <Pressable
          onPress={() => toggleBookmark(course.id)}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.secondaryButtonText}>
            {isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (!isOnline) {
              Alert.alert('Offline', 'Reconnect to enroll in this course.');
              return;
            }

            toggleEnrollment(course.id);
          }}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed ? styles.buttonPressed : null,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {isEnrolled ? 'Enrolled' : 'Enroll Now'}
          </Text>
        </Pressable>
      </View>
      <Pressable
        onPress={() => router.push(`/(app)/course/${course.id}/learn`)}
        style={({ pressed }) => [
          styles.learnButton,
          pressed ? styles.buttonPressed : null,
        ]}
      >
        <Text style={styles.learnButtonText}>Open Learning View</Text>
      </Pressable>
      <Text style={styles.statusNote}>
        {isEnrolled
          ? 'You are enrolled in this course. Your enrollment is saved on this device.'
          : isOnline
            ? 'Enroll to save this course in your local learner progress.'
            : 'You are offline. Enrollment is disabled until your connection returns.'}
      </Text>
      <Text style={styles.description}>{course.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
    gap: 12,
  },
  centerWrap: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  hero: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#0f172a',
  },
  instructor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  meta: {
    fontSize: 14,
    color: '#475569',
  },
  description: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 24,
    color: '#1e293b',
  },
  actions: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  statusNote: {
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
  },
  learnButton: {
    minHeight: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d4ed8',
  },
  learnButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
