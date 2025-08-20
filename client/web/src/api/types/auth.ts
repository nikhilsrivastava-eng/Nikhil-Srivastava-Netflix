// Types mirrored from server schema for client use
// Server references:
// - server/schema/auth.py (LoginRequest, AuthResponse)
// - server/schema/user.py (UserOut)

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  name: string;
  password: string;
  profile_picture?: string | null;
}

export interface UserOut {
  id: number;
  email: string;
  name: string;
  profile_picture?: string | null;
  role: string;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export interface AuthResponse {
  access_token: string;
  token_type: 'bearer';
  user: UserOut;
  issued_at: string; // ISO datetime
  message?: string;
}
