import { useEffect, useState } from 'react'

function NewCollectionModal({ onClose, onCreate, onUpdate, existingCollection }) {
  const [name, setName] = useState(existingCollection?.name || '')
  const [coverPreview, setCoverPreview] = useState(existingCollection?.cover || null)
  const [draggingOver, setDraggingOver] = useState(false)

  useEffect(() => {
    if (existingCollection) {
      setName(existingCollection.name)
      setCoverPreview(existingCollection.cover)
    } else {
      setName('')
      setCoverPreview(null)
    }
  }, [existingCollection])

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    resizeImageFile(file).then((dataUrl) => setCoverPreview(dataUrl))
  }

  function handleDrop(e) {
    e.preventDefault()
    setDraggingOver(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    resizeImageFile(file).then((dataUrl) => setCoverPreview(dataUrl))
  }

  function resizeImageFile(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width)
          const width = Math.round(img.width * scale)
          const height = Math.round(img.height * scale)
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          URL.revokeObjectURL(objectUrl)
          resolve(dataUrl)
        }
        img.onerror = (err) => {
          URL.revokeObjectURL(objectUrl)
          reject(err)
        }
        img.src = objectUrl
      } catch (err) {
        reject(err)
      }
    })
  }

  function handleSubmit() {
    if (!name.trim() || !coverPreview) return
    const payload = {
      id: existingCollection?.id ?? Date.now(),
      name: name.trim(),
      itemCount: existingCollection?.itemCount ?? 0,
      cover: coverPreview,
    }

    if (existingCollection) {
      onUpdate?.(payload)
    } else {
      onCreate(payload)
    }

    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-[#111111] border border-zinc-800 w-full max-w-lg">

          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] mb-1">
                New Archive
              </p>
              <h2 className="font-editorial text-2xl text-white italic">
                Create Collection
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-600 hover:text-white transition-colors duration-200 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6">

            {/* Cover Image */}
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                Cover Image
              </p>
              <label
                htmlFor="cover-upload"
                onDragOver={(e) => { e.preventDefault(); setDraggingOver(true) }}
                onDragLeave={() => setDraggingOver(false)}
                onDrop={handleDrop}
                className={`
                  block w-full border cursor-pointer transition-all duration-300
                  ${draggingOver
                    ? 'border-white bg-zinc-900'
                    : 'border-zinc-800 hover:border-zinc-600'
                  }
                `}
              >
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full max-h-64 object-cover"
                  />
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center gap-2">
                    <p className="text-zinc-600 text-sm">Drop image here</p>
                    <p className="text-zinc-700 text-xs uppercase tracking-widest">
                      or click to browse
                    </p>
                  </div>
                )}
              </label>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Collection Name */}
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                Collection Name
              </p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dark Streetwear"
                className="w-full bg-transparent border border-zinc-800 text-white text-sm font-light px-4 py-3 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors duration-200"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-[11px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !coverPreview}
              className={`
                text-[11px] uppercase tracking-[0.2em] px-6 py-2.5 transition-all duration-300
                ${name.trim() && coverPreview
                  ? 'bg-white text-black hover:bg-zinc-200 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }
              `}
            >
              Create Collection
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default NewCollectionModal