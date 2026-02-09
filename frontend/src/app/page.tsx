import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500 opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full border-2 border-cyan-400 shadow-2xl shadow-cyan-500/20">
            <span className="text-7xl">📝</span>
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-6">
          <h1 className="text-7xl md:text-8xl font-black leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Task Master
            </span>
          </h1>
          <p className="text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
            Organize your day. Master your tasks. Achieve your goals.
          </p>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            A modern, lightning-fast task management platform designed for productivity.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
          <Link
            href="/todos"
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold text-lg rounded-xl transition duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-purple-500/30"
          >
            <span>🚀</span>
            Launch App
          </Link>
          <Link
            href="/login"
            className="px-10 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg rounded-xl transition duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center gap-3 border-2 border-gray-700 hover:border-cyan-500"
          >
            <span>🔐</span>
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-cyan-500/30 hover:bg-gray-800/50 transition duration-300 group">
            <div className="text-5xl mb-4 group-hover:scale-125 transition duration-300">⚡</div>
            <h3 className="text-white font-bold text-xl mb-3">Lightning Fast</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Instant updates and real-time synchronization across all devices</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-purple-500/30 hover:bg-gray-800/50 transition duration-300 group">
            <div className="text-5xl mb-4 group-hover:scale-125 transition duration-300">📊</div>
            <h3 className="text-white font-bold text-xl mb-3">Track Progress</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Monitor your productivity with beautiful progress indicators</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-pink-500/30 hover:bg-gray-800/50 transition duration-300 group">
            <div className="text-5xl mb-4 group-hover:scale-125 transition duration-300">🎯</div>
            <h3 className="text-white font-bold text-xl mb-3">Stay Focused</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Distraction-free interface to keep you on track</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-20 text-center text-gray-600 text-sm">
        <p>Built with Next.js • TypeScript • Tailwind CSS</p>
      </div>
    </div>
  );
}
