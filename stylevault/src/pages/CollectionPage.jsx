import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useItems } from '../hooks/useItems'
import AddInspirationModal from '../components/ui/AddInspirationModal'
import UserMenu from '../components/auth/UserMenu'
import { supabase } from '../lib/supabaseClient'
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const moodColors = {
  'Avant-Garde': 'bg-purple-950 text-purple-300',
  Streetwear: 'bg-zinc-800 text-zinc-300',
  Minimalist: 'bg-stone-800 text-stone-300',
  Archive: 'bg-amber-950 text-amber-300',
  Luxury: 'bg-yellow-950 text-yellow-300',
  Techwear: 'bg-cyan-950 text-cyan-300',
}

function SortableCard({ item, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative break-inside-avoid mb-4 cursor-grab active:cursor-grabbing
        transition-all duration-300
        ${isDragging ? 'opacity-40 scale-95 z-50' : 'opacity-100 scale-100'}
      `}
    >
      <div
        className={`
          relative overflow-hidden bg-zinc-900
          transition-all duration-300
          ${isDragging ? 'shadow-[0_30px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/20' : 'shadow-none'}
        `}
      >
        <div className="relative overflow-hidden">
          <img
            src={item.image}
            alt={item.caption}
            loading="lazy"
            decoding="async"
            className={`
              w-full h-auto block
              transition-transform duration-500
              ${isDragging ? 'scale-105' : 'group-hover:scale-105'}
            `}
          />
        </div>

        <div
          className={`
            absolute inset-0 flex flex-col justify-end p-4
            bg-gradient-to-t from-black/85 via-black/40 to-transparent
            can-hover:bg-none can-hover:bg-black/60
            transition-opacity duration-300
            ${isDragging
              ? 'opacity-0'
              : 'opacity-100 can-hover:opacity-0 can-hover:group-hover:opacity-100'
            }
          `}
        >
          <p className="text-white text-sm font-light leading-snug mb-3">
            {item.caption}
          </p>
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] uppercase tracking-widest px-2.5 py-1 ${
                moodColors[item.mood] || 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {item.mood}
            </span>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.()
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="p-2.5 -m-1 text-zinc-400 hover:text-white transition-colors duration-200"
                aria-label="Edit inspiration"
              >
                ✎
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.()
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="p-2.5 -m-1 text-zinc-400 hover:text-white transition-colors duration-200"
                aria-label="Delete inspiration"
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CollectionPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [collection, setCollection] = useState(null)
  const [collectionLoading, setCollectionLoading] = useState(true)
  const [collectionError, setCollectionError] = useState(false)

  const { items, loading: itemsLoading, addItem, updateItem, deleteItem, reorderItems } = useItems(id)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchCollection() {
      setCollectionLoading(true)
      setCollectionError(false)

      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single()

      if (!isMounted) return

      if (error) {
        console.error('Error fetching collection:', error)
        setCollectionError(true)
      } else {
        setCollection(data)
      }
      setCollectionLoading(false)
    }

    fetchCollection()
    return () => {
      isMounted = false
    }
  }, [id])

  const filteredItems = activeFilter
    ? items.filter((item) => item.mood === activeFilter)
    : items

  const allMoods = [...new Set(items.map((item) => item.mood))]
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    // Long-press to drag on touch devices, so normal swipes still scroll the page
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 12 },
    }),
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      const reordered = arrayMove(items, oldIndex, newIndex)
      reorderItems(reordered)
    }
  }

  async function handleAddItem(payload) {
    await addItem(payload)
  }

  async function handleSaveItem(itemId, payload) {
    await updateItem(itemId, payload)
  }

  async function handleDeleteItem(itemId) {
    if (!window.confirm('Delete this inspiration?')) return
    try {
      await deleteItem(itemId)
    } catch (err) {
      console.error('Error deleting item:', err)
      window.alert('Could not delete this item. Please try again.')
    }
  }

  function handleEditItem(item) {
    setEditingItem(item)
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
    setEditingItem(null)
  }

  if (collectionLoading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <p className="text-zinc-600 text-[11px] uppercase tracking-[0.4em]">Loading collection…</p>
      </div>
    )
  }

  if (collectionError || !collection) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center gap-6">
        <p className="text-zinc-500 text-sm">This collection doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => navigate('/')}
          className="text-[11px] uppercase tracking-[0.2em] text-black bg-white px-5 py-2.5 hover:bg-zinc-200 transition-colors duration-300"
        >
          ← Back to Collections
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <nav className="flex items-center justify-between gap-3 px-5 sm:px-10 py-5 sm:py-6 border-b border-zinc-900">
        <div onClick={() => navigate('/')} className="cursor-pointer">
          <span className="font-editorial text-white text-xl sm:text-2xl italic">Style</span>
          <span className="text-white text-xl sm:text-2xl font-light tracking-widest">VAULT</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <UserMenu />
          <button
            onClick={() => setShowModal(true)}
            aria-label="Add inspiration"
            className="hidden sm:inline-flex sm:items-center text-[11px] uppercase tracking-[0.2em] text-black bg-white px-5 py-2.5 hover:bg-zinc-200 transition-colors duration-300"
          >
            + Add Inspiration
          </button>
        </div>
      </nav>

      <div className="px-5 sm:px-10 pt-10 sm:pt-12 pb-8 sm:pb-10 flex flex-col items-start sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-900">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-[10px] text-zinc-600 uppercase tracking-widest mb-4 hover:text-zinc-400 transition-colors flex items-center gap-2"
          >
            ← All Collections
          </button>
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] mb-3">Collection</p>
          <h1 className="font-editorial text-4xl sm:text-6xl text-white font-normal italic break-words">
            {collection?.name}
          </h1>
        </div>
        <p className="text-zinc-600 text-sm tracking-widest uppercase"> {filteredItems.length} pieces</p>
      </div>

      <div className="px-5 sm:px-10 pt-8 sm:pt-10 pb-24 sm:pb-10">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 sm:p-16 text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] mb-4">
              Empty Collection
            </p>
            <h2 className="font-editorial text-3xl sm:text-5xl text-white font-normal italic mb-4">
              Add your first piece
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto mb-8">
              This collection is currently empty. Add your first inspiration to start building your archive.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="text-[11px] uppercase tracking-[0.2em] text-black bg-white px-6 py-3 hover:bg-zinc-200 transition-colors duration-200"
            >
              Add your first piece
            </button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredItems.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                {filteredItems.map((item) => (
                  <SortableCard
                    key={item.id}
                    item={item}
                    onEdit={() => handleEditItem(item)}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Mobile: floating action button */}
      <button
        onClick={() => setShowModal(true)}
        aria-label="Add inspiration"
        className="sm:hidden fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-5 z-30 h-14 w-14 rounded-full bg-white text-black text-2xl font-light flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.5)] active:scale-95 transition-transform duration-200"
      >
        +
      </button>

      {showModal && (
        <AddInspirationModal
          onClose={handleCloseModal}
          onAdd={handleAddItem}
          onSave={handleSaveItem}
          initialItem={editingItem}
        />
      )}
    </div>
  )
}

export default CollectionPage