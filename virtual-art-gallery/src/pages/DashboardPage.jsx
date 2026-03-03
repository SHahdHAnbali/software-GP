import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useGallery } from '@/contexts/GalleryContext'
import { Button, Modal, Alert, Badge, PriceTag, EmptyState, Spinner } from '@/components/ui'
import UploadArtworkForm from '@/components/dashboard/UploadArtworkForm'
import GalleryLayoutEditor from '@/components/dashboard/GalleryLayoutEditor'

const TABS = ['My Artworks', 'Upload', 'Gallery Layout']

function ArtworkCard({ artwork, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${artwork.title}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await onDelete(artwork.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="card group overflow-hidden hover:border-gallery-700/40 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {artwork.artwork_type && <Badge>{artwork.artwork_type}</Badge>}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg text-ivory mb-1 truncate">{artwork.title}</h3>
        <div className="flex items-center justify-between mb-3">
          <PriceTag price={artwork.price} />
          {artwork.year && <span className="text-gallery-700 font-mono text-xs">{artwork.year}</span>}
        </div>

        {artwork.description && (
          <p className="text-gallery-600 font-body text-xs leading-relaxed mb-4 line-clamp-2">
            {artwork.description}
          </p>
        )}

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => onEdit(artwork)} className="flex-1 py-1.5 text-xs">
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleting}
            className="flex-1 py-1.5 text-xs"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { profile } = useAuth()
  const { myArtworks, loading, deleteArtwork, fetchMyArtworks } = useGallery()
  const [tab, setTab] = useState('My Artworks')
  const [editArtwork, setEditArtwork] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleEditSuccess = async () => {
    setEditArtwork(null)
    await fetchMyArtworks()
    setSuccess('Artwork updated.')
  }

  const handleUploadSuccess = async () => {
    await fetchMyArtworks()
    setTab('My Artworks')
    setSuccess('Artwork uploaded successfully!')
  }

  return (
    <div className="min-h-screen bg-obsidian pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-gallery-600 text-xs tracking-widest uppercase font-mono mb-2">Artist Dashboard</p>
            <h1 className="font-display text-4xl text-ivory mb-1">
              {profile?.gallery_name || `${profile?.username}'s Gallery`}
            </h1>
            <p className="text-gallery-500 font-body text-sm">
              {myArtworks.length} artwork{myArtworks.length !== 1 ? 's' : ''} in collection
            </p>
          </div>
          <Button onClick={() => setTab('Upload')}>
            + Upload Artwork
          </Button>
        </div>

        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />}
        {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gallery-800/30 mb-8">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-body tracking-wide transition-all border-b-2 -mb-px ${
                tab === t
                  ? 'border-gallery-400 text-gallery-300'
                  : 'border-transparent text-gallery-600 hover:text-gallery-400'
              }`}
            >
              {t}
              {t === 'My Artworks' && (
                <span className="ml-2 font-mono text-xs text-gallery-700">({myArtworks.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'My Artworks' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : myArtworks.length === 0 ? (
              <EmptyState
                title="No artworks yet"
                description="Upload your first artwork to start building your virtual gallery."
                icon={
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                  </svg>
                }
                action={<Button onClick={() => setTab('Upload')}>Upload First Artwork</Button>}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {myArtworks.map(artwork => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onEdit={art => { setEditArtwork(art); setTab('Upload') }}
                    onDelete={deleteArtwork}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'Upload' && (
          <div className="max-w-2xl">
            <div className="card p-8">
              <h2 className="font-display text-2xl text-ivory mb-6">
                {editArtwork ? `Editing: ${editArtwork.title}` : 'Upload New Artwork'}
              </h2>
              <UploadArtworkForm
                onSuccess={editArtwork ? handleEditSuccess : handleUploadSuccess}
                editArtwork={editArtwork}
              />
              {editArtwork && (
                <button
                  onClick={() => setEditArtwork(null)}
                  className="mt-4 text-gallery-600 hover:text-gallery-400 text-sm font-body"
                >
                  Cancel editing
                </button>
              )}
            </div>
          </div>
        )}

        {tab === 'Gallery Layout' && (
          <div className="card p-8">
            <GalleryLayoutEditor />
          </div>
        )}
      </div>
    </div>
  )
}
