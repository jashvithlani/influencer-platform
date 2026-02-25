import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    profile: store.profile,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    register: store.register,
    logout: store.logout,
    loadUser: store.loadUser,
    isBrand: store.user?.role === 'brand',
    isInfluencer: store.user?.role === 'influencer',
  };
};
