import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { loginSchema, type LoginFormValues } from '@/features/auth/schemas';

type LoginFormProps = {
  isSubmitting?: boolean;
  serverError?: string | null;
  onSubmit?: (values: LoginFormValues) => void;
};

export function LoginForm({
  isSubmitting = false,
  serverError,
  onSubmit,
}: LoginFormProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'test2@gmail.com',
      password: 'Test@123',
    },
  });

  const values = watch();

  const submit = handleSubmit((formValues) => {
    onSubmit?.(formValues);
  });

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={(text) =>
            setValue('email', text, { shouldDirty: true, shouldValidate: true })
          }
          placeholder="you@example.com"
          placeholderTextColor="#94a3b8"
          style={styles.input}
          value={values.email}
        />
        {errors.email ? <Text style={styles.error}>{errors.email.message}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          autoCapitalize="none"
          autoComplete="password"
          onChangeText={(text) =>
            setValue('password', text, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          placeholder="Enter your password"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          style={styles.input}
          value={values.password}
        />
        {errors.password ? (
          <Text style={styles.error}>{errors.password.message}</Text>
        ) : null}
      </View>

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <Pressable disabled={isSubmitting} onPress={submit} style={styles.button}>
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Signing in...' : 'Continue'}
        </Text>
      </Pressable>

      <Text style={styles.helper}>
        Use a real FreeAPI account here once registration and login are connected.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  error: {
    fontSize: 13,
    color: '#dc2626',
  },
  button: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  helper: {
    fontSize: 13,
    lineHeight: 20,
    color: '#64748b',
  },
});
