import React, { type PropsWithChildren } from 'react';
import Navbar from '../Navbar';

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
