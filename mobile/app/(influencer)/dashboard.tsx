import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMyApplications } from '../../src/hooks/useApi';
import { useAuth } from '../../src/hooks/useAuth';
import { tokens, colors, fontSize, spacing, borderRadius } from '../../src/theme';
import type { InfluencerProfile } from '../../src/types/api';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: inf?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/png?seed=default' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>Good {getTimeOfDay()},</Text>
              <Text style={styles.name}>{inf?.display_name || 'Creator'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={logout} style={styles.iconBtn}>
            <Ionicons name="log-out-outline" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Profile Stats */}
        {inf && (
          <View style={styles.statsCard}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{fmt(inf.follower_count)}</Text>
              <Text style={styles.statLabel}>followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{(inf.engagement_rate * 100).toFixed(1)}%</Text>
              <Text style={styles.statLabel}>engagement</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, {
                color: inf.authenticity_score >= 80 ? colors.success
                  : inf.authenticity_score >= 60 ? colors.warning : colors.error
              }]}>{inf.authenticity_score.toFixed(0)}</Text>
              <Text style={styles.statLabel}>authenticity</Text>
            </View>
          </View>
        )}

        {/* Application Stats */}
        <View style={styles.appRow}>
          <View style={styles.appStat}>
            <Text style={[styles.appNumber, { color: colors.warning }]}>{pending}</Text>
            <Text style={styles.appLabel}>pending</Text>
          </View>
          <View style={styles.appStat}>
            <Text style={[styles.appNumber, { color: colors.success }]}>{accepted}</Text>
            <Text style={styles.appLabel}>accepted</Text>
          </View>
          <View style={styles.appStat}>
            <Text style={styles.appNumber}>{applications?.length || 0}</Text>
            <Text style={styles.appLabel}>total</Text>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => router.push('/(influencer)/campaigns')}
          activeOpacity={0.7}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="compass" size={20} color={colors.accent} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Browse Campaigns</Text>
            <Text style={styles.actionDesc}>Find brand partnerships</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={() => router.push('/(influencer)/profile')}
          activeOpacity={0.7}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="create" size={20} color={colors.success} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Edit Profile</Text>
            <Text style={styles.actionDesc}>Keep your profile updated</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Recent Applications */}
        {applications && applications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>recent applications</Text>
            {applications.slice(0, 5).map((app) => {
              const sc = app.status === 'accepted' ? colors.success
                : app.status === 'rejected' ? colors.error : colors.warning;
              const icon = app.status === 'accepted' ? 'checkmark-circle'
                : app.status === 'rejected' ? 'close-circle' : 'time';

              return (
                <TouchableOpacity
                  key={app.id}
                  style={styles.listRow}
                  onPress={() => router.push(`/(influencer)/campaign/${app.campaign_id}`)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={icon} size={20} color={sc} />
                  <View style={styles.listInfo}>
                    <Text style={styles.listTitle} numberOfLines={1}>{app.campaign_title || 'Campaign'}</Text>
                    <Text style={[styles.listStatus, { color: sc }]}>{app.status}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {(!applications || applications.length === 0) && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>no applications yet</Text>
            <Text style={styles.emptyDesc}>Browse campaigns and apply to start collaborating.</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(influencer)/campaigns')}
            >
              <Text style={styles.emptyBtnText}>explore campaigns</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xl,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 44, height: 44, borderRadius: borderRadius.full, backgroundColor: colors.surfaceLight },
  greeting: { fontFamily: tokens.font.family.regular, fontSize: fontSize.sm, color: colors.textLight },
  name: { fontFamily: tokens.font.family.semibold, fontSize: fontSize.xl, color: colors.text, marginTop: 1 },
  iconBtn: {
    width: 36, height: 36, borderRadius: borderRadius.full,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },

  // Stats
  statsCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.lg, marginBottom: spacing.lg,
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border,
    paddingVertical: spacing.lg,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontFamily: tokens.font.family.light, fontSize: fontSize.xxl, color: colors.text, letterSpacing: -1 },
  statLabel: { fontFamily: tokens.font.family.medium, fontSize: fontSize.xs, color: colors.textLight, marginTop: spacing.xs },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border },

  // App stats
  appRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg, marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  appStat: {
    flex: 1, alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border,
    paddingVertical: spacing.md,
  },
  appNumber: { fontFamily: tokens.font.family.light, fontSize: fontSize.xl, color: colors.text },
  appLabel: { fontFamily: tokens.font.family.medium, fontSize: fontSize.xs, color: colors.textLight, marginTop: 2 },

  // Actions
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.lg, marginBottom: spacing.sm,
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md,
  },
  actionIcon: {
    width: 40, height: 40, borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center',
  },
  actionInfo: { flex: 1, marginLeft: spacing.md },
  actionTitle: { fontFamily: tokens.font.family.medium, fontSize: fontSize.md, color: colors.text },
  actionDesc: { fontFamily: tokens.font.family.regular, fontSize: fontSize.sm, color: colors.textLight, marginTop: 2 },

  // Section
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.lg },
  sectionTitle: { fontFamily: tokens.font.family.medium, fontSize: fontSize.sm, color: colors.textLight, letterSpacing: 1, marginBottom: spacing.md },

  // List
  listRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  listInfo: { flex: 1 },
  listTitle: { fontFamily: tokens.font.family.medium, fontSize: fontSize.md, color: colors.text },
  listStatus: { fontFamily: tokens.font.family.regular, fontSize: fontSize.sm, marginTop: 2, textTransform: 'capitalize' },

  // Empty
  emptyWrap: { alignItems: 'center', padding: spacing.xxl },
  emptyTitle: { fontFamily: tokens.font.family.medium, fontSize: fontSize.lg, color: colors.text },
  emptyDesc: { fontFamily: tokens.font.family.regular, fontSize: fontSize.sm, color: colors.textLight, textAlign: 'center', marginTop: spacing.sm, maxWidth: 260, lineHeight: 20 },
  emptyBtn: {
    borderWidth: 1, borderColor: colors.accent, borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md - 2, marginTop: spacing.lg,
  },
  emptyBtnText: { fontFamily: tokens.font.family.medium, color: colors.accent, fontSize: fontSize.md },
});
