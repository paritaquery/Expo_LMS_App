import type { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type AuthShellProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  footer?: string;
}>;

export function AuthShell({
  eyebrow,
  title,
  description,
  footer,
  children,
}: AuthShellProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Ionicons name="book" size={32} color="#ffffff" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.card}>{children}</View>

        {footer ? <Text style={styles.footer}>{footer}</Text> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: {
    marginBottom: 10,
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  card: {
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  footer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
    color: '#94a3b8',
  },
});
