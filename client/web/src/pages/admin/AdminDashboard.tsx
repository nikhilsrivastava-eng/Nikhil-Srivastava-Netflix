import React from 'react';
import { Outlet } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Sidebar from '../../components/admin/Sidebar';

const AdminDashboard: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex min-h-screen">
        <Sidebar />
        <section className="flex-1 p-6">
          <div className="w-full">
            <Outlet />
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
