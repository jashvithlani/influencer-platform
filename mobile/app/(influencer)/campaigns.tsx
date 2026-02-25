import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CampaignCard } from '../../src/components/CampaignCard';
import { useCampaigns } from '../../src/hooks/useApi';
import { colors, fontSize, spacing, borderRadius } from '../../src/theme';

const CATEGORIES = ['all', 'fashion', 'beauty', 'fitness', 'food', 'travel', 'tech', 'gaming', 'lifestyle'];

export default function InfluencerCampaignsScreen() {
  const [category, setCategory] = useState('all');
  const { data, isLoading } = useCampaigns(category !== 'all' ? { category } : undefined);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Campaigns</Text>
      </View>

      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tab, category === item && styles.tabActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.tabText, category === item && styles.tabTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
        style={styles.tabsContainer}
      />

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={data?.items || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CampaignCard
              campaign={item}
              onPress={() => router.push(`/(influencer)/campaign/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No campaigns available right now.</Text>}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  tabsContainer: { maxHeight: 50 },
  tabs: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  tab: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: fontSize.sm, color: colors.textSecondary },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  list: { padding: spacing.lg },
  loader: { marginTop: spacing.xxl },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.xxl },
});
