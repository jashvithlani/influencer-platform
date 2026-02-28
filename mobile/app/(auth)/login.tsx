import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/stores/authStore';
import { tokens, colors, fontSize, spacing, borderRadius } from '../../src/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.replace('/');
    } catch (e: any) {
      if (e.response?.data?.detail) {
        setError(e.response.data.detail);
      } else if (e.code === 'ERR_NETWORK' || e.message === 'Network Error') {
        setError('Cannot connect to server. Make sure the API is running on port 8000.');
      } else if (e.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else {
        setError(e.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Text style={styles.logoLetter}>i</Text>
          </View>
          <Text style={styles.logo}>influencer</Text>
          <Text style={styles.subtitle}>where brands meet creators</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={15} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button title="Sign In" onPress={handleLogin} loading={loading} size="lg" />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/role-select" style={styles.link}>Sign Up</Link>
          </View>
        </View>

        <View style={styles.demo}>
          <Text style={styles.demoLabel}>DEMO ACCOUNTS</Text>
          <View style={styles.demoAccounts}>
            <TouchableOpacity style={styles.demoChip} onPress={() => { setEmail('brand1@example.com'); setPassword('password123'); }}>
              <Ionicons name="business" size={12} color={colors.accent} />
              <Text style={styles.demoChipText}>Brand</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoChip} onPress={() => { setEmail('influencer1@example.com'); setPassword('password123'); }}>
              <Ionicons name="person" size={12} color={colors.success} />
              <Text style={styles.demoChipText}>Creator</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.demoHint}>Tap to auto-fill · password123</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },

  header: { alignItems: 'center', marginBottom: spacing.xxl },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoLetter: { fontFamily: tokens.font.family.light, fontSize: 28, color: colors.accent, fontStyle: 'italic' },
  logo: { fontFamily: tokens.font.family.light, fontSize: fontSize.hero, color: colors.text, letterSpacing: -1 },
  subtitle: { fontFamily: tokens.font.family.medium, fontSize: fontSize.sm, color: colors.textLight, marginTop: spacing.xs, letterSpacing: 2, textTransform: 'uppercase' },

  form: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.errorSoft,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  errorText: { fontFamily: tokens.font.family.regular, color: colors.error, fontSize: fontSize.sm, flex: 1 },

  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { fontFamily: tokens.font.family.regular, color: colors.textSecondary, fontSize: fontSize.md },
  link: { fontFamily: tokens.font.family.semibold, color: colors.accent, fontSize: fontSize.md },

  demo: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  demoLabel: { fontFamily: tokens.font.family.semibold, fontSize: fontSize.xs, color: colors.textMuted, letterSpacing: 2 },
  demoAccounts: { flexDirection: 'row', gap: spacing.sm },
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  demoChipText: { fontFamily: tokens.font.family.medium, color: colors.textSecondary, fontSize: fontSize.sm },
  demoHint: { fontFamily: tokens.font.family.regular, fontSize: fontSize.xs, color: colors.textMuted },
});
