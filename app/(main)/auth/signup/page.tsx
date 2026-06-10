'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';

// Client-side validation schema matching SignupSchema + confirm password check
const ClientSignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormFields = z.infer<typeof ClientSignupSchema>;

export default function SignUpPage() {
  const router = useRouter();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [K in keyof FormFields]?: string }>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setLoading(true);

    // Client-side Zod validation
    const result = ClientSignupSchema.safeParse({ name, email, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: { [K in keyof FormFields]?: string } = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof FormFields;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGlobalError(data.error || 'Registration failed');
      } else {
        router.push('/auth/signin?registered=true');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setGlobalError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Create an Account</h1>
          <p className="text-sm font-medium text-gray-500">
            Sign up below to start saving colleges and comparing profiles
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
          {globalError && (
            <div className="rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700">
              ⚠️ {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`block w-full rounded-xl border px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full rounded-xl border px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors ${
                  errors.email ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="name@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full rounded-xl border px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors ${
                  errors.password ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="•••••••• (Min. 6 chars)"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`block w-full rounded-xl border px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-xs font-semibold text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-bold text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
