import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { moviesApi } from '../api/moviesapi';
import type { MovieOut } from '../api/types/movies';
import { Button, Loading, Card } from '../ui';
import MovieDetails from '../components/movies/MovieDetails';
import VideoPlayer from '../components/movies/VideoPlayer';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const mid = Number(id);
        if (!mid) throw new Error('Invalid movie id');
        const data = await moviesApi.getMovie(mid);
        if (mounted) setMovie(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load movie');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => { mounted = false; };
  }, [id]);

  // Video playback handled by VideoPlayer.

  return (
    <MainLayout>
      <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading && (
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        )}
        {!loading && error && (
          <Card className="p-6 text-[#b3b3b3]">
            <div className="text-red-400 font-semibold mb-2">{error}</div>
            <div>Try refreshing or go back to home.</div>
          </Card>
        )}
        {!loading && movie && (
          <>
            <VideoPlayer
              src={movie.video_url || ''}
              poster={movie.thumbnail_url}
              className="mb-6"
            />
            <MovieDetails movie={movie} showHero={false} />
          </>
        )}
      </main>
      </div>
    </MainLayout>
  );
};

export default MovieDetailsPage;
