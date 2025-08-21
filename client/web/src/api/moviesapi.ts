import type { MovieCreate, MovieOut, MovieUpdate } from './types/movies';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data?.error?.message || data?.detail || data?.message || message;
    } catch {}
    throw new Error(message);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export const moviesApi = {
  getMovies(params?: { q?: string; genre?: string; is_premium?: boolean; limit?: number; offset?: number; order?: string }) {
    const qs = new URLSearchParams();
    if (params?.q) qs.set('q', params.q);
    if (params?.genre) qs.set('genre', params.genre);
    if (typeof params?.is_premium === 'boolean') qs.set('is_premium', String(params.is_premium));
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    if (params?.order) qs.set('order', params.order);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    return request<MovieOut[]>(`/movies${suffix}`);
  },
  getMovie(movieId: number) {
    return request<MovieOut>(`/movies/${movieId}`);
  },

  createMovie(payload: MovieCreate) {
    return request<MovieOut>('/movies', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateMovie(movieId: number, payload: MovieUpdate) {
    return request<MovieOut>(`/movies/${movieId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async uploadThumbnail(movieId: number, file: File) {
    const form = new FormData();
    form.append('file', file);

    const res = await fetch(`${BASE_URL}/movies/${movieId}/upload-thumbnail`, {
      method: 'POST',
      body: form,
      credentials: 'include',
      // Let browser set multipart boundary
    });

    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        message = data?.error?.message || data?.detail || data?.message || message;
      } catch {}
      throw new Error(message);
    }

    return res.json() as Promise<{ movie: MovieOut }>;
  },

  async uploadVideo(movieId: number, file: File) {
    const form = new FormData();
    form.append('file', file);

    const res = await fetch(`${BASE_URL}/movies/${movieId}/upload-video`, {
      method: 'POST',
      body: form,
      credentials: 'include',
      // Do NOT set Content-Type for FormData; browser will set multipart boundary
    });

    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        message = data?.error?.message || data?.detail || data?.message || message;
      } catch {}
      throw new Error(message);
    }

    return res.json() as Promise<{ video_url: string; playlist_filename: string }>
  },

  async uploadTrailer(movieId: number, file: File) {
    const form = new FormData();
    form.append('file', file);

    const res = await fetch(`${BASE_URL}/movies/${movieId}/upload-trailer`, {
      method: 'POST',
      body: form,
      credentials: 'include',
    });

    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try {
        const data = await res.json();
        message = data?.error?.message || data?.detail || data?.message || message;
      } catch {}
      throw new Error(message);
    }

    return res.json() as Promise<{ movie: MovieOut }>;
  },
};
