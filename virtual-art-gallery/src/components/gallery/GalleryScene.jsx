import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import {
  Environment,
  PerspectiveCamera,
  useTexture,
  Text,
  Html,
  PointerLockControls,
} from '@react-three/drei'
import * as THREE from 'three'
import { useGallery } from '@/contexts/GalleryContext'

// ─── Artwork Frame ─────────────────────────────────────────────────────────────
function ArtworkFrame({ artwork, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(artwork.image_url, tex => {
      tex.colorSpace = THREE.SRGBColorSpace
      setTexture(tex)
    })
  }, [artwork.image_url])

  const px = artwork.position_x ?? 0
  const py = artwork.position_y ?? 1.5
  const pz = artwork.position_z ?? 0
  const rx = artwork.rotation_x ?? 0
  const ry = artwork.rotation_y ?? 0
  const rz = artwork.rotation_z ?? 0
  const sx = artwork.scale_x ?? 1.5
  const sy = artwork.scale_y ?? 1.2

  useFrame(() => {
    if (meshRef.current) {
      const target = hovered ? 1.05 : 1
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, target * sx, 0.05)
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, target * sy, 0.05)
    }
  })

  return (
    <group position={[px, py, pz]} rotation={[rx, ry, rz]}>
      {/* Frame backing */}
      <mesh
        ref={meshRef}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
        onClick={() => onClick(artwork)}
        castShadow
      >
        <planeGeometry args={[sx + 0.08, sy + 0.08]} />
        <meshStandardMaterial color={hovered ? '#d4bfa0' : '#5a3e28'} />
      </mesh>

      {/* Artwork image */}
      {texture && (
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[sx, sy]} />
          <meshStandardMaterial map={texture} />
        </mesh>
      )}

      {/* Placeholder while loading */}
      {!texture && (
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[sx, sy]} />
          <meshStandardMaterial color="#2a1a0e" />
        </mesh>
      )}

      {/* Label */}
      <Text
        position={[0, -(sy / 2 + 0.25), 0.02]}
        fontSize={0.12}
        color="#c09a72"
        anchorX="center"
        font="/fonts/Playfair_Display/static/PlayfairDisplay-Regular.ttf"
      >
        {artwork.title}
      </Text>
      <Text
        position={[0, -(sy / 2 + 0.44), 0.02]}
        fontSize={0.09}
        color="#7f5237"
        anchorX="center"
      >
        {artwork.profiles?.username || 'Unknown Artist'}
      </Text>

      {/* Spotlight */}
      <spotLight
        position={[0, 3, 2]}
        target-position={[px, py, pz]}
        angle={0.3}
        penumbra={0.3}
        intensity={hovered ? 4 : 2}
        color="#fff8e7"
        castShadow
      />
    </group>
  )
}

// ─── Gallery Room ───────────────────────────────────────────────────────────────
function GalleryRoom() {
  const roomW = 30
  const roomH = 5
  const roomD = 50

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial color="#1a1208" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomH, 0]} receiveShadow>
        <planeGeometry args={[roomW, roomD]} />
        <meshStandardMaterial color="#0d0d12" roughness={1} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, roomH / 2, -roomD / 2]} receiveShadow>
        <planeGeometry args={[roomW, roomH]} />
        <meshStandardMaterial color="#111114" roughness={0.9} />
      </mesh>

      {/* Front wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, roomH / 2, roomD / 2]} receiveShadow>
        <planeGeometry args={[roomW, roomH]} />
        <meshStandardMaterial color="#111114" roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-roomW / 2, roomH / 2, 0]} receiveShadow>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial color="#0f0f13" roughness={0.9} />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[roomW / 2, roomH / 2, 0]} receiveShadow>
        <planeGeometry args={[roomD, roomH]} />
        <meshStandardMaterial color="#0f0f13" roughness={0.9} />
      </mesh>

      {/* Ceiling strip lights */}
      {[-8, 0, 8].map(x => (
        <group key={x}>
          {[-15, -5, 5, 15].map(z => (
            <pointLight key={z} position={[x, roomH - 0.2, z]} intensity={0.5} color="#fff5e0" distance={12} />
          ))}
        </group>
      ))}

      {/* Ambient */}
      <ambientLight intensity={0.15} color="#1a1210" />
      <directionalLight position={[0, roomH, 0]} intensity={0.3} color="#fff5e0" />
    </group>
  )
}

// ─── Camera Controls (WASD + Mouse) ────────────────────────────────────────────
function FPSControls() {
  const { camera } = useThree()
  const keys = useRef({})
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())

  useEffect(() => {
    const onKey = (e) => {
      keys.current[e.code] = e.type === 'keydown'
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
    }
  }, [])

  useEffect(() => {
    camera.position.set(0, 1.7, 18)
  }, [camera])

  useFrame((_, delta) => {
    const speed = 8
    direction.current.set(0, 0, 0)

    if (keys.current['KeyW'] || keys.current['ArrowUp']) direction.current.z -= 1
    if (keys.current['KeyS'] || keys.current['ArrowDown']) direction.current.z += 1
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) direction.current.x -= 1
    if (keys.current['KeyD'] || keys.current['ArrowRight']) direction.current.x += 1

    direction.current.normalize().multiplyScalar(speed * delta)
    direction.current.applyEuler(camera.rotation)
    direction.current.y = 0

    camera.position.add(direction.current)

    // Clamp to room boundaries
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -13, 13)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -23, 23)
    camera.position.y = 1.7
  })

  return null
}

// ─── Layout helper: auto-arrange artworks ─────────────────────────────────────
function computeDefaultPositions(artworks) {
  return artworks.map((art, i) => {
    // If already has positions, use them
    if (art.position_x != null) return art

    const side = i % 2 === 0 ? -1 : 1
    const row = Math.floor(i / 2)
    const x = side * 12
    const z = -15 + row * 6
    const ry = side === -1 ? Math.PI / 2 : -Math.PI / 2

    return { ...art, position_x: x, position_y: 1.8, position_z: z, rotation_x: 0, rotation_y: ry, rotation_z: 0 }
  })
}

// ─── Main Gallery Scene ────────────────────────────────────────────────────────
export default function GalleryScene({ onArtworkClick }) {
  const { artworks } = useGallery()
  const [lockedControls, setLockedControls] = useState(false)
  const positioned = computeDefaultPositions(artworks)

  return (
    <div className="relative w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault fov={75} near={0.1} far={200} />
        <FPSControls />
        <PointerLockControls
          onLock={() => setLockedControls(true)}
          onUnlock={() => setLockedControls(false)}
        />

        <Suspense fallback={null}>
          <GalleryRoom />
          {positioned.map(artwork => (
            <ArtworkFrame
              key={artwork.id}
              artwork={artwork}
              onClick={onArtworkClick}
            />
          ))}
        </Suspense>
      </Canvas>

      {/* Controls hint */}
      {!lockedControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-obsidian/80 backdrop-blur-sm border border-gallery-800/50 rounded-sm px-8 py-6 text-center pointer-events-auto">
            <p className="font-display text-xl text-ivory mb-2">Click to Enter Gallery</p>
            <p className="text-gallery-500 font-body text-sm">Use WASD / Arrow keys to move, Mouse to look</p>
            <p className="text-gallery-700 font-mono text-xs mt-2">Press Esc to exit free-look mode</p>
          </div>
        </div>
      )}

      {/* Mini HUD */}
      {lockedControls && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6 text-gallery-600 font-mono text-xs tracking-widest">
          <span>WASD to move</span>
          <span>·</span>
          <span>Click artworks for details</span>
          <span>·</span>
          <span>Esc to unlock</span>
        </div>
      )}

      {/* Crosshair */}
      {lockedControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-4 h-4">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gallery-500/50 -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gallery-500/50 -translate-x-1/2" />
          </div>
        </div>
      )}
    </div>
  )
}
