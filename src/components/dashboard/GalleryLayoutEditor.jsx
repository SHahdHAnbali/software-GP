import { useState, useRef, useCallback } from 'react'
import { useGallery } from '@/contexts/GalleryContext'
import { Button, Alert } from '@/components/ui'

// Room dimensions (scaled for display)
const ROOM_W = 26 // total width in 3D units (-13 to 13)
const ROOM_D = 46 // total depth in 3D units (-23 to 23)
const DISPLAY_W = 520
const DISPLAY_H = 460
const SCALE_X = DISPLAY_W / ROOM_W
const SCALE_Z = DISPLAY_H / ROOM_D

function to2D(x, z) {
  return {
    left: ((x + 13) * SCALE_X),
    top: ((z + 23) * SCALE_Z),
  }
}

function from2D(left, top) {
  return {
    x: Math.round(((left / SCALE_X) - 13) * 10) / 10,
    z: Math.round(((top / SCALE_Z) - 23) * 10) / 10,
  }
}

export default function GalleryLayoutEditor() {
  const { myArtworks, updateArtwork } = useGallery()
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(myArtworks.map(a => [a.id, { x: a.position_x ?? 0, z: a.position_z ?? 0 }]))
  )
  const [dragging, setDragging] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const containerRef = useRef()

  const handleMouseDown = useCallback((e, id) => {
    e.preventDefault()
    setDragging(id)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const left = Math.max(0, Math.min(DISPLAY_W, e.clientX - rect.left))
    const top = Math.max(0, Math.min(DISPLAY_H, e.clientY - rect.top))
    const { x, z } = from2D(left, top)
    setPositions(prev => ({ ...prev, [dragging]: { x, z } }))
  }, [dragging])

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  const handleSaveAll = async () => {
    setSaving(true)
    setError('')
    try {
      await Promise.all(
        myArtworks.map(art =>
          updateArtwork(art.id, {
            position_x: positions[art.id]?.x ?? art.position_x,
            position_z: positions[art.id]?.z ?? art.position_z,
          })
        )
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError('Failed to save layout: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-xl text-ivory">Gallery Layout</h3>
          <p className="text-gallery-500 text-xs font-mono mt-1">Drag artworks to position them in the 3D gallery</p>
        </div>
        <Button onClick={handleSaveAll} loading={saving} variant={saved ? 'secondary' : 'primary'}>
          {saved ? '✓ Saved' : 'Save Layout'}
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-4" />}

      <div className="overflow-auto">
        <div
          ref={containerRef}
          className="relative bg-gallery-950/60 border border-gallery-800/30 rounded-sm select-none"
          style={{ width: DISPLAY_W, height: DISPLAY_H }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Room outline */}
          <div className="absolute inset-0">
            {/* Walls labels */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-gallery-800 text-xs font-mono">BACK WALL</div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-gallery-800 text-xs font-mono">FRONT WALL</div>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-gallery-800 text-xs font-mono">LEFT</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-gallery-800 text-xs font-mono">RIGHT</div>

            {/* Grid lines */}
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="absolute border-gallery-900 border-dashed opacity-30"
                style={{
                  left: (i * DISPLAY_W) / 8,
                  top: 0,
                  width: 1,
                  height: '100%',
                  borderWidth: '0 0 0 1px',
                }}
              />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="absolute border-gallery-900 border-dashed opacity-30"
                style={{
                  top: (i * DISPLAY_H) / 6,
                  left: 0,
                  height: 1,
                  width: '100%',
                  borderWidth: '1px 0 0 0',
                }}
              />
            ))}

            {/* Center dot */}
            <div
              className="absolute w-2 h-2 rounded-full bg-gallery-800/50 -translate-x-1/2 -translate-y-1/2"
              style={{ left: DISPLAY_W / 2, top: DISPLAY_H / 2 }}
            />
          </div>

          {/* Artwork dots */}
          {myArtworks.map(art => {
            const pos = positions[art.id] || { x: art.position_x ?? 0, z: art.position_z ?? 0 }
            const { left, top } = to2D(pos.x, pos.z)

            return (
              <div
                key={art.id}
                className={`absolute cursor-grab active:cursor-grabbing group transition-shadow ${
                  dragging === art.id ? 'z-50 shadow-2xl shadow-gallery-500/30' : 'z-10'
                }`}
                style={{
                  left: left - 30,
                  top: top - 30,
                  width: 60,
                  height: 60,
                }}
                onMouseDown={e => handleMouseDown(e, art.id)}
              >
                <div className={`w-full h-full border-2 overflow-hidden rounded-sm transition-all ${
                  dragging === art.id ? 'border-gallery-300 scale-110' : 'border-gallery-600 hover:border-gallery-400'
                }`}>
                  <img
                    src={art.image_url}
                    alt={art.title}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
                </div>
                {/* Label tooltip */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono text-gallery-400 opacity-0 group-hover:opacity-100 transition-opacity bg-obsidian/90 px-2 py-0.5 rounded">
                  {art.title} ({pos.x.toFixed(1)}, {pos.z.toFixed(1)})
                </div>
              </div>
            )
          })}

          {myArtworks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gallery-700 font-body text-sm">Upload artworks to position them here</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-6 text-gallery-700 text-xs font-mono">
        <span>Width: {ROOM_W} units</span>
        <span>Depth: {ROOM_D} units</span>
        <span>Left wall: X = -13</span>
        <span>Right wall: X = 13</span>
      </div>
    </div>
  )
}
