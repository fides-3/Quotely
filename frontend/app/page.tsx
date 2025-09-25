'use client';

export default function LandingPage() {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-amber-50 to-amber-100">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-3 bg-amber-100 shadow-sm">
        <div className="text-xl font-bold text-amber-950">Quotely</div>
        <nav className="space-x-3">
          <a href="/login" className="text-amber-800 hover:text-amber-950">Login</a>
          <a
            href="/signup"
            className="px-3 py-1.5 rounded-lg bg-amber-950 text-amber-50 hover:bg-amber-900"
          >
            Sign Up
          </a>
        </nav>
      </header>

      <div className="flex-1 overflow-auto">
        {/* HERO */}
        <section className="py-8 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-amber-100/50 to-transparent">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-amber-950">
            Discover, Share & Collect Quotes That Inspire You
          </h1>
          <p className="text-base text-amber-800 mb-6">
            Join our community of thinkers, writers, and dreamers.
          </p>
          <div className="space-x-3">
            <a
              href="/signup"
              className="px-4 py-2 rounded-lg bg-amber-950 text-amber-50 hover:bg-amber-900"
            >
              Get Started
            </a>
            
          </div>
        </section>

        {/* QUOTE OF THE DAY */}
        <section className="py-8 bg-amber-50/80 text-center">
          <blockquote className="text-xl italic font-medium text-amber-950 max-w-2xl mx-auto px-4">
            "The future belongs to those who believe in the beauty of their dreams."
          </blockquote>
          <p className="mt-2 text-amber-800">— Eleanor Roosevelt</p>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-8 bg-gradient-to-b from-amber-100/50 to-transparent">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 text-center">
            <div className="bg-amber-50/80 p-4 rounded-lg">
              <span className="text-2xl">✍️</span>
              <h3 className="text-lg font-semibold mt-2 text-amber-950">Post Quotes</h3>
              <p className="text-amber-800 text-sm">Share your favorite lines.</p>
            </div>
            <div className="bg-amber-50/80 p-4 rounded-lg">
              <span className="text-2xl">❤️</span>
              <h3 className="text-lg font-semibold mt-2 text-amber-950">Engage</h3>
              <p className="text-amber-800 text-sm">Like and save inspiring posts.</p>
            </div>
            <div className="bg-amber-50/80 p-4 rounded-lg">
              <span className="text-2xl">🌍</span>
              <h3 className="text-lg font-semibold mt-2 text-amber-950">Inspire</h3>
              <p className="text-amber-800 text-sm">Join a global community.</p>
            </div>
          </div>
        </section>

        {/* COMMUNITY STATS */}
        <section className="py-6 text-center bg-amber-50/80">
          <h2 className="text-2xl font-bold text-amber-950 mb-2">Join Our Community</h2>
          <p className="text-amber-800 text-sm">
            🌟 12,500+ Quotes · 3,200+ Members
          </p>
        </section>

        {/* FOOTER */}
        <footer className="py-4 text-center text-amber-700 text-xs bg-amber-100">
          <p>© 2025 Quotely. All rights reserved.</p>
          <div className="mt-1 space-x-4">
            <a href="/about" className="hover:text-amber-950">About</a>
            <a href="/contact" className="hover:text-amber-950">Contact</a>
            <a href="/privacy" className="hover:text-amber-950">Privacy</a>
          </div>
        </footer>
      </div>
    </div>
  );
}