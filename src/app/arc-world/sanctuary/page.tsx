"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Environment, 
  PerspectiveCamera,
  Float,
  Text,
  ContactShadows
} from '@react-three/drei';
import Link from 'next/link';
import { Heart, Home } from 'lucide-react';

function PalaceFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial 
        color="#f0f0f0" 
        roughness={0.1} 
        metalness={0.8} 
      />
    </mesh>
  );
}

function Pillar({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.5, 0.5, 6, 32]} />
      <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.2} />
    </mesh>
  );
}

export default function SanctuaryWorld() {
  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-10 left-10 z-10 text-white flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Heart className="text-red-500 fill-red-500 animate-pulse" size={32} />
          <h1 className="text-5xl font-bold tracking-tighter uppercase italic">The Sanctuary</h1>
        </div>
        <p className="text-orange-400 font-sans text-[10px] font-bold uppercase tracking-[0.5em] ml-1">Palace of the Great Architect</p>
      </div>

      <Link href="/arc-world" className="absolute top-10 right-10 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full transition-all">
        <Home size={20} />
      </Link>

      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, 12]} />
          
          {/* Majestic Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFD700" castShadow />
          <spotLight position={[-10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />

          {/* Palace Environment */}
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="apartment" /> 

          {/* Architectural Elements */}
          <PalaceFloor />
          <Pillar position={[-6, 2, -5]} />
          <Pillar position={[6, 2, -5]} />
          <Pillar position={[-6, 2, 5]} />
          <Pillar position={[6, 2, 5]} />

          {/* The Hero - Placed on a Floating Pedestal */}
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh position={[0, 1, 0]} castShadow>
              <boxGeometry args={[1.2, 2.2, 1.2]} />
              <meshStandardMaterial color="#93A37F" metalness={0.6} roughness={0.2} />
            </mesh>
          </Float>

          <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
          <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
        </Suspense>
      </Canvas>
    </div>
  );
}