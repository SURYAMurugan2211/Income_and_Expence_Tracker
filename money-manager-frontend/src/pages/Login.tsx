import React, { useState } from 'react';
import { Input, Button } from '../components/common';
import { authService } from '../services/authService';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        await authService.register({ name, email, password });
        setError('');
        // Only call onLogin after successful registration
        onLogin();
      } else {
        await authService.login({ email, password });
        setError('');
        // Only call onLogin after successful login
        onLogin();
      }
    } catch (err: any) {
      // Show error message for wrong credentials
      const errorMessage = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(errorMessage);
      // Prevent form submission to avoid browser autosave prompt
      e.stopPropagation();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-primary-100 rounded-full mb-4">
            <span className="text-5xl">💰</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Money Manager</h1>
          <p className="text-gray-500">
            {isRegister ? 'Create your account' : 'Sign in to manage your finances'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete={error ? 'off' : 'on'}>
          {isRegister && (
            <Input
              label="Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              autoComplete="name"
            />
          )}

          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            autoComplete={isRegister ? 'new-password' : 'current-password'}
          />

          {!isRegister && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                Forgot password?
              </a>
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : (isRegister ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {isRegister ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;