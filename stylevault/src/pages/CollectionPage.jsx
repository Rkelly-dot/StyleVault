import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import AddInspirationModal from '../components/ui/AddInspirationModal'
import {
  DndContext,
  closestCenter,
  PointerSensor,
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

// Default items for a new collection should be empty so
// newly-created collections don't inherit demo placeholder data.
const initialItems = []

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
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={item.image}
            alt={item.caption}
            className={`
              w-full h-full object-cover
              transition-transform duration-500
              ${isDragging ? 'scale-105' : 'group-hover:scale-105'}
            `}
          />
        </div>

        <div
          className={`
            absolute inset-0 bg-black/60
            transition-opacity duration-300 flex flex-col justify-end p-4
            ${isDragging ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
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
                className="text-zinc-400 hover:text-white transition-colors duration-200"
                aria-label="Edit inspiration"
              >
                ✎
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.()
                }}
                className="text-zinc-400 hover:text-white transition-colors duration-200"
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

function CollectionPage({ collections, setCollections }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const collection = collections.find((c) => c.id === Number(id))
  const [items, setItems] = useLocalStorage(`collection-${id}`, initialItems)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeFilter, setActiveFilter] = useState(null)

  const filteredItems = activeFilter
    ? items.filter((item) => item.mood === activeFilter)
    : items

  const allMoods = [...new Set(items.map((item) => item.mood))]
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  function updateCollectionItemCount(count) {
    setCollections?.((prev) => prev.map((collectionItem) => (
      collectionItem.id === Number(id)
        ? { ...collectionItem, itemCount: count }
        : collectionItem
    )))
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  function handleAddItem(newItem) {
    const nextItems = [newItem, ...items]
    setItems(nextItems)
    updateCollectionItemCount(nextItems.length)
  }

  function handleSaveItem(updatedItem) {
    const nextItems = items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    setItems(nextItems)
  }

  function handleDeleteItem(itemId) {
    if (!window.confirm('Delete this inspiration?')) return
    const nextItems = items.filter((item) => item.id !== itemId)
    setItems(nextItems)
    updateCollectionItemCount(nextItems.length)
  }

  function handleEditItem(item) {
    setEditingItem(item)
    setShowModal(true)
  }

  function handleCloseModal() {
    setShowModal(false)
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      <nav className="flex items-center justify-between px-10 py-6 border-b border-zinc-900">
        <div onClick={() => navigate('/')} className="cursor-pointer">
          <span className="font-editorial text-white text-2xl italic">Style</span>
          <span className="text-white text-2xl font-light tracking-widest">VAULT</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-[11px] uppercase tracking-[0.2em] text-black bg-white px-5 py-2.5 hover:bg-zinc-200 transition-colors duration-300"
        >
          + Add Inspiration
        </button>
      </nav>

      <div className="px-10 pt-12 pb-10 flex items-end justify-between border-b border-zinc-900">
        <div>
          <button
            onClick={() => navigate('/')}
            className="text-[10px] text-zinc-600 uppercase tracking-widest mb-4 hover:text-zinc-400 transition-colors flex items-center gap-2"
          >
            ← All Collections
          </button>
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] mb-3">Collection</p>
          <h1 className="font-editorial text-6xl text-white font-normal italic">
            {collection?.name}
          </h1>
        </div>
        <p className="text-zinc-600 text-sm tracking-widest uppercase"> {filteredItems.length} pieces</p>
      </div>

      <div className="px-10 py-10">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-16 text-center">
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] mb-4">
              Empty Collection
            </p>
            <h2 className="font-editorial text-5xl text-white font-normal italic mb-4">
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
