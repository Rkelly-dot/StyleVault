import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function WelcomePage() {
  const navigate = useNavigate()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#080808] relative overflow-hidden">
      {/* Splash overlay */}
      <div
        className={`
          fixed inset-0 z-50 flex items-center justify-center bg-[#080808]
          transition-all duration-700 ease-out
          ${showSplash ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}
        `}
      >
        <div className="text-center">
          <span className="font-editorial text-white text-5xl italic">Style</span>
          <span className="text-white text-5xl font-light tracking-widest">VAULT</span>
        </div>
      </div>

      {/* Landing content */}
      <div
        className={`
          transition-opacity duration-700 ease-in
          ${showSplash ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <nav className="flex items-center justify-between px-10 py-6">
          <div>
            <span className="font-editorial text-white text-2xl italic">Style</span>
            <span className="text-white text-2xl font-light tracking-widest">VAULT</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-300"
          >
            Already have an account
          </button>
        </nav>

        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.5em] mb-6">
            A curated fashion archive
          </p>
          <h1 className="font-editorial text-white font-normal italic leading-[0.95] text-6xl sm:text-7xl md:text-8xl max-w-4xl">
            Your style,
            <br />
            archived like art.
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mt-8 leading-relaxed">
            Collect, arrange, and revisit the inspiration that shapes your eye —
            moodboards built for people who take fashion seriously.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 mt-12">
            <button
              onClick={() => navigate('/register')}
              className="text-[11px] uppercase tracking-[0.2em] text-black bg-white px-8 py-4 hover:bg-zinc-200 transition-colors duration-300"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-[11px] uppercase tracking-[0.2em] text-zinc-300 border border-zinc-700 px-8 py-4 hover:border-zinc-400 hover:text-white transition-colors duration-300"
            >
              Already have an account
            </button>
          </div>
        </div>

        <footer className="px-10 py-8 border-t border-zinc-900 text-center">
          <p className="text-zinc-700 text-[10px] uppercase tracking-[0.3em]">
            StyleVault — Est. for the archive-minded
          </p>
        </footer>
      </div>
    </div>
  )
}

export default WelcomePage