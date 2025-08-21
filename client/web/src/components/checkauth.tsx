import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loading from '../ui/Loading/Loading';
import { useAuthStore } from '../store/authstore';



const CheckAuth: React.FC = () => {
  const location = useLocation();
  const { user, status } = useAuthStore();

  const isAdminRoute = location.pathname.includes('/admin');
  const isAuthPage = location.pathname.includes('/auth');

  // While hydrating/me-check, show spinner
  if (status === 'loading') {
    return (
      <div className="flex justify-center py-8">
        <Loading text="Checking session..." />
      </div>
    );
  }

  if(isAuthPage&&user){
     if(user.role==='admin'){
      return <Navigate to="/admin/dashboard" replace state={{ from: location }} />;
     }else
     return <Navigate to="/movies" replace state={{ from: location }} />;
  }
  
  if (isAdminRoute) {
    // Require login
    if (!user) {
      return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }
    // Require admin role
    if (user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  }

  // Public routes or authorized admin
  return <Outlet/>
};

export default CheckAuth;