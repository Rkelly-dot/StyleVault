import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function UserMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.user_metadata?.display_name || user?.email || ''

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <span className="hidden sm:block font-editorial italic text-white text-base truncate max-w-[12rem]">{displayName}</span>
      <button
        onClick={handleLogout}
        className="text-[11px] uppercase tracking-[0.2em] text-black bg-white px-3.5 sm:px-5 py-2.5 hover:bg-zinc-200 transition-colors duration-300"
      >
        Log out
      </button>
    </div>
  )
}

export default UserMenu