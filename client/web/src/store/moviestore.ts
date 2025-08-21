import { create } from 'zustand';
import { moviesApi } from '../api/moviesapi';
import type { MovieOut } from '../api/types/movies';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface MovieState {
  items: MovieOut[];
  status: Status;
  error: string | null;
  params: { q?: string; genre?: string; is_premium?: boolean; limit?: number; offset?: number; order?: string };
  setParams: (p: Partial<MovieState['params']>) => void;
  load: (overrideParams?: Partial<MovieState['params']>) => Promise<void>;
}

export const useMovieStore = create<MovieState>()((set, get) => ({
  items: [],
  status: 'idle',
  error: null,
  params: { limit: 40, offset: 0, order: 'newest' },
  setParams: (p) => set((s) => ({ params: { ...s.params, ...p } })),
  load: async (overrideParams) => {
    set({ status: 'loading', error: null });
    try {
      const params = { ...get().params, ...(overrideParams || {}) };
      const movies = await moviesApi.getMovies(params);
      set({ items: movies, status: 'succeeded', params });
    } catch (e: any) {
      set({ status: 'failed', error: e?.message || 'Failed to load movies' });
    }
  },
}));
