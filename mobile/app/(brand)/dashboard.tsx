import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useMyCampaigns, useSavedInfluencers } from '../../src/hooks/useApi';
import { useAuth } from '../../src/hooks/useAuth';
import { colors, fontSize, spacing } from '../../src/theme';
import type { BrandProfile } from '../../src/types/api';

export default function BrandDashboard() {
  const { profile, logout } = useAuth();
  const brand = profile as BrandProfile | null;
  const { data: campaigns } = useMyCampaigns();
  const { data: saved } = useSavedInfluencers();
  const router = useRouter();

  const activeCampaigns = campaigns?.items?.filter((c) => c.status === 'active') || [];
  const totalApplicants = campaigns?.items?.reduce((sum, c) => sum + (c.application_count || 0), 0) || 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{brand?.company_name || 'Brand'}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{activeCampaigns.length}</Text>
            <Text style={styles.statLabel}>Active Campaigns</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{totalApplicants}</Text>
            <Text style={styles.statLabel}>Total Applicants</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{saved?.length || 0}</Text>
            <Text style={styles.statLabel}>Saved Creators</Text>
          </Card>
        </View>

        <View style={styles.actions}>
          <Button title="Search Influencers" onPress={() => router.push('/(brand)/search')} size="lg" style={{ marginBottom: spacing.md }} />
          <Button title="Create Campaign" variant="outline" onPress={() => router.push('/(brand)/campaigns/create')} size="lg" />
        </View>

        {activeCampaigns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Campaigns</Text>
            {activeCampaigns.slice(0, 3).map((c) => (
              <TouchableOpacity key={c.id} style={styles.campaignRow} onPress={() => router.push(`/(brand)/campaigns/${c.id}`)}>
                <View style={styles.campaignInfo}>
                  <Text style={styles.campaignTitle} numberOfLines={1}>{c.title}</Text>
                  <Text style={styles.campaignMeta}>{c.application_count || 0} applicants</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
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
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statNumber: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center' },
  actions: { marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  campaignRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: 10, marginBottom: spacing.sm },
  campaignInfo: { flex: 1 },
  campaignTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  campaignMeta: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
});
