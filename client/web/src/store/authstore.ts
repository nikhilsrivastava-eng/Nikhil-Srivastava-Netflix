import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '../api/authapi';
import type { AuthResponse, LoginRequest, SignupRequest, UserOut } from '../api/types/auth';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface AuthState {
  user: UserOut | null;
  accessToken: string | null;
  status: Status;
  error: string | null;

  login: (payload: LoginRequest) => Promise<AuthResponse>;
  signup: (payload: SignupRequest) => Promise<AuthResponse>;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
  resetError: () => void;
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,

  resetError: () => set({ error: null }),

  login: async (payload) => {
    set({ status: 'loading', error: null });
    try {
      const res: AuthResponse = await authApi.login(payload);
      console.log(res)
      set({ user: res.user, accessToken: res.access_token, status: 'succeeded' });
      return res;
    } catch (e: any) {
      set({ status: 'failed', error: e?.message || 'Login failed' });
      throw e;
    }
  },

  signup: async (payload) => {
    set({ status: 'loading', error: null });
    try {
      const res: AuthResponse = await authApi.signup(payload);
      set({ user: res.user, accessToken: res.access_token, status: 'succeeded' });
      return res;
    } catch (e: any) {
      set({ status: 'failed', error: e?.message || 'Signup failed' });
      throw e;
    }
  },

  fetchMe: async () => {
    set({ status: 'loading', error: null });
    try {
      const me = await authApi.me();
      set({ user: me, status: 'succeeded' });
    } catch (e: any) {
      set({ user: null, accessToken: null, status: 'failed', error: e?.message || 'Fetch me failed' });
      // Clear persisted auth on failed me() to avoid stale rehydration on refresh
      try {
        localStorage.removeItem('auth');
        localStorage.removeItem('zustand:auth');
      } catch {}
    }
  },

  logout: async () => {
    set({ status: 'loading', error: null });
    try {
      await authApi.logout();
      set({ user: null, accessToken: null, status: 'succeeded' });
      // Explicitly clear persisted storage so no stale details remain
      try {
        localStorage.removeItem('auth');
        localStorage.removeItem('zustand:auth');
      } catch {}
    } catch (e: any) {
      set({ status: 'failed', error: e?.message || 'Logout failed' });
      throw e;
    }
  },
}), {
  name: 'auth',
  storage: createJSONStorage(() => localStorage),
  // Do not persist user or token; we rely on HTTP-only cookie and /auth/me
  partialize: () => ({}),
  onRehydrateStorage: () => (state) => {
    // After rehydration, immediately sync with server
    try { state?.fetchMe?.(); } catch {}
  },
}));
