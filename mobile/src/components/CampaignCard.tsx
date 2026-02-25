import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { colors, fontSize, spacing } from '../theme';
import type { Campaign } from '../types/api';

interface CampaignCardProps {
  campaign: Campaign;
  onPress: () => void;
}

const platformIcons: Record<string, string> = {
  instagram: 'logo-instagram',
  tiktok: 'logo-tiktok',
  youtube: 'logo-youtube',
  any: 'globe-outline',
};

const statusColors: Record<string, { color: string; bg: string }> = {
  active: { color: colors.success, bg: colors.success + '15' },
  draft: { color: colors.textSecondary, bg: colors.border },
  paused: { color: colors.warning, bg: colors.warning + '15' },
  completed: { color: colors.primary, bg: colors.primaryLight + '15' },
};

export function CampaignCard({ campaign, onPress }: CampaignCardProps) {
  const sc = statusColors[campaign.status] || statusColors.draft;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.platformIcon}>
            <Ionicons
              name={(platformIcons[campaign.platform] || 'globe-outline') as any}
              size={20}
              color={colors.primary}
            />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.title} numberOfLines={2}>{campaign.title}</Text>
            {campaign.brand_name && (
              <Text style={styles.brand}>{campaign.brand_name}</Text>
            )}
          </View>
          <Badge label={campaign.status} color={sc.color} backgroundColor={sc.bg} />
        </View>

        {campaign.description && (
          <Text style={styles.description} numberOfLines={2}>
            {campaign.description}
          </Text>
        )}

        <View style={styles.meta}>
          {campaign.budget && (
            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>${Number(campaign.budget).toLocaleString()}</Text>
            </View>
          )}
          {campaign.category && (
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{campaign.category}</Text>
            </View>
          )}
          {campaign.application_count != null && (
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaText}>{campaign.application_count} applicants</Text>
            </View>
          )}
        </View>
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
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primaryLight + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  brand: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
