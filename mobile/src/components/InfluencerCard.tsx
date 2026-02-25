import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { AuthenticityBadge } from './AuthenticityBadge';
import { colors, fontSize, spacing, borderRadius } from '../theme';
import type { InfluencerProfile } from '../types/api';

interface InfluencerCardProps {
  influencer: InfluencerProfile;
  onPress: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

export function InfluencerCard({ influencer, onPress, onSave, isSaved }: InfluencerCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Image
            source={{ uri: influencer.avatar_url || 'https://api.dicebear.com/7.x/avataaars/png?seed=default' }}
            style={styles.avatar}
          />
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{influencer.display_name}</Text>
              {influencer.is_verified && (
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              )}
            </View>
            <Text style={styles.location} numberOfLines={1}>
              {influencer.location || 'Unknown location'}
            </Text>
          </View>
          {onSave && (
            <TouchableOpacity onPress={onSave} style={styles.saveBtn}>
              <Ionicons
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isSaved ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatFollowers(influencer.follower_count)}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{(influencer.engagement_rate * 100).toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Engagement</Text>
          </View>
          <View style={styles.stat}>
            <AuthenticityBadge score={influencer.authenticity_score} size="sm" />
            <Text style={styles.statLabel}>Authenticity</Text>
          </View>
        </View>

        {influencer.categories && influencer.categories.length > 0 && (
          <View style={styles.categories}>
            {influencer.categories.slice(0, 3).map((cat) => (
              <Badge key={cat} label={cat} />
            ))}
          </View>
        )}

        {influencer.price_per_post && (
          <Text style={styles.price}>
            ${Number(influencer.price_per_post).toLocaleString()} / post
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  location: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  saveBtn: {
    padding: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
});
