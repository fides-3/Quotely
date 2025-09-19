

export default function Signup() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <form className="bg-gradient-to-br from-white to-gray-100 max-w-md w-full rounded-2xl p-8 shadow-2xl space-y-6">
        
        {/* HEADING */}
        <h1 className="text-center text-2xl font-bold text-amber-950">SIGNUP</h1>

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
