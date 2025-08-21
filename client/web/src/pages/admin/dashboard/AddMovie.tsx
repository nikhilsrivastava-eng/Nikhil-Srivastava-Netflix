import React from 'react';
import { Card } from '../../../ui';
import AddMovieForm from '../../../components/movies/AddMovieForm';

const DashboardAddMovie: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card className="p-0 bg-transparent border-none">
        <AddMovieForm />
      </Card>
    </div>
  );
};

export default DashboardAddMovie;
