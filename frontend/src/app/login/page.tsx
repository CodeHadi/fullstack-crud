'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, isSetSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignUp ? '/api/auth/sign-up' : '/api/auth/sign-in';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Authentication failed');
      }

      const data = await response.json();
      
      await setSession({
        token: data.token,
        user: { email: email, id: email }
      });

      router.push('/todos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 opacity-5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md animate-in fade-in slide-in-from-top-8 duration-500">
        {/* Card */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-black bg-opacity-30 rounded-full mb-4">
              <span className="text-4xl">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-white">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-200 mt-2 text-sm">
              {isSignUp ? 'Join us to manage your tasks' : 'Sign in to your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-5 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition bg-gray-800 text-white placeholder-gray-500 hover:bg-gray-700"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition bg-gray-800 text-white placeholder-gray-500 hover:bg-gray-700"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900 bg-opacity-30 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-400 text-sm font-medium flex items-start">
                  <span className="mr-2">⚠️</span>
                  <span>{error}</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:from-gray-700 disabled:to-gray-600 text-black font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
              {loading && <span className="animate-spin">⏳</span>}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-800 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => isSetSignUp(!isSignUp)}
                className="text-cyan-400 font-semibold ml-2 hover:text-cyan-300 transition"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>

        {/* Guest Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-3">Or continue as guest:</p>
          <Link
            href="/todos"
            className="inline-block px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition duration-200 border border-gray-700 hover:border-cyan-500"
          >
            Guest Access →
          </Link>
        </div>
      </div>
    </div>
  );
}
