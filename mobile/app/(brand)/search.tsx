import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InfluencerCard } from '../../src/components/InfluencerCard';
import { FilterSheet } from '../../src/components/FilterSheet';
import { useInfluencers, useNaturalSearch, useSaveInfluencer, useSavedInfluencers } from '../../src/hooks/useApi';
import { colors, fontSize, spacing, borderRadius } from '../../src/theme';

export default function SearchScreen() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [nlQuery, setNlQuery] = useState('');
  const router = useRouter();
  const { data, isLoading } = useInfluencers(filters);
  const nlSearch = useNaturalSearch();
  const saveInfluencer = useSaveInfluencer();
  const { data: savedList } = useSavedInfluencers();
  const savedIds = new Set(savedList?.map((i) => i.id) || []);

  const handleNLSearch = () => {
    if (!nlQuery.trim()) return;
    nlSearch.mutate(nlQuery);
  };

  const displayData = nlSearch.data?.results || data?.items || [];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Creators</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="sparkles" size={18} color={colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Try: fashion influencers in LA with 100k+ followers"
            placeholderTextColor={colors.textLight}
            value={nlQuery}
            onChangeText={setNlQuery}
            onSubmitEditing={handleNLSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {nlSearch.data && (
        <View style={styles.nlInfo}>
          <Text style={styles.nlText}>AI interpreted: {JSON.stringify(nlSearch.data.interpreted_filters)}</Text>
        </View>
      )}

      {(isLoading || nlSearch.isPending) ? (
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={displayData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InfluencerCard
              influencer={item}
              onPress={() => router.push(`/(brand)/influencer/${item.id}`)}
              onSave={() => saveInfluencer.mutate(item.id)}
              isSaved={savedIds.has(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No influencers found. Try adjusting your filters.</Text>}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={(f) => { setFilters(f); nlSearch.reset(); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  searchRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: borderRadius.md, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  searchInput: { flex: 1, marginLeft: spacing.sm, paddingVertical: spacing.md - 2, fontSize: fontSize.sm, color: colors.text },
  filterBtn: {
    width: 48, height: 48, borderRadius: borderRadius.md, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  nlInfo: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  nlText: { fontSize: fontSize.xs, color: colors.textSecondary, fontStyle: 'italic' },
  list: { padding: spacing.lg },
  loader: { marginTop: spacing.xxl },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.xxl },
});
