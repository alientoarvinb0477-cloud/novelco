"use client";

import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointerLockControls, PerspectiveCamera, Text, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';

// ─── PLAYER ───────────────────────────────────────────────────────────────────
function useKeys() {
  const keys = useRef({ w:false, s:false, a:false, d:false, shift:false });
  useEffect(() => {
    const dn = (e: KeyboardEvent) => {
      if (e.code==='KeyW') keys.current.w=true; if (e.code==='KeyS') keys.current.s=true;
      if (e.code==='KeyA') keys.current.a=true; if (e.code==='KeyD') keys.current.d=true;
      if (e.code==='ShiftLeft') keys.current.shift=true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.code==='KeyW') keys.current.w=false; if (e.code==='KeyS') keys.current.s=false;
      if (e.code==='KeyA') keys.current.a=false; if (e.code==='KeyD') keys.current.d=false;
      if (e.code==='ShiftLeft') keys.current.shift=false;
    };
    window.addEventListener('keydown', dn); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, []);
  return keys;
}

function Player() {
  const keys = useKeys();
  const vel = useRef(new THREE.Vector3()); const dir = useRef(new THREE.Vector3()); const bob = useRef(0);
  useFrame(({ camera }) => {
    const { w,s,a,d,shift } = keys.current; const speed = shift ? 0.1 : 0.055;
    vel.current.multiplyScalar(0.82);
    dir.current.set(Number(d)-Number(a), 0, Number(s)-Number(w)).normalize();
    if (w||s) vel.current.z += dir.current.z*speed; if (a||d) vel.current.x += dir.current.x*speed;
    camera.translateX(vel.current.x); camera.translateZ(vel.current.z);
    if (w||s||a||d) { bob.current+=0.09; camera.position.y=2.2+Math.sin(bob.current)*0.035; }
    else camera.position.y=THREE.MathUtils.lerp(camera.position.y,2.2,0.12);
    camera.position.x=THREE.MathUtils.clamp(camera.position.x,-55,55);
    camera.position.z=THREE.MathUtils.clamp(camera.position.z,-55,55);
  });
  return <PointerLockControls />;
}

// ─── TEXTURES ─────────────────────────────────────────────────────────────────
function makeMarbleTex(w=256,h=256,dark=false) {
  const c=document.createElement('canvas'); c.width=w; c.height=h;
  const ctx=c.getContext('2d')!; const base=dark?180:240;
  ctx.fillStyle=`rgb(${base},${base-5},${base-15})`; ctx.fillRect(0,0,w,h);
  for (let i=0;i<18;i++) {
    const x0=Math.random()*w, y0=Math.random()*h;
    ctx.beginPath(); ctx.moveTo(x0,y0);
    for (let j=0;j<8;j++) ctx.quadraticCurveTo(x0+(Math.random()-.5)*120,y0+(Math.random()-.5)*120,x0+(Math.random()-.5)*200,y0+(Math.random()-.5)*200);
    ctx.strokeStyle=`rgba(${dark?Math.floor(Math.random()*60+60):Math.floor(Math.random()*40+160)},${dark?Math.floor(Math.random()*60+60):Math.floor(Math.random()*40+160)},${dark?Math.floor(Math.random()*60+70):Math.floor(Math.random()*40+170)},${Math.random()*0.12+0.04})`;
    ctx.lineWidth=Math.random()*2+0.5; ctx.stroke();
  }
  const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; return t;
}

function makeRockTex(seed=0, tint:[number,number,number]=[140,130,120]) {
  const c=document.createElement('canvas'); c.width=512; c.height=512;
  const ctx=c.getContext('2d')!; const [r,g,b]=tint;
  ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.fillRect(0,0,512,512);
  for (let i=0;i<60000;i++) {
    const x=Math.random()*512, y=Math.random()*512, v=Math.floor((Math.random()-.5)*60);
    ctx.fillStyle=`rgba(${r+v},${g+v},${b+v},${0.3+Math.random()*0.5})`; ctx.fillRect(x,y,Math.random()*4+1,Math.random()*4+1);
  }
  for (let i=0;i<25;i++) {
    const x0=Math.random()*512, y0=Math.random()*512; ctx.beginPath(); ctx.moveTo(x0,y0);
    let cx=x0,cy=y0;
    for (let j=0;j<6;j++) { cx+=(Math.random()-.5)*80; cy+=(Math.random()-.5)*80; ctx.lineTo(cx,cy); }
    ctx.strokeStyle=`rgba(${r-60},${g-55},${b-50},${0.3+Math.random()*0.5})`; ctx.lineWidth=Math.random()*2+0.5; ctx.stroke();
  }
  for (let i=0;i<18;i++) {
    const cx=Math.random()*512, cy=Math.random()*512, rad=Math.random()*20+4;
    const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,rad);
    grad.addColorStop(0,`rgba(${r-50},${g-45},${b-40},0.8)`); grad.addColorStop(0.6,`rgba(${r-20},${g-18},${b-15},0.4)`); grad.addColorStop(1,`rgba(${r+10},${g+10},${b+5},0)`);
    ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(cx,cy,rad,0,Math.PI*2); ctx.fill();
  }
  const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; return t;
}

// Ancient stone texture — darker, aged, worn for statues & door frames
function makeAncientStoneTex(tint:[number,number,number]=[160,152,138]) {
  const c=document.createElement('canvas'); c.width=512; c.height=512;
  const ctx=c.getContext('2d')!; const [r,g,b]=tint;
  ctx.fillStyle=`rgb(${r},${g},${b})`; ctx.fillRect(0,0,512,512);
  // Base noise
  for (let i=0;i<80000;i++) {
    const x=Math.random()*512, y=Math.random()*512, v=Math.floor((Math.random()-.5)*50);
    ctx.fillStyle=`rgba(${r+v},${g+v},${b+v},${0.2+Math.random()*0.4})`; ctx.fillRect(x,y,Math.random()*3+1,Math.random()*2+1);
  }
  // Deep cracks
  for (let i=0;i<35;i++) {
    const x0=Math.random()*512, y0=Math.random()*512; ctx.beginPath(); ctx.moveTo(x0,y0);
    let cx=x0,cy=y0;
    for (let j=0;j<8;j++) { cx+=(Math.random()-.5)*60; cy+=(Math.random()-.5)*60; ctx.lineTo(cx,cy); }
    ctx.strokeStyle=`rgba(${r-80},${g-75},${b-65},${0.4+Math.random()*0.4})`; ctx.lineWidth=Math.random()*1.5+0.5; ctx.stroke();
  }
  // Weathering patches — lighter areas
  for (let i=0;i<20;i++) {
    const cx=Math.random()*512, cy=Math.random()*512, rad=Math.random()*40+10;
    const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,rad);
    grad.addColorStop(0,`rgba(${r+25},${g+22},${b+15},0.3)`); grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grad; ctx.beginPath(); ctx.ellipse(cx,cy,rad,rad*0.6,Math.random()*Math.PI,0,Math.PI*2); ctx.fill();
  }
  // Dark staining streaks (rain erosion)
  for (let i=0;i<12;i++) {
    const x=Math.random()*512;
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x+(Math.random()-.5)*30,512);
    ctx.strokeStyle=`rgba(${r-50},${g-48},${b-40},${0.1+Math.random()*0.15})`; ctx.lineWidth=Math.random()*8+2; ctx.stroke();
  }
  const t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; return t;
}

// Glowing rune/engraving texture for door panels
function makeRuneTex(color: string) {
  const c=document.createElement('canvas'); c.width=256; c.height=512;
  const ctx=c.getContext('2d')!;
  ctx.fillStyle='#1a1208'; ctx.fillRect(0,0,256,512);
  // Stone base
  for (let i=0;i<15000;i++) {
    const x=Math.random()*256, y=Math.random()*512, v=Math.floor((Math.random()-.5)*20);
    ctx.fillStyle=`rgba(${50+v},${45+v},${38+v},0.5)`; ctx.fillRect(x,y,2,2);
  }
  // Greek key border pattern
  ctx.strokeStyle=color; ctx.lineWidth=3; ctx.shadowBlur=8; ctx.shadowColor=color;
  ctx.strokeRect(10,10,236,492);
  ctx.strokeRect(20,20,216,472);
  // Rune symbols
  ctx.font='bold 28px serif'; ctx.fillStyle=color; ctx.shadowBlur=12; ctx.shadowColor=color;
  ctx.textAlign='center';
  const symbols = ['Ω','Φ','Ψ','Δ','Λ','Σ','Θ','Ξ','Π','Γ'];
  for (let i=0;i<6;i++) {
    ctx.fillText(symbols[i%symbols.length], 128, 80+i*68);
  }
  // Decorative horizontal dividers
  ctx.lineWidth=1.5; ctx.shadowBlur=6;
  for (let i=0;i<5;i++) { ctx.beginPath(); ctx.moveTo(30,60+i*80); ctx.lineTo(226,60+i*80); ctx.stroke(); }
  // Corner ornaments
  [[35,35],[221,35],[35,477],[221,477]].forEach(([x,y]) => {
    ctx.beginPath(); ctx.arc(x,y,8,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
  });
  return new THREE.CanvasTexture(c);
}

function makeMossyTex() {
  const c=document.createElement('canvas'); c.width=256; c.height=256;
  const ctx=c.getContext('2d')!;
  ctx.fillStyle='#7a8860'; ctx.fillRect(0,0,256,256);
  for (let i=0;i<20000;i++) {
    const x=Math.random()*256, y=Math.random()*256, v=Math.floor((Math.random()-.5)*40);
    ctx.fillStyle=Math.random()>0.35?`rgba(${90+v},${115+v},${60+v},0.6)`:`rgba(${110+v},${100+v},${85+v},0.5)`;
    ctx.fillRect(x,y,Math.random()*4+1,Math.random()*4+1);
  }
  return new THREE.CanvasTexture(c);
}

function makePlanetTex(type:'earth'|'gas'|'moon') {
  const c=document.createElement('canvas'); c.width=512; c.height=512; const ctx=c.getContext('2d')!;
  if (type==='earth') {
    ctx.fillStyle='#1a4a8a'; ctx.fillRect(0,0,512,512);
    [{x:120,y:180,rx:90,ry:60},{x:280,y:200,rx:70,ry:80},{x:350,y:300,rx:50,ry:40},{x:80,y:350,rx:40,ry:30},{x:420,y:120,rx:35,ry:25},{x:230,y:380,rx:55,ry:35}].forEach(co => {
      ctx.fillStyle=`rgb(${80+Math.random()*40},${110+Math.random()*30},${60+Math.random()*20})`;
      ctx.beginPath(); ctx.ellipse(co.x,co.y,co.rx,co.ry,Math.random()*Math.PI,0,Math.PI*2); ctx.fill();
    });
    for (let i=0;i<12;i++) { const cx=Math.random()*512,cy=Math.random()*512; ctx.fillStyle=`rgba(255,255,255,${0.3+Math.random()*0.4})`; ctx.beginPath(); ctx.ellipse(cx,cy,40+Math.random()*60,15+Math.random()*20,Math.random()*Math.PI,0,Math.PI*2); ctx.fill(); }
    ctx.fillStyle='rgba(220,235,255,0.7)'; ctx.fillRect(0,0,512,40); ctx.fillRect(0,472,512,40);
  } else if (type==='gas') {
    const colors=['#c8882a','#e8a84a','#d09060','#b07040','#e8c890','#a06830'];
    for (let y=0;y<512;y++) { ctx.fillStyle=colors[Math.floor((y/512)*colors.length)%colors.length]; ctx.fillRect(0,y,512,1); }
    for (let i=0;i<5;i++) { const cx=Math.random()*512,cy=Math.random()*512,grad=ctx.createRadialGradient(cx,cy,0,cx,cy,30+Math.random()*20); grad.addColorStop(0,'rgba(180,80,40,0.8)'); grad.addColorStop(1,'rgba(180,80,40,0)'); ctx.fillStyle=grad; ctx.beginPath(); ctx.ellipse(cx,cy,40+Math.random()*20,20+Math.random()*10,0,0,Math.PI*2); ctx.fill(); }
  } else {
    ctx.fillStyle='#888880'; ctx.fillRect(0,0,512,512);
    for (let i=0;i<40000;i++) { const v=Math.floor((Math.random()-.5)*50); ctx.fillStyle=`rgba(${130+v},${128+v},${120+v},0.4)`; ctx.fillRect(Math.random()*512,Math.random()*512,2,2); }
    for (let i=0;i<60;i++) { const cx=Math.random()*512,cy=Math.random()*512,rad=Math.random()*25+3,grad=ctx.createRadialGradient(cx,cy,0,cx,cy,rad); grad.addColorStop(0,'rgba(60,58,55,0.9)'); grad.addColorStop(0.7,'rgba(80,78,72,0.5)'); grad.addColorStop(1,'rgba(140,138,130,0)'); ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(cx,cy,rad,0,Math.PI*2); ctx.fill(); }
  }
  return new THREE.CanvasTexture(c);
}

// ─── ZEUS/GOD STATUE ──────────────────────────────────────────────────────────
// Matches photo 1 (powerful bearded figure) & photo 2 (classical marble bust)
function GodStatue({ position, rotation = [0,0,0], scale = 1, lightningColor = '#88aaff' }: {
  position: [number,number,number]; rotation?: [number,number,number]; scale?: number; lightningColor?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const eyeRef = useRef<THREE.PointLight>(null);
  const tex = useMemo(() => makeAncientStoneTex([185,178,162]), []);
  const darkTex = useMemo(() => makeAncientStoneTex([150,143,130]), []);

  useFrame(({ clock }) => {
    if (eyeRef.current) eyeRef.current.intensity = 0.4 + Math.sin(clock.elapsedTime*2.2)*0.3;
  });

  return (
    <group position={position} rotation={rotation as [number,number,number]} scale={scale}>
      {/* ── PEDESTAL BASE ── */}
      <mesh position={[0,0.25,0]} receiveShadow castShadow>
        <boxGeometry args={[3.2,0.5,3.2]} />
        <meshStandardMaterial map={darkTex} roughness={0.9} metalness={0.05} color="#b8b0a0" />
      </mesh>
      {/* Pedestal step 2 */}
      <mesh position={[0,0.65,0]} castShadow>
        <boxGeometry args={[2.8,0.3,2.8]} />
        <meshStandardMaterial map={darkTex} roughness={0.88} metalness={0.05} color="#bcb4a4" />
      </mesh>
      {/* Pedestal column */}
      <mesh position={[0,2.2,0]} castShadow>
        <boxGeometry args={[2.2,2.5,2.2]} />
        <meshStandardMaterial map={tex} roughness={0.85} metalness={0.08} color="#c8c0b0" />
      </mesh>
      {/* Inscription panel on pedestal */}
      <mesh position={[0,2.2,1.12]}>
        <planeGeometry args={[1.8,1.6]} />
        <meshStandardMaterial color="#a8a098" roughness={0.95} metalness={0.0} />
      </mesh>
      {/* Pedestal top cap */}
      <mesh position={[0,3.55,0]} castShadow>
        <boxGeometry args={[2.4,0.2,2.4]} />
        <meshStandardMaterial map={darkTex} roughness={0.8} metalness={0.1} color="#c0b8a8" />
      </mesh>

      {/* ── BODY — torso/robes ── */}
      {/* Lower robe / toga */}
      <mesh position={[0,5.2,0]} castShadow>
        <cylinderGeometry args={[0.85,1.0,3.2,16]} />
        <meshStandardMaterial map={tex} roughness={0.85} metalness={0.05} color="#d0c8b8" />
      </mesh>
      {/* Robe fold details — vertical ridges */}
      {[-0.5,-0.2,0.1,0.4].map((x,i) => (
        <mesh key={i} position={[x,5.0,0.83]} castShadow>
          <boxGeometry args={[0.08,2.8,0.06]} />
          <meshStandardMaterial color="#b8b0a0" roughness={0.9} metalness={0.0} />
        </mesh>
      ))}
      {/* Upper torso — broad, muscular like Zeus photo 1 */}
      <mesh position={[0,7.1,0]} castShadow>
        <cylinderGeometry args={[0.75,0.85,1.8,16]} />
        <meshStandardMaterial map={tex} roughness={0.8} metalness={0.08} color="#d8d0c0" />
      </mesh>
      {/* Chest musculature bump */}
      <mesh position={[0,7.4,0.6]} castShadow>
        <sphereGeometry args={[0.55,12,10]} />
        <meshStandardMaterial map={tex} roughness={0.82} metalness={0.05} color="#d4ccc0" />
      </mesh>
      {/* Toga drape across shoulder */}
      <mesh position={[-0.5,7.6,0.4]} rotation={[0.3,0.4,0.5]} castShadow>
        <boxGeometry args={[1.2,0.15,0.8]} />
        <meshStandardMaterial map={tex} roughness={0.88} metalness={0.0} color="#c8c0b0" />
      </mesh>

      {/* ── ARMS ── */}
      {/* Left arm — raised (commanding gesture, like photo 1) */}
      <mesh position={[-1.0,7.6,0]} rotation={[0,0,-0.5]} castShadow>
        <cylinderGeometry args={[0.22,0.26,1.4,10]} />
        <meshStandardMaterial map={tex} roughness={0.82} metalness={0.06} color="#d0c8b8" />
      </mesh>
      {/* Left forearm — angled outward */}
      <mesh position={[-1.6,8.1,0.2]} rotation={[0.3,0,-1.1]} castShadow>
        <cylinderGeometry args={[0.18,0.22,1.2,10]} />
        <meshStandardMaterial map={tex} roughness={0.82} metalness={0.06} color="#d0c8b8" />
      </mesh>
      {/* Left hand (fist holding lightning) */}
      <mesh position={[-2.0,8.5,0.4]} castShadow>
        <sphereGeometry args={[0.22,10,8]} />
        <meshStandardMaterial map={tex} roughness={0.8} metalness={0.06} color="#cec6b6" />
      </mesh>

      {/* Right arm — slightly lower, resting */}
      <mesh position={[1.0,7.2,0]} rotation={[0,0,0.3]} castShadow>
        <cylinderGeometry args={[0.22,0.26,1.4,10]} />
        <meshStandardMaterial map={tex} roughness={0.82} metalness={0.06} color="#d0c8b8" />
      </mesh>
      {/* Right forearm */}
      <mesh position={[1.5,6.8,0.3]} rotation={[0.5,0,0.6]} castShadow>
        <cylinderGeometry args={[0.18,0.22,1.1,10]} />
        <meshStandardMaterial map={tex} roughness={0.82} metalness={0.06} color="#d0c8b8" />
      </mesh>

      {/* ── NECK ── */}
      <mesh position={[0,8.1,0]} castShadow>
        <cylinderGeometry args={[0.28,0.35,0.6,12]} />
        <meshStandardMaterial map={tex} roughness={0.8} metalness={0.06} color="#d8d0c0" />
      </mesh>

      {/* ── HEAD — Zeus face matching photo 2 (classical marble bust style) ── */}
      {/* Main head */}
      <mesh position={[0,8.85,0]} castShadow>
        <sphereGeometry args={[0.58,16,14]} />
        <meshStandardMaterial map={tex} roughness={0.78} metalness={0.08} color="#ddd5c5" />
      </mesh>
      {/* Forehead ridge — strong brow */}
      <mesh position={[0,9.05,-0.05]} castShadow>
        <sphereGeometry args={[0.52,12,8]} />
        <meshStandardMaterial map={tex} roughness={0.78} metalness={0.06} color="#d8d0c0" />
      </mesh>

      {/* BEARD — the defining feature of both photos */}
      {/* Main beard mass — full and flowing like Zeus */}
      <mesh position={[0,8.35,0.35]} rotation={[0.2,0,0]} castShadow>
        <sphereGeometry args={[0.52,14,10]} />
        <meshStandardMaterial map={tex} roughness={0.9} metalness={0.02} color="#cac2b2" />
      </mesh>
      {/* Beard lower flow */}
      <mesh position={[0,7.95,0.3]} rotation={[0.1,0,0]} castShadow>
        <cylinderGeometry args={[0.3,0.45,0.8,12]} />
        <meshStandardMaterial map={darkTex} roughness={0.92} metalness={0.01} color="#c0b8a8" />
      </mesh>
      {/* Beard chin point */}
      <mesh position={[0,7.65,0.4]} rotation={[0.3,0,0]} castShadow>
        <cylinderGeometry args={[0.08,0.28,0.6,10]} />
        <meshStandardMaterial map={darkTex} roughness={0.92} metalness={0.01} color="#bab2a2" />
      </mesh>
      {/* Side beard left */}
      <mesh position={[-0.35,8.3,0.3]} rotation={[0.1,0.2,-0.1]} castShadow>
        <sphereGeometry args={[0.28,10,8]} />
        <meshStandardMaterial map={tex} roughness={0.9} metalness={0.02} color="#c8c0b0" />
      </mesh>
      {/* Side beard right */}
      <mesh position={[0.35,8.3,0.3]} rotation={[0.1,-0.2,0.1]} castShadow>
        <sphereGeometry args={[0.28,10,8]} />
        <meshStandardMaterial map={tex} roughness={0.9} metalness={0.02} color="#c8c0b0" />
      </mesh>

      {/* HAIR — flowing wild hair like photo 1 */}
      <mesh position={[0,9.2,0]} castShadow>
        <sphereGeometry args={[0.62,12,10]} />
        <meshStandardMaterial map={darkTex} roughness={0.92} metalness={0.02} color="#c0b8a8" />
      </mesh>
      {/* Hair flow left */}
      <mesh position={[-0.55,9.0,-0.1]} rotation={[0.1,0.3,-0.4]} castShadow>
        <sphereGeometry args={[0.35,10,8]} />
        <meshStandardMaterial map={darkTex} roughness={0.92} metalness={0.01} color="#b8b0a0" />
      </mesh>
      {/* Hair flow right */}
      <mesh position={[0.55,9.0,-0.1]} rotation={[0.1,-0.3,0.4]} castShadow>
        <sphereGeometry args={[0.35,10,8]} />
        <meshStandardMaterial map={darkTex} roughness={0.92} metalness={0.01} color="#b8b0a0" />
      </mesh>
      {/* Hair back/flowing down */}
      <mesh position={[0,8.7,-0.4]} rotation={[-0.3,0,0]} castShadow>
        <cylinderGeometry args={[0.3,0.45,1.1,10]} />
        <meshStandardMaterial map={darkTex} roughness={0.93} metalness={0.01} color="#b0a898" />
      </mesh>

      {/* Mustache — above beard */}
      <mesh position={[0,8.52,0.5]} rotation={[0.05,0,0]} castShadow>
        <sphereGeometry args={[0.22,10,6]} />
        <meshStandardMaterial map={darkTex} roughness={0.9} metalness={0.01} color="#c0b8a8" />
      </mesh>

      {/* Nose */}
      <mesh position={[0,8.75,0.52]} rotation={[0.3,0,0]} castShadow>
        <cylinderGeometry args={[0.06,0.1,0.25,8]} />
        <meshStandardMaterial map={tex} roughness={0.8} metalness={0.05} color="#d4ccc0" />
      </mesh>

      {/* Brow ridges */}
      <mesh position={[-0.18,8.95,0.48]} rotation={[0,0.1,0]}>
        <boxGeometry args={[0.25,0.08,0.08]} />
        <meshStandardMaterial map={tex} roughness={0.8} color="#c8c0b0" />
      </mesh>
      <mesh position={[0.18,8.95,0.48]} rotation={[0,-0.1,0]}>
        <boxGeometry args={[0.25,0.08,0.08]} />
        <meshStandardMaterial map={tex} roughness={0.8} color="#c8c0b0" />
      </mesh>

      {/* Eyes — glowing divine light */}
      <mesh position={[-0.18,8.85,0.5]}>
        <sphereGeometry args={[0.06,8,8]} />
        <meshStandardMaterial color={lightningColor} emissive={lightningColor} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.18,8.85,0.5]}>
        <sphereGeometry args={[0.06,8,8]} />
        <meshStandardMaterial color={lightningColor} emissive={lightningColor} emissiveIntensity={2} />
      </mesh>
      <pointLight ref={eyeRef} position={[0,8.85,0.5]} color={lightningColor} intensity={0.6} distance={8} />

      {/* Crown of laurel (gold ring) */}
      <mesh position={[0,9.28,0]}>
        <torusGeometry args={[0.52,0.06,8,32]} />
        <meshStandardMaterial color="#c8a820" emissive="#aa8810" emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Lightning bolt in raised hand */}
      <mesh position={[-2.15,8.7,0.5]} rotation={[0.5,0,0.8]}>
        <cylinderGeometry args={[0.04,0.04,0.8,6]} />
        <meshStandardMaterial color="#ffe066" emissive="#ffcc00" emissiveIntensity={4} />
      </mesh>
      <mesh position={[-2.3,8.9,0.6]} rotation={[0.5,0,1.1]}>
        <cylinderGeometry args={[0.025,0.025,0.5,6]} />
        <meshStandardMaterial color="#ffe066" emissive="#ffcc00" emissiveIntensity={4} />
      </mesh>
      <pointLight position={[-2.2,8.8,0.55]} color="#ffe066" intensity={1.5} distance={6} />
    </group>
  );
}

// ─── ANCIENT GOD PORTAL DOOR ──────────────────────────────────────────────────
// Redesigned as carved stone archway — like an ancient temple entrance
function AncientGodDoor({ color, position, rotation, title, route, god, glyphColor }: {
  color: string; position: [number,number,number]; rotation?: [number,number,number];
  title: string; route: string; god: string; glyphColor: string;
}) {
  const router = useRouter();
  const glowRef = useRef<THREE.PointLight>(null);
  const energyRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);

  const stoneTex = useMemo(() => makeAncientStoneTex([145,137,122]), []);
  const darkStoneTex = useMemo(() => makeAncientStoneTex([110,104,92]), []);
  const runeTex = useMemo(() => makeRuneTex(glyphColor), [glyphColor]);

  // Swirling energy particles inside the door
  const particles = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      positions[i*3] = (Math.random()-.5)*3.2;
      positions[i*3+1] = Math.random()*5.5;
      positions[i*3+2] = (Math.random()-.5)*0.4;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Arch shape
  const archShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.2, 0); s.lineTo(-2.2, 5.5);
    s.quadraticCurveTo(-2.2, 7.8, 0, 7.8);
    s.quadraticCurveTo(2.2, 7.8, 2.2, 5.5);
    s.lineTo(2.2, 0); s.lineTo(-2.2, 0);
    // Hole (inner arch opening)
    const hole = new THREE.Path();
    hole.moveTo(-1.6, 0); hole.lineTo(-1.6, 5.2);
    hole.quadraticCurveTo(-1.6, 7.0, 0, 7.0);
    hole.quadraticCurveTo(1.6, 7.0, 1.6, 5.2);
    hole.lineTo(1.6, 0); hole.lineTo(-1.6, 0);
    s.holes.push(hole);
    return s;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (glowRef.current) glowRef.current.intensity = (hovered ? 4 : 2) + Math.sin(t*2)*0.8;
    if (energyRef.current) {
      energyRef.current.rotation.z = t * 0.4;
      (energyRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2 + Math.sin(t*3)*0.6;
    }
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) + 0.02;
        if (y > 7.5) y = 0;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group position={position} rotation={rotation as [number,number,number]}>
      {/* ── STONE ARCH FRAME ── */}
      <mesh castShadow>
        <extrudeGeometry args={[archShape, { depth: 0.9, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 3 }]} />
        <meshStandardMaterial map={stoneTex} roughness={0.92} metalness={0.06} color="#8a8070" />
      </mesh>

      {/* ── CARVED SIDE PANELS with rune glyphs ── */}
      {/* Left panel */}
      <mesh position={[-2.9, 3.2, 0.2]} castShadow>
        <boxGeometry args={[0.9, 6.0, 0.7]} />
        <meshStandardMaterial map={darkStoneTex} roughness={0.95} metalness={0.04} color="#706860" />
      </mesh>
      <mesh position={[-2.9, 3.2, 0.56]}>
        <planeGeometry args={[0.7, 5.5]} />
        <meshStandardMaterial map={runeTex} roughness={0.9} metalness={0.0} transparent opacity={0.9} />
      </mesh>
      {/* Right panel */}
      <mesh position={[2.9, 3.2, 0.2]} castShadow>
        <boxGeometry args={[0.9, 6.0, 0.7]} />
        <meshStandardMaterial map={darkStoneTex} roughness={0.95} metalness={0.04} color="#706860" />
      </mesh>
      <mesh position={[2.9, 3.2, 0.56]}>
        <planeGeometry args={[0.7, 5.5]} />
        <meshStandardMaterial map={runeTex} roughness={0.9} metalness={0.0} transparent opacity={0.9} />
      </mesh>

      {/* ── LINTEL — horizontal stone over the arch ── */}
      <mesh position={[0, 8.5, 0.2]} castShadow>
        <boxGeometry args={[6.8, 1.0, 0.9]} />
        <meshStandardMaterial map={stoneTex} roughness={0.9} metalness={0.06} color="#7a7262" />
      </mesh>
      {/* Lintel carving — relief pattern */}
      <mesh position={[0, 8.5, 0.68]}>
        <planeGeometry args={[6.2, 0.7]} />
        <meshStandardMaterial map={runeTex} roughness={0.95} transparent opacity={0.7} />
      </mesh>

      {/* ── CORNICE / TOP PEDIMENT ── */}
      <mesh position={[0, 9.1, 0.15]} castShadow>
        <boxGeometry args={[7.0, 0.4, 1.1]} />
        <meshStandardMaterial map={darkStoneTex} roughness={0.9} metalness={0.07} color="#6a6258" />
      </mesh>
      {/* Small pediment triangle */}
      <mesh position={[-3.0, 9.5, 0.15]} castShadow>
        {(() => { const s=new THREE.Shape(); s.moveTo(0,0); s.lineTo(6,0); s.lineTo(3,2); s.closePath(); return <extrudeGeometry args={[s,{depth:0.8,bevelEnabled:false}]} />; })()}
        <meshStandardMaterial map={stoneTex} roughness={0.9} metalness={0.06} color="#7a7262" />
      </mesh>
      {/* God emblem in pediment */}
      <mesh position={[0, 10.15, 1.1]}>
        <torusGeometry args={[0.6, 0.1, 8, 24]} />
        <meshStandardMaterial color={glyphColor} emissive={glyphColor} emissiveIntensity={2} metalness={0.8} roughness={0.1} />
      </mesh>

      {/* ── BASE STEPS ── */}
      {[0,1,2].map(i => (
        <mesh key={i} position={[0, -i*0.35-0.18, -i*0.35+0.5]} receiveShadow castShadow>
          <boxGeometry args={[5.5+i*0.8, 0.35, 1.2]} />
          <meshStandardMaterial map={stoneTex} roughness={0.92} metalness={0.04} color="#888072" />
        </mesh>
      ))}

      {/* ── PORTAL ENERGY FILL (inside arch) ── */}
      {/* Background dark void */}
      <mesh position={[0, 3.5, 0.05]}>
        <planeGeometry args={[3.2, 7.5]} />
        <meshStandardMaterial color="#050308" roughness={1} transparent opacity={0.95} />
      </mesh>
      {/* Energy swirl disc */}
      <mesh ref={energyRef} position={[0, 3.8, 0.15]}>
        <torusGeometry args={[1.5, 0.6, 6, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* Core energy glow */}
      <mesh position={[0, 3.8, 0.18]}
        onClick={() => router.push(route)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 3.0 : 1.6} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Rising particles through the gate */}
      <points ref={particlesRef} position={[0,0,0.2]}>
        <primitive object={particles} />
        <pointsMaterial color={glyphColor} size={0.06} transparent opacity={0.8} sizeAttenuation />
      </points>
      {/* Mystical inner ring */}
      <mesh position={[0, 3.8, 0.22]}>
        <torusGeometry args={[1.55, 0.05, 8, 48]} />
        <meshStandardMaterial color={glyphColor} emissive={glyphColor} emissiveIntensity={3} />
      </mesh>

      {/* ── GLOW LIGHT ── */}
      <pointLight ref={glowRef} color={color} intensity={2.5} distance={16} position={[0,4,1.5]} />
      <pointLight color={glyphColor} intensity={0.8} distance={8} position={[0,9,1]} />

      {/* ── GOD NAME + REALM TEXT ── */}
      <Text position={[0, 0.9, 1.0]} fontSize={0.55} color={glyphColor} anchorX="center" letterSpacing={0.15} outlineColor="#000" outlineWidth={0.02}>
        {god}
      </Text>
      <Text position={[0, 0.25, 1.0]} fontSize={0.28} color="#e8daa0" anchorX="center" letterSpacing={0.2}>
        {title}
      </Text>

      {/* Torch sconces on side pillars */}
      {[-3.35, 3.35].map((x, i) => (
        <group key={i} position={[x, 5.5, 0.7]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.06,0.1,0.5,6]} />
            <meshStandardMaterial color="#5a4010" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0,0.38,0]}>
            <sphereGeometry args={[0.14,8,6]} />
            <meshStandardMaterial color="#ff8800" emissive="#ff5500" emissiveIntensity={5} />
          </mesh>
          <pointLight position={[0,0.5,0]} color="#ff8833" intensity={1.5} distance={8} />
        </group>
      ))}
    </group>
  );
}

// ─── ASTEROID ─────────────────────────────────────────────────────────────────
function Asteroid({ position, scale, rotSpeed, seed=0 }: {position:[number,number,number];scale:number;rotSpeed:[number,number,number];seed?:number}) {
  const ref=useRef<THREE.Mesh>(null);
  const tex=useMemo(()=>makeRockTex(seed,[125+Math.floor(Math.sin(seed*.7)*15),117+Math.floor(Math.sin(seed*1.1)*12),105+Math.floor(Math.sin(seed*1.5)*10)]),[seed]);
  const geo=useMemo(()=>{
    const g=new THREE.IcosahedronGeometry(1,4); const pos=g.attributes.position;
    for (let i=0;i<pos.count;i++) {
      const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
      const n=0.70+Math.sin(x*3.1+seed)*0.18+Math.sin(y*5.7+seed*.7)*0.12+Math.sin(z*7.3+seed*1.3)*0.08;
      pos.setXYZ(i,x*n,y*n,z*n);
    } g.computeVertexNormals(); return g;
  },[seed]);
  useFrame(({clock})=>{ if(ref.current){ref.current.rotation.x+=rotSpeed[0];ref.current.rotation.y+=rotSpeed[1];ref.current.rotation.z+=rotSpeed[2];ref.current.position.y=position[1]+Math.sin(clock.elapsedTime*.28+seed)*1.8;} });
  return <mesh ref={ref} position={position} scale={scale} geometry={geo} castShadow><meshStandardMaterial map={tex} roughness={0.93} metalness={0.04} color="#a09080" /></mesh>;
}

function StoneBlock({ position, scale=1, rotY=0, seed=0 }: {position:[number,number,number];scale?:number;rotY?:number;seed?:number}) {
  const ref=useRef<THREE.Group>(null);
  const sideTex=useMemo(()=>makeRockTex(seed,[122,115,102]),[seed]);
  const topTex=useMemo(()=>makeMossyTex(),[]);
  const geo=useMemo(()=>{ const g=new THREE.BoxGeometry(1,.85,.95,4,4,4); const pos=g.attributes.position; for(let i=0;i<pos.count;i++){const jitter=.055;pos.setXYZ(i,pos.getX(i)+(Math.random()-.5)*jitter,pos.getY(i)+(Math.random()-.5)*jitter*.5,pos.getZ(i)+(Math.random()-.5)*jitter);} g.computeVertexNormals(); return g; },[]);
  const mats=useMemo(()=>[new THREE.MeshStandardMaterial({map:sideTex,roughness:.95,metalness:.02,color:'#a09080'}),new THREE.MeshStandardMaterial({map:sideTex,roughness:.95,metalness:.02,color:'#a09080'}),new THREE.MeshStandardMaterial({map:topTex,roughness:.90,metalness:.00,color:'#8a9272'}),new THREE.MeshStandardMaterial({map:sideTex,roughness:.95,metalness:.02,color:'#908878'}),new THREE.MeshStandardMaterial({map:sideTex,roughness:.95,metalness:.02,color:'#a09080'}),new THREE.MeshStandardMaterial({map:sideTex,roughness:.95,metalness:.02,color:'#a09080'})],[sideTex,topTex]);
  const fs=position[0]*7+position[2]*3;
  useFrame(({clock})=>{ if(ref.current){ref.current.rotation.y+=.0008;ref.current.position.y=position[1]+Math.sin(clock.elapsedTime*.22+fs)*1.5;} });
  return <group ref={ref} position={position} rotation={[0,rotY,0]} scale={scale}><mesh geometry={geo} material={mats} castShadow /></group>;
}

function LargeAsteroid({ position, scale }: {position:[number,number,number];scale:[number,number,number]}) {
  const ref=useRef<THREE.Group>(null);
  const tex=useMemo(()=>makeRockTex(42,[115,108,96]),[]);
  const geo=useMemo(()=>{ const g=new THREE.IcosahedronGeometry(1,5); const pos=g.attributes.position; for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);const n=.72+Math.sin(x*8.1+y*6.3)*.20+Math.sin(y*12.4+z*9.7)*.12+Math.sin(z*5.2+x*11.1)*.09;pos.setXYZ(i,x*n,y*n,z*n);} g.computeVertexNormals(); return g; },[]);
  useFrame(({clock})=>{ if(ref.current){ref.current.rotation.x+=.0007;ref.current.rotation.y+=.0013;ref.current.position.y=position[1]+Math.sin(clock.elapsedTime*.1+position[0])*.3;} });
  return <group ref={ref} position={position} scale={scale}><mesh geometry={geo} castShadow><meshStandardMaterial map={tex} roughness={.94} metalness={.03} color="#908878" /></mesh></group>;
}

function Planet({ position, radius, type, rotSpeed, hasRing=false }: {position:[number,number,number];radius:number;type:'earth'|'gas'|'moon';rotSpeed:number;hasRing?:boolean}) {
  const ref=useRef<THREE.Group>(null);
  const tex=useMemo(()=>makePlanetTex(type),[type]);
  const fs=position[0]+position[2];
  useFrame(({clock})=>{ if(ref.current){ref.current.rotation.y+=rotSpeed;ref.current.position.y=position[1]+Math.sin(clock.elapsedTime*.12+fs)*2.5;} });
  return <group ref={ref} position={position}>{type==='earth'&&<mesh><sphereGeometry args={[radius*1.06,32,32]} /><meshStandardMaterial color="#4488cc" transparent opacity={0.18} roughness={1} metalness={0} depthWrite={false} side={THREE.FrontSide} /></mesh>}<mesh castShadow><sphereGeometry args={[radius,64,64]} /><meshStandardMaterial map={tex} roughness={type==='gas'?.7:.88} metalness={0} /></mesh>{hasRing&&<><mesh rotation={[Math.PI/3.5,0,.3]}><torusGeometry args={[radius*1.65,radius*.38,4,100]} /><meshStandardMaterial color="#c8a060" transparent opacity={.55} roughness={.95} metalness={.1} side={THREE.DoubleSide} /></mesh><mesh rotation={[Math.PI/3.5,0,.3]}><torusGeometry args={[radius*2.1,radius*.22,4,100]} /><meshStandardMaterial color="#b09050" transparent opacity={.35} roughness={.95} metalness={.08} side={THREE.DoubleSide} /></mesh></>}</group>;
}

// ─── TEMPLE ARCHITECTURE ──────────────────────────────────────────────────────
function OlympusFloor() {
  const tex=useMemo(()=>{ const c=document.createElement('canvas');c.width=512;c.height=512;const ctx=c.getContext('2d')!;ctx.fillStyle='#f0ece0';ctx.fillRect(0,0,512,512);ctx.strokeStyle='rgba(200,180,120,0.6)';ctx.lineWidth=3;for(let i=0;i<=512;i+=64){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,512);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(512,i);ctx.stroke();}ctx.strokeStyle='rgba(220,190,100,0.2)';ctx.lineWidth=1;for(let tx=0;tx<8;tx++)for(let ty=0;ty<8;ty++){ctx.beginPath();ctx.moveTo(tx*64,ty*64);ctx.lineTo(tx*64+64,ty*64+64);ctx.stroke();}for(let i=0;i<20;i++){const x0=Math.random()*512,y0=Math.random()*512;ctx.beginPath();ctx.moveTo(x0,y0);for(let j=0;j<5;j++)ctx.quadraticCurveTo(Math.random()*512,Math.random()*512,Math.random()*512,Math.random()*512);ctx.strokeStyle=`rgba(180,160,100,${Math.random()*.1+.03})`;ctx.lineWidth=.8;ctx.stroke();}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(12,12);return t;},[]);
  return <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]} receiveShadow><planeGeometry args={[120,120]} /><meshStandardMaterial map={tex} roughness={.08} metalness={.3} color="#f5f0e0" /></mesh>;
}

function IonicColumn({ position, height=18 }: {position:[number,number,number];height?:number}) {
  const tex=useMemo(()=>makeMarbleTex(128,512,false),[]);
  return <group position={position}><mesh position={[0,.3,0]} receiveShadow castShadow><boxGeometry args={[3.2,.6,3.2]} /><meshStandardMaterial map={tex} roughness={.1} metalness={.15} color="#ede8d8" /></mesh><mesh position={[0,.75,0]}><torusGeometry args={[1.3,.15,12,32]} /><meshStandardMaterial color="#e0dac8" roughness={.1} metalness={.2} /></mesh><mesh position={[0,height/2+.75,0]} castShadow><cylinderGeometry args={[1.1,1.3,height,24]} /><meshStandardMaterial map={tex} roughness={.1} metalness={.15} color="#f0ece0" /></mesh><mesh position={[0,height+1.2,0]}><torusGeometry args={[1.4,.2,8,24]} /><meshStandardMaterial color="#d4c89a" roughness={.2} metalness={.4} /></mesh><mesh position={[0,height+1.8,0]} castShadow><boxGeometry args={[3.4,.6,3.4]} /><meshStandardMaterial color="#ede8d8" roughness={.08} metalness={.25} /></mesh></group>;
}

function Entablature({ z, colHeight=18 }: {z:number;colHeight?:number}) {
  const y=colHeight+2.1;
  return <><mesh position={[0,y,z]} castShadow><boxGeometry args={[44,1.2,2.5]} /><meshStandardMaterial color="#e8e2ce" roughness={.1} metalness={.2} /></mesh><mesh position={[0,y+1.5,z]} castShadow><boxGeometry args={[44,1.5,2]} /><meshStandardMaterial color="#d4c89a" roughness={.2} metalness={.3} /></mesh><mesh position={[0,y+2.6,z]} castShadow><boxGeometry args={[46,.8,3]} /><meshStandardMaterial color="#ede8d8" roughness={.08} metalness={.2} /></mesh></>;
}

function Pediment({ position }: {position:[number,number,number]}) {
  const shape=useMemo(()=>{ const s=new THREE.Shape();s.moveTo(-22,0);s.lineTo(22,0);s.lineTo(0,7);s.closePath();return s;},[]);
  return <mesh position={position} castShadow><extrudeGeometry args={[shape,{depth:2,bevelEnabled:false}]} /><meshStandardMaterial color="#ede8d8" roughness={.1} metalness={.2} /></mesh>;
}

function Brazier({ position }: {position:[number,number,number]}) {
  const ref=useRef<THREE.PointLight>(null);
  useFrame(({clock})=>{ if(ref.current)ref.current.intensity=3+Math.sin(clock.elapsedTime*8+position[0])*1.2; });
  return <group position={position}><mesh castShadow><cylinderGeometry args={[.08,.3,2.5,8]} /><meshStandardMaterial color="#8B6914" metalness={.9} roughness={.2} /></mesh><mesh position={[0,1.4,0]} castShadow><sphereGeometry args={[.5,12,8,0,Math.PI*2,0,Math.PI/2]} /><meshStandardMaterial color="#6B4F0A" metalness={.8} roughness={.3} /></mesh><mesh position={[0,1.9,0]}><sphereGeometry args={[.35,8,8]} /><meshStandardMaterial color="#ff8800" emissive="#ff6600" emissiveIntensity={4} transparent opacity={.9} /></mesh><pointLight ref={ref} position={[0,2.2,0]} color="#ff9933" intensity={3} distance={14} castShadow /></group>;
}

function ZeusAltar() {
  const ref=useRef<THREE.PointLight>(null);
  useFrame(({clock})=>{ if(ref.current)ref.current.intensity=2+Math.sin(clock.elapsedTime*1.5)*.8; });
  const tex=useMemo(()=>makeMarbleTex(256,256,true),[]);
  return <group position={[0,0,-30]}><mesh position={[0,1,0]} castShadow><boxGeometry args={[8,2,5]} /><meshStandardMaterial map={tex} roughness={.1} metalness={.3} color="#d4c89a" /></mesh><mesh position={[0,3.2,0]} castShadow><boxGeometry args={[6,.4,4]} /><meshStandardMaterial color="#c8b870" metalness={.7} roughness={.1} /></mesh><mesh position={[0,5.5,-1.6]} castShadow><boxGeometry args={[6,5,.4]} /><meshStandardMaterial map={tex} roughness={.1} metalness={.2} color="#d4c89a" /></mesh>{[-2.8,2.8].map((x,i)=><mesh key={i} position={[x,4.2,.5]} castShadow><boxGeometry args={[.4,.3,3]} /><meshStandardMaterial color="#c8b870" metalness={.8} roughness={.1} /></mesh>)}<mesh position={[0,3.5,2.1]}><boxGeometry args={[.4,2.5,.1]} /><meshStandardMaterial color="#ffd700" emissive="#ffaa00" emissiveIntensity={3} /></mesh><pointLight ref={ref} position={[0,4,0]} color="#ffe066" intensity={2.5} distance={20} /></group>;
}

function LightningSystem() {
  const ref=useRef<THREE.DirectionalLight>(null); const next=useRef(8+Math.random()*12);
  useFrame(({clock})=>{ if(!ref.current)return;const t=clock.elapsedTime%next.current;if(t<.08)ref.current.intensity=12;else if(t<.14)ref.current.intensity=0;else if(t<.19)ref.current.intensity=8;else ref.current.intensity=0;if(Math.abs(t-.2)<.016)next.current=8+Math.random()*15; });
  return <directionalLight ref={ref} color="#c0ccff" position={[30,50,-20]} intensity={0} />;
}

function Steps({ position, width=20, steps=5 }: {position:[number,number,number];width?:number;steps?:number}) {
  const tex=useMemo(()=>{ const t=makeMarbleTex(128,128);t.repeat.set(4,1);return t; },[]);
  return <group position={position}>{Array.from({length:steps}).map((_,i)=><mesh key={i} position={[0,i*.4,-i*.6]} receiveShadow castShadow><boxGeometry args={[width-i*1.5,.4,1.2]} /><meshStandardMaterial map={tex} roughness={.15} metalness={.1} color="#ede8d8" /></mesh>)}</group>;
}

// ─── FULL SCENE ───────────────────────────────────────────────────────────────
function OlympusScene() {
  const COL_H=18;
  const colPositions:[number,number,number][]=[];
  for(let i=-4;i<=4;i++){colPositions.push([-18,0,i*8-8]);colPositions.push([18,0,i*8-8]);}
  for(let i=-3;i<=3;i++){colPositions.push([i*6,0,18]);colPositions.push([i*6,0,-50]);}

  return (
    <>
      {/* LIGHTING */}
      <ambientLight intensity={0.4} color="#ffe8c0" />
      <directionalLight position={[40,80,20]} intensity={2.0} color="#fff5d0" castShadow shadow-mapSize={[4096,4096]} shadow-camera-far={200} shadow-camera-left={-80} shadow-camera-right={80} shadow-camera-top={80} shadow-camera-bottom={-80} />
      <pointLight position={[0,15,-30]} color="#ffe066" intensity={1.5} distance={50} />
      <LightningSystem />

      {/* SKY */}
      <fog attach="fog" args={['#c8d8f0', 70, 280]} />
      <color attach="background" args={['#5878a0']} />
      <Stars radius={300} depth={80} count={5000} factor={4} saturation={0.3} fade />
      <Sparkles count={120} scale={[80,30,80]} size={2.5} speed={0.3} color="#ffe8a0" opacity={0.6} />

      {/* GROUND & STRUCTURE */}
      <mesh position={[0,-18,-60]} receiveShadow><coneGeometry args={[70,30,32]} /><meshStandardMaterial color="#c0b8a8" roughness={.95} /></mesh>
      <OlympusFloor />
      <Steps position={[0,0,16]} width={42} steps={6} />
      <Steps position={[0,0,-48]} width={42} steps={6} />
      {colPositions.map((pos,i)=><IonicColumn key={i} position={pos} height={COL_H} />)}
      <Entablature z={18} colHeight={COL_H} />
      <Entablature z={-48} colHeight={COL_H} />
      <Pediment position={[-22,COL_H+3.2,19]} />
      <Pediment position={[-22,COL_H+3.2,-47]} />
      {[-4,0,4].map((z,i)=><mesh key={i} position={[0,COL_H+2.1,z*6-16]} castShadow><boxGeometry args={[38,.8,1.2]} /><meshStandardMaterial color="#e8e2ce" roughness={.1} metalness={.15} /></mesh>)}

      {/* BRAZIERS & ALTAR */}
      {[-16,-8,0,8,16].map((x,i)=><React.Fragment key={i}><Brazier position={[x,0,16]} /><Brazier position={[x,0,-44]} /></React.Fragment>)}
      <Brazier position={[-16,0,-10]} /><Brazier position={[16,0,-10]} />
      <ZeusAltar />

      {/* ══════════════════════════════════════════════ */}
      {/*  GOD STATUES — Left & Right sides of temple   */}
      {/* ══════════════════════════════════════════════ */}

      {/* Main hall — pairs flanking the corridor */}
      {/* LEFT SIDE statues */}
      <GodStatue position={[-14, 0, 0]}  rotation={[0, 0.4, 0]}  scale={1.0} lightningColor="#88aaff" />
      <GodStatue position={[-14, 0, -14]} rotation={[0, 0.3, 0]} scale={1.0} lightningColor="#ff8844" />
      <GodStatue position={[-14, 0, -26]} rotation={[0, 0.5, 0]} scale={1.0} lightningColor="#44ffaa" />

      {/* RIGHT SIDE statues */}
      <GodStatue position={[14, 0, 0]}   rotation={[0, -0.4, 0]}  scale={1.0} lightningColor="#ff4444" />
      <GodStatue position={[14, 0, -14]} rotation={[0, -0.3, 0]}  scale={1.0} lightningColor="#aa44ff" />
      <GodStatue position={[14, 0, -26]} rotation={[0, -0.5, 0]}  scale={1.0} lightningColor="#ffdd44" />

      {/* ENTRANCE — two grand statues flanking entry */}
      <GodStatue position={[-8, 0, 14]}  rotation={[0, -0.8, 0]}  scale={1.2} lightningColor="#ffd700" />
      <GodStatue position={[8, 0, 14]}   rotation={[0,  0.8, 0]}  scale={1.2} lightningColor="#ffd700" />

      {/* DEEP HALL — guarding the altar */}
      <GodStatue position={[-6, 0, -38]} rotation={[0,  0.6, 0]}  scale={1.1} lightningColor="#88ccff" />
      <GodStatue position={[6, 0, -38]}  rotation={[0, -0.6, 0]}  scale={1.1} lightningColor="#88ccff" />

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  ANCIENT GOD PORTAL DOORS — redesigned stone archways     */}
      {/* ══════════════════════════════════════════════════════════ */}
      <AncientGodDoor
        title="GOD OF WAR"  god="ARES"
        color="#cc2200"     glyphColor="#ff6644"
        position={[-9, 0, -22]}
        rotation={[0, 0.15, 0]}
        route="/arc-world/sanctuary"
      />
      <AncientGodDoor
        title="GOD OF SEAS"  god="POSEIDON"
        color="#0055cc"      glyphColor="#44aaff"
        position={[0, 0, -34]}
        rotation={[0, 0, 0]}
        route="/arc-world/citadel"
      />
      <AncientGodDoor
        title="GOD OF DEATH" god="HADES"
        color="#440088"      glyphColor="#aa44ff"
        position={[9, 0, -22]}
        rotation={[0, -0.15, 0]}
        route="/arc-world/wasteland"
      />

      {/* FLOOR EMBLEM */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,.01,-10]}><ringGeometry args={[4,4.3,48]} /><meshStandardMaterial color="#c8a820" metalness={.9} roughness={.1} emissive="#c8a820" emissiveIntensity={.4} /></mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,.01,-10]}><ringGeometry args={[1.8,2.1,48]} /><meshStandardMaterial color="#c8a820" metalness={.9} roughness={.1} emissive="#c8a820" emissiveIntensity={.4} /></mesh>

      {/* FLOATING OBJECTS */}
      <LargeAsteroid position={[65,42,-38]} scale={[15,9,24]} />
      <LargeAsteroid position={[-72,50,-18]} scale={[9,5.5,15]} />
      {[1,2,3,4,5,6,7,8,9,10].map(s=><Asteroid key={s} position={[(s%3-1)*40+10,25+s*3,(s%4)*15-30]} scale={2.5+s*.3} rotSpeed={[.001*s,.002*s,.001]} seed={s} />)}
      {[10,20,30,40,50,60].map((s,i)=><StoneBlock key={i} position={[(i%2===0?-1:1)*(25+i*5),20+i*2,-20-i*8]} scale={4+i*.3} rotY={i*.5} seed={s} />)}
      <Planet position={[130,85,-130]} radius={24} type="earth" rotSpeed={.0008} />
      <Planet position={[-150,110,-85]} radius={35} type="gas" rotSpeed={.0004} hasRing />
      <Planet position={[95,68,-175]} radius={11} type="moon" rotSpeed={.001} />
      <Planet position={[-65,55,-105]} radius={7.5} type="moon" rotSpeed={.0016} />
    </>
  );
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
function OlympusHUD() {
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', userSelect:'none' }}>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ position:'relative', width:28, height:28 }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1.5px solid rgba(255,215,0,0.5)' }} />
          <div style={{ position:'absolute', top:'50%', left:2, right:2, height:1, background:'rgba(255,220,80,0.85)', transform:'translateY(-50%)' }} />
          <div style={{ position:'absolute', left:'50%', top:2, bottom:2, width:1, background:'rgba(255,220,80,0.85)', transform:'translateX(-50%)' }} />
          <div style={{ position:'absolute', top:'50%', left:'50%', width:3, height:3, borderRadius:'50%', background:'#ffd700', transform:'translate(-50%,-50%)', boxShadow:'0 0 6px #ffd700' }} />
        </div>
      </div>
      <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', background:'linear-gradient(180deg, rgba(20,15,5,0.85) 0%, transparent 100%)', padding:'12px 60px 20px', textAlign:'center', fontFamily:'"Palatino Linotype", Palatino, "Book Antiqua", serif' }}>
        <div style={{ fontSize:11, letterSpacing:'0.4em', color:'rgba(200,168,80,0.7)', marginBottom:2 }}>✦ MOUNT OLYMPUS ✦</div>
        <div style={{ fontSize:18, letterSpacing:'0.25em', color:'#ffd700', textShadow:'0 0 12px rgba(255,215,0,0.6)', fontWeight:'bold' }}>PALACE OF ZEUS</div>
      </div>
      <div style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)', display:'flex', gap:32, alignItems:'center', background:'linear-gradient(180deg, transparent, rgba(10,7,2,0.7))', padding:'10px 30px', fontFamily:'"Palatino Linotype", Palatino, serif', fontSize:11, color:'rgba(200,168,80,0.75)', letterSpacing:'0.15em', borderTop:'1px solid rgba(200,168,80,0.2)' }}>
        <span>⚡ CLICK TO ENTER</span><span>WASD · MOVE</span><span>SHIFT · HASTEN</span>
      </div>
      {[{top:16,left:20},{top:16,right:20},{bottom:16,left:20},{bottom:16,right:20}].map((s,i)=><div key={i} style={{ position:'absolute', fontSize:18, color:'rgba(200,168,80,0.35)', lineHeight:1, ...s }}>⚜</div>)}
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, transparent 50%, rgba(5,3,1,0.65) 100%)', pointerEvents:'none' }} />
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function ArcWorldOlympus() {
  return (
    <div style={{ width:'100vw', height:'100vh', background:'#5878a0', position:'relative', overflow:'hidden' }}>
      <OlympusHUD />
      <Canvas shadows gl={{ antialias:true, toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:1.1 }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault fov={80} position={[0,2.2,14]} near={0.1} far={500} />
          <Player />
          <OlympusScene />
        </Suspense>
      </Canvas>
    </div>
  );
}