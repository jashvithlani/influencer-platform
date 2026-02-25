import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/stores/authStore';
import { colors, fontSize, spacing } from '../../src/theme';

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
      setError(e.response?.data?.detail || 'Login failed');
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
          <Text style={styles.logo}>Influencer</Text>
          <Text style={styles.logoSub}>Platform</Text>
          <Text style={styles.subtitle}>Connect brands with creators</Text>
        </View>

        <View>
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
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Sign In" onPress={handleLogin} loading={loading} size="lg" />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/role-select" style={styles.link}>Sign Up</Link>
          </View>

          <View style={styles.demo}>
            <Text style={styles.demoTitle}>Demo Accounts</Text>
            <Text style={styles.demoText}>Brand: brand1@example.com</Text>
            <Text style={styles.demoText}>Influencer: influencer1@example.com</Text>
            <Text style={styles.demoText}>Password: password123</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  header: { alignItems: 'center', marginBottom: spacing.xxl },
  logo: { fontSize: fontSize.hero, fontWeight: '800', color: colors.primary },
  logoSub: { fontSize: fontSize.xl, fontWeight: '300', color: colors.textSecondary, marginTop: -4 },
  subtitle: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.sm },
  error: { color: colors.error, fontSize: fontSize.sm, marginBottom: spacing.md, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textSecondary, fontSize: fontSize.md },
  link: { color: colors.primary, fontWeight: '600', fontSize: fontSize.md },
  demo: {
    marginTop: spacing.xl, padding: spacing.md, backgroundColor: colors.primaryLight + '10',
    borderRadius: 10, alignItems: 'center',
  },
  demoTitle: { fontWeight: '700', color: colors.primary, marginBottom: spacing.xs, fontSize: fontSize.sm },
  demoText: { color: colors.textSecondary, fontSize: fontSize.sm },
});
