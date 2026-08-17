import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Enter your email and password.')
      return
    }
    setSubmitting(true)
    try {
      await signIn({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="font-editorial text-white text-3xl italic">Style</span>
          <span className="text-white text-3xl font-light tracking-widest">VAULT</span>
        </div>

        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] mb-3 text-center">
          Welcome back
        </p>
        <h1 className="font-editorial text-4xl text-white font-normal italic text-center mb-10">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full bg-[#111111] border border-zinc-800 text-white text-sm px-4 py-3 outline-none focus:border-zinc-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-[#111111] border border-zinc-800 text-white text-sm px-4 py-3 outline-none focus:border-zinc-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-[11px] uppercase tracking-[0.2em] text-black bg-white px-5 py-3 hover:bg-zinc-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-zinc-600 text-xs text-center mt-8 tracking-wide">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:text-zinc-300 underline underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage