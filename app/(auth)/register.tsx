import { useMutation } from '@tanstack/react-query';
import { Link, Redirect, router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

import { registerUser } from '@/features/auth/api';
import { AuthShell, RegisterForm } from '@/features/auth/components';
import type { RegisterFormValues } from '@/features/auth/schemas';
import { normalizeApiError } from '@/services/api';
import { useAppStore, useAuthStore } from '@/store';

export default function RegisterScreen() {
  const status = useAuthStore((state) => state.status);
  const session = useAuthStore((state) => state.session);
  const isOnline = useAppStore((state) => state.isOnline);

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (user) => {
      console.log('[auth][register] success', {
        email: user.email,
        userId: user.id,
      });

      Alert.alert(
        'Registration successful',
        `Account created for ${user.email}.\nPlease sign in with your new credentials.`,
        [
          {
            text: 'Go to login',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    },
    onError: (error) => {
      const normalizedError = normalizeApiError(error);

      console.log('[auth][register] error', {
        message: normalizedError.message,
        status: normalizedError.status,
        code: normalizedError.code,
      });
    },
  });

  const handleRegisterSubmit = (values: RegisterFormValues) => {
    if (!isOnline) {
      Alert.alert('Offline', 'Please reconnect to create an account.');
      return;
    }

    console.log('[auth][register] submit', {
      fullName: values.fullName,
      email: values.email,
      passwordLength: values.password.length,
    });

    registerMutation.mutate({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    });
  };

  if (status === 'authenticated' && session) {
    return <Redirect href="/(app)" />;
  }

  return (
    <AuthShell
      eyebrow="Mini LMS"
      title="Create your account"
      description="Join the learning platform to save bookmarks, track progress, and access your course experience across sessions."
      footer="Authentication endpoint integration is the next roadmap step."
    >
      <RegisterForm
        isSubmitting={registerMutation.isPending}
        onSubmit={handleRegisterSubmit}
        serverError={
          registerMutation.error
            ? normalizeApiError(registerMutation.error).message
            : null
        }
      />
      <Link asChild href="/login">
        <Pressable style={styles.switchAction}>
          <Text style={styles.switchText}>
            Already have an account? <Text style={styles.switchTextStrong}>Sign in</Text>
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
