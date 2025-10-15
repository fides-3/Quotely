"use client"
import {useState} from 'react'
import { ThemeToggle } from "../theme-toggle";
import { QuoteIcon, UserIcon, SendIcon } from "lucide-react"; // Importing icons for a cleaner look
import axios from '../api/axiosInstance'

export default function QuoteInput() {

  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContent("")
    setAuthor("")
    try{
        const res =await axios.post('http://localhost:5000/quote/createQuote', {content, author});
        if(res.status===201){
            console.log("Quote successfully saved");
        }else{
            console.error("Failed to save quote");
        }   
    }catch(error){
        console.error("Error submitting quote:", error);
   
    }
    }   
     

  return (
    // The main container needs 'flex-col' to allow the header and main content to stack.
    // I've also adjusted the class on the main div to center the form content.
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      
      {/* --- Header --- */}
      <header className="flex items-center justify-between px-6 py-3 bg-amber-100/90 dark:bg-gray-800/90 shadow-lg sticky top-0 z-10">
        <div className="text-xl font-bold text-amber-950 dark:text-amber-50">Quotely</div>
        <nav className="flex items-center space-x-3">
          <a href="/login" className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 transition duration-150">Login</a>
          <a
            href="/signup"
            className="text-amber-800 hover:text-amber-950 dark:text-amber-200 dark:hover:text-amber-50 transition duration-150"
          >
            Sign Up
          </a>
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent text-lg font-semibold rounded-lg shadow-md text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-200"
            >
              <SendIcon className="w-5 h-5" />
              <span>Save Quote</span>
            </button>
          </form>
        </div>
      </main>

    </div>
  );
}
