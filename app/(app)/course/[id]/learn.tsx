import { Redirect, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { EmptyState, ScreenLoader } from '@/components/feedback';
import { useCourseCatalog } from '@/features/courses/hooks';
import { buildCourseWebviewHtml } from '@/features/courses/webview-template';
import { useAuthStore } from '@/store';

export default function CourseLearningScreen() {
  const session = useAuthStore((state) => state.session);
  const params = useLocalSearchParams<{ id?: string }>();
  const courseCatalogQuery = useCourseCatalog();
  const [hasWebviewError, setHasWebviewError] = useState(false);

  if (!session) {
    return <Redirect href="/login" />;
  }

  if (courseCatalogQuery.isPending) {
    return (
      <View style={styles.centerWrap}>
        <ScreenLoader message="Preparing learning content..." />
      </View>
    );
  }

  if (!params.id || !courseCatalogQuery.data) {
    return (
      <View style={styles.centerWrap}>
        <EmptyState
          title="Learning content unavailable"
          description="Course data could not be loaded for this lesson view."
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
          description="This course may no longer be available in the catalog."
        />
      </View>
    );
  }

  const html = useMemo(() => buildCourseWebviewHtml(course), [course]);

  if (hasWebviewError) {
    return (
      <View style={styles.centerWrap}>
        <EmptyState
          title="Could not render lesson content"
          description="The embedded lesson failed to load. Try the retry button below."
          action={
            <Pressable onPress={() => setHasWebviewError(false)} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        onError={() => setHasWebviewError(true)}
        originWhitelist={['*']}
        source={{ html }}
        startInLoadingState
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerWrap: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  retryButton: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
