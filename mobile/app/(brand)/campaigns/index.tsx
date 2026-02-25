import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CampaignCard } from '../../../src/components/CampaignCard';
import { Button } from '../../../src/components/ui/Button';
import { useMyCampaigns } from '../../../src/hooks/useApi';
import { colors, fontSize, spacing } from '../../../src/theme';

export default function CampaignsListScreen() {
  const { data, isLoading } = useMyCampaigns();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Campaigns</Text>
        <Button title="+ Create" size="sm" onPress={() => router.push('/(brand)/campaigns/create')} />
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={data?.items || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CampaignCard campaign={item} onPress={() => router.push(`/(brand)/campaigns/${item.id}`)} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.empty}>No campaigns yet.</Text>
              <Button title="Create Your First Campaign" onPress={() => router.push('/(brand)/campaigns/create')} />
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.md, marginBottom: spacing.md,
  },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  list: { padding: spacing.lg },
  loader: { marginTop: spacing.xxl },
  emptyContainer: { alignItems: 'center', marginTop: spacing.xxl, gap: spacing.md },
  empty: { textAlign: 'center', color: colors.textSecondary },
});
