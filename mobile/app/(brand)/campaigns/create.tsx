import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../../src/components/ui/Input';
import { Button } from '../../../src/components/ui/Button';
import { useCreateCampaign } from '../../../src/hooks/useApi';
import { colors, fontSize, spacing, borderRadius } from '../../../src/theme';

const CATEGORIES = ['fashion', 'beauty', 'fitness', 'food', 'travel', 'tech', 'gaming', 'lifestyle', 'music', 'sports'];
const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'any'];

export default function CreateCampaignScreen() {
  const [form, setForm] = useState({
    title: '', description: '', requirements: '', budget: '',
    price_per_influencer: '', category: 'lifestyle', platform: 'any',
    min_followers: '', min_engagement_rate: '', max_influencers: '', status: 'active',
  });
  const [error, setError] = useState('');
  const router = useRouter();
  const createCampaign = useCreateCampaign();

  const handleCreate = async () => {
    if (!form.title) { setError('Campaign title is required'); return; }
    setError('');
    try {
      const payload: Record<string, any> = {
        title: form.title, description: form.description || undefined,
        requirements: form.requirements || undefined, category: form.category,
        platform: form.platform, status: form.status,
      };
      if (form.budget) payload.budget = parseFloat(form.budget);
      if (form.price_per_influencer) payload.price_per_influencer = parseFloat(form.price_per_influencer);
      if (form.min_followers) payload.min_followers = parseInt(form.min_followers);
      if (form.max_influencers) payload.max_influencers = parseInt(form.max_influencers);
      await createCampaign.mutateAsync(payload);
      router.back();
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to create campaign');
    }
  };

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Campaign</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Input label="Campaign Title *" placeholder="e.g. Summer Glow Collection" value={form.title} onChangeText={(v) => update('title', v)} />
          <Input label="Description" placeholder="Describe your campaign..." value={form.description} onChangeText={(v) => update('description', v)} multiline numberOfLines={3} />
          <Input label="Requirements" placeholder="What do you need from influencers?" value={form.requirements} onChangeText={(v) => update('requirements', v)} multiline numberOfLines={3} />

          <Text style={styles.label}>Category</Text>
          <View style={styles.chips}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity key={c} style={[styles.chip, form.category === c && styles.chipActive]} onPress={() => update('category', c)}>
                <Text style={[styles.chipText, form.category === c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Platform</Text>
          <View style={styles.chips}>
            {PLATFORMS.map((p) => (
              <TouchableOpacity key={p} style={[styles.chip, form.platform === p && styles.chipActive]} onPress={() => update('platform', p)}>
                <Text style={[styles.chipText, form.platform === p && styles.chipTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}><Input label="Budget ($)" placeholder="25000" keyboardType="numeric" value={form.budget} onChangeText={(v) => update('budget', v)} /></View>
            <View style={{ flex: 1 }}><Input label="Per Influencer ($)" placeholder="5000" keyboardType="numeric" value={form.price_per_influencer} onChangeText={(v) => update('price_per_influencer', v)} /></View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}><Input label="Min Followers" placeholder="10000" keyboardType="numeric" value={form.min_followers} onChangeText={(v) => update('min_followers', v)} /></View>
            <View style={{ flex: 1 }}><Input label="Max Influencers" placeholder="5" keyboardType="numeric" value={form.max_influencers} onChangeText={(v) => update('max_influencers', v)} /></View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Create Campaign" onPress={handleCreate} loading={createCampaign.isPending} size="lg" style={{ marginBottom: spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderColor: colors.border },
  headerTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  body: { flex: 1, padding: spacing.lg },
  label: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  row: { flexDirection: 'row', gap: spacing.md },
  error: { color: colors.error, fontSize: fontSize.sm, textAlign: 'center', marginBottom: spacing.md },
});
