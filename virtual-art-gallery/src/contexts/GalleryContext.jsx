import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'

const GalleryContext = createContext(null)

export function GalleryProvider({ children }) {
  const { user } = useAuth()
  const [artworks, setArtworks] = useState([])
  const [myArtworks, setMyArtworks] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchArtworks = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          *,
          profiles:artist_id (
            id, username, gallery_name, profile_pic
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setArtworks(data || [])
    } catch (err) {
      console.error('Error fetching artworks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMyArtworks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('artist_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMyArtworks(data || [])
    } catch (err) {
      console.error('Error fetching my artworks:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  async function uploadArtwork(file) {
    if (!user) throw new Error('Not authenticated')
    if (file.size > 5 * 1024 * 1024) throw new Error('File size must be under 5MB')

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('artworks')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('artworks')
      .getPublicUrl(fileName)

    return publicUrl
  }

  async function createArtwork(artworkData, imageFile) {
    if (!user) throw new Error('Not authenticated')

    const imageUrl = await uploadArtwork(imageFile)

    const { data, error } = await supabase
      .from('artworks')
      .insert({
        ...artworkData,
        image_url: imageUrl,
        artist_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    await fetchMyArtworks()
    return data
  }

  async function updateArtwork(id, updates) {
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('artworks')
      .update(updates)
      .eq('id', id)
      .eq('artist_id', user.id)
      .select()
      .single()

    if (error) throw error
    setMyArtworks(prev => prev.map(a => a.id === id ? data : a))
    setArtworks(prev => prev.map(a => a.id === id ? { ...a, ...data } : a))
    return data
  }

  async function deleteArtwork(id) {
    if (!user) throw new Error('Not authenticated')

    const artwork = myArtworks.find(a => a.id === id)
    if (artwork?.image_url) {
      const path = artwork.image_url.split('/artworks/')[1]
      if (path) {
        await supabase.storage.from('artworks').remove([path])
      }
    }

    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id)
      .eq('artist_id', user.id)

    if (error) throw error
    setMyArtworks(prev => prev.filter(a => a.id !== id))
    setArtworks(prev => prev.filter(a => a.id !== id))
  }

  // Realtime subscription
  useEffect(() => {
    fetchArtworks()

    const channel = supabase
      .channel('artworks-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'artworks',
      }, async (payload) => {
        // Fetch full artwork with profile
        const { data } = await supabase
          .from('artworks')
          .select(`*, profiles:artist_id (id, username, gallery_name, profile_pic)`)
          .eq('id', payload.new.id)
          .single()
        if (data) setArtworks(prev => [data, ...prev])
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'artworks',
      }, (payload) => {
        setArtworks(prev => prev.map(a => a.id === payload.new.id ? { ...a, ...payload.new } : a))
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'artworks',
      }, (payload) => {
        setArtworks(prev => prev.filter(a => a.id !== payload.old.id))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [fetchArtworks])

  useEffect(() => {
    if (user) fetchMyArtworks()
  }, [user, fetchMyArtworks])

  const value = {
    artworks,
    myArtworks,
    loading,
    fetchArtworks,
    fetchMyArtworks,
    createArtwork,
    updateArtwork,
    deleteArtwork,
    uploadArtwork,
  }

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

export function useGallery() {
  const ctx = useContext(GalleryContext)
  if (!ctx) throw new Error('useGallery must be used within GalleryProvider')
  return ctx
}
