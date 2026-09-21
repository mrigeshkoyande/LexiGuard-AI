import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DocumentStackProps {
  className?: string;
}

export const DocumentStack: React.FC<DocumentStackProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2, 2.5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Create 3 layered parchment planes with gold wireframe borders
    const docGeo = new THREE.PlaneGeometry(2.2, 3);
    const edgesGeo = new THREE.EdgesGeometry(docGeo);

    const sheets: { mesh: THREE.Mesh; line: THREE.LineSegments; initialY: number; initialRotZ: number }[] = [];

    const offsets = [
      { y: -0.2, z: -0.2, rotZ: -0.08, color: 0x071F30, op: 0.6 },
      { y: 0, z: 0, rotZ: 0.04, color: 0x0C2A46, op: 0.8 },
      { y: 0.2, z: 0.2, rotZ: -0.02, color: 0xF7F3EC, op: 0.95 }
    ];

    offsets.forEach((cfg) => {
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.op,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(docGeo, mat);
      mesh.position.set(0, cfg.y, cfg.z);
      mesh.rotation.x = -Math.PI / 3;
      mesh.rotation.z = cfg.rotZ;

      const lineMat = new THREE.LineBasicMaterial({
        color: 0xA67A53,
        transparent: true,
        opacity: 0.5
      });
      const line = new THREE.LineSegments(edgesGeo, lineMat);
      mesh.add(line);

      group.add(mesh);
      sheets.push({ mesh, line, initialY: cfg.y, initialRotZ: cfg.rotZ });
    });

    let animationId: number;
    let isMounted = true;
    let time = 0;

    const animate = () => {
      if (!isMounted) return;
      animationId = requestAnimationFrame(animate);
      time += 0.015;

      group.rotation.y = Math.sin(time * 0.5) * 0.15;
      sheets.forEach((s, idx) => {
        s.mesh.position.y = s.initialY + Math.sin(time + idx * 0.8) * 0.05;
      });

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
      docGeo.dispose();
      edgesGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full min-h-[240px] pointer-events-none ${className}`} />;
};
