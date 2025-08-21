import React, { useEffect, useState } from 'react';
import { Card, Loading } from '../../../ui';
import { useParams } from 'react-router-dom';
import { moviesApi } from '../../../api/moviesapi';
import type { MovieOut, MovieUpdate } from '../../../api/types/movies';
import MovieForm from '../../../components/admin/MovieForm';

const DashboardEditMovie: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieOut | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      setStatus('loading');
      setError(null);
      setMessage(null);
      try {
        const data = await moviesApi.getMovie(Number(id));
        setMovie(data);
        setStatus('succeeded');
      } catch (e: any) {
        setError(e?.message || 'Failed to load movie');
        setStatus('failed');
      }
    };
    fetchMovie();
  }, [id]);

  const handleSubmit = async (payload: MovieUpdate) => {
    if (!id) return;
    setError(null);
    setMessage(null);
    try {
      const updated = await moviesApi.updateMovie(Number(id), payload);
      setMovie(updated);
      setMessage('Changes saved');
    } catch (e: any) {
      setError(e?.message || 'Failed to save changes');
      throw e;
    }
  };

  return (
    <div className="space-y-4">
      {status === 'loading' && (
        <div className="py-10 flex justify-center"><Loading /></div>
      )}

      {status === 'failed' && (
        <Card className="p-6 text-red-400 border-red-500/30">{error || 'Failed to load movie'}</Card>
      )}

      {status === 'succeeded' && movie && (
        <>
          <Card className="p-6">
            <div className="text-xl font-semibold text-white mb-4">Edit Movie</div>
            <MovieForm
              mode="edit"
              initialValues={{
                title: movie.title,
                description: movie.description ?? '',
                genre: movie.genre as any,
                release_year: movie.release_year ?? '',
                duration: movie.duration ?? '',
                rating: movie.rating ?? '',
                is_premium: movie.is_premium,
                thumbnail_url: movie.thumbnail_url ?? '',
                video_url: movie.video_url ?? '',
                trailer_url: movie.trailer_url ?? '',
              }}
              movieId={Number(id)}
              onSubmit={handleSubmit}
            />
          </Card>
          {message && <Card className="p-3 text-green-400 border-green-500/30">{message}</Card>}
          {error && <Card className="p-3 text-red-400 border-red-500/30">{error}</Card>}
        </>
      )}
    </div>
  );
};

export default DashboardEditMovie;
