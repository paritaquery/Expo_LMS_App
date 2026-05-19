import { useMutation } from '@tanstack/react-query';
import { Link, Redirect } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

import { loginUser } from '@/features/auth/api';
import { AuthShell, LoginForm } from '@/features/auth/components';
import type { LoginFormValues } from '@/features/auth/schemas';
import { normalizeApiError } from '@/services/api';
import { secureStorage } from '@/services/storage';
import { useAppStore, useAuthStore } from '@/store';

export default function LoginScreen() {
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);
  const isOnline = useAppStore((state) => state.isOnline);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (session) => {
      console.log('[auth][login] success', {
        email: session.email,
        userId: session.userId,
        hasAccessToken: Boolean(session.tokens.accessToken),
        hasRefreshToken: Boolean(session.tokens.refreshToken),
      });

      await secureStorage.saveAuthSession(session);
      setSession(session);

      Alert.alert(
        'Login successful',
        `Signed in as ${session.email}.\nSession was saved securely on this device.`
      );
    },
    onError: (error) => {
      const normalizedError = normalizeApiError(error);

      console.log('[auth][login] error', {
        message: normalizedError.message,
        status: normalizedError.status,
        code: normalizedError.code,
      });
    },
  });

  const handleLoginSubmit = (values: LoginFormValues) => {
    if (!isOnline) {
      Alert.alert('Offline', 'Please reconnect to sign in.');
      return;
    }

    console.log('[auth][login] submit', {
      email: values.email,
      passwordLength: values.password.length,
    });

    loginMutation.mutate(values);
  };

  if (status === 'authenticated' && session) {
    return <Redirect href="/(app)" />;
  }

  return (
    <AuthShell
      eyebrow="Mini LMS"
      title="Welcome back"
      description="Sign in to continue your learning journey, sync bookmarks, and access enrolled courses."
      footer="Authentication API wiring is the next roadmap step."
    >
      <LoginForm
        isSubmitting={loginMutation.isPending}
        onSubmit={handleLoginSubmit}
        serverError={
          loginMutation.error ? normalizeApiError(loginMutation.error).message : null
        }
      />
      <Link asChild href="/register">
        <Pressable style={styles.switchAction}>
          <Text style={styles.switchText}>
            New here? <Text style={styles.switchTextStrong}>Create an account</Text>
          </Text>
        </Pressable>
      </Link>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  switchAction: {
    marginTop: 18,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#475569',
  },
  switchTextStrong: {
    fontWeight: '700',
    color: '#0f172a',
  },
});
