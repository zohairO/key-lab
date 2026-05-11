import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Theme } from '../../types';

interface SceneProps {
  children?: ReactNode;
  theme: Theme;
}

export function Scene({ children, theme }: SceneProps) {
  const dark = theme === 'dark';
  const bgColor = dark ? '#0b0b0e' : '#f4f4f5';
  const ambient = dark ? 0.35 : 0.65;
  const directional = dark ? 1.1 : 0.85;
  const fill = dark ? 0.25 : 0.35;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 9, 13.5], fov: 38 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={[bgColor]} />

      <ambientLight intensity={ambient} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={directional}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 4, -3]} intensity={fill} />

      {children}

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={5}
        maxDistance={28}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
