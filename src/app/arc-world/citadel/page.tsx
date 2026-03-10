"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  Float,
  ContactShadows,
  Grid
} from '@react-three/drei';
import Link from 'next/link';
import { Shield, Home, Cpu } from 'lucide-react';

function DataCrystal({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={4} rotationIntensity={2} floatIntensity={1}>
      <mesh position={position}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={2} transparent opacity={0.7} />
      </mesh>
    </Float>
  );
}

export default function CitadelWorld() {
  return (
    <div className="w-full h-screen bg-[#02040a] overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-10 left-10 z-10 text-white flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-400 animate-pulse" size={32} />
          <h1 className="text-5xl font-bold tracking-tighter uppercase italic text-blue-100">The Citadel</h1>
        </div>
        <p className="text-blue-400 font-sans text-[10px] font-bold uppercase tracking-[0.5em] ml-1 flex items-center gap-2">
          <Cpu size={12} /> Community Hub & Resource Exchange
        </p>
      </div>

      <Link href="/arc-world" className="absolute top-10 right-10 z-10 bg-blue-900/20 hover:bg-blue-600/40 backdrop-blur-md text-white p-4 rounded-full transition-all border border-blue-500/30">
        <Home size={20} />
      </Link>

      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 8, 15]} />
          
          {/* Cyberpunk Lighting */}
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00ffff" castShadow />
          <rectAreaLight width={10} height={10} intensity={5} position={[0, 10, -5]} color="#0077ff" />

          {/* Holographic Environment */}
          <Environment preset="city" /> 
          
          {/* The Floor: A glowing neon grid */}
          <Grid 
            renderOrder={-1} 
            position={[0, -0.9, 0]} 
            infiniteGrid 
            cellSize={1} 
            cellThickness={1} 
            sectionSize={5} 
            sectionThickness={1.5} 
            sectionColor="#0077ff" 
            fadeDistance={30} 
          />

          {/* Floating Data Structures */}
          <DataCrystal position={[-5, 4, -5]} />
          <DataCrystal position={[6, 2, -8]} />
          <DataCrystal position={[-7, 1, 4]} />
          
          {/* The Hero - Enhanced with High-Tech Materials */}
          <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh position={[0, 1, 0]} castShadow>
              <boxGeometry args={[1.2, 2.2, 1.2]} />
              <meshStandardMaterial 
                color="#1e293b" 
                metalness={1} 
                roughness={0.1} 
                emissive="#0077ff"
                emissiveIntensity={0.2}
              />
            </mesh>
          </Float>

          <ContactShadows opacity={0.6} scale={20} blur={2} far={4.5} />
          <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
        </Suspense>
      </Canvas>
    </div>
  );
}