import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Input, Button, Checkbox, Form, Toast } from '../../ui';
import { useAuthStore } from '../../store/authstore';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const { signup, status, error, resetError } = useAuthStore();
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

    if (password !== confirmPassword) {
      addToast('warning', 'Passwords do not match.');
      return;
    }
    if (!agree) {
      addToast('warning', 'Please accept Terms & Privacy.');
      return;
    }

    try {
      await signup({ name, email, password, profile_picture: undefined });
      // Optionally show success toast
      addToast('success', 'Account created successfully.');
    } catch (err: any) {
      // error already in store; also show backend message
      const message = err?.message || 'Signup failed. Please try again.';
      addToast('error', message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-[#b3b3b3]">Join to explore the UI components.</p>
        </div>

        <Form onSubmit={onSubmit} className="space-y-5">
          <Input
            label="Full name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between">
            <Checkbox
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              label="I agree to Terms & Privacy"
            />
            <Link to="/auth/login" className="text-sm text-[#e50914] hover:underline">
              Have an account?
            </Link>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button type="submit" loading={isLoading} className="w-full">
            Create account
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
  );
};

export default Signup;

