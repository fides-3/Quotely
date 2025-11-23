'use client'
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../theme-toggle';
import axios from '../api/axiosInstance';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt?: string;
}

export default function Profile() {
  const router = useRouter();
  const { auth, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', email: '', name: '' });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [quoteCount, setQuoteCount] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch user profile data and quote count
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isAuthenticated) return;
      
      try {
        // Fetch profile data
        const profileResponse = await axios.get('http://localhost:5000/auth/profile');
        if (profileResponse.data.success) {
          setUser(profileResponse.data.user);
          setEditForm({
            username: profileResponse.data.user.username || '',
            email: profileResponse.data.user.email || '',
            name: profileResponse.data.user.name || ''
          });
        }

        // Fetch quote count
        const quotesResponse = await axios.get('/quote/my-quotes');
        if (quotesResponse.data.success) {
          setQuoteCount(quotesResponse.data.count || 0);
        }
      } catch (err: any) {
        setError('Failed to load profile data');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfileData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
    if (!isEditing && user) {
      setEditForm({
        username: user.username || '',
        email: user.email || '',
        name: user.name || ''
      });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put('http://localhost:5000/auth/profile', editForm);
      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    setDeleteLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.delete('/auth/profile');
      if (response.data.success) {
        logout();
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete account');
      console.error('Profile delete error:', err);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUser(response.data.user);
        setSuccess('Profile picture updated successfully!');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload profile picture');
      console.error('Image upload error:', err);
    }
  };



  if (authLoading || loading) {
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
          <a href="/" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
            Home
          </a>
          <a href="/quoteinput" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
            Add Quote
          </a>
          <a href="/personalcollection" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
            My Collection
          </a>
          <a href="/search" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
            Search Users
          </a>
          <ThemeToggle />
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          
          {/* PROFILE HEADER */}
          <div className="relative bg-gradient-to-r from-amber-100 to-amber-200 dark:from-gray-700 dark:to-gray-600 px-6 md:px-8 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              
              {/* PROFILE PICTURE */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-amber-200 dark:bg-gray-600 border-4 border-white dark:border-gray-300 shadow-lg overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl md:text-4xl font-bold text-amber-800 dark:text-gray-300">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* CAMERA ICON */}
                <button
                  onClick={() => document.getElementById('profilePictureInput')?.click()}
                  className="absolute bottom-0 right-0 bg-amber-950 dark:bg-amber-200 text-amber-50 dark:text-gray-900 rounded-full p-2 shadow-lg hover:bg-amber-900 dark:hover:bg-amber-100 transition-colors"
                  title="Change profile picture"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                
                {/* HIDDEN FILE INPUT */}
                <input
                  id="profilePictureInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* USER INFO */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-amber-950 dark:text-amber-50 mb-1">
                      {user?.username || 'User'}
                    </h1>
                    <p className="text-amber-700 dark:text-amber-300">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleEditToggle}
                    className="mt-2 md:mt-0 px-4 py-2 bg-amber-200 dark:bg-amber-600 text-amber-950 dark:text-amber-50 rounded-lg hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors text-sm font-medium"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>
                {user?.createdAt && (
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CONTENT SECTIONS */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* ERROR/SUCCESS MESSAGES */}
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* PROFILE DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ACCOUNT INFO / EDIT FORM */}
              <div className="bg-amber-100 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-amber-950 dark:text-amber-50 mb-4">
                  {isEditing ? 'Edit Profile' : 'Account Information'}
                </h2>
                
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-amber-800 dark:text-amber-200 block mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={editForm.username}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-amber-800 dark:text-amber-200 block mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-amber-200 dark:border-gray-500 bg-amber-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="w-full py-2 bg-amber-950 dark:bg-amber-200 text-amber-50 dark:text-gray-900 font-medium rounded-lg hover:bg-amber-900 dark:hover:bg-amber-100 transition-colors disabled:opacity-50"
                    >
                      {updateLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-amber-800 dark:text-amber-200">Username</label>
                      <p className="text-amber-950 dark:text-amber-50 bg-white dark:bg-gray-600 rounded px-3 py-2 mt-1">
                        {user?.username}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-amber-800 dark:text-amber-200">Email</label>
                      <p className="text-amber-950 dark:text-amber-50 bg-amber-50 dark:bg-gray-600 rounded px-3 py-2 mt-1">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* USER STATS */}
              <div className="bg-amber-100 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-amber-950 dark:text-amber-50 mb-4">
                  Account Stats
                </h2>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-amber-50 dark:bg-gray-600 rounded-lg cursor-pointer hover:bg-amber-100 dark:hover:bg-gray-500 transition-colors" onClick={() => router.push('/personalcollection')}>
                    <div className="text-2xl font-bold text-amber-950 dark:text-amber-50">{quoteCount}</div>
                    <div className="text-sm text-amber-700 dark:text-amber-300">Quotes Posted</div>
                    {quoteCount > 0 && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">Click to view</div>
                    )}
                  </div>
                  {user?.createdAt && (
                    <div className="text-center p-4 bg-amber-50 dark:bg-gray-600 rounded-lg">
                      <div className="text-lg font-bold text-amber-950 dark:text-amber-50">
                        {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-sm text-amber-700 dark:text-amber-300">Days as Member</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* LOGOUT SECTION */}
            <div className="border-t border-amber-200 dark:border-gray-600 pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-medium text-amber-950 dark:text-amber-50">Account Actions</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Manage your account settings
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 bg-amber-950 dark:bg-amber-200 text-amber-50 dark:text-gray-900 font-medium rounded-lg hover:bg-amber-900 dark:hover:bg-amber-100 transition-colors"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
              Delete Account
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
