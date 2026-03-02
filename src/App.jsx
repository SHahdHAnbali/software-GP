import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import GalleryRoom from './canvas/GalleryRoom';

function App() {
  return (
    <div className="relative h-screen w-full bg-[#1a1a1a]">
      {/* واجهة المستخدم (UI Layer) */}
      <div className="absolute top-10 left-10 z-10 pointer-events-none">
        <h1 className="text-4xl font-serif text-gold-500 text-white shadow-sm">
          Heritage AI <span className="text-sm font-sans block opacity-70">The Virtual Curator</span>
        </h1>
        <button className="mt-4 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full pointer-events-auto hover:bg-white/20 transition">
          Generate New Art
        </button>
      </div>

      {/* محرك الـ 3D (Canvas Layer) */}
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <GalleryRoom />
          <Environment preset="lobby" background blur={0.5} />
          <ContactShadows opacity={0.5} scale={20} blur={2} far={4.5} />
        </Suspense>
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
      </Canvas>
    </div>
  );
}

export default App;