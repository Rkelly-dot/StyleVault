import { useNavigate } from 'react-router-dom'

function CollectionCard({ collection, onEdit, onDelete }) {
  const navigate = useNavigate()

  return (
    <div
      className="group relative overflow-hidden cursor-pointer bg-zinc-950"
      onClick={() => navigate(`/collection/${collection.id}`)}
    >
      <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(collection)
          }}
          className="rounded-full bg-black/70 p-2 text-zinc-200 hover:bg-white hover:text-black transition-colors duration-200"
          aria-label="Edit collection"
        >
          ✎
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(collection.id)
          }}
          className="rounded-full bg-black/70 p-2 text-zinc-200 hover:bg-white hover:text-black transition-colors duration-200"
          aria-label="Delete collection"
        >
          🗑
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={collection.cover}
          alt={collection.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-[10px] text-zinc-400 uppercase tracking-[0.3em] mb-2">
          {collection.itemCount} pieces
        </p>
        <h2 className="font-editorial text-2xl text-white font-normal leading-tight">
          {collection.name}
        </h2>
        <div className="mt-3 h-px bg-white w-0 group-hover:w-full transition-all duration-500" />
      </div>
    </div>
  )
}

export default CollectionCard