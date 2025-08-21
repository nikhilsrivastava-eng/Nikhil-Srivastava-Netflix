export type MovieGenre =
  | 'Action'
  | 'Drama'
  | 'Comedy'
  | 'Thriller'
  | 'Horror'
  | 'Sci-Fi'
  | 'Romance'
  | 'Documentary'
  | 'Animation'
  | 'Adventure'
  | 'Fantasy'
  | 'Crime'
  | 'Mystery'
  | 'Family';

export interface MovieCreate {
  title: string;
  description?: string;
  genre: MovieGenre;
  release_year?: number;
  duration?: number; // minutes
  rating?: number; // 0..5
  video_url?: string;
  thumbnail_url?: string;
  trailer_url?: string;
  is_premium?: boolean;
}

export interface MovieUpdate {
  title?: string;
  description?: string | null;
  genre?: MovieGenre;
  release_year?: number | null;
  duration?: number | null; // minutes
  rating?: number | null; // 0..5
  video_url?: string | null;
  thumbnail_url?: string | null;
  trailer_url?: string | null;
  is_premium?: boolean;
}

export interface MovieOut {
  id: number;
  title: string;
  description?: string | null;
  genre: string; // server returns string
  release_year?: number | null;
  duration?: number | null;
  rating?: number | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  trailer_url?: string | null;
  is_premium: boolean;
  created_at: string; // ISO
  updated_at: string; // ISO
}
