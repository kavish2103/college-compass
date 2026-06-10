'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useCompare } from '@/components/colleges/CompareContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { selectedColleges } = useCompare();

  // Navigation Interactive State
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus on path changes
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const compareCount = selectedColleges.length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Logo / Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-black text-blue-600 tracking-tight flex items-center gap-1.5 hover:opacity-90 transition-opacity">
            <span className="text-2xl">🧭</span>
            <span>CollegeCompass</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/colleges"
              className={`text-sm font-bold transition-colors ${
                pathname.startsWith('/colleges') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Colleges
            </Link>
            <Link
              href="/compare"
              className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/compare') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white shadow-sm ring-2 ring-white">
                  {compareCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Right Auth / Mobile Trigger */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {status === 'loading' ? (
              <span className="text-xs font-semibold text-gray-400">Loading...</span>
            ) : session ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Dropdown Trigger */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-gray-50 border border-transparent hover:border-gray-150 transition-all outline-none"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 font-extrabold flex items-center justify-center text-sm shadow-inner uppercase">
                    {session.user?.name?.slice(0, 2) || session.user?.email?.slice(0, 2) || 'US'}
                  </div>
                  <svg className={`h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Account Dropdown list */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="border-b border-gray-50 px-3 py-2 text-left mb-1">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Account</p>
                      <p className="text-xs font-bold text-gray-700 truncate">{session.user?.email}</p>
                    </div>
                    
                    <Link
                      href="/saved"
                      className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Saved Colleges
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="rounded-xl px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-50 md:hidden border border-transparent hover:border-gray-100 focus:outline-none transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <div className="relative">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {compareCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-600 text-[8px] font-black text-white ring-1 ring-white">
                    {compareCount}
                  </span>
                )}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer panel */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="space-y-1.5 px-4 py-4">
            <Link
              href="/colleges"
              className="flex items-center rounded-xl px-4 py-2.5 text-base font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Colleges
            </Link>
            <Link
              href="/compare"
              className="flex items-center justify-between rounded-xl px-4 py-2.5 text-base font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">
                  {compareCount}
                </span>
              )}
            </Link>
            
            {status === 'authenticated' && session ? (
              <>
                <Link
                  href="/saved"
                  className="flex items-center rounded-xl px-4 py-2.5 text-base font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Saved Colleges
                </Link>
                <div className="border-t border-gray-50 pt-2 mt-2">
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Signed In as</p>
                    <p className="text-sm font-bold text-gray-700 truncate">{session.user?.email}</p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full items-center rounded-xl px-4 py-2.5 text-left text-base font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : status === 'unauthenticated' ? (
              <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-4 mt-2">
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
