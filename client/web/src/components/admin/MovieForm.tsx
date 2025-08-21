import React, { useMemo, useRef, useState } from 'react';
import { Button, Card, Dropdown, Input, Slider, Textarea, Checkbox } from '../../ui';
import type { MovieCreate, MovieOut, MovieUpdate, MovieGenre } from '../../api/types/movies';
import { moviesApi } from '../../api/moviesapi';

export interface MovieFormValues {
  title: string;
  description?: string;
  genre: MovieGenre | '';
  release_year?: number | '';
  duration?: number | '';
  rating?: number | '';
  is_premium?: boolean;
  thumbnail_url?: string;
  video_url?: string;
  trailer_url?: string;
}

export interface MovieFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<MovieFormValues>;
  disabled?: boolean;
  onSubmit: (values: MovieCreate | MovieUpdate) => Promise<void> | void;
  movieId?: number; // required when mode === 'edit' for uploads
}

const toFormValues = (m?: MovieOut | Partial<MovieFormValues>): MovieFormValues => ({
  title: m?.title || '',
  description: (m as any)?.description || '',
  genre: ((m as any)?.genre as MovieGenre) || '',
  release_year: (m as any)?.release_year ?? '',
  duration: (m as any)?.duration ?? '',
  rating: (m as any)?.rating ?? '',
  is_premium: (m as any)?.is_premium ?? false,
  thumbnail_url: (m as any)?.thumbnail_url || '',
  video_url: (m as any)?.video_url || '',
  trailer_url: (m as any)?.trailer_url || '',
});

const MovieForm: React.FC<MovieFormProps> = ({ mode, initialValues, onSubmit, disabled, movieId }) => {
  const [values, setValues] = useState<MovieFormValues>(() => toFormValues(initialValues as any));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadingTrailer, setUploadingTrailer] = useState(false);
  const [thumbName, setThumbName] = useState<string>('');
  const [videoName, setVideoName] = useState<string>('');

  const thumbInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const genreOptions = useMemo(() => ([
    { value: '', label: 'Select Genre' },
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

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload: any = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        genre: values.genre || undefined,
        release_year: values.release_year === '' ? undefined : Number(values.release_year),
        duration: values.duration === '' ? undefined : Number(values.duration),
        rating: values.rating === '' ? undefined : Number(values.rating),
        is_premium: !!values.is_premium,
        thumbnail_url: values.thumbnail_url || undefined,
        video_url: values.video_url || undefined,
        trailer_url: values.trailer_url || undefined,
      } as MovieCreate | MovieUpdate;
      await onSubmit(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const onTrailerFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!movieId || !e.target.files?.[0]) return;
    setError(null); setUploadMsg(null); setUploadingTrailer(true);
    try {
      const res = await moviesApi.uploadTrailer(movieId, e.target.files[0]);
      const nextUrl = res?.movie?.trailer_url;
      if (nextUrl) {
        setValues(v => ({ ...v, trailer_url: nextUrl }));
        setUploadMsg('Trailer uploaded');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to upload trailer');
    } finally {
      setUploadingTrailer(false);
      e.target.value = '';
    }
  };

  const onThumbFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!movieId || !e.target.files?.[0]) return;
    setThumbName(e.target.files[0].name || '');
    setError(null); setUploadMsg(null); setUploadingThumb(true);
    try {
      const res = await moviesApi.uploadThumbnail(movieId, e.target.files[0]);
      const nextThumb = res?.movie?.thumbnail_url;
      if (nextThumb) {
        setValues(v => ({ ...v, thumbnail_url: nextThumb }));
        setUploadMsg('Thumbnail uploaded');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to upload thumbnail');
    } finally {
      setUploadingThumb(false);
      // reset input value so same file can be re-selected if needed
      e.target.value = '';
    }
  };

  const onVideoFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!movieId || !e.target.files?.[0]) return;
    setVideoName(e.target.files[0].name || '');
    setError(null); setUploadMsg(null); setUploadingVideo(true);
    try {
      const res = await moviesApi.uploadVideo(movieId, e.target.files[0]);
      if (res?.video_url) {
        setValues(v => ({ ...v, video_url: res.video_url }));
        setUploadMsg('Video uploaded');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Card className="p-3 text-sm text-red-400 border-red-500/30">{error}</Card>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Title" placeholder="Movie title" required value={values.title} onChange={(e) => setValues(v => ({ ...v, title: e.target.value }))} />
        <Dropdown label="Genre" options={genreOptions} value={values.genre} onChange={(val) => setValues(v => ({ ...v, genre: val as MovieGenre }))} />
        <Input label="Release Year" type="number" placeholder="2024" value={values.release_year as any} onChange={(e) => setValues(v => ({ ...v, release_year: e.target.value === '' ? '' : Number(e.target.value) }))} />
        <Input label="Duration (min)" type="number" placeholder="120" value={values.duration as any} onChange={(e) => setValues(v => ({ ...v, duration: e.target.value === '' ? '' : Number(e.target.value) }))} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Textarea label="Description" placeholder="Synopsis..." value={values.description} onChange={(e) => setValues(v => ({ ...v, description: e.target.value }))} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Rating: {values.rating || 0}</label>
          <Slider min={0} max={5} step={1} value={Number(values.rating || 0)} onChange={(val: number) => setValues(v => ({ ...v, rating: val }))} />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Checkbox checked={!!values.is_premium} onChange={(e: any) => setValues(v => ({ ...v, is_premium: e.target.checked }))} />
          <span className="text-sm text-white">Premium</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Thumbnail URL" placeholder="https://..." value={values.thumbnail_url} onChange={(e) => setValues(v => ({ ...v, thumbnail_url: e.target.value }))} />
        <Input label="Video URL" placeholder="https://..." value={values.video_url} onChange={(e) => setValues(v => ({ ...v, video_url: e.target.value }))} />
      </div>

      {mode === 'edit' && (
        <Card className="p-4 border-white/10">
          <div className="text-sm font-medium text-white mb-3">Upload Assets</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm text-[#b3b3b3]">Thumbnail</label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="secondary" onClick={() => thumbInputRef.current?.click()} disabled={disabled || uploadingThumb}>
                  Upload Thumbnail
                </Button>
                <span className="text-xs text-[#b3b3b3] truncate">{thumbName || 'No file selected'}</span>
              </div>
              <input ref={thumbInputRef} className="hidden" type="file" accept="image/*" onChange={onThumbFileChange} />
              {uploadingThumb && <div className="text-xs text-[#b3b3b3]">Uploading thumbnail...</div>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-[#b3b3b3]">Movie</label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="secondary" onClick={() => videoInputRef.current?.click()} disabled={disabled || uploadingVideo}>
                  Upload Movie
                </Button>
                <span className="text-xs text-[#b3b3b3] truncate">{videoName || 'No file selected'}</span>
              </div>
              <input ref={videoInputRef} className="hidden" type="file" accept="video/*" onChange={onVideoFileChange} />
              {uploadingVideo && <div className="text-xs text-[#b3b3b3]">Uploading video...</div>}
            </div>
            
          </div>
          {uploadMsg && <div className="mt-2 text-xs text-green-400">{uploadMsg}</div>}
        </Card>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={disabled || submitting}>{mode === 'create' ? 'Create Movie' : 'Save Changes'}</Button>
      </div>
    </form>
  );
};

export default MovieForm;
