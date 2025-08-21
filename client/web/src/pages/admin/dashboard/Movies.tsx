import React, { useEffect, useMemo, useState } from 'react';
import { Card, Loading, Input, Dropdown, Button } from '../../../ui';
import { useMovieStore } from '../../../store/moviestore';
import AdminMovieCard from '../../../components/admin/MovieCard';

const DashboardMovies: React.FC = () => {
  const { items, status, error, load, params, setParams } = useMovieStore();
  const [q, setQ] = useState(params.q || '');
  const [genre, setGenre] = useState(params.genre || '');

  const genreOptions = useMemo(() => ([
    { value: '', label: 'All Genres' },
    { value: 'Action', label: 'Action' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Comedy', label: 'Comedy' },
    { value: 'Thriller', label: 'Thriller' },
    { value: 'Horror', label: 'Horror' },
    { value: 'Sci-Fi', label: 'Sci-Fi' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Documentary', label: 'Documentary' },
    { value: 'Animation', label: 'Animation' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Crime', label: 'Crime' },
    { value: 'Mystery', label: 'Mystery' },
    { value: 'Family', label: 'Family' },
  ]), []);

  useEffect(() => {
    if (status === 'idle') {
      load();
    }
  }, [status, load]);

  // Handlers
  const applyFilters = () => {
    const next = { ...params, q: q || undefined, genre: genre || undefined, offset: 0 };
    setParams(next);
    load(next);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') applyFilters();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search by title..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 105.324 11.03l3.173 3.173a.75.75 0 101.06-1.06l-3.173-3.174A6.75 6.75 0 0010.5 3.75zm-5.25 6.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>
        <div className="w-full sm:w-56">
          <Dropdown
            options={genreOptions}
            value={genre}
            onChange={(val) => setGenre(val)}
            placeholder="Filter by genre"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={applyFilters}>Apply</Button>
          {(q || genre) && (
            <Button variant="secondary" onClick={() => { setQ(''); setGenre(''); setParams({ ...params, q: undefined, genre: undefined, offset: 0 }); load({ q: undefined, genre: undefined, offset: 0 }); }}>Clear</Button>
          )}
        </div>
      </div>
    
      {status === 'loading' && (
        <div className="py-10 flex justify-center"><Loading /></div>
      )}

      {status === 'failed' && (
        <Card className="p-6 text-red-400 border-red-500/30">{error || 'Failed to load movies'}</Card>
      )}

      {status === 'succeeded' && items.length === 0 && (
        <Card className="p-6 text-[#b3b3b3]">No movies found.</Card>
      )}

      {status === 'succeeded' && items.length > 0 && (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((m) => (
            <AdminMovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardMovies;
