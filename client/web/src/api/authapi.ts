import type { AuthResponse, LoginRequest, SignupRequest, UserOut } from './types/auth';

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
      // Prefer centralized error envelope from server/main.py
      // { error: { message, code }, path, details? }
      message = data?.error?.message || data?.detail || data?.message || message;
    } catch {
      // ignore JSON parse failure
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export const authApi = {
  signup(payload: SignupRequest) {
    // POST /auth/signup -> AuthResponse (201)
    return request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login(payload: LoginRequest) {
    // POST /auth/login -> AuthResponse
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout() {
    // POST /auth/logout -> 204
    return request<void>('/auth/logout', { method: 'POST' });
  },

  me() {
    // GET /auth/me -> UserOut
    return request<UserOut>('/auth/me', { method: 'GET' });
  },
};