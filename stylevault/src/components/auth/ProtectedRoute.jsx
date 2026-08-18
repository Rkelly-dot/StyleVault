import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <p className="text-zinc-600 text-[11px] uppercase tracking-[0.4em]">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/welcome" replace />
  }

  return children
}

export default ProtectedRoute