import { useState } from 'react'
import { useGallery } from '@/contexts/GalleryContext'
import { Modal, Badge, PriceTag, EmptyState, Spinner } from '@/components/ui'

function ArtworkCard({ artwork, onClick }) {
  return (
    <div
      className="group relative cursor-pointer overflow-hidden bg-gallery-950/40 border border-gallery-800/20 hover:border-gallery-700/50 transition-all duration-300"
      onClick={() => onClick(artwork)}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {artwork.artwork_type && (
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge>{artwork.artwork_type}</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg text-ivory mb-1 truncate">{artwork.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gallery-500 text-xs font-body truncate">
            {artwork.profiles?.username || 'Unknown'}
          </span>
          {artwork.year && (
            <span className="text-gallery-700 text-xs font-mono">· {artwork.year}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <PriceTag price={artwork.price} />
          {artwork.profiles?.gallery_name && (
            <span className="text-gallery-700 text-xs font-mono truncate ml-2">
              {artwork.profiles.gallery_name}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  const { artworks, loading } = useGallery()
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const types = ['all', ...new Set(artworks.map(a => a.artwork_type).filter(Boolean))]

  const filtered = artworks.filter(a => {
    const matchType = filter === 'all' || a.artwork_type === filter
    const matchSearch = !search || 
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.profiles?.username?.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <div className="min-h-screen bg-obsidian pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-gallery-600 text-xs tracking-widest uppercase font-mono mb-2">Browse</p>
          <h1 className="font-display text-4xl text-ivory mb-6">Explore Works</h1>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or artist..."
              className="input-field flex-1"
            />
            <div className="flex gap-2 flex-wrap">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 text-xs font-mono uppercase tracking-widest rounded-sm border transition-all ${
                    filter === type
                      ? 'border-gallery-400 text-gallery-300 bg-gallery-900/30'
                      : 'border-gallery-800 text-gallery-600 hover:border-gallery-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No artworks found"
            description={search ? 'Try a different search term.' : 'No artworks have been uploaded yet.'}
            icon={
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        ) : (
          <>
            <p className="text-gallery-600 text-xs font-mono mb-6">
              {filtered.length} work{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} onClick={setSelected} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-obsidian/90 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-3xl glass-panel rounded-sm shadow-2xl overflow-hidden animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square md:aspect-auto">
                <img src={selected.image_url} alt={selected.title} className="w-full h-full object-cover" style={{ maxHeight: '500px' }} />
              </div>
              <div className="p-8">
                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gallery-500 hover:text-ivory">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex gap-2 mb-4">
                  {selected.artwork_type && <Badge>{selected.artwork_type}</Badge>}
                </div>
                <h2 className="font-display text-3xl text-ivory mb-2">{selected.title}</h2>
                <p className="text-gallery-500 font-body text-sm mb-4">
                  by {selected.profiles?.username || 'Unknown Artist'}
                  {selected.year && `, ${selected.year}`}
                </p>
                {selected.description && (
                  <p className="text-gallery-400 font-body text-sm leading-relaxed mb-6">{selected.description}</p>
                )}
                <div className="space-y-2">
                  {selected.materials && (
                    <div className="flex justify-between py-2 border-b border-gallery-800/30">
                      <span className="text-gallery-600 text-xs uppercase font-mono">Materials</span>
                      <span className="text-gallery-300 text-sm">{selected.materials}</span>
                    </div>
                  )}
                  {selected.dimensions && (
                    <div className="flex justify-between py-2 border-b border-gallery-800/30">
                      <span className="text-gallery-600 text-xs uppercase font-mono">Dimensions</span>
                      <span className="text-gallery-300 text-sm">{selected.dimensions}</span>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <span className="text-gallery-600 text-xs font-mono block mb-1">Price</span>
                    <PriceTag price={selected.price} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
