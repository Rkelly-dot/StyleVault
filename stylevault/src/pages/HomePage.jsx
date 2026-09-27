import { useState } from 'react'
import CollectionGrid from '../components/collections/CollectionGrid'
import NewCollectionModal from '../components/ui/NewCollectionModal'
import UserMenu from '../components/auth/UserMenu'
import { useCollections } from '../hooks/useCollections'

function HomePage() {
  const { collections, loading, createCollection, updateCollection, deleteCollection } = useCollections()
  const [showModal, setShowModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const displayedCollections = collections.filter((collection) => {
    if (!searchTerm.trim()) return true
    return collection.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  })

  async function handleCreateCollection(payload) {
    try {
      await createCollection(payload)
    } catch (err) {
      console.error('Error creating collection:', err)
      window.alert('Could not create the collection. Please try again.')
    }
  }

  async function handleUpdateCollection(id, updates) {
    try {
      await updateCollection(id, updates)
    } catch (err) {
      console.error('Error updating collection:', err)
      window.alert('Could not update the collection. Please try again.')
    }
  }

  async function handleDeleteCollection(id) {
    if (!window.confirm('Delete this collection?')) return
    try {
      await deleteCollection(id)
    } catch (err) {
      console.error('Error deleting collection:', err)
      window.alert('Could not delete the collection. Please try again.')
    }
  }

  function handleEditCollection(collection) {
    setEditingCollection(collection)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditingCollection(null)
  }

  return (
    <div className="min-h-screen bg-[#080808]">

      {/* Navigation */}
      <nav className="flex items-center justify-between gap-3 px-5 sm:px-10 py-5 sm:py-6 border-b border-zinc-900">
        <div>
          <span className="font-editorial text-white text-xl sm:text-2xl italic">Style</span>
          <span className="text-white text-xl sm:text-2xl font-light tracking-widest">VAULT</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <UserMenu />
          <div className="relative">
            <button
              onClick={() => setSearchOpen((open) => !open)}
              className="p-2 -m-1 text-zinc-500 hover:text-white transition-colors duration-300"
              aria-label="Toggle search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
            {searchOpen && (
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search collections"
                className="absolute right-0 top-full mt-2 w-64 bg-[#111111] border border-zinc-800 text-white text-sm px-4 py-2 outline-none"
              />
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            aria-label="New collection"
            className="hidden sm:inline-flex sm:items-center text-[11px] uppercase tracking-[0.2em] text-black bg-white px-5 py-2.5 hover:bg-zinc-200 transition-colors duration-300"
          >
            New Collection
          </button>
        </div>
      </nav>

      {/* Hero header */}
      <div className="px-5 sm:px-10 pt-12 sm:pt-16 pb-8 sm:pb-12">
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] mb-4">
          Your Archive
        </p>
        <h1 className="font-editorial text-5xl sm:text-7xl text-white font-normal italic leading-none">
          Collections
        </h1>
      </div>

      {/* Grid */}
      <div className="px-5 sm:px-10 pb-28 sm:pb-16">
        {loading ? (
          <p className="text-zinc-600 text-[11px] uppercase tracking-[0.4em]">Loading collections…</p>
        ) : (
          <CollectionGrid
            collections={displayedCollections}
            onEdit={handleEditCollection}
            onDelete={handleDeleteCollection}
          />
        )}
      </div>

      {/* Mobile: floating action button */}
      <button
        onClick={() => setShowModal(true)}
        aria-label="New collection"
        className="sm:hidden fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-5 z-30 h-14 w-14 rounded-full bg-white text-black text-2xl font-light flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.5)] active:scale-95 transition-transform duration-200"
      >
        +
      </button>

   {showModal && (
        <NewCollectionModal
          onClose={closeModal}
          onCreate={handleCreateCollection}
          onUpdate={handleUpdateCollection}
          existingCollection={editingCollection}
        />
      )}
    </div>
  )
}

export default HomePage