import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  registerSchema,
  type RegisterFormValues,
} from '@/features/auth/schemas';

type RegisterFormProps = {
  isSubmitting?: boolean;
  serverError?: string | null;
  onSubmit?: (values: RegisterFormValues) => void;
};

export function RegisterForm({
  isSubmitting = false,
  serverError,
  onSubmit,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const values = watch();

  const submit = handleSubmit((formValues) => {
    onSubmit?.(formValues);
  });

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            autoCapitalize="words"
            autoComplete="name"
            onChangeText={(text) =>
              setValue('fullName', text, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            placeholder="Your full name"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={values.fullName}
          />
        </View>
        {errors.fullName ? (
          <Text style={styles.error}>{errors.fullName.message}</Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
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
        </View>
        {errors.email ? <Text style={styles.error}>{errors.email.message}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            autoCapitalize="none"
            autoComplete="new-password"
            onChangeText={(text) =>
              setValue('password', text, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            placeholder="Create a password"
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={values.password}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
          </Pressable>
        </View>
        {errors.password ? (
          <Text style={styles.error}>{errors.password.message}</Text>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
          <TextInput
            autoCapitalize="none"
            autoComplete="new-password"
            onChangeText={(text) =>
              setValue('confirmPassword', text, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            placeholder="Confirm your password"
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            value={values.confirmPassword}
          />
          <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94a3b8" />
          </Pressable>
        </View>
        {errors.confirmPassword ? (
          <Text style={styles.error}>{errors.confirmPassword.message}</Text>
        ) : null}
      </View>

      {serverError ? <Text style={styles.error}>{serverError}</Text> : null}

      <Pressable disabled={isSubmitting} onPress={submit} style={styles.button}>
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Text>
      </Pressable>

      <Text style={styles.helper}>
        This form now targets the real authentication endpoints.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 16,
    backgroundColor: '#f8fafc',
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  eyeIcon: {
    paddingRight: 16,
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
  },
  input: {
    flex: 1,
    height: 54,
    paddingRight: 16,
    fontSize: 15,
    color: '#0f172a',
  },
  error: {
    fontSize: 13,
    color: '#ef4444',
    marginLeft: 4,
  },
  button: {
    minHeight: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    marginTop: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  helper: {
    display: 'none',
  },
});
