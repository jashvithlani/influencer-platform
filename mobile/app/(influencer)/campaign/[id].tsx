import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';
import { useCampaign, useApplyToCampaign } from '../../../src/hooks/useApi';
import { colors, fontSize, spacing } from '../../../src/theme';

export default function CampaignApplyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: campaign, isLoading } = useCampaign(id);
  const applyMutation = useApplyToCampaign();
  const router = useRouter();
  const [pitch, setPitch] = useState('');
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    try {
      await applyMutation.mutateAsync({ campaignId: id, pitch: pitch || undefined });
      setApplied(true);
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to apply');
    }
  };

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
          <View style={styles.row}>
            <Badge label={campaign.platform} />
            <Badge label={campaign.status} />
          </View>
          {campaign.brand_name && (
            <Text style={styles.brand}>by {campaign.brand_name}</Text>
          )}
        </View>

        <View style={styles.body}>
          {campaign.description && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.desc}>{campaign.description}</Text>
            </Card>
          )}

          {campaign.requirements && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              <Text style={styles.desc}>{campaign.requirements}</Text>
            </Card>
          )}

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Campaign Details</Text>
            <View style={styles.details}>
              {campaign.budget && (
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>Budget</Text>
                  <Text style={styles.detailValue}>${Number(campaign.budget).toLocaleString()}</Text>
                </View>
              )}
              {campaign.price_per_influencer && (
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>Per Influencer</Text>
                  <Text style={styles.detailValue}>${Number(campaign.price_per_influencer).toLocaleString()}</Text>
                </View>
              )}
              {campaign.min_followers && (
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>Min Followers</Text>
                  <Text style={styles.detailValue}>{campaign.min_followers.toLocaleString()}</Text>
                </View>
              )}
              {campaign.min_engagement_rate && (
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>Min Engagement</Text>
                  <Text style={styles.detailValue}>{(campaign.min_engagement_rate * 100).toFixed(1)}%</Text>
                </View>
              )}
            </View>
          </Card>

          {applied ? (
            <Card style={[styles.section, { alignItems: 'center' }]}>
              <Ionicons name="checkmark-circle" size={48} color={colors.success} />
              <Text style={styles.appliedTitle}>Application Submitted!</Text>
              <Text style={styles.appliedDesc}>The brand will review your application and get back to you.</Text>
            </Card>
          ) : (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Apply to Campaign</Text>
              <Input
                label="Your Pitch (optional)"
                placeholder="Tell the brand why you're a great fit..."
                multiline
                numberOfLines={4}
                value={pitch}
                onChangeText={setPitch}
                style={{ minHeight: 100, textAlignVertical: 'top' }}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <Button
                title="Submit Application"
                onPress={handleApply}
                loading={applyMutation.isPending}
                size="lg"
              />
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loader: { marginTop: 100 },
  backBtn: { padding: spacing.lg },
  header: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  row: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  brand: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs },
  body: { padding: spacing.lg },
  section: { marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  desc: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 22 },
  details: { gap: spacing.md },
  detail: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
  detailValue: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text },
  error: { color: colors.error, fontSize: fontSize.sm, textAlign: 'center', marginBottom: spacing.md },
  appliedTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.success, marginTop: spacing.md },
  appliedDesc: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
});
