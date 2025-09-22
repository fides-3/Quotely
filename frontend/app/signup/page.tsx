'use client'
import { useState } from "react";
import {useRouter} from 'next/navigation'
import axios from '../api/axiosInstance'

export default function Signup() {
const router=useRouter()
const [error,setError]=useState("")
const [form,setForm]=useState({
  username:"",
  email:"",
  password:"",
})
const handleChange= (e:any) =>{
  setForm({ ...form,[e.target.name]:e.target.value})
  if (error){
    setError('')
  }
}
const handleSubmit=async(e:any)=>{
  e.preventDefault();
  setError("");
  
  if(form.password.length<6){
    setError("password must be atleast 6 characters long");
    return

  }
  try{
    console.log("Attempting registration with:",form);
    const res=await axios.post("auth/register",form);
    console.log("Registration response:",res.data)

    setTimeout(()=>{
      router.push("/login");
    },2000)

    }catch(err:any){
      console.error("Registration error details:",
      {
        status:err.response?.status,
        statusText:err.response?.statusText,
        data:err.response?.data,
        message:err.message,

      })
      const errorMessage=
      err.response?.data?.error||
      err.response?.data?.details||
      err.response?.data?.message||
      `Registration failed: ${err.message}`;
      setError(errorMessage)
    }


  
  }




  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <form className="bg-amber-50 max-w-md w-full rounded-2xl p-8 shadow-xl space-y-6">
        
        {/* HEADING */}
        <h1 className="text-center text-2xl font-bold text-black">SIGNUP</h1>

        {/* USERNAME */}
        <div className="space-y-2">
          <label htmlFor="Username" className="text-gray-600 text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            name="Username"
            id="Username"
            placeholder="Enter your username"
            className="w-full rounded-lg border border-gray-300 text-black px-4 py-2 focus:ring-2 focus:ring-amber-950 focus:outline-none"
            onChange={handleChange}
          />
        </div>

        {/* EMAIL */}
        <div className="space-y-2">
          <label htmlFor="Email" className="text-gray-600 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="Email"
            id="Email"
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-300 text-black px-4 py-2 focus:ring-2 focus:ring-amber-950 focus:outline-none"
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label htmlFor="Password" className="text-gray-600 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="Password"
            id="Password"
            placeholder="Enter your password"
            className="w-full rounded-lg border border-gray-300 text-black px-4 py-2 focus:ring-2 focus:ring-amber-950 focus:outline-none"
            onChange={handleChange}
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full py-3 bg-amber-950 text-white font-semibold rounded-lg shadow-md hover:bg-amber-900 transition"
        >
          Signup
        </button>
      </form>
    </div>
  );
}
