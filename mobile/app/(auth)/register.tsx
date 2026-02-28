import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/stores/authStore';
import { tokens, fontSize, spacing } from '../../src/theme';

export default function RegisterScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const extra = role === 'brand' ? { company_name: name } : { display_name: name };
      await register(email, password, role || 'influencer', extra);
      router.replace('/');
    } catch (e: any) {
      if (e.response?.data?.detail) {
        setError(e.response.data.detail);
      } else if (e.code === 'ERR_NETWORK' || e.message === 'Network Error') {
        setError('Cannot connect to server. Make sure the API is running on port 8000.');
      } else if (e.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else {
        setError(e.message || 'An unexpected error occurred. Please try again.');
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Signing up as {role === 'brand' ? 'a Brand' : 'a Creator'}
        </Text>

        <View>
          <Input
            label={role === 'brand' ? 'Company Name' : 'Display Name'}
            placeholder={role === 'brand' ? 'Your company name' : 'Your creator name'}
            value={name}
            onChangeText={setName}
          />
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
            placeholder="Create a password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Create Account" onPress={handleRegister} loading={loading} size="lg" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: tokens.color.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: fontSize.md, color: tokens.color.textSecondary, textAlign: 'center', marginTop: spacing.xs, marginBottom: spacing.xl },
  error: { color: tokens.color.error, fontSize: fontSize.sm, marginBottom: spacing.md, textAlign: 'center' },
});
