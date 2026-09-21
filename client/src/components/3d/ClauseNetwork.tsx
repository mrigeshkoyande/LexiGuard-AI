import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ClauseNetworkProps {
  className?: string;
}

export const ClauseNetwork: React.FC<ClauseNetworkProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const nodeCount = 12;
    const nodePositions: THREE.Vector3[] = [];
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const sphereGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xA67A53 });
    const centerMat = new THREE.MeshBasicMaterial({ color: 0xC49A6C });

    // Generate node positions
    for (let i = 0; i < nodeCount; i++) {
      const theta = (i / nodeCount) * Math.PI * 2;
      const radius = 2.2 + (i % 3) * 0.4;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * (radius * 0.6);
      const z = ((i % 5) - 2) * 0.4;
      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos);

      const mesh = new THREE.Mesh(sphereGeo, i === 0 ? centerMat : sphereMat);
      mesh.position.copy(pos);
      nodesGroup.add(mesh);
    }

    // Create connected line geometry between adjacent and center nodes
    const lineIndices: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      lineIndices.push(0, i); // Connect all to center node
      lineIndices.push(i, (i + 1) % nodeCount); // Connect to adjacent
    }

    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i < lineIndices.length; i += 2) {
      linePoints.push(nodePositions[lineIndices[i]], nodePositions[lineIndices[i + 1]]);
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xA67A53,
      transparent: true,
      opacity: 0.3
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    nodesGroup.add(lines);

    let animationId: number;
    let isMounted = true;

    const animate = () => {
      if (!isMounted) return;
      animationId = requestAnimationFrame(animate);

      nodesGroup.rotation.y += 0.004;
      nodesGroup.rotation.x += 0.002;

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
      sphereGeo.dispose();
      sphereMat.dispose();
      centerMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full min-h-[220px] pointer-events-none ${className}`} />;
};
