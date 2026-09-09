import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

const BUCKET = 'inspiration-images'

function extractStoragePath(publicUrl) {
  const marker = `/${BUCKET}/`
  const index = publicUrl.indexOf(marker)
  if (index === -1) return null
  return publicUrl.slice(index + marker.length)
}

export function useItems(collectionId) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    if (!collectionId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('collection_id', collectionId)
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching items:', error)
      setLoading(false)
      return
    }

    setItems(data)
    setLoading(false)
  }, [collectionId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  async function uploadImage(blob) {
    const path = `${user.id}/${crypto.randomUUID()}.jpg`
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType: 'image/jpeg', upsert: false })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  async function addItem({ caption, mood, imageBlob }) {
    const imageUrl = await uploadImage(imageBlob)
    const minPosition = items.length ? Math.min(...items.map((i) => i.position)) : 0

    const { data, error } = await supabase
      .from('items')
      .insert([{
        collection_id: collectionId,
        user_id: user.id,
        image: imageUrl,
        caption,
        mood,
        position: minPosition - 1,
      }])
      .select()
      .single()

    if (error) throw error
    setItems((prev) => [data, ...prev])
    return data
  }

  async function updateItem(id, { caption, mood, imageBlob, existingImage }) {
    let imageUrl = existingImage

    if (imageBlob) {
      imageUrl = await uploadImage(imageBlob)
      const oldPath = extractStoragePath(existingImage)
      if (oldPath) {
        await supabase.storage.from(BUCKET).remove([oldPath])
      }
    }

    const { data, error } = await supabase
      .from('items')
      .update({ caption, mood, image: imageUrl })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setItems((prev) => prev.map((item) => (item.id === id ? data : item)))
    return data
  }

  async function deleteItem(id) {
    const item = items.find((i) => i.id === id)
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) throw error

    if (item) {
      const path = extractStoragePath(item.image)
      if (path) {
        await supabase.storage.from(BUCKET).remove([path])
      }
    }

    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  async function reorderItems(newOrder) {
    setItems(newOrder)

    const updates = newOrder.map((item, index) =>
      supabase.from('items').update({ position: index }).eq('id', item.id),
    )
    const results = await Promise.all(updates)
    const failed = results.find((r) => r.error)
    if (failed) {
      console.error('Error saving item order:', failed.error)
    }
  }

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
  }
}