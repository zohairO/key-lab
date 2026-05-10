import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface SceneProps {
  children?: ReactNode;
}

export function Scene({ children }: SceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 7, 9], fov: 40 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#0b0b0e']} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 4, -3]} intensity={0.25} />

      {children}

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
