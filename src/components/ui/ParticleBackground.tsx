import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 500;

        // Detect dark mode
        const isDark = document.documentElement.classList.contains('dark');

        // Particle geometry
        const COUNT = 1200;
        const positions = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 2000;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: isDark ? 0x67e8f9 : 0x067ff9,
            size: isDark ? 1.5 : 1.2,
            transparent: true,
            opacity: isDark ? 0.45 : 0.25,
            sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        let animFrameId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            animFrameId = requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();
            points.rotation.x = elapsed * 0.012;
            points.rotation.y = elapsed * 0.018;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animFrameId);
            window.removeEventListener('resize', handleResize);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
};

export default ParticleBackground;
