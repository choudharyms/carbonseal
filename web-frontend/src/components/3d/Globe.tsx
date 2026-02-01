"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

const GlobeMesh = ({ onSelectProject }: { onSelectProject: (id: number) => void }) => {
  const globeRef = useRef<THREE.Mesh>(null);

  // Auto-rotation
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0005;
    }
  });

  // Mock Project Locations (converted to 3D coordinates roughly)
  const locations = useMemo(() => [
    { id: 1, lat: 22.0, lng: 88.0, name: "Sundarbans", type: "Mangrove" }, // India
    { id: 2, lat: -4.0, lng: 39.5, name: "Gazi Bay", type: "Seagrass" },   // Kenya
    { id: 3, lat: -18.0, lng: 146.0, name: "Great Barrier Reef", type: "Coral" }, // Australia
    { id: 4, lat: 0.0, lng: -50.0, name: "Amazon Delta", type: "Wetland" }, // Brazil
    { id: 5, lat: 10.0, lng: 105.0, name: "Mekong Delta", type: "Mangrove" }, // Vietnam
  ], []);

  // Helper to convert Lat/Lng to Vector3
  const calcPos = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  return (
    <group>
      {/* The Blue Planet */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshPhongMaterial 
          color="#1e3a8a" 
          emissive="#172554"
          specular="#60a5fa"
          shininess={10}
          transparent
          opacity={0.9}
        />
        
        {/* Markers */}
        {locations.map((loc) => {
          const pos = calcPos(loc.lat, loc.lng, 2.52);
          return (
            <mesh 
              key={loc.id} 
              position={pos} 
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject(loc.id);
              }}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'auto'}
            >
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} />
              
              {/* HTML Label on Hover */}
              <Html distanceFactor={10}>
                <div className="bg-black/70 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md whitespace-nowrap border border-white/20">
                  {loc.name}
                </div>
              </Html>
            </mesh>
          );
        })}
      </mesh>
      
      {/* Atmosphere Glow */}
      <mesh scale={[2.6, 2.6, 2.6]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

export default function Globe({ onSelectProject }: { onSelectProject: (id: number) => void }) {
  return (
    <div className="h-full w-full cursor-move">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <GlobeMesh onSelectProject={onSelectProject} />
        <OrbitControls enableZoom={true} enablePan={false} minDistance={4} maxDistance={10} autoRotate={false} />
      </Canvas>
    </div>
  );
}