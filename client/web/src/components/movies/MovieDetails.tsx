import React from 'react';
import type { MovieOut } from '../../api/types/movies';
import { Button, Card, Badge } from '../../ui';

interface MovieDetailsProps {
  movie: MovieOut;
  onPlay?: () => void;
  showHero?: boolean;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onPlay, showHero = true }) => {
  const bgImage = movie.thumbnail_url || '';

  return (
    <div className="w-full">
      {showHero && (
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg border border-white/10 bg-black">
        {bgImage ? (
          <img
            src={bgImage}
            alt={movie.title}
            className="h-full w-full object-cover opacity-80"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#b3b3b3]">
            No thumbnail available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button size="lg" onClick={onPlay}>
            ▶ Play
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-extrabold drop-shadow-md">{movie.title}</h1>
        </div>
      </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="col-span-2 p-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#b3b3b3]">
            {movie.is_premium && <Badge variant="error">Premium</Badge>}
            {movie.genre && <Badge>{movie.genre}</Badge>}
            {movie.release_year && <span>• {movie.release_year}</span>}
            {movie.duration && <span>• {movie.duration} min</span>}
            {typeof movie.rating === 'number' && <span>• ⭐ {movie.rating}</span>}
          </div>
          {movie.description && (
            <p className="text-[#d1d1d1] leading-relaxed">{movie.description}</p>
          )}
        </Card>

        <Card className="p-6 space-y-2">
          <h3 className="text-lg font-semibold">Details</h3>
          <div className="text-sm text-[#b3b3b3] space-y-1">
            <div><span className="text-[#7a7a7a]">Title:</span> {movie.title}</div>
            <div><span className="text-[#7a7a7a]">Genre:</span> {movie.genre}</div>
            <div><span className="text-[#7a7a7a]">Year:</span> {movie.release_year ?? '—'}</div>
            <div><span className="text-[#7a7a7a]">Duration:</span> {movie.duration ? `${movie.duration} min` : '—'}</div>
            <div><span className="text-[#7a7a7a]">Rating:</span> {typeof movie.rating === 'number' ? movie.rating : '—'}</div>
            <div><span className="text-[#7a7a7a]">Premium:</span> {movie.is_premium ? 'Yes' : 'No'}</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MovieDetails;
