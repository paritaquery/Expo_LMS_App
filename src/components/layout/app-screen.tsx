import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type AppScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  scrollEnabled?: boolean;
};

export function AppScreen({
  eyebrow,
  title,
  description,
  children,
  scrollEnabled = true,
}: AppScreenProps) {
  if (!scrollEnabled) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {children ? <View style={styles.content}>{children}</View> : null}
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {children ? <View style={styles.content}>{children}</View> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  eyebrow: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#2563eb',
  },
  title: {
    marginBottom: 12,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    color: '#0f172a',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
  },
  content: {
    marginTop: 24,
    gap: 12,
  },
});
