import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Input, Button, Checkbox, Form, Toast } from '../../ui';
import { useAuthStore } from '../../store/authstore';
import AuthLayout from '../../components/layout/AuthLayout';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const { login, status, error, resetError } = useAuthStore();
  const isLoading = status === 'loading';
  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string }>>([]);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    resetError();
    try {
      await login({ email, password });
      // Optionally handle remember flag here (e.g., persist email) if needed
      addToast('success', 'Signed in successfully.');
    } catch (err: any) {
      // error is already set in store; also show backend message
      const message = err?.message || 'Login failed. Please try again.';
      addToast('error', message);
    }
  };

  return (
    <AuthLayout>
    <div className="relative min-h-screen text-white">
      {/* Background image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/auth.jpg)' }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-black/60" />

      <div className="relative z-20 flex items-center justify-center p-6 min-h-screen">
        <Card className="w-full max-w-md p-8 backdrop-blur-sm bg-black/70 border-white/10">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Sign in</h1>
            <p className="text-sm text-[#b3b3b3]">Welcome back! Please enter your details.</p>
          </div>

          <Form onSubmit={onSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                label="Remember me"
              />
              <Link to="/auth/signup" className="text-sm text-[#e50914] hover:underline">
                Create account
              </Link>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" loading={isLoading} className="w-full">
              Sign in
            </Button>
          </Form>
        </Card>
        {/* Toast Container */}
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={removeToast}
              duration={3000}
            />
          ))}
        </div>
      </div>
    </div>
    </AuthLayout>
  );
};

export default Login;

