'use client';
import {useState} from 'react';
import axios from '../api/axiosInstance.js';
import { useRouter } from 'next/navigation';
import {useAuth} from '../context/AuthContext';
import Link from 'next/link.js';


export default function Login(){
    const router=useRouter()
    const [error,setError]=useState("");
    const [form,setForm]=useState({
        email:"",
        password:""
    })
    const[loading,setLoading]=useState(false)
    const {setAuth}=useAuth()

    
    interface AxiosError {
    response?: {
    status: number;
    statusText: string;
    data: ApiErrorResponse;
    };
    message: string;
    }
   interface ApiErrorResponse {
    error?: string;
    details?: string;
    message?: string;
    }
    

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setForm({...form,[e.target.name]:e.target.value});
        if (error){
            setError("");
        }
    };

    const handleSubmit=async (e:React.FormEvent)=>{
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            const res = await axios.post('/auth/login', form);
            
            if(res.data.accessToken){
                const authData = {
                    accessToken: res.data.accessToken,
                    user: {email: form.email},
                };
                setAuth(authData);
                localStorage.setItem('auth', JSON.stringify(authData));
                router.push("/");
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
      const axiosError = err as AxiosError;
      console.error('Login error:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message
      });
      
      if (axiosError.response?.status === 401) {
        setError('Invalid email or password');
      } else if (axiosError.response?.status === 404) {
        setError('User not found');
      } else if (!axiosError.response) {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError(
          axiosError.response?.data?.error || 
          axiosError.response?.data?.message || 
          'An error occurred during login. Please try again.'
        );
      }
    } finally {
      setLoading(false)
    }
    }

    return(
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-amber-50 max-w-md w-full rounded-2xl p-8 shadow-xl space-y-6">
               {/* HEADING */}
               <h1 className="text-center text-2xl font-bold text-black">LOGIN</h1>

               {/* EMAIL */}
               <div className="space-y-2">
                <label htmlFor="email" className="text-gray-600 text-sm font-medium">
                    Email
                </label>
                <input 
                    type="email"
                    name="email" 
                    id="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-gray-300 text-black px-4 py-2 focus:ring-2 focus:ring-amber-950 focus:outline-none"
                    onChange={handleChange}
                    value={form.email}
                />
               </div>

               {/* Password */}
               <div className="space-y-2">
                <label htmlFor="password" className="text-gray-600 text-sm font-medium">
                    Password
                </label>
                <input 
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-gray-300 text-black px-4 py-2 focus:ring-2 focus:ring-amber-950 focus:outline-none"
                    onChange={handleChange}
                    value={form.password}
                />
               </div>
               
               <div className="flex justify-end w-full">
                 <Link href="/passwordReset" className="text-sm text-amber-950 hover:text-amber-800">
                   Forgot your password?
                 </Link>
               </div>

               <button
                 type="submit"
                 disabled={loading}
                 className="w-full py-3 bg-amber-950 text-white font-semibold rounded-lg shadow-md hover:bg-amber-900 transition disabled:opacity-50"
               >
                 {loading ? 'Logging in...' : 'Login'}
               </button>

               {error && (
                 <div className="text-red-700 text-sm">{error}</div>
               )}

               <div className="text-center">
                 <span className="text-gray-600 text-sm">
                   Don&apos;t have an account?{" "}
                 </span>
                 <Link href="/signup" className="text-amber-950 hover:text-amber-800 font-medium">
                   Register
                 </Link>
               </div>
            </form>
        </div>
    )





  
    }
 