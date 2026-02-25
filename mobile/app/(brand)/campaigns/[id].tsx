import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { Button } from '../../../src/components/ui/Button';
import { useCampaign, useApplications, useUpdateApplicationStatus } from '../../../src/hooks/useApi';
import { colors, fontSize, spacing } from '../../../src/theme';

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: campaign, isLoading } = useCampaign(id);
  const { data: applications } = useApplications(id);
  const updateStatus = useUpdateApplicationStatus();
  const router = useRouter();

  if (isLoading || !campaign) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{campaign.title}</Text>
          <Badge label={campaign.status} />
        </View>

        <View style={styles.body}>
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            {campaign.description && <Text style={styles.desc}>{campaign.description}</Text>}
            <View style={styles.metaGrid}>
              {campaign.budget && (
                <View style={styles.metaItem}><Text style={styles.metaLabel}>Budget</Text><Text style={styles.metaValue}>${Number(campaign.budget).toLocaleString()}</Text></View>
              )}
              {campaign.price_per_influencer && (
                <View style={styles.metaItem}><Text style={styles.metaLabel}>Per Influencer</Text><Text style={styles.metaValue}>${Number(campaign.price_per_influencer).toLocaleString()}</Text></View>
              )}
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Platform</Text><Text style={styles.metaValue}>{campaign.platform}</Text></View>
              <View style={styles.metaItem}><Text style={styles.metaLabel}>Category</Text><Text style={styles.metaValue}>{campaign.category || 'Any'}</Text></View>
            </View>
          </Card>

          {campaign.requirements && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              <Text style={styles.desc}>{campaign.requirements}</Text>
            </Card>
          )}

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Applications ({applications?.length || 0})</Text>
            {(!applications || applications.length === 0) ? (
              <Text style={styles.emptyText}>No applications yet</Text>
            ) : (
              applications.map((app) => (
                <View key={app.id} style={styles.appCard}>
                  <View style={styles.appHeader}>
                    <Image source={{ uri: app.influencer_avatar || 'https://api.dicebear.com/7.x/avataaars/png?seed=default' }} style={styles.appAvatar} />
                    <View style={styles.appInfo}>
                      <Text style={styles.appName}>{app.influencer_name || 'Influencer'}</Text>
                      <Badge
                        label={app.status}
                        color={app.status === 'accepted' ? colors.success : app.status === 'rejected' ? colors.error : colors.textSecondary}
                        backgroundColor={app.status === 'accepted' ? colors.success + '15' : app.status === 'rejected' ? colors.error + '15' : colors.border}
                      />
                    </View>
                  </View>
                  {app.pitch && <Text style={styles.pitch} numberOfLines={3}>{app.pitch}</Text>}
                  {app.status === 'pending' && (
                    <View style={styles.appActions}>
                      <Button title="Accept" size="sm" onPress={() => updateStatus.mutate({ campaignId: id, applicationId: app.id, status: 'accepted' })} style={{ flex: 1 }} />
                      <Button title="Reject" variant="outline" size="sm" onPress={() => updateStatus.mutate({ campaignId: id, applicationId: app.id, status: 'rejected' })} style={{ flex: 1 }} />
                    </View>
                  )}
                </View>
              ))
            )}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loader: { marginTop: 100 },
  backBtn: { padding: spacing.lg },
  header: { paddingHorizontal: spacing.lg, marginBottom: spacing.md, gap: spacing.sm },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  body: { padding: spacing.lg },
  section: { marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  desc: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 22 },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  metaItem: { width: '45%' },
  metaLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
  metaValue: { fontSize: fontSize.md, fontWeight: '600', color: colors.text, marginTop: 2 },
  emptyText: { color: colors.textSecondary, fontStyle: 'italic' },
  appCard: { borderBottomWidth: 1, borderColor: colors.border, paddingVertical: spacing.md },
  appHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  appAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.border },
  appInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  pitch: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 20 },
  appActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
});
