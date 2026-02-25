import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useAuth } from '../../src/hooks/useAuth';
import api from '../../src/api/client';
import { colors, fontSize, spacing } from '../../src/theme';
import type { InfluencerProfile } from '../../src/types/api';

export default function ProfileEditScreen() {
  const { profile, loadUser } = useAuth();
  const inf = profile as InfluencerProfile | null;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    display_name: inf?.display_name || '',
    bio: inf?.bio || '',
    location: inf?.location || '',
    instagram_handle: inf?.instagram_handle || '',
    tiktok_handle: inf?.tiktok_handle || '',
    youtube_handle: inf?.youtube_handle || '',
    price_per_post: inf?.price_per_post?.toString() || '',
  });

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const payload: Record<string, any> = {};
      if (form.display_name) payload.display_name = form.display_name;
      if (form.bio) payload.bio = form.bio;
      if (form.location) payload.location = form.location;
      if (form.instagram_handle) payload.instagram_handle = form.instagram_handle;
      if (form.tiktok_handle) payload.tiktok_handle = form.tiktok_handle;
      if (form.youtube_handle) payload.youtube_handle = form.youtube_handle;
      if (form.price_per_post) payload.price_per_post = parseFloat(form.price_per_post);

      await api.put('/api/v1/influencers/me', payload);
      await loadUser();
      router.back();
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Input label="Display Name" value={form.display_name} onChangeText={(v) => update('display_name', v)} />
          <Input label="Bio" value={form.bio} onChangeText={(v) => update('bio', v)} multiline numberOfLines={3} />
          <Input label="Location" placeholder="City, Country" value={form.location} onChangeText={(v) => update('location', v)} />
          <Input label="Instagram Handle" placeholder="@username" value={form.instagram_handle} onChangeText={(v) => update('instagram_handle', v)} />
          <Input label="TikTok Handle" placeholder="@username" value={form.tiktok_handle} onChangeText={(v) => update('tiktok_handle', v)} />
          <Input label="YouTube Handle" placeholder="@username" value={form.youtube_handle} onChangeText={(v) => update('youtube_handle', v)} />
          <Input label="Price Per Post ($)" placeholder="500" keyboardType="numeric" value={form.price_per_post} onChangeText={(v) => update('price_per_post', v)} />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Save Changes" onPress={handleSave} loading={loading} size="lg" style={{ marginBottom: spacing.xxl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderColor: colors.border,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  body: { flex: 1, padding: spacing.lg },
  error: { color: colors.error, fontSize: fontSize.sm, textAlign: 'center', marginBottom: spacing.md },
});
