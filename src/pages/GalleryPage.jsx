import { useState, Suspense } from 'react'
import { PageLoader } from '@/components/ui'
import GalleryScene from '@/components/gallery/GalleryScene'
import ArtworkDetailModal from '@/components/gallery/ArtworkDetailModal'
import { useGallery } from '@/contexts/GalleryContext'

export default function GalleryPage() {
  const { artworks, loading } = useGallery()
  const [selectedArtwork, setSelectedArtwork] = useState(null)

  if (loading) return <PageLoader text="Loading Gallery..." />

  return (
    <div className="fixed inset-0 bg-obsidian">
      {/* 3D Canvas takes full screen */}
      <div className="w-full h-full">
        <Suspense fallback={<PageLoader text="Entering Gallery..." />}>
          <GalleryScene onArtworkClick={setSelectedArtwork} />
        </Suspense>
      </div>

      {/* Nav overlay at top */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-obsidian/80 to-transparent pointer-events-none">
        <div>
          <h1 className="font-display text-xl text-ivory">Virtual Gallery</h1>
          <p className="text-gallery-500 font-body text-xs">
            {artworks.length} artwork{artworks.length !== 1 ? 's' : ''} on display
          </p>
        </div>
        <a
          href="/"
          className="pointer-events-auto text-xs text-gallery-500 hover:text-gallery-300 transition-colors font-mono tracking-widest uppercase"
        >
          ← Exit
        </a>
      </div>

      {/* Artwork detail modal */}
      <ArtworkDetailModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />
    </div>
  )
}
