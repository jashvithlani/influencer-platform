import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/ui/Card';
import { AuthenticityBadge } from '../../src/components/AuthenticityBadge';
import { useMyApplications } from '../../src/hooks/useApi';
import { useAuth } from '../../src/hooks/useAuth';
import { colors, fontSize, spacing } from '../../src/theme';
import type { InfluencerProfile } from '../../src/types/api';

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export default function InfluencerDashboard() {
  const { profile, logout } = useAuth();
  const inf = profile as InfluencerProfile | null;
  const { data: applications } = useMyApplications();
  const router = useRouter();

  const pending = applications?.filter((a) => a.status === 'pending').length || 0;
  const accepted = applications?.filter((a) => a.status === 'accepted').length || 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{inf?.display_name || 'Creator'}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {inf && (
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{formatFollowers(inf.follower_count)}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{(inf.engagement_rate * 100).toFixed(1)}%</Text>
                <Text style={styles.statLabel}>Engagement</Text>
              </View>
              <View style={styles.stat}>
                <AuthenticityBadge score={inf.authenticity_score} size="sm" />
                <Text style={styles.statLabel}>Authenticity</Text>
              </View>
            </View>
          </Card>
        )}

        <View style={styles.appSummary}>
          <Card style={styles.appCard}>
            <Text style={styles.appNumber}>{pending}</Text>
            <Text style={styles.appLabel}>Pending</Text>
          </Card>
          <Card style={styles.appCard}>
            <Text style={[styles.appNumber, { color: colors.success }]}>{accepted}</Text>
            <Text style={styles.appLabel}>Accepted</Text>
          </Card>
          <Card style={styles.appCard}>
            <Text style={styles.appNumber}>{applications?.length || 0}</Text>
            <Text style={styles.appLabel}>Total Apps</Text>
          </Card>
        </View>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(influencer)/campaigns')}
          activeOpacity={0.8}
        >
          <Ionicons name="megaphone" size={24} color={colors.primary} />
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Browse Campaigns</Text>
            <Text style={styles.actionDesc}>Find brand partnerships that match your niche</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(influencer)/profile')}
          activeOpacity={0.8}
        >
          <Ionicons name="person" size={24} color={colors.secondary} />
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Edit Profile</Text>
            <Text style={styles.actionDesc}>Keep your profile updated for brands</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        {applications && applications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Applications</Text>
            {applications.slice(0, 5).map((app) => (
              <TouchableOpacity
                key={app.id}
                style={styles.appRow}
                onPress={() => router.push(`/(influencer)/campaign/${app.campaign_id}`)}
              >
                <View style={styles.appRowInfo}>
                  <Text style={styles.appRowTitle} numberOfLines={1}>{app.campaign_title || 'Campaign'}</Text>
                  <Text style={[
                    styles.appRowStatus,
                    { color: app.status === 'accepted' ? colors.success : app.status === 'rejected' ? colors.error : colors.textSecondary },
                  ]}>{app.status}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  greeting: { fontSize: fontSize.md, color: colors.textSecondary },
  name: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  logoutBtn: { padding: spacing.sm },
  statsCard: { marginBottom: spacing.lg },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: fontSize.xl, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
  appSummary: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  appCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  appNumber: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.primary },
  appLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  actionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    padding: spacing.md, borderRadius: 12, marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  actionInfo: { flex: 1, marginLeft: spacing.md },
  actionTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  actionDesc: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  section: { marginTop: spacing.lg },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  appRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    padding: spacing.md, borderRadius: 10, marginBottom: spacing.sm,
  },
  appRowInfo: { flex: 1 },
  appRowTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  appRowStatus: { fontSize: fontSize.sm, marginTop: 2, textTransform: 'capitalize' },
});
