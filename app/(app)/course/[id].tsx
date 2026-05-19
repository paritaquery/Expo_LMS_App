import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      <View style={styles.imageWrap}>
        <Image resizeMode="cover" source={{ uri: course.thumbnailUrl }} style={styles.hero} />
        {typeof course.price === 'number' ? (
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>${course.price}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.headerInfo}>
        <Text style={styles.title}>{course.title}</Text>
        <View style={styles.instructorRow}>
          <Ionicons color="#64748b" name="person-circle-outline" size={20} />
          <Text style={styles.instructor}>{course.instructorName}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        {course.category ? (
          <View style={styles.metaPill}>
            <Ionicons color="#475569" name="folder-outline" size={16} />
            <Text style={styles.metaPillText}>{course.category}</Text>
          </View>
        ) : null}
        {typeof course.rating === 'number' ? (
          <View style={styles.metaPill}>
            <Ionicons color="#f59e0b" name="star" size={16} />
            <Text style={styles.metaPillText}>{course.rating.toFixed(1)}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
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
            isEnrolled && styles.primaryButtonEnrolled,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons color="#ffffff" name={isEnrolled ? 'checkmark-circle' : 'play-circle'} size={20} />
          <Text style={styles.primaryButtonText}>
            {isEnrolled ? 'Enrolled' : 'Enroll Now'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => toggleBookmark(course.id)}
          style={({ pressed }) => [
            styles.bookmarkButton,
            isBookmarked && styles.bookmarkButtonActive,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons
            color={isBookmarked ? '#f59e0b' : '#64748b'}
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
          />
        </Pressable>
      </View>

      {isEnrolled ? (
        <Pressable
          onPress={() => router.push(`/(app)/course/${course.id}/learn`)}
          style={({ pressed }) => [styles.learnButton, pressed && styles.buttonPressed]}
        >
          <Ionicons color="#ffffff" name="book-outline" size={20} style={styles.learnIcon} />
          <Text style={styles.learnButtonText}>Open Learning View</Text>
        </Pressable>
      ) : null}

      {!isEnrolled && (
        <Text style={styles.statusNote}>
          {isOnline
            ? 'Enroll to save this course in your local learner progress.'
            : 'You are offline. Enrollment is disabled until your connection returns.'}
        </Text>
      )}

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About this course</Text>
        <Text style={styles.description}>{course.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  centerWrap: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  imageWrap: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    marginBottom: 24,
  },
  hero: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    backgroundColor: '#e2e8f0',
  },
  priceBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  headerInfo: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  instructor: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  metaPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    gap: 8,
  },
  primaryButtonEnrolled: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  bookmarkButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bookmarkButtonActive: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  learnButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    marginBottom: 8,
  },
  learnIcon: {
    marginRight: 8,
  },
  learnButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  statusNote: {
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 24,
  },
  section: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
});
