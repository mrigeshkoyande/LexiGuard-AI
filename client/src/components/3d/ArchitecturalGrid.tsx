import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ArchitecturalGridProps {
  className?: string;
}

export const ArchitecturalGrid: React.FC<ArchitecturalGridProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 3, 7);
    camera.lookAt(0, 0, -2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Floor Grid
    const gridHelper = new THREE.GridHelper(30, 30, 0xA67A53, 0x102F49);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // Subtle floating vertical architectural line pillars
    const lineGeo = new THREE.BufferGeometry();
    const positions: number[] = [];
    for (let i = -10; i <= 10; i += 4) {
      for (let j = -10; j <= 5; j += 4) {
        positions.push(i, -1, j);
        positions.push(i, 2 + Math.random() * 2, j);
      }
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xA67A53,
      transparent: true,
      opacity: 0.15
    });
    const pillars = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(pillars);

    let animationId: number;
    let isMounted = true;
    let zOffset = 0;

    const animate = () => {
      if (!isMounted) return;
      animationId = requestAnimationFrame(animate);

      zOffset = (zOffset + 0.005) % 1;
      gridHelper.position.z = zOffset;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      gridHelper.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full min-h-[300px] pointer-events-none ${className}`} />;
};
