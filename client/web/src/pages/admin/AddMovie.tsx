import AddMovieForm from '../../components/movies/AddMovieForm';
import MainLayout from '../../components/layout/MainLayout';

export default function AddMoviePage() {
  return (
    <MainLayout>
      <div className="p-6">
        <AddMovieForm />
      </div>
    </MainLayout>
  );
}
