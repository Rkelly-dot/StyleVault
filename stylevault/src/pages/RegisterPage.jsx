import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')

    if (!email || !password) {
      setError('Enter your email and password.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const data = await signUp({ email, password, displayName })
      if (!data.session) {
        setInfo('Check your email to confirm your account, then sign in.')
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/welcome" className="block text-center mb-10">
          <span className="font-editorial text-white text-3xl italic">Style</span>
          <span className="text-white text-3xl font-light tracking-widest">VAULT</span>
        </Link>

        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] mb-3 text-center">
          Start your archive
        </p>
        <h1 className="font-editorial text-4xl text-white font-normal italic text-center mb-10">
          Create account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
              Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
              className="w-full bg-[#111111] border border-zinc-800 text-white text-sm px-4 py-3 outline-none focus:border-zinc-500 transition-colors"
              placeholder="Optional"
            />
          </div>

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
              autoComplete="new-password"
              className="w-full bg-[#111111] border border-zinc-800 text-white text-sm px-4 py-3 outline-none focus:border-zinc-500 transition-colors"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-[10px] text-zinc-600 uppercase tracking-widest mb-2">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full bg-[#111111] border border-zinc-800 text-white text-sm px-4 py-3 outline-none focus:border-zinc-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-xs tracking-wide">{error}</p>}
          {info && <p className="text-emerald-400 text-xs tracking-wide">{info}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-[11px] uppercase tracking-[0.2em] text-black bg-white px-5 py-3 hover:bg-zinc-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-zinc-600 text-xs text-center mt-8 tracking-wide">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-zinc-300 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage