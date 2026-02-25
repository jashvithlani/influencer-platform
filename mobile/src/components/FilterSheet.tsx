import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { colors, fontSize, spacing, borderRadius } from '../theme';

interface Filters {
  category?: string;
  min_followers?: string;
  max_followers?: string;
  min_engagement?: string;
  location?: string;
  platform?: string;
  sort_by?: string;
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, any>) => void;
  initialFilters?: Filters;
}

const CATEGORIES = ['fashion', 'beauty', 'fitness', 'food', 'travel', 'tech', 'gaming', 'lifestyle', 'music', 'sports'];
const PLATFORMS = ['instagram', 'tiktok', 'youtube'];
const SORT_OPTIONS = ['follower_count', 'engagement_rate', 'authenticity_score'];

export function FilterSheet({ visible, onClose, onApply, initialFilters = {} }: FilterSheetProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleApply = () => {
    const cleaned: Record<string, any> = {};
    if (filters.category) cleaned.category = filters.category;
    if (filters.min_followers) cleaned.min_followers = parseInt(filters.min_followers);
    if (filters.max_followers) cleaned.max_followers = parseInt(filters.max_followers);
    if (filters.min_engagement) cleaned.min_engagement = parseFloat(filters.min_engagement);
    if (filters.location) cleaned.location = filters.location;
    if (filters.platform) cleaned.platform = filters.platform;
    if (filters.sort_by) cleaned.sort_by = filters.sort_by;
    onApply(cleaned);
    onClose();
  };

  const ChipSelect = ({ options, selected, onSelect, label }: {
    options: string[];
    selected?: string;
    onSelect: (v: string | undefined) => void;
    label: string;
  }) => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.chips}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, selected === opt && styles.chipActive]}
            onPress={() => onSelect(selected === opt ? undefined : opt)}
          >
            <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <ChipSelect
            label="Category"
            options={CATEGORIES}
            selected={filters.category}
            onSelect={(v) => setFilters({ ...filters, category: v })}
          />

          <ChipSelect
            label="Platform"
            options={PLATFORMS}
            selected={filters.platform}
            onSelect={(v) => setFilters({ ...filters, platform: v })}
          />

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Followers</Text>
            <View style={styles.row}>
              <Input
                placeholder="Min"
                keyboardType="numeric"
                value={filters.min_followers}
                onChangeText={(v) => setFilters({ ...filters, min_followers: v })}
                style={styles.halfInput}
              />
              <Input
                placeholder="Max"
                keyboardType="numeric"
                value={filters.max_followers}
                onChangeText={(v) => setFilters({ ...filters, max_followers: v })}
                style={styles.halfInput}
              />
            </View>
          </View>

          <Input
            label="Min Engagement Rate"
            placeholder="e.g. 0.03"
            keyboardType="decimal-pad"
            value={filters.min_engagement}
            onChangeText={(v) => setFilters({ ...filters, min_engagement: v })}
          />

          <Input
            label="Location"
            placeholder="e.g. Los Angeles"
            value={filters.location}
            onChangeText={(v) => setFilters({ ...filters, location: v })}
          />

          <ChipSelect
            label="Sort By"
            options={SORT_OPTIONS}
            selected={filters.sort_by}
            onSelect={(v) => setFilters({ ...filters, sort_by: v })}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Reset"
            variant="outline"
            onPress={() => setFilters({})}
            style={{ flex: 1 }}
          />
          <Button
            title="Apply Filters"
            onPress={handleApply}
            style={{ flex: 2 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
});
