import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface LegalCoreProps {
  className?: string;
}

export const LegalCore: React.FC<LegalCoreProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Core Icosahedron Wireframe
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xA67A53,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Inner Solid Node
    const innerGeo = new THREE.OctahedronGeometry(0.5);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xC49A6C,
      wireframe: false,
      transparent: true,
      opacity: 0.8
    });
    const innerNode = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerNode);

    // Outer Orbiting Ring
    const ringGeo = new THREE.TorusGeometry(1.8, 0.015, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xA67A53,
      transparent: true,
      opacity: 0.35
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Second Orbiting Ring
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 4;
    scene.add(ring2);

    let animationId: number;
    let isMounted = true;

    const animate = () => {
      if (!isMounted) return;
      animationId = requestAnimationFrame(animate);

      core.rotation.x += 0.003;
      core.rotation.y += 0.005;

      innerNode.rotation.x -= 0.004;
      innerNode.rotation.y -= 0.006;

      ring.rotation.z += 0.004;
      ring2.rotation.z -= 0.003;

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
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full min-h-[220px] pointer-events-none ${className}`} />;
};
