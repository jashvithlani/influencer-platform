import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../../src/components/ui/Card';
import { Badge } from '../../../src/components/ui/Badge';
import { Button } from '../../../src/components/ui/Button';
import { AuthenticityBadge } from '../../../src/components/AuthenticityBadge';
import { useInfluencer, useSaveInfluencer } from '../../../src/hooks/useApi';
import { colors, fontSize, spacing, borderRadius } from '../../../src/theme';

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export default function InfluencerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: influencer, isLoading } = useInfluencer(id);
  const saveInfluencer = useSaveInfluencer();
  const router = useRouter();

  if (isLoading || !influencer) {
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

        <View style={styles.profile}>
          <Image
            source={{ uri: influencer.avatar_url || 'https://api.dicebear.com/7.x/avataaars/png?seed=default' }}
            style={styles.avatar}
          />
          <View style={styles.nameRow}>
            <Text style={styles.name}>{influencer.display_name}</Text>
            {influencer.is_verified && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
          </View>
          <Text style={styles.location}>{influencer.location}</Text>
          <AuthenticityBadge score={influencer.authenticity_score} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatFollowers(influencer.follower_count)}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{(influencer.engagement_rate * 100).toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Engagement</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatFollowers(influencer.avg_likes)}</Text>
            <Text style={styles.statLabel}>Avg Likes</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatFollowers(influencer.avg_comments)}</Text>
            <Text style={styles.statLabel}>Avg Comments</Text>
          </View>
        </View>

        <View style={styles.body}>
          {influencer.bio && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bio}>{influencer.bio}</Text>
            </Card>
          )}

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Platforms</Text>
            {influencer.instagram_handle && (
              <View style={styles.platformRow}>
                <Ionicons name="logo-instagram" size={20} color="#E4405F" />
                <Text style={styles.handle}>{influencer.instagram_handle}</Text>
              </View>
            )}
            {influencer.tiktok_handle && (
              <View style={styles.platformRow}>
                <Ionicons name="logo-tiktok" size={20} color="#000" />
                <Text style={styles.handle}>{influencer.tiktok_handle}</Text>
              </View>
            )}
            {influencer.youtube_handle && (
              <View style={styles.platformRow}>
                <Ionicons name="logo-youtube" size={20} color="#FF0000" />
                <Text style={styles.handle}>{influencer.youtube_handle}</Text>
              </View>
            )}
          </Card>

          {influencer.categories && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.tags}>
                {influencer.categories.map((c) => <Badge key={c} label={c} />)}
              </View>
            </Card>
          )}

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Audience</Text>
            <View style={styles.audienceRow}>
              <Text style={styles.audienceLabel}>Top Country</Text>
              <Text style={styles.audienceValue}>{influencer.audience_top_country || 'N/A'}</Text>
            </View>
            <View style={styles.audienceRow}>
              <Text style={styles.audienceLabel}>Age Range</Text>
              <Text style={styles.audienceValue}>{influencer.audience_age_range || 'N/A'}</Text>
            </View>
            <View style={styles.audienceRow}>
              <Text style={styles.audienceLabel}>Fake Followers</Text>
              <Text style={[styles.audienceValue, { color: influencer.fake_follower_pct > 30 ? colors.error : colors.success }]}>
                {influencer.fake_follower_pct.toFixed(1)}%
              </Text>
            </View>
          </Card>

          {influencer.price_per_post && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Pricing</Text>
              <Text style={styles.price}>${Number(influencer.price_per_post).toLocaleString()} / post</Text>
            </Card>
          )}

          <Button
            title="Save Influencer"
            onPress={() => saveInfluencer.mutate(influencer.id)}
            loading={saveInfluencer.isPending}
            size="lg"
            style={{ marginVertical: spacing.lg }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loader: { marginTop: 100 },
  backBtn: { padding: spacing.lg },
  profile: { alignItems: 'center', paddingBottom: spacing.lg },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.border, marginBottom: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  location: { fontSize: fontSize.md, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.sm },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.md,
    marginHorizontal: spacing.lg, backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  stat: { alignItems: 'center' },
  statValue: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  body: { padding: spacing.lg },
  section: { marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  bio: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 22 },
  platformRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  handle: { fontSize: fontSize.md, color: colors.text },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  audienceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderColor: colors.border },
  audienceLabel: { fontSize: fontSize.sm, color: colors.textSecondary },
  audienceValue: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text },
  price: { fontSize: fontSize.xl, fontWeight: '800', color: colors.primary },
});
