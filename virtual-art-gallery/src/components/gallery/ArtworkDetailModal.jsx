import { PriceTag, Badge } from '@/components/ui'

export default function ArtworkDetailModal({ artwork, onClose }) {
  if (!artwork) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-obsidian/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl glass-panel rounded-sm shadow-2xl overflow-hidden animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto">
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="w-full h-full object-cover"
              style={{ maxHeight: '500px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-obsidian/20 hidden md:block" />
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gallery-500 hover:text-ivory transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-2 mb-4">
                {artwork.artwork_type && <Badge>{artwork.artwork_type}</Badge>}
                {artwork.year && (
                  <span className="text-gallery-600 font-mono text-xs">{artwork.year}</span>
                )}
              </div>

              <h2 className="font-display text-3xl text-ivory mb-2 leading-tight">{artwork.title}</h2>

              <div className="flex items-center gap-2 mb-6">
                {artwork.profiles?.profile_pic ? (
                  <img
                    src={artwork.profiles.profile_pic}
                    alt={artwork.profiles.username}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gallery-800 flex items-center justify-center">
                    <span className="text-xs text-gallery-400">
                      {artwork.profiles?.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-gallery-400 font-body text-sm">
                  {artwork.profiles?.username || 'Unknown Artist'}
                </span>
              </div>

              {artwork.description && (
                <p className="text-gallery-400 font-body text-sm leading-relaxed mb-6">
                  {artwork.description}
                </p>
              )}

              <div className="space-y-3">
                {artwork.materials && (
                  <div className="flex justify-between items-center py-2 border-b border-gallery-800/30">
                    <span className="text-gallery-600 text-xs uppercase tracking-widest font-mono">Materials</span>
                    <span className="text-gallery-300 font-body text-sm">{artwork.materials}</span>
                  </div>
                )}
                {artwork.dimensions && (
                  <div className="flex justify-between items-center py-2 border-b border-gallery-800/30">
                    <span className="text-gallery-600 text-xs uppercase tracking-widest font-mono">Dimensions</span>
                    <span className="text-gallery-300 font-body text-sm">{artwork.dimensions}</span>
                  </div>
                )}
                {artwork.year && (
                  <div className="flex justify-between items-center py-2 border-b border-gallery-800/30">
                    <span className="text-gallery-600 text-xs uppercase tracking-widest font-mono">Year</span>
                    <span className="text-gallery-300 font-body text-sm">{artwork.year}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <span className="text-gallery-600 text-xs uppercase tracking-widest font-mono block mb-1">Price</span>
                <PriceTag price={artwork.price} />
              </div>
              {artwork.profiles?.gallery_name && (
                <div className="text-right">
                  <span className="text-gallery-600 text-xs uppercase tracking-widest font-mono block mb-1">Gallery</span>
                  <span className="text-gallery-400 font-body text-sm">{artwork.profiles.gallery_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
