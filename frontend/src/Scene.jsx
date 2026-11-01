
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
    Float,
    OrbitControls,
    Stars,
    Sparkles,
    MeshDistortMaterial
} from "@react-three/drei";

function Core({ lightMode }) {
    return (
        <Float
            speed={1.3}
            rotationIntensity={0.7}
            floatIntensity={0.8}
        >
            <mesh>
                <icosahedronGeometry args={[1.35, 3]} />

                <MeshDistortMaterial
                    color={lightMode ? "#4f46e5" : "#635bff"}
                    roughness={lightMode ? 0.35 : 0.25}
                    metalness={lightMode ? 0.25 : 0.6}
                    distort={0.3}
                    speed={1.2}
                    emissive={lightMode ? "#312e81" : "#21145e"}
                    emissiveIntensity={lightMode ? 0.3 : 0.45}
                />
            </mesh>

            <mesh scale={1.7} rotation={[0.5, 0.3, 0]}>
                <torusGeometry args={[1.35, 0.018, 12, 80]} />
                <meshBasicMaterial
                    color={lightMode ? "#0891b2" : "#22d3ee"}
                />
            </mesh>

            <mesh scale={2.05} rotation={[1.1, 0.4, 0.3]}>
                <torusGeometry args={[1.35, 0.009, 8, 80]} />
                <meshBasicMaterial
                    color={lightMode ? "#818cf8" : "#818cf8"}
                    transparent
                    opacity={0.8}
                />
            </mesh>
        </Float>
    );
}

export default function Scene() {
    const containerRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [lightMode, setLightMode] = useState(false);

    useEffect(() => {
        const element = containerRef.current;

        if (!element) return;

        const updateTheme = () => {
            setLightMode(Boolean(element.closest(".light-mode")));
        };

        updateTheme();

        const themeObserver = new MutationObserver(updateTheme);

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
            subtree: true
        });

        return () => themeObserver.disconnect();
    }, []);

    useEffect(() => {
        const element = containerRef.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setVisible(entry.isIntersecting);
            },
            {
                rootMargin: "100px",
                threshold: 0
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none"
        >
            {visible && (
                <Canvas
                    camera={{
                        position: [0, 0, 5],
                        fov: 45
                    }}
                    dpr={[1, 1.5]}
                    gl={{
                        antialias: false,
                        alpha: true,
                        powerPreference: "low-power"
                    }}
                >
                    <ambientLight intensity={1.5} />

                    <pointLight
                        position={[3, 3, 4]}
                        intensity={lightMode ? 35 : 25}
                        color={lightMode ? "#818cf8" : "#7c3aed"}
                    />

                    <pointLight
                        position={[-3, -2, 2]}
                        intensity={lightMode ? 25 : 15}
                        color="#22d3ee"
                    />

                    <pointLight
                        position={[0, 3, -3]}
                        intensity={lightMode ? 12 : 8}
                        color="#a78bfa"
                    />

                    {lightMode ? (
                        <Sparkles
                            count={180}
                            scale={[12, 8, 6]}
                            size={4}
                            speed={0.6}
                            opacity={1}
                            color="#4f46e5"
                            noise={1}
                        />
                    ) : (
                        <Stars
                            radius={60}
                            depth={30}
                            count={1000}
                            factor={3}
                            saturation={0.8}
                            fade={false}
                            speed={0.8}
                        />
                    )}

                    <Core lightMode={lightMode} />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.3}
                    />
                </Canvas>
            )}
        </div>
    );
}
