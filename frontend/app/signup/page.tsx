'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation'
import axios from '../api/axiosInstance'
import { ThemeToggle } from '../theme-toggle'
import Link from 'next/link'

// Define interfaces for better type safety
interface FormData {
  username: string;
  email: string;
  password: string;
}

interface ApiErrorResponse {
  error?: string;
  details?: string;
  message?: string;
}

interface AxiosError {
  response?: {
    status: number;
    statusText: string;
    data: ApiErrorResponse;
  };
  message: string;
}

export default function Signup() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [form, setForm] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  })
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Changed to false initially

  // Fix 1: Type the event parameter properly
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) {
      setError('')
    }
  }

  // Fix 2: Type the event parameter properly
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("")
    setLoading(true);
    
    if (form.password.length < 6) {
      setError("password must be atleast 6 characters long");
      setLoading(false);
      return
    }

    try {
      console.log("Attempting registration with:", form);
      const res = await axios.post("http://localhost:5000/auth/register", form);
      console.log("Registration response:", res.data);
      setSuccess("Registration successful! You can now log in.")

      setTimeout(() => {
        router.push("/login");
      }, 2000)

    } catch (err) {
      // Fix 3: Use proper error typing instead of any
      console.log('full error object:', err)
      
      // Type guard to check if it's an Axios error
      const axiosError = err as AxiosError;
      
      console.error("Registration error details:", {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        message: axiosError.message,
      })
      
      const errorMessage =
        axiosError.response?.data?.error ||
        axiosError.response?.data?.details ||
        axiosError.response?.data?.message ||
        `Registration failed: ${axiosError.message}`;
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-3 bg-amber-100/90 dark:bg-gray-800/90 shadow-sm">
        <div className="text-xl font-bold text-amber-950 dark:text-amber-50">Quotely</div>
        <nav className="flex items-center space-x-3">
          <Link href="/" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
            Home
          </Link>
          <Link href="/login" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50">
            Login
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      {/* FORM SECTION */}
      <div className="flex-1 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 max-w-md w-full rounded-2xl p-8 shadow-xl space-y-6">

        {/* HEADING */}
        <h1 className="text-center text-2xl font-bold text-amber-950 dark:text-amber-50">SIGNUP</h1>

        {/* USERNAME */}
        <div className="space-y-2">
          <label htmlFor="username" className="text-amber-900 dark:text-amber-200 text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none"
            onChange={handleChange}
            value={form.username}
          />
        </div>

        {/* EMAIL */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-amber-900 dark:text-amber-200 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none"
            onChange={handleChange}
            value={form.email}
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-amber-900 dark:text-amber-200 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none"
            onChange={handleChange}
            value={form.password}
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-950 dark:bg-amber-200 text-amber-50 dark:text-gray-900 font-semibold rounded-lg shadow-md hover:bg-amber-900 dark:hover:bg-amber-100 transition disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
        
        {error && (
          <div className="text-red-700 dark:text-red-400 text-sm bg-red-100 dark:bg-red-900/30 p-2 rounded">{error}</div>
        )}

        {success && (
          <div className="text-green-600 dark:text-green-400 text-sm bg-green-100 dark:bg-green-900/30 p-2 rounded">{success}</div>
        )}

        {/* Login Link */}
        <div className="text-center">
          <span className="text-amber-900 dark:text-amber-200 text-sm">
            Already have an account?{" "}
          </span>
          <a href="/login" className="text-amber-950 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-100 font-medium">
            Login
          </a>
        </div>
        
      </form>
    </div>
    </div>
  );
}