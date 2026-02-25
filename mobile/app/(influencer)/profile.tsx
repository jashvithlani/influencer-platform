import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../src/components/ui/Card';
import { Badge } from '../../src/components/ui/Badge';
import { Button } from '../../src/components/ui/Button';
import { AuthenticityBadge } from '../../src/components/AuthenticityBadge';
import { useAuth } from '../../src/hooks/useAuth';
import { colors, fontSize, spacing, borderRadius } from '../../src/theme';
import type { InfluencerProfile } from '../../src/types/api';

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export default function ProfileScreen() {
  const { profile } = useAuth();
  const inf = profile as InfluencerProfile | null;
  const router = useRouter();

  if (!inf) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: inf.avatar_url || 'https://api.dicebear.com/7.x/avataaars/png?seed=default' }}
            style={styles.avatar}
          />
          <View style={styles.nameRow}>
            <Text style={styles.name}>{inf.display_name}</Text>
            {inf.is_verified && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
          </View>
          <Text style={styles.location}>{inf.location || 'No location set'}</Text>
          <AuthenticityBadge score={inf.authenticity_score} />
        </View>

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
            <Text style={styles.statValue}>{formatFollowers(inf.avg_likes)}</Text>
            <Text style={styles.statLabel}>Avg Likes</Text>
          </View>
        </View>

        <View style={styles.body}>
          {inf.bio && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Bio</Text>
              <Text style={styles.bio}>{inf.bio}</Text>
            </Card>
          )}

          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Social Platforms</Text>
            {inf.instagram_handle && (
              <View style={styles.platformRow}>
                <Ionicons name="logo-instagram" size={20} color="#E4405F" />
                <Text style={styles.handle}>{inf.instagram_handle}</Text>
              </View>
            )}
            {inf.tiktok_handle && (
              <View style={styles.platformRow}>
                <Ionicons name="logo-tiktok" size={20} color="#000" />
                <Text style={styles.handle}>{inf.tiktok_handle}</Text>
              </View>
            )}
            {inf.youtube_handle && (
              <View style={styles.platformRow}>
                <Ionicons name="logo-youtube" size={20} color="#FF0000" />
                <Text style={styles.handle}>{inf.youtube_handle}</Text>
              </View>
            )}
          </Card>

          {inf.categories && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.tags}>
                {inf.categories.map((c) => <Badge key={c} label={c} />)}
              </View>
            </Card>
          )}

          {inf.price_per_post && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Pricing</Text>
              <Text style={styles.price}>${Number(inf.price_per_post).toLocaleString()} per post</Text>
            </Card>
          )}

          <Button
            title="Edit Profile"
            variant="outline"
            onPress={() => router.push('/(influencer)/profile-edit')}
            size="lg"
            style={{ marginTop: spacing.md }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xxl },
  profileHeader: { alignItems: 'center', paddingTop: spacing.lg, paddingBottom: spacing.md },
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
  price: { fontSize: fontSize.xl, fontWeight: '800', color: colors.primary },
});
