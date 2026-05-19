import { memo } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
        contentFit="cover"
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
            <Text style={styles.bookmarkIcon}>{isBookmarked ? '★' : '☆'}</Text>
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
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 130,
    backgroundColor: '#e2e8f0',
  },
  content: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  description: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
  },
  instructor: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  bookmarkButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  bookmarkIcon: {
    fontSize: 16,
    color: '#0f172a',
  },
  pressed: {
    opacity: 0.7,
  },
});
