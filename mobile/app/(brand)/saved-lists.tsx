import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InfluencerCard } from '../../src/components/InfluencerCard';
import { useSavedInfluencers, useUnsaveInfluencer } from '../../src/hooks/useApi';
import { colors, fontSize, spacing } from '../../src/theme';

export default function SavedListsScreen() {
  const { data, isLoading } = useSavedInfluencers();
  const unsave = useUnsaveInfluencer();
  const router = useRouter();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Creators</Text>
        <Text style={styles.count}>{data?.length || 0} saved</Text>
      </View>
      <FlatList
        data={data || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InfluencerCard
            influencer={item}
            onPress={() => router.push(`/(brand)/influencer/${item.id}`)}
            onSave={() => unsave.mutate(item.id)}
            isSaved={true}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No saved influencers yet. Search and save creators you like!</Text>}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, marginBottom: spacing.md },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  count: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.xs },
  list: { padding: spacing.lg },
  loader: { marginTop: spacing.xxl },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.xxl, paddingHorizontal: spacing.lg },
});
