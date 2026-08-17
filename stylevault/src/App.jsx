import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import useLocalStorage from './hooks/useLocalStorage'

const defaultCollections = [
  {
    id: 1,
    name: 'Dark Streetwear',
    itemCount: 12,
    cover: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
  },
  {
    id: 2,
    name: 'Opium',
    itemCount: 8,
    cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  },
  {
    id: 3,
    name: 'Archive Fits',
    itemCount: 15,
    cover: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800',
  },
  {
    id: 4,
    name: 'Techwear',
    itemCount: 6,
    cover: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  },
  {
    id: 5,
    name: 'Campus Fits',
    itemCount: 9,
    cover: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
  },
  {
    id: 6,
    name: 'Luxury',
    itemCount: 11,
    cover: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
  },
]

function App() {
  const [collections, setCollections] = useLocalStorage('stylevault-collections', defaultCollections)

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#080808] text-white">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage collections={collections} setCollections={setCollections} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collection/:id"
              element={
                <ProtectedRoute>
                  <CollectionPage collections={collections} setCollections={setCollections} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App