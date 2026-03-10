"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  Float,
  ContactShadows,

} from '@react-three/drei';
import Link from 'next/link';
import { Skull, Home, AlertTriangle } from 'lucide-react';

function CrackedEarth() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        color="#1a1a1a" 
        roughness={0.9} 
        metalness={0.1}
      />
    </mesh>
  );
}

function RuinedPillar({ position, scale = 1 }: { position: [number, number, number], scale?: number }) {
  return (
    <mesh position={position} rotation={[Math.random(), 0, Math.random()]} scale={scale}>
      <boxGeometry args={[1, 4, 1]} />
      <meshStandardMaterial color="#333333" roughness={1} />
    </mesh>
  );
}

export default function WastelandWorld() {
  return (
    <div className="w-full h-screen bg-[#0a0a0a] overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-10 left-10 z-10 text-white flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Skull className="text-stone-500 animate-pulse" size={32} />
          <h1 className="text-5xl font-bold tracking-tighter uppercase italic text-stone-200">The Wasteland</h1>
        </div>
        <p className="text-red-600 font-sans text-[10px] font-bold uppercase tracking-[0.5em] ml-1 flex items-center gap-2">
          <AlertTriangle size={12} /> High Danger Zone: Rescue Characters
        </p>
      </div>

      <Link href="/arc-world" className="absolute top-10 right-10 z-10 bg-white/5 hover:bg-red-900/20 backdrop-blur-md text-white p-4 rounded-full transition-all border border-white/10">
        <Home size={20} />
      </Link>

      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[8, 5, 15]} />
          
          {/* Gritty Lighting */}
          <ambientLight intensity={0.1} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#ff0000" castShadow />
          <spotLight position={[0, 10, 0]} intensity={1.5} color="#ffffff" angle={0.5} penumbra={1} />

          {/* Environmental Effects */}
         <fog attach="fog" args={['#444444', 10, 50]} />
          <Environment preset="night" /> 

          {/* Scenery */}
          <CrackedEarth />
          <RuinedPillar position={[-8, 0, -10]} scale={1.5} />
          <RuinedPillar position={[5, -0.5, -8]} scale={0.8} />
          <RuinedPillar position={[-12, 0, 5]} scale={2} />
          
          {/* The Hero - Struggling in the Wasteland */}
          <Float speed={1} rotationIntensity={2} floatIntensity={0.5}>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[1.2, 2.2, 1.2]} />
              <meshStandardMaterial color="#4a5d3a" metalness={0.1} roughness={0.8} />
            </mesh>
          </Float>

          <ContactShadows opacity={0.8} scale={15} blur={3} far={4.5} />
          <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
        </Suspense>
      </Canvas>
    </div>
  );
}