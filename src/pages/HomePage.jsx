import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useGallery } from '@/contexts/GalleryContext'

export default function HomePage() {
  const { user } = useAuth()
  const { artworks } = useGallery()

  const featured = artworks.slice(0, 3)

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(192,154,114,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(192,154,114,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-gallery-700/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-gallery-600/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <p className="text-gallery-500 text-xs tracking-[0.4em] uppercase font-mono mb-8 animate-fade-in">
            — An Immersive Experience —
          </p>

          <h1 className="font-display text-6xl md:text-8xl text-ivory leading-none mb-6 animate-slide-up">
            Virtual
            <br />
            <span className="text-gradient italic">Art Gallery</span>
          </h1>

          <p className="text-gallery-400 font-body text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Step inside a living gallery where artists share their vision and visitors explore
            art in an immersive 3D environment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/gallery" className="btn-primary text-sm px-10 py-3">
              Enter Gallery
            </Link>
            {!user && (
              <Link to="/register" className="btn-secondary text-sm px-10 py-3">
                Join as Artist
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { label: 'Artworks', value: artworks.length || '∞' },
              { label: 'Artists', value: '3D' },
              { label: 'Experience', value: 'Live' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl text-gallery-300">{stat.value}</div>
                <div className="text-gallery-600 text-xs uppercase tracking-widest font-mono mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gallery-700">
          <span className="text-xs font-mono tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gallery-700 to-transparent" />
        </div>
      </section>

      {/* Featured Artworks */}
      {featured.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-gallery-600 text-xs tracking-widest uppercase font-mono mb-2">Collection</p>
                <h2 className="font-display text-4xl text-ivory">Recent Works</h2>
              </div>
              <Link to="/explore" className="text-sm text-gallery-500 hover:text-gallery-300 transition-colors font-body tracking-wide">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              {featured.map((artwork, i) => (
                <Link
                  key={artwork.id}
                  to="/explore"
                  className="group relative overflow-hidden aspect-square block"
                >
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="font-display text-xl text-ivory">{artwork.title}</h3>
                    <p className="text-gallery-400 text-sm font-body mt-1">
                      {artwork.profiles?.username || 'Artist'}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 text-gallery-600 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    0{i + 1}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-24 px-6 border-t border-gallery-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl text-ivory mb-4">A New Way to Experience Art</h2>
            <p className="text-gallery-500 font-body max-w-xl mx-auto">
              Our platform bridges the physical and digital worlds of art.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: '3D Immersion',
                desc: 'Walk through a fully realized 3D gallery environment with realistic lighting and spatial audio.',
              },
              {
                num: '02',
                title: 'Artist Tools',
                desc: 'Powerful dashboard for artists to upload, position, and curate their works with precision.',
              },
              {
                num: '03',
                title: 'AI Descriptions',
                desc: 'AI-powered artwork descriptions help artists articulate their vision and engage visitors.',
              },
            ].map(feature => (
              <div key={feature.num} className="card p-8 group hover:border-gallery-700/50 transition-colors">
                <div className="font-mono text-gallery-700 text-xs mb-6">{feature.num}</div>
                <div className="w-8 h-px bg-gallery-600 mb-4 group-hover:w-12 group-hover:bg-gallery-400 transition-all duration-300" />
                <h3 className="font-display text-xl text-ivory mb-3">{feature.title}</h3>
                <p className="text-gallery-500 font-body text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="card p-12">
              <h2 className="font-display text-4xl text-ivory mb-4">Ready to Share Your Art?</h2>
              <p className="text-gallery-400 font-body mb-8">
                Join our community of artists and give your work the immersive showcase it deserves.
              </p>
              <Link to="/register" className="btn-primary text-sm px-12 py-3">
                Create Artist Account
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gallery-900/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-display text-gallery-700">Virtual Art Gallery</span>
          <span className="font-mono text-gallery-800 text-xs">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
