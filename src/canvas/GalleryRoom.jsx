import React from 'react';

const GalleryRoom = () => {
  return (
    <group>
      {/* الأرضية التقليدية */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#654f33" roughness={0.9} />
      </mesh>

      {/* الجدار الرئيسي */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#f5f5d0" />
      </mesh>
      
      {/* إضاءة موجهة للجدار */}
      <spotLight position={[0, 5, 2]} angle={0.3} penumbra={1} intensity={2} castShadow />
    </group>
  );
};

export default GalleryRoom;