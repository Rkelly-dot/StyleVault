import { useState } from 'react'
import CollectionGrid from '../components/collections/CollectionGrid'
import NewCollectionModal from '../components/ui/NewCollectionModal'
import UserMenu from '../components/auth/UserMenu'

function HomePage({ collections, setCollections }) {
  const [showModal, setShowModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const displayedCollections = collections
    .map((c) => {
      try {
        const stored = localStorage.getItem(`collection-${c.id}`)
        const items = stored ? JSON.parse(stored) : null
        return items && items.length ? { ...c, cover: items[0].image } : c
      } catch (err) {
        return c
      }
    })
    .filter((collection) => {
      if (!searchTerm.trim()) return true
      return collection.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    })

  function handleCreateCollection(newCollection) {
    setCollections((prev) => [newCollection, ...prev])
  }

  function handleUpdateCollection(updatedCollection) {
    setCollections((prev) => prev.map((collection) => (
      collection.id === updatedCollection.id ? updatedCollection : collection
    )))
  }

  function handleDeleteCollection(id) {
    if (!window.confirm('Delete this collection?')) return
    localStorage.removeItem(`collection-${id}`)
    setCollections((prev) => prev.filter((collection) => collection.id !== id))
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
      <nav className="flex items-center justify-between px-10 py-6 border-b border-zinc-900">
        <div>
          <span className="font-editorial text-white text-2xl italic">Style</span>
          <span className="text-white text-2xl font-light tracking-widest">VAULT</span>
        </div>
        <div className="flex items-center gap-4">
          <UserMenu />
          <div className="relative">
            <button
              onClick={() => setSearchOpen((open) => !open)}
              className="text-zinc-500 hover:text-white transition-colors duration-300"
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
             className="text-[11px] uppercase tracking-[0.2em] text-black bg-white px-5 py-2.5 hover:bg-zinc-200 transition-colors duration-300"
          >
            New Collection
          </button>
        </div>
      </nav>

      {/* Hero header */}
      <div className="px-10 pt-16 pb-12">
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] mb-4">
          Your Archive
        </p>
        <h1 className="font-editorial text-7xl text-white font-normal italic leading-none">
          Collections
        </h1>
      </div>

      {/* Grid */}
      <div className="px-10 pb-16">
          <CollectionGrid
            collections={displayedCollections}
            onEdit={handleEditCollection}
            onDelete={handleDeleteCollection}
          />
      </div>

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