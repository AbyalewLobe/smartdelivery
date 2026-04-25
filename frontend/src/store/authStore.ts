import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  _hasHydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

// Separate computed properties
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      _hasHydrated: false,
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ user, accessToken, refreshToken, _hasHydrated: true });
      },
      updateUser: (user) => {
        set({ user });
      },
      logout: () => {
        localStorage.clear();
        set({ user: null, accessToken: null, refreshToken: null });
      }
    }),
    { 
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.log('Rehydration error:', error);
          } else {
            console.log('Rehydration complete:', state);
            if (state) {
              state._hasHydrated = true;
            }
          }
        };
      }
    }
  )
);

// Initialize hydration flag on mount
useAuthStore.persist.onFinishHydration((state) => {
  console.log('Hydration finished:', state);
  state._hasHydrated = true;
});

// Helper functions for computed values
export const useIsAuthenticated = () => {
  const user = useAuthStore((state) => state.user);
  return !!user;
};

export const useIsAdmin = () => {
  const user = useAuthStore((state) => state.user);
  return user?.role === 'admin';
};
