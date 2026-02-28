import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { tokens, fontSize, spacing, borderRadius } from '../../src/theme';

export default function RoleSelectScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join as...</Text>
      <Text style={styles.subtitle}>Choose how you want to use the platform</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push({ pathname: '/(auth)/register', params: { role: 'brand' } })}
        activeOpacity={0.8}
      >
        <Ionicons name="business-outline" size={40} color={tokens.color.accent} />
        <Text style={styles.cardTitle}>Brand / Marketer</Text>
        <Text style={styles.cardDesc}>Find and collaborate with influencers for your marketing campaigns</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push({ pathname: '/(auth)/register', params: { role: 'influencer' } })}
        activeOpacity={0.8}
      >
        <Ionicons name="person-outline" size={40} color={tokens.color.success} />
        <Text style={styles.cardTitle}>Creator / Influencer</Text>
        <Text style={styles.cardDesc}>Discover brand partnerships and grow your creator business</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.color.bg, padding: spacing.lg, justifyContent: 'center' },
  title: { fontSize: fontSize.hero, fontWeight: '800', color: tokens.color.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: fontSize.md, color: tokens.color.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl },
  card: {
    backgroundColor: tokens.color.bgCard, borderRadius: borderRadius.lg, padding: spacing.lg,
    marginBottom: spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: tokens.color.border,
  },
  cardTitle: { fontSize: fontSize.lg, fontWeight: '700', color: tokens.color.textPrimary, marginTop: spacing.md },
  cardDesc: { fontSize: fontSize.sm, color: tokens.color.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  back: { alignItems: 'center', marginTop: spacing.lg },
  backText: { color: tokens.color.accent, fontWeight: '600', fontSize: fontSize.md },
});
