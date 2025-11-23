"use client"
import {useState, useEffect} from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from "../theme-toggle";
import { QuoteIcon, UserIcon, SendIcon } from "lucide-react";
import axios from '../api/axiosInstance'

export default function QuoteInput() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    setError('')
    setSuccess('')
    
    try{
        const res = await axios.post('/quote/createQuote', {content, author});
        if(res.data.success){
            setSuccess('Quote saved successfully to your collection!');
            setContent("")
            setAuthor("")
        }
    }catch(error: any){
        console.error("Error submitting quote:", error);
        setError(error.response?.data?.error || 'Failed to save quote');
    } finally {
        setLoading(false)
    }
  }   
     

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      
      {/* --- Header --- */}
      <header className="flex items-center justify-between px-6 py-3 bg-amber-100/90 dark:bg-gray-800/90 shadow-lg sticky top-0 z-10">
        <div className="text-xl font-bold text-amber-950 dark:text-amber-50">Quotely</div>
        <nav className="flex items-center space-x-3">
          <a href="/" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 transition duration-150">Home</a>
          <a href="/personalcollection" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 transition duration-150">My Collection</a>
          <a href="/search" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 transition duration-150">Search Users</a>
          <a href="/profile" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 transition duration-150">Profile</a>
          <ThemeToggle />
        </nav>
      </header>
      
      {/* --- Main Content Area for Quote Input --- */}
      <main className="flex flex-grow items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white/70 dark:bg-gray-700/80 p-8 rounded-xl shadow-2xl backdrop-blur-sm border border-amber-200 dark:border-gray-600">
          
          <h1 className="text-3xl font-extrabold text-center mb-8 text-amber-900 dark:text-amber-100 flex items-center justify-center space-x-3">
            <QuoteIcon className="w-7 h-7" />
            <span>Submit Your Quote</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Quote Textarea Field */}
            <div>
              <label 
                htmlFor="quote" 
                className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-2"
              >
                <QuoteIcon className="w-4 h-4 inline mr-2 align-text-bottom" />
                The Quote
              </label>
              <textarea
                id="quote"
                name="quote"
                rows={4}
                required
                placeholder="Type your inspiring quote here..."
                className="w-full p-4 border border-amber-300 dark:border-gray-600 rounded-lg shadow-inner focus:ring-amber-500 focus:border-amber-500 transition duration-150 bg-amber-50 dark:bg-gray-800 text-amber-950 dark:text-amber-50 placeholder-amber-400 dark:placeholder-gray-400 resize-none"
                onChange={(e) => setContent(e.target.value)}
                value={content}
              />
            </div>

            {/* Author Input Field */}
            <div>
              <label 
                htmlFor="author" 
                className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-2"
              >
                <UserIcon className="w-4 h-4 inline mr-2 align-text-bottom" />
                Author 
              </label>
              <input
                id="author"
                name="author"
                type="text"
                required
                placeholder="e.g., Albert Einstein, Anonymous"
                className="w-full p-3 border border-amber-300 dark:border-gray-600 rounded-lg shadow-inner focus:ring-amber-500 focus:border-amber-500 transition duration-150 bg-amber-50 dark:bg-gray-800 text-amber-950 dark:text-amber-50 placeholder-amber-400 dark:placeholder-gray-400"
                onChange={(e) => setAuthor(e.target.value)}
                value={author}
              />
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg">
                {success}
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent text-lg font-semibold rounded-lg shadow-md text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-200 disabled:opacity-50"
            >
              <SendIcon className="w-5 h-5" />
              <span>{loading ? 'Saving...' : 'Save Quote'}</span>
            </button>
          </form>
        </div>
      </main>

    </div>
  );
}
