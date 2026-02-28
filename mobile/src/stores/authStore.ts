import { create } from 'zustand';
import { getItem, setItem, deleteItem } from '../api/storage';
import api from '../api/client';
import type { User, InfluencerProfile, BrandProfile, MeResponse } from '../types/api';

interface AuthState {
  user: User | null;
  profile: InfluencerProfile | BrandProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string, extra?: Record<string, string>) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { data } = await api.post('/api/v1/auth/login', { email, password });
    await setItem('access_token', data.access_token);
    await setItem('refresh_token', data.refresh_token);
    const me = await api.get<MeResponse>('/api/v1/auth/me');
    set({ user: me.data.user, profile: me.data.profile, isAuthenticated: true });
  },

  register: async (email, password, role, extra = {}) => {
    const { data } = await api.post('/api/v1/auth/register', {
      email,
      password,
      role,
      ...extra,
    });
    await setItem('access_token', data.access_token);
    await setItem('refresh_token', data.refresh_token);
    const me = await api.get<MeResponse>('/api/v1/auth/me');
    set({ user: me.data.user, profile: me.data.profile, isAuthenticated: true });
  },

  logout: async () => {
    await deleteItem('access_token');
    await deleteItem('refresh_token');
    set({ user: null, profile: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      const token = await getItem('access_token');
      if (token) {
        const { data } = await api.get<MeResponse>('/api/v1/auth/me');
        set({ user: data.user, profile: data.profile, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
