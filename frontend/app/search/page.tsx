'use client'
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../theme-toggle';
import { SearchIcon, UserIcon } from 'lucide-react';
import axios from '../api/axiosInstance';
import Link from 'next/link';
import Image from "next/image";

interface User {
  _id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
}

export default function SearchUsers() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setError('Please enter at least 2 characters to search');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const response = await axios.get(`/auth/search?query=${encodeURIComponent(searchQuery.trim())}`);
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err: any) {
      setError('Failed to search users');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-950 dark:border-amber-200 mx-auto"></div>
          <p className="mt-4 text-amber-800 dark:text-amber-200">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200 dark:from-gray-900 dark:to-gray-800">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-amber-100/90 dark:bg-gray-800/90 shadow-sm">
        <div className="text-xl font-bold text-amber-950 dark:text-amber-50">Quotely</div>
        <nav className="flex items-center space-x-3">
          <Link href="/" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
            Home
          </Link>
          <Link href="/quoteinput" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
            Add Quote
          </Link>
          <Link href="/personalcollection" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
            My Collection
          </Link>
          <Link href="/profile" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
            Profile
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* PAGE HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-950 dark:text-amber-50 mb-4 flex items-center justify-center space-x-3">
            <SearchIcon className="w-8 h-8" />
            <span>Search Users</span>
          </h1>
          <p className="text-amber-700 dark:text-amber-300">
            Find other users and explore their quote collections
          </p>
        </div>

        {/* SEARCH FORM */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-amber-200 dark:border-gray-600">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username..."
                className="w-full px-4 py-3 rounded-lg border border-amber-200 dark:border-gray-600 bg-amber-50 dark:bg-gray-700 text-amber-900 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="px-6 py-3 bg-amber-950 dark:bg-amber-200 text-amber-50 dark:text-gray-900 font-medium rounded-lg hover:bg-amber-900 dark:hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <SearchIcon className="w-5 h-5" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </form>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* SEARCH RESULTS */}
        {hasSearched && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-amber-200 dark:border-gray-600 overflow-hidden">
            <div className="p-6 border-b border-amber-200 dark:border-gray-600">
              <h2 className="text-xl font-semibold text-amber-950 dark:text-amber-50">
                Search Results
              </h2>
              <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                {loading ? 'Searching...' : `Found ${users.length} user${users.length === 1 ? '' : 's'}`}
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-950 dark:border-amber-200 mx-auto"></div>
              </div>
            ) : users.length > 0 ? (
              <div className="divide-y divide-amber-200 dark:divide-gray-600">
                {users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserClick(user._id)}
                    className="p-6 hover:bg-amber-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {/* USER AVATAR */}
                      <div className="w-12 h-12 rounded-full bg-amber-200 dark:bg-gray-600 border-2 border-amber-300 dark:border-gray-500 overflow-hidden flex-shrink-0">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-amber-800 dark:text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* USER INFO */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-amber-950 dark:text-amber-50 truncate">
                            {user.username}
                          </h3>
                        </div>
                        <p className="text-amber-700 dark:text-amber-300 text-sm truncate">
                          {user.email}
                        </p>
                        <p className="text-amber-600 dark:text-amber-400 text-xs mt-1">
                          Member since {formatDate(user.createdAt)}
                        </p>
                      </div>

                      {/* ARROW INDICATOR */}
                      <div className="text-amber-600 dark:text-amber-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <UserIcon className="w-16 h-16 text-amber-400 dark:text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  No Users Found
                </h3>
                <p className="text-amber-700 dark:text-amber-300">
                  Try searching with a different username
                </p>
              </div>
            )}
          </div>
        )}

        {/* HELP TEXT */}
        {!hasSearched && (
          <div className="text-center mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md mx-auto border border-amber-200 dark:border-gray-600">
              <SearchIcon className="w-12 h-12 text-amber-400 dark:text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3">
                Discover Users
              </h3>
              <p className="text-amber-700 dark:text-amber-300 text-sm">
                Search for users by their username to explore their quote collections, like their quotes, and leave comments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}