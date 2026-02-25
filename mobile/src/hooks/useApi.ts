import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import type {
  InfluencerProfile,
  Campaign,
  Application,
  PaginatedResponse,
  NaturalSearchResponse,
} from '../types/api';

export function useInfluencers(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['influencers', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<InfluencerProfile>>(
        '/api/v1/influencers',
        { params }
      );
      return data;
    },
  });
}

export function useInfluencer(id: string) {
  return useQuery({
    queryKey: ['influencer', id],
    queryFn: async () => {
      const { data } = await api.get<InfluencerProfile>(`/api/v1/influencers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCampaigns(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Campaign>>(
        '/api/v1/campaigns',
        { params }
      );
      return data;
    },
  });
}

export function useMyCampaigns() {
  return useQuery({
    queryKey: ['my-campaigns'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Campaign>>('/api/v1/campaigns/mine');
      return data;
    },
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const { data } = await api.get<Campaign>(`/api/v1/campaigns/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useApplications(campaignId: string) {
  return useQuery({
    queryKey: ['applications', campaignId],
    queryFn: async () => {
      const { data } = await api.get<Application[]>(`/api/v1/campaigns/${campaignId}/applications`);
      return data;
    },
    enabled: !!campaignId,
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const { data } = await api.get<Application[]>('/api/v1/influencers/me/applications');
      return data;
    },
  });
}

export function useSavedInfluencers() {
  return useQuery({
    queryKey: ['saved-influencers'],
    queryFn: async () => {
      const { data } = await api.get<InfluencerProfile[]>('/api/v1/brands/me/saved');
      return data;
    },
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Record<string, any>) => {
      const { data } = await api.post<Campaign>('/api/v1/campaigns', body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-campaigns'] }),
  });
}

export function useApplyToCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ campaignId, pitch }: { campaignId: string; pitch?: string }) => {
      const { data } = await api.post<Application>(`/api/v1/campaigns/${campaignId}/apply`, { pitch });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-applications'] }),
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      campaignId,
      applicationId,
      status,
    }: {
      campaignId: string;
      applicationId: string;
      status: string;
    }) => {
      const { data } = await api.put<Application>(
        `/api/v1/campaigns/${campaignId}/applications/${applicationId}`,
        { status }
      );
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['applications', vars.campaignId] }),
  });
}

export function useSaveInfluencer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (influencerId: string) => {
      await api.post(`/api/v1/brands/me/saved/${influencerId}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-influencers'] }),
  });
}

export function useUnsaveInfluencer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (influencerId: string) => {
      await api.delete(`/api/v1/brands/me/saved/${influencerId}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-influencers'] }),
  });
}

export function useNaturalSearch() {
  return useMutation({
    mutationFn: async (query: string) => {
      const { data } = await api.post<NaturalSearchResponse>('/api/v1/search/natural', { query });
      return data;
    },
  });
}
