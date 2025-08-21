import React from 'react';
import type { PropsWithChildren } from 'react';

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

export default AuthLayout;
