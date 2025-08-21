import React from 'react';
import { Card, Badge, Button } from '../../ui';
import type { MovieOut } from '../../api/types/movies';
import { useNavigate } from 'react-router-dom';

interface Props {
  movie: MovieOut;
}

export const AdminMovieCard: React.FC<Props> = ({ movie }) => {
  const navigate = useNavigate();
  const rating = Math.max(0, Math.min(5, Math.round((movie.rating || 0))));

  return (
    <Card className="overflow-hidden bg-black/50 border-white/10 hover:border-white/20 transition-colors">
      <div className="aspect-[16/10] w-full bg-[#111]">
        {movie.thumbnail_url ? (
          <img
            src={movie.thumbnail_url}
            alt={movie.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[#666] text-sm">
            No Poster
          </div>
        )}
      </div>

      <div className="p-2.5 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate" title={movie.title}>{movie.title}</h3>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#b3b3b3]">
              <span>{movie.genre}</span>
              {movie.release_year ? <>
                <span>•</span>
                <span>{movie.release_year}</span>
              </> : null}
            </div>
          </div>
          {movie.is_premium ? (
            <Badge variant="error" className="shrink-0">Premium</Badge>
          ) : (
            <Badge variant="default" className="shrink-0">Free</Badge>
          )}
        </div>

        <div className="flex items-center gap-0.5 text-yellow-400" aria-label={`Rating ${rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 20 20" className={`h-3.5 w-3.5 ${i < rating ? 'fill-yellow-400' : 'fill-transparent stroke-yellow-400/60'}`}> 
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.062 3.277a1 1 0 00.95.69h3.445c.969 0 1.371 1.24.588 1.81l-2.787 2.025a1 1 0 00-.364 1.118l1.063 3.277c.3.921-.755 1.688-1.538 1.118l-2.787-2.025a1 1 0 00-1.175 0l-2.787 2.025c-.783.57-1.838-.197-1.538-1.118l1.063-3.277a1 1 0 00-.364-1.118L2.904 8.704c-.783-.57-.38-1.81.588-1.81h3.445a1 1 0 00.95-.69l1.062-3.277z"/>
            </svg>
          ))}
        </div>

        <div className="pt-1">
          <Button
            size="sm"
            onClick={() => navigate(`/admin/dashboard/editmovie/${movie.id}`)}
            className="w-full"
          >
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AdminMovieCard;
