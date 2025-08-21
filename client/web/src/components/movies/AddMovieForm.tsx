import React, { useMemo, useState } from 'react';
import { Button, Card, Form, Input, Textarea, Dropdown, Checkbox } from '../../ui';
import type { MovieCreate, MovieGenre, MovieOut } from '../../api/types/movies';
import { moviesApi } from '../../api/moviesapi';

const GENRES: MovieGenre[] = [
  'Action','Drama','Comedy','Thriller','Horror','Sci-Fi','Romance','Documentary','Animation','Adventure','Fantasy','Crime','Mystery','Family'
];

type Props = {
  onCreated?: (movie: MovieOut) => void;
};

export default function AddMovieForm({ onCreated }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState<MovieGenre>('Action');
  const [releaseYear, setReleaseYear] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [isPremium, setIsPremium] = useState<boolean>(false);

  const [thumbName, setThumbName] = useState<string>('');
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoName, setVideoName] = useState<string>('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const payload: MovieCreate = useMemo(() => ({
    title,
    description: description || undefined,
    genre,
    release_year: releaseYear ? Number(releaseYear) : undefined,
    duration: duration ? Number(duration) : undefined,
    rating: rating ? Number(rating) : undefined,
    is_premium: isPremium,
    // thumbnail_url intentionally omitted; thumbnail upload flow TBD
  }), [title, description, genre, releaseYear, duration, rating, isPremium]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    try {
      setSubmitting(true);
      const movie = await moviesApi.createMovie(payload);
      setSuccess('Movie created.');
      if (thumbFile) {
        await moviesApi.uploadThumbnail(movie.id, thumbFile);
        setSuccess('Movie created and thumbnail uploaded.');
      }
      if (videoFile) {
        await moviesApi.uploadVideo(movie.id, videoFile);
        setSuccess('Movie created, thumbnail and video uploaded.');
      }
      onCreated?.(movie);
    } catch (err: any) {
      setError(err?.message || 'Failed to create movie');
    } finally {
      setSubmitting(false);
    }
  }

  function onPickThumb() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const f = input.files?.[0] || null;
      setThumbFile(f);
      setThumbName(f ? f.name : '');
    };
    input.click();
  }

  function onPickVideo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = () => {
      const f = input.files?.[0] || null;
      setVideoFile(f);
      setVideoName(f ? f.name : '');
    };
    input.click();
  }

  return (
    <Card className="max-w-3xl mx-auto p-6 space-y-6 bg-[#141414] border border-white/10">
      <h1 className="text-2xl font-bold">Add Movie</h1>

      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-500 text-sm">{success}</div>}

      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Title" placeholder="Enter movie title" value={title} onChange={e => setTitle(e.target.value)} required />
          <Dropdown
            label="Genre"
            options={GENRES.map(g => ({ label: g, value: g }))}
            value={genre}
            onChange={(val) => setGenre(val as MovieGenre)}
          />
          <Input label="Release Year" type="number" placeholder="e.g., 2023" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} />
          <Input label="Duration (min)" type="number" placeholder="e.g., 120" value={duration} onChange={e => setDuration(e.target.value)} />
          <Input label="Rating (0-5)" type="number" step="0.1" min={0} max={5} placeholder="e.g., 4.5" value={rating} onChange={e => setRating(e.target.value)} />
          <div className="flex items-center gap-3 mt-7">
            <Checkbox checked={isPremium} onChange={e => setIsPremium(e.target.checked)} />
            <span>Premium</span>
          </div>
        </div>

        <Textarea label="Description" placeholder="Brief description" value={description} onChange={e => setDescription(e.target.value)} />

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2">Thumbnail</label>
            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" onClick={onPickThumb}>Upload Thumbnail</Button>
              <span className="text-sm text-[#b3b3b3] truncate">{thumbName || 'No file selected'}</span>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2">Movie</label>
            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" onClick={onPickVideo}>Upload Movie</Button>
              <span className="text-sm text-[#b3b3b3] truncate">{videoName || 'No file selected'}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" loading={submitting}>Add Movie</Button>
        </div>
      </Form>
    </Card>
  );
}
