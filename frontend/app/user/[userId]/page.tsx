'use client'
import { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../theme-toggle';
import { QuoteIcon, HeartIcon, MessageCircleIcon, UserIcon, SendIcon, EditIcon, Trash2Icon, CheckIcon, XIcon } from 'lucide-react';
import axios from '../../api/axiosInstance';
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

interface Comment {
  _id: string;
  userId: {
    _id: string;
    username: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
}

interface Quote {
  _id: string;
  content: string;
  author: string;
  userId: User;
  likes: string[];
  likeCount: number;
  comments: Comment[];
  createdAt: string;
}

export default function PublicProfile() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentInputs, setCommentInputs] = useState<{[key: string]: string}>({});
  const [submittingComments, setSubmittingComments] = useState<{[key: string]: boolean}>({});
  const [editingComments, setEditingComments] = useState<{[key: string]: boolean}>({});
  const [editCommentInputs, setEditCommentInputs] = useState<{[key: string]: string}>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const userId = params.userId as string;

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch user profile and quotes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !userId) return;
      
      try {
        // Fetch user profile
        const profileResponse = await axios.get(`/auth/public-profile/${userId}`);
        if (profileResponse.data.success) {
          setUser(profileResponse.data.user);
        }

        // Fetch user's quotes
        const quotesResponse = await axios.get(`/quote/user/${userId}`);
        if (quotesResponse.data.success) {
          setQuotes(quotesResponse.data.data);
        }
      } catch (err: any) {
        setError('Failed to load user data');
        console.error('Fetch user data error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && userId) {
      fetchUserData();
    }
  }, [isAuthenticated, userId]);

  // Get current user ID for edit permissions
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get('/auth/profile');
        if (response.data.success) {
          setCurrentUserId(response.data.user._id);
        }
      } catch (err) {
        console.error('Failed to get current user:', err);
      }
    };

    if (isAuthenticated) {
      getCurrentUser();
    }
  }, [isAuthenticated]);

  const handleLikeQuote = async (quoteId: string) => {
    try {
      const response = await axios.post(`/quote/${quoteId}/like`);
      if (response.data.success) {
        setQuotes(prev => prev.map(quote => 
          quote._id === quoteId 
            ? { 
                ...quote, 
                likeCount: response.data.likeCount,
                likes: response.data.hasLiked 
                  ? [...quote.likes, 'currentUser'] 
                  : quote.likes.filter(id => id !== 'currentUser')
              }
            : quote
        ));
      }
    } catch (err: any) {
      console.error('Like quote error:', err);
    }
  };

  const handleCommentChange = (quoteId: string, value: string) => {
    setCommentInputs(prev => ({ ...prev, [quoteId]: value }));
  };

  const handleSubmitComment = async (quoteId: string) => {
    const content = commentInputs[quoteId]?.trim();
    if (!content) return;

    setSubmittingComments(prev => ({ ...prev, [quoteId]: true }));

    try {
      const response = await axios.post(`/quote/${quoteId}/comment`, { content });
      if (response.data.success) {
        setQuotes(prev => prev.map(quote => 
          quote._id === quoteId 
            ? { ...quote, comments: [...quote.comments, response.data.comment] }
            : quote
        ));
        setCommentInputs(prev => ({ ...prev, [quoteId]: '' }));
      }
    } catch (err: any) {
      console.error('Comment error:', err);
    } finally {
      setSubmittingComments(prev => ({ ...prev, [quoteId]: false }));
    }
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingComments(prev => ({ ...prev, [commentId]: true }));
    setEditCommentInputs(prev => ({ ...prev, [commentId]: currentContent }));
  };

  const handleCancelEdit = (commentId: string) => {
    setEditingComments(prev => ({ ...prev, [commentId]: false }));
    setEditCommentInputs(prev => ({ ...prev, [commentId]: '' }));
  };

  const handleSaveEdit = async (quoteId: string, commentId: string) => {
    const content = editCommentInputs[commentId]?.trim();
    if (!content) return;

    try {
      const response = await axios.put(`/quote/${quoteId}/comment/${commentId}`, { content });
      if (response.data.success) {
        setQuotes(prev => prev.map(quote => 
          quote._id === quoteId 
            ? {
                ...quote, 
                comments: quote.comments.map(comment => 
                  comment._id === commentId 
                    ? response.data.comment
                    : comment
                )
              }
            : quote
        ));
        setEditingComments(prev => ({ ...prev, [commentId]: false }));
        setEditCommentInputs(prev => ({ ...prev, [commentId]: '' }));
      }
    } catch (err: any) {
      console.error('Edit comment error:', err);
    }
  };

  const handleDeleteComment = async (quoteId: string, commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await axios.delete(`/quote/${quoteId}/comment/${commentId}`);
      if (response.data.success) {
        setQuotes(prev => prev.map(quote => 
          quote._id === quoteId 
            ? {
                ...quote, 
                comments: quote.comments.filter(comment => comment._id !== commentId)
              }
            : quote
        ));
      }
    } catch (err: any) {
      console.error('Delete comment error:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-950 dark:border-amber-200 mx-auto"></div>
          <p className="mt-4 text-amber-800 dark:text-amber-200">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h1>
          <p className="text-amber-800 dark:text-amber-200 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-amber-950 dark:bg-amber-200 text-amber-50 dark:text-gray-900 rounded-lg hover:bg-amber-900 dark:hover:bg-amber-100 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200 dark:from-gray-900 dark:to-gray-800">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-amber-100/90 dark:bg-gray-800/90 shadow-sm">
        <div className="text-xl font-bold text-amber-950 dark:text-amber-50">Quotely</div>
        <nav className="flex items-center space-x-3">
          <Link  href="/" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
            Home
          </Link>
          <Link href="/search" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
            Search Users
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
        {/* USER PROFILE HEADER */}
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-amber-200 dark:border-gray-600">
            <div className="flex items-center space-x-6">
              {/* USER AVATAR */}
              <div className="w-20 h-20 rounded-full bg-amber-200 dark:bg-gray-600 border-4 border-amber-300 dark:border-gray-500 overflow-hidden flex-shrink-0">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-amber-800 dark:text-gray-300" />
                  </div>
                )}
              </div>

              {/* USER INFO */}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-amber-950 dark:text-amber-50 mb-2">
                  {user.username}
                </h1>
                <p className="text-amber-700 dark:text-amber-300 mb-2">
                  {user.email}
                </p>
                <p className="text-amber-600 dark:text-amber-400 text-sm">
                  Member since {formatDate(user.createdAt)}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                    {quotes.length} {quotes.length === 1 ? 'Quote' : 'Quotes'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QUOTES SECTION */}
        <div className="space-y-6">
          {quotes.length > 0 ? (
            quotes.map((quote) => (
              <div
                key={quote._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-amber-200 dark:border-gray-600"
              >
                {/* QUOTE CONTENT */}
                <div className="mb-4">
                  <QuoteIcon className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-3" />
                  <blockquote className="text-amber-900 dark:text-amber-100 text-lg italic leading-relaxed mb-3">
                    &ldquo;{quote.content}&rdquo;
                  </blockquote>
                  <p className="text-amber-700 dark:text-amber-300 font-medium text-right">
                    — {quote.author}
                  </p>
                </div>

                {/* QUOTE ACTIONS */}
                <div className="border-t border-amber-200 dark:border-gray-600 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {/* LIKE BUTTON */}
                      <button
                        onClick={() => handleLikeQuote(quote._id)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <HeartIcon 
                          className={`w-5 h-5 ${
                            quote.likes.includes('currentUser') 
                              ? 'text-red-500 fill-current' 
                              : 'text-amber-600 dark:text-amber-400'
                          }`} 
                        />
                        <span className="text-amber-700 dark:text-amber-300 text-sm">
                          {quote.likeCount || 0}
                        </span>
                      </button>

                      {/* COMMENT COUNT */}
                      <div className="flex items-center space-x-2">
                        <MessageCircleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <span className="text-amber-700 dark:text-amber-300 text-sm">
                          {quote.comments?.length || 0}
                        </span>
                      </div>
                    </div>

                    <p className="text-amber-600 dark:text-amber-400 text-sm">
                      {formatDate(quote.createdAt)}
                    </p>
                  </div>

                  {/* COMMENTS SECTION */}
                  {quote.comments && quote.comments.length > 0 && (
                    <div className="mb-4 space-y-3">
                      {quote.comments.map((comment) => {
                        const canEditComment = currentUserId === comment.userId._id;
                        const canDeleteComment = currentUserId === comment.userId._id || currentUserId === quote.userId._id;
                        
                        return (
                          <div key={comment._id} className="bg-amber-50 dark:bg-gray-700 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                                  {comment.userId.username}
                                </p>
                                
                                {editingComments[comment._id] ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={editCommentInputs[comment._id] || ''}
                                      onChange={(e) => setEditCommentInputs(prev => ({ ...prev, [comment._id]: e.target.value }))}
                                      className="w-full px-3 py-2 rounded border border-amber-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-amber-900 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"
                                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(quote._id, comment._id)}
                                    />
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleSaveEdit(quote._id, comment._id)}
                                        className="flex items-center space-x-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                                      >
                                        <CheckIcon className="w-3 h-3" />
                                        <span>Save</span>
                                      </button>
                                      <button
                                        onClick={() => handleCancelEdit(comment._id)}
                                        className="flex items-center space-x-1 px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
                                      >
                                        <XIcon className="w-3 h-3" />
                                        <span>Cancel</span>
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-amber-800 dark:text-amber-200 mt-1">
                                      {comment.content}
                                    </p>
                                    <p className="text-amber-600 dark:text-amber-400 text-xs mt-1">
                                      {formatDate(comment.createdAt)}
                                      {comment.updatedAt && (
                                        <span className="ml-2 text-amber-500 dark:text-amber-400">
                                          (edited)
                                        </span>
                                      )}
                                    </p>
                                  </>
                                )}
                              </div>
                              
                              {!editingComments[comment._id] && (canEditComment || canDeleteComment) && (
                                <div className="flex space-x-2 ml-2">
                                  {canEditComment && (
                                    <button
                                      onClick={() => handleEditComment(comment._id, comment.content)}
                                      className="p-1 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                                      title="Edit comment"
                                    >
                                      <EditIcon className="w-3 h-3" />
                                    </button>
                                  )}
                                  {canDeleteComment && (
                                    <button
                                      onClick={() => handleDeleteComment(quote._id, comment._id)}
                                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                      title="Delete comment"
                                    >
                                      <Trash2Icon className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ADD COMMENT */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={commentInputs[quote._id] || ''}
                      onChange={(e) => handleCommentChange(quote._id, e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 rounded-lg border border-amber-200 dark:border-gray-600 bg-amber-50 dark:bg-gray-700 text-amber-900 dark:text-amber-100 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none text-sm"
                      disabled={submittingComments[quote._id]}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment(quote._id)}
                    />
                    <button
                      onClick={() => handleSubmitComment(quote._id)}
                      disabled={!commentInputs[quote._id]?.trim() || submittingComments[quote._id]}
                      className="px-4 py-2 bg-amber-950 dark:bg-amber-200 text-amber-50 dark:text-gray-900 rounded-lg hover:bg-amber-900 dark:hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <SendIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* EMPTY STATE */
            <div className="text-center py-16">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 max-w-md mx-auto border border-amber-200 dark:border-gray-600">
                <QuoteIcon className="w-16 h-16 text-amber-400 dark:text-amber-500 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4">
                  No Quotes Yet
                </h3>
                <p className="text-amber-700 dark:text-amber-300">
                  This user hasn`&apos;`t posted any quotes yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}