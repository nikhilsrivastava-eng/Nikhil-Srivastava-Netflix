import {Routes, Route,} from 'react-router-dom'
import { useEffect } from 'react'
import UIShowcase from './pages/UIShowcase'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import AddMovie from './pages/admin/AddMovie'
import AdminDashboard from './pages/admin/AdminDashboard'
import DashboardMovies from './pages/admin/dashboard/Movies'
import DashboardAddMovie from './pages/admin/dashboard/AddMovie'
import DashboardPlans from './pages/admin/dashboard/Plans'
import DashboardEditMovie from './pages/admin/dashboard/EditMovie'
import DashboardAddPlan from './pages/admin/dashboard/AddPlan'
import MovieDetailsPage from './pages/MovieDetailsPage'
import { useAuthStore } from './store/authstore'
import CheckAuth from './components/checkauth';

function App() {
  // Always hydrate auth on first mount to avoid stale persisted state
  useEffect(() => {
    const s = useAuthStore.getState();
    s.fetchMe?.();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sample" element={<UIShowcase />} />
      <Route path="/movie/:id" element={<MovieDetailsPage />} />
      <Route path="/movies" element={<div>Movies</div>} />
      <Route element={<CheckAuth />}>
        {/* Standalone admin page example */}
        <Route path="/admin/addmovie" element={<AddMovie />} />
        {/* Admin dashboard with nested routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route index element={<DashboardMovies />} />
          <Route path="movies" element={<DashboardMovies />} />
          <Route path="addmovie" element={<DashboardAddMovie />} />
          <Route path="editmovie/:id" element={<DashboardEditMovie />} />
          <Route path="plans" element={<DashboardPlans />} />
          <Route path="addplan" element={<DashboardAddPlan />} />
        </Route>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
      </Route>
     
      
    </Routes>
  )
}

export default App
