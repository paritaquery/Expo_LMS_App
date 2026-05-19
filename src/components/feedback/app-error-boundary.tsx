import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface AppErrorBoundaryProps {
  error: Error;
  retry: () => void;
}

export function AppErrorBoundary({ error, retry }: AppErrorBoundaryProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>
        {error.message || 'An unexpected error occurred. Please try again.'}
      </Text>
      <Pressable onPress={retry} style={styles.button}>
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
      <Pressable
        onPress={() => router.replace('/')}
        style={[styles.button, styles.homeButton]}
      >
        <Text style={styles.homeButtonText}>Return to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    minHeight: 48,
    width: '100%',
    maxWidth: 300,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  homeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
});
