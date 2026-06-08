'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-blue-600">
            CollegeCompass
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/colleges" className="text-sm font-medium text-gray-600 hover:text-blue-600">
              Colleges
            </Link>
            <Link href="/compare" className="text-sm font-medium text-gray-600 hover:text-blue-600">
              Compare
            </Link>
            {session && (
              <Link href="/saved" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                Saved Colleges
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : session ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-sm text-gray-700 font-medium">
                Hi, {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
