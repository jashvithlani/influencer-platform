import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMyCampaigns, useSavedInfluencers } from '../../src/hooks/useApi';
import { useAuth } from '../../src/hooks/useAuth';
import { tokens, colors, fontSize, spacing, borderRadius } from '../../src/theme';
import type { BrandProfile } from '../../src/types/api';

export default function BrandDashboard() {
  const { profile, logout } = useAuth();
  const brand = profile as BrandProfile | null;
  const { data: campaigns } = useMyCampaigns();
  const { data: saved } = useSavedInfluencers();
  const router = useRouter();

  const activeCampaigns = campaigns?.items?.filter((c) => c.status === 'active') || [];
  const draftCampaigns = campaigns?.items?.filter((c) => c.status === 'draft') || [];
  const totalApplicants = campaigns?.items?.reduce((sum, c) => sum + (c.application_count || 0), 0) || 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(brand?.company_name || 'B').charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={styles.greeting}>Good {getTimeOfDay()},</Text>
              <Text style={styles.name}>{brand?.company_name || 'Brand'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={logout} style={styles.iconBtn}>
            <Ionicons name="log-out-outline" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeCampaigns.length}</Text>
            <Text style={styles.statLabel}>active campaigns</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalApplicants}</Text>
            <Text style={styles.statLabel}>applicants</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{saved?.length || 0}</Text>
            <Text style={styles.statLabel}>saved</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(brand)/search')}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconWrap}>
              <Ionicons name="search" size={20} color={colors.accent} />
            </View>
            <Text style={styles.actionTitle}>Find Creators</Text>
            <Text style={styles.actionDesc}>Search & discover</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.textMuted} style={styles.actionArrow} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(brand)/campaigns/create')}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconWrap}>
              <Ionicons name="add" size={20} color={colors.success} />
            </View>
            <Text style={styles.actionTitle}>New Campaign</Text>
            <Text style={styles.actionDesc}>Launch a collab</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.textMuted} style={styles.actionArrow} />
          </TouchableOpacity>
        </View>

        {/* Active Campaigns */}
        {activeCampaigns.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>active campaigns</Text>
              <TouchableOpacity onPress={() => router.push('/(brand)/campaigns')}>
                <Text style={styles.seeAll}>see all</Text>
              </TouchableOpacity>
            </View>
            {activeCampaigns.slice(0, 3).map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.listRow}
                onPress={() => router.push(`/(brand)/campaigns/${c.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.listInfo}>
                  <Text style={styles.listTitle} numberOfLines={1}>{c.title}</Text>
                  <Text style={styles.listMeta}>
                    {c.application_count || 0} applicants · {c.category}
                  </Text>
                </View>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>live</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Drafts */}
        {draftCampaigns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>drafts</Text>
            {draftCampaigns.slice(0, 2).map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.listRow}
                onPress={() => router.push(`/(brand)/campaigns/${c.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.listInfo}>
                  <Text style={styles.listTitle} numberOfLines={1}>{c.title}</Text>
                  <Text style={styles.listMeta}>{c.category}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty */}
        {(!campaigns?.items || campaigns.items.length === 0) && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>no campaigns yet</Text>
            <Text style={styles.emptyDesc}>
              Create your first campaign to start connecting with creators.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(brand)/campaigns/create')}
            >
              <Text style={styles.emptyBtnText}>get started</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xl,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 44, height: 44, borderRadius: borderRadius.full,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: tokens.font.family.light, color: colors.accent, fontSize: fontSize.lg },
  greeting: { fontFamily: tokens.font.family.regular, fontSize: fontSize.sm, color: colors.textLight },
  name: { fontFamily: tokens.font.family.semibold, fontSize: fontSize.xl, color: colors.text, marginTop: 1 },
  iconBtn: {
    width: 36, height: 36, borderRadius: borderRadius.full,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },

  // Stats
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.lg, marginBottom: spacing.xl,
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border,
    paddingVertical: spacing.lg,
  },
  statCard: { flex: 1, alignItems: 'center' },
  statNumber: { fontFamily: tokens.font.family.light, fontSize: fontSize.xxl, color: colors.text, letterSpacing: -1 },
  statLabel: { fontFamily: tokens.font.family.medium, fontSize: fontSize.xs, color: colors.textLight, marginTop: spacing.xs, textTransform: 'lowercase' },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border },

  // Actions
  actionsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.md, marginBottom: spacing.xl },
  actionCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border, padding: spacing.lg,
  },
  actionIconWrap: {
    width: 36, height: 36, borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  actionTitle: { fontFamily: tokens.font.family.semibold, fontSize: fontSize.md, color: colors.text },
  actionDesc: { fontFamily: tokens.font.family.regular, fontSize: fontSize.xs, color: colors.textLight, marginTop: 2 },
  actionArrow: { position: 'absolute', right: spacing.lg, bottom: spacing.lg },

  // Sections
  section: { marginBottom: spacing.lg, paddingHorizontal: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontFamily: tokens.font.family.medium, fontSize: fontSize.sm, color: colors.textLight, textTransform: 'lowercase', letterSpacing: 1, marginBottom: spacing.md },
  seeAll: { fontFamily: tokens.font.family.medium, color: colors.accent, fontSize: fontSize.sm },

  // List rows
  listRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.sm,
  },
  listInfo: { flex: 1 },
  listTitle: { fontFamily: tokens.font.family.medium, fontSize: fontSize.md, color: colors.text },
  listMeta: { fontFamily: tokens.font.family.regular, fontSize: fontSize.sm, color: colors.textLight, marginTop: 3 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  liveText: { fontFamily: tokens.font.family.medium, fontSize: fontSize.xs, color: colors.success },

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
