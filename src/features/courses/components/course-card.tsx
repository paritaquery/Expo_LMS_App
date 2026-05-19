import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { Course } from '@/types/course';

type CourseCardProps = {
  course: Course;
  isBookmarked?: boolean;
  onToggleBookmark?: (courseId: string) => void;
  onPress?: (courseId: string) => void;
};

export const CourseCard = memo(function CourseCard({
  course,
  isBookmarked = false,
  onToggleBookmark,
  onPress,
}: CourseCardProps) {
  return (
    <Pressable
      accessibilityLabel={`Course: ${course.title} by ${course.instructorName}`}
      accessibilityRole="button"
      onPress={() => onPress?.(course.id)}
      style={styles.card}
    >
      <Image
        resizeMode="cover"
        source={{ uri: course.thumbnailUrl }}
        style={styles.thumbnail}
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text numberOfLines={1} style={styles.title}>
            {course.title}
          </Text>
          <Pressable
            accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            accessibilityRole="button"
            hitSlop={14}
            onPress={() => onToggleBookmark?.(course.id)}
            style={({ pressed }) => [styles.bookmarkButton, pressed ? styles.pressed : null]}
          >
            <Ionicons
              color={isBookmarked ? '#f59e0b' : '#94a3b8'}
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
            />
          </Pressable>
        </View>
        <Text numberOfLines={2} style={styles.description}>
          {course.description}
        </Text>
        <Text numberOfLines={1} style={styles.instructor}>
          {course.instructorName}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: '#e2e8f0',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 24,
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  instructor: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bookmarkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.95 }],
  },
});
