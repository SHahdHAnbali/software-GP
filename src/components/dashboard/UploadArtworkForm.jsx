import { useState, useRef } from 'react'
import { useGallery } from '@/contexts/GalleryContext'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Textarea, Select, Alert, Spinner } from '@/components/ui'
import { supabase } from '@/lib/supabase'

const ARTWORK_TYPES = ['Painting', 'Photography', 'Sculpture', 'Digital Art', 'Drawing', 'Printmaking', 'Mixed Media', 'Other']

export default function UploadArtworkForm({ onSuccess, editArtwork = null }) {
  const { createArtwork, updateArtwork } = useGallery()
  const { user } = useAuth()
  const fileRef = useRef()

  const [form, setForm] = useState({
    title: editArtwork?.title || '',
    description: editArtwork?.description || '',
    materials: editArtwork?.materials || '',
    dimensions: editArtwork?.dimensions || '',
    year: editArtwork?.year || new Date().getFullYear().toString(),
    price: editArtwork?.price || '',
    artwork_type: editArtwork?.artwork_type || 'Painting',
    position_x: editArtwork?.position_x ?? 0,
    position_y: editArtwork?.position_y ?? 1.8,
    position_z: editArtwork?.position_z ?? 0,
    rotation_y: editArtwork?.rotation_y ?? 0,
    scale_x: editArtwork?.scale_x ?? 1.5,
    scale_y: editArtwork?.scale_y ?? 1.2,
  })

  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(editArtwork?.image_url || null)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleImageChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.')
      return
    }
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleGenerateDescription = async () => {
    if (!form.title) {
      setError('Please enter a title first.')
      return
    }
    setAiLoading(true)
    setError('')
    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-description', {
        body: {
          title: form.title,
          artwork_type: form.artwork_type,
          materials: form.materials,
          year: form.year,
        },
      })
      if (fnError) throw fnError
      setForm(prev => ({ ...prev, description: data.description }))
    } catch (err) {
      setError('AI description generation failed. Please check your Edge Function configuration.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!editArtwork && !imageFile) {
      setError('Please upload an image.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const artworkData = {
        title: form.title,
        description: form.description,
        materials: form.materials,
        dimensions: form.dimensions,
        year: form.year ? parseInt(form.year) : null,
        price: form.price ? parseFloat(form.price) : null,
        artwork_type: form.artwork_type,
        position_x: parseFloat(form.position_x),
        position_y: parseFloat(form.position_y),
        position_z: parseFloat(form.position_z),
        rotation_x: 0,
        rotation_y: parseFloat(form.rotation_y),
        rotation_z: 0,
        scale_x: parseFloat(form.scale_x),
        scale_y: parseFloat(form.scale_y),
        scale_z: 1,
      }

      if (editArtwork) {
        await updateArtwork(editArtwork.id, artworkData)
      } else {
        await createArtwork(artworkData, imageFile)
      }

      onSuccess?.()
    } catch (err) {
      setError(err.message || 'Failed to save artwork.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Image Upload */}
      {!editArtwork && (
        <div>
          <label className="label">Artwork Image *</label>
          <div
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-sm cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center
              ${preview ? 'border-gallery-600 p-0 aspect-video overflow-hidden' : 'border-gallery-800 hover:border-gallery-600 p-12'}`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-obsidian/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-ivory text-sm font-body">Click to change</span>
                </div>
              </>
            ) : (
              <>
                <svg className="w-10 h-10 text-gallery-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gallery-500 font-body text-sm">Click to upload</p>
                <p className="text-gallery-700 font-mono text-xs mt-1">PNG, JPG, WEBP · Max 5MB</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Title *" name="title" value={form.title} onChange={handleChange} placeholder="Artwork title" required />
        <Select label="Type" name="artwork_type" value={form.artwork_type} onChange={handleChange}>
          {ARTWORK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
      </div>

      {/* Description with AI */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label">Description</label>
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={aiLoading}
            className="flex items-center gap-1.5 text-xs text-gallery-500 hover:text-gallery-300 transition-colors font-mono tracking-wide disabled:opacity-50"
          >
            {aiLoading ? <Spinner size="sm" /> : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            AI Generate
          </button>
        </div>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your artwork..."
          rows={4}
        />
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="Materials" name="materials" value={form.materials} onChange={handleChange} placeholder="Oil on canvas" />
        <Input label="Dimensions" name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="60 × 80 cm" />
        <Input label="Year" name="year" type="number" value={form.year} onChange={handleChange} placeholder="2024" min="1000" max="2099" />
      </div>

      <Input label="Price (USD)" name="price" type="number" value={form.price} onChange={handleChange} placeholder="Leave blank for price on request" min="0" step="0.01" />

      {/* Gallery Positioning */}
      <div className="border-t border-gallery-800/30 pt-6">
        <h4 className="font-display text-lg text-gallery-300 mb-4">Gallery Position</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="label">X (left/right)</label>
            <input
              type="number"
              name="position_x"
              value={form.position_x}
              onChange={handleChange}
              className="input-field"
              step="0.5"
              min="-13"
              max="13"
            />
          </div>
          <div>
            <label className="label">Y (height)</label>
            <input
              type="number"
              name="position_y"
              value={form.position_y}
              onChange={handleChange}
              className="input-field"
              step="0.1"
              min="0.5"
              max="4"
            />
          </div>
          <div>
            <label className="label">Z (depth)</label>
            <input
              type="number"
              name="position_z"
              value={form.position_z}
              onChange={handleChange}
              className="input-field"
              step="0.5"
              min="-23"
              max="23"
            />
          </div>
          <div>
            <label className="label">Rotation Y (rad)</label>
            <input
              type="number"
              name="rotation_y"
              value={form.rotation_y}
              onChange={handleChange}
              className="input-field"
              step="0.1"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="label">Width (scale)</label>
            <input type="number" name="scale_x" value={form.scale_x} onChange={handleChange} className="input-field" step="0.1" min="0.5" max="5" />
          </div>
          <div>
            <label className="label">Height (scale)</label>
            <input type="number" name="scale_y" value={form.scale_y} onChange={handleChange} className="input-field" step="0.1" min="0.5" max="5" />
          </div>
        </div>
        <p className="text-gallery-700 text-xs font-mono mt-2">
          Tip: X ≈ -12 (left wall), X ≈ 12 (right wall). Z ranges from -22 to 22.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          {editArtwork ? 'Save Changes' : 'Upload Artwork'}
        </Button>
      </div>
    </form>
  )
}
