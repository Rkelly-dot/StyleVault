import { useEffect, useState } from 'react'

const MOOD_TAGS = [
  'Streetwear',
  'Avant-Garde',
  'Minimalist',
  'Archive',
  'Luxury',
  'Techwear',
  'Opium',
  'Casual',
]

function AddInspirationModal({ onClose, onAdd, onSave, initialItem }) {
  const [caption, setCaption] = useState(initialItem?.caption || '')
  const [selectedMood, setSelectedMood] = useState(initialItem?.mood || null)
  const [imagePreview, setImagePreview] = useState(initialItem?.image || null)
  const [imageBlob, setImageBlob] = useState(null)
  const [draggingOver, setDraggingOver] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialItem) {
      setCaption(initialItem.caption || '')
      setSelectedMood(initialItem.mood || null)
      setImagePreview(initialItem.image || null)
      setImageBlob(null)
    } else {
      setCaption('')
      setSelectedMood(null)
      setImagePreview(null)
      setImageBlob(null)
    }
  }, [initialItem])

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    resizeImageFile(file).then((blob) => {
      setImageBlob(blob)
      setImagePreview(URL.createObjectURL(blob))
    })
  }

  function handleDrop(e) {
    e.preventDefault()
    setDraggingOver(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    resizeImageFile(file).then((blob) => {
      setImageBlob(blob)
      setImagePreview(URL.createObjectURL(blob))
    })
  }

  function resizeImageFile(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image()
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width)
          const width = Math.round(img.width * scale)
          const height = Math.round(img.height * scale)
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(img.src)
              if (blob) resolve(blob)
              else reject(new Error('Could not process image'))
            },
            'image/jpeg',
            quality,
          )
        }
        img.onerror = (err) => {
          URL.revokeObjectURL(img.src)
          reject(err)
        }
        img.src = URL.createObjectURL(file)
      } catch (err) {
        reject(err)
      }
    })
  }

  async function handleSubmit() {
    if (!imagePreview || !selectedMood) return
    setError('')
    setSubmitting(true)

    const payload = {
      caption,
      mood: selectedMood,
      imageBlob,
      existingImage: initialItem?.image || null,
    }

    try {
      if (initialItem) {
        await onSave?.(initialItem.id, payload)
      } else {
        await onAdd(payload)
      }
      onClose()
    } catch (err) {
      console.error('Error saving inspiration:', err)
      setError('Something went wrong saving this. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="bg-[#111111] border border-zinc-800 w-full max-w-lg max-h-[calc(100dvh-3rem)] overflow-hidden rounded-3xl flex flex-col">

          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6 border-b border-zinc-800">
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] mb-1">
                New Entry
              </p>
              <h2 className="font-editorial text-2xl text-white italic">
                Add Inspiration
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-600 hover:text-white transition-colors duration-200 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-5 sm:px-8 py-6 space-y-6 overflow-y-auto flex-1 min-h-0">

            {/* Image Upload */}
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                Image
              </p>
              <label
                htmlFor="image-upload"
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
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 sm:h-64 object-cover"
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
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Caption */}
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                Caption
              </p>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe the vibe..."
                rows={2}
                className="w-full bg-transparent border border-zinc-800 text-white text-sm font-light px-4 py-3 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors duration-200 resize-none"
              />
            </div>

            {/* Mood Tags */}
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                Mood
              </p>
              <div className="flex flex-wrap gap-2">
                {MOOD_TAGS.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`
                      text-[10px] uppercase tracking-widest px-3.5 py-2.5 sm:px-3 sm:py-1.5 border transition-all duration-200
                      ${selectedMood === mood
                        ? 'border-white text-white bg-white/10'
                        : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                      }
                    `}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {error && (
            <p className="px-5 sm:px-8 text-red-400 text-xs tracking-wide -mt-2 mb-2">{error}</p>
          )}

          {/* Modal Footer */}
          <div className="px-5 sm:px-8 py-5 sm:py-6 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={onClose}
              disabled={submitting}
              className="text-[11px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!imagePreview || !selectedMood || submitting}
              className={`
                text-[11px] uppercase tracking-[0.2em] px-6 py-2.5 transition-all duration-300
                ${imagePreview && selectedMood && !submitting
                  ? 'bg-white text-black hover:bg-zinc-200 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }
              `}
            >
              {submitting ? 'Saving…' : 'Add to Collection'}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default AddInspirationModal