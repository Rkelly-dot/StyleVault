import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    cover: row.cover,
    itemCount: row.items?.[0]?.count ?? 0,
  }
}

export function useCollections() {
  const { user } = useAuth()
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCollections = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('collections')
      .select('*, items(count)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching collections:', error)
      setLoading(false)
      return
    }

    setCollections(data.map(mapRow))
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  async function createCollection({ name, cover }) {
    const { data, error } = await supabase
      .from('collections')
      .insert([{ name, cover, user_id: user.id }])
      .select('*, items(count)')
      .single()

    if (error) throw error
    setCollections((prev) => [mapRow(data), ...prev])
    return mapRow(data)
  }

  async function updateCollection(id, updates) {
    const { data, error } = await supabase
      .from('collections')
      .update(updates)
      .eq('id', id)
      .select('*, items(count)')
      .single()

    if (error) throw error
    setCollections((prev) => prev.map((c) => (c.id === id ? mapRow(data) : c)))
    return mapRow(data)
  }

  async function deleteCollection(id) {
    const { error } = await supabase.from('collections').delete().eq('id', id)
    if (error) throw error
    setCollections((prev) => prev.filter((c) => c.id !== id))
  }

  return {
    collections,
    loading,
    createCollection,
    updateCollection,
    deleteCollection,
    refetch: fetchCollections,
  }
}