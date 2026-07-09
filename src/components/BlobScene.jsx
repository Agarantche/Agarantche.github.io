import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

/**
 * The one 3D moment: a soft-matte cobalt blob with an iridescent sheen.
 * Idles with slow constant motion, leans toward the cursor with damped
 * easing, and dissolves upward as the hero scrolls away.
 */
function Blob({ progress, reduced, pointer, small }) {
  const mesh = useRef()
  const mat = useRef()
  const base = small
    ? { x: 0, y: 0, scale: 0.55 }
    : { x: 1.3, y: 0.35, scale: 0.62 }

  useFrame((state, dt) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime

    if (!reduced) {
      // slow constant idle
      mesh.current.rotation.y += dt * 0.18
      mesh.current.rotation.z = Math.sin(t * 0.22) * 0.14

      // damped lean toward cursor
      const px = pointer?.current?.x ?? 0
      const py = pointer?.current?.y ?? 0
      mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, -py * 0.45, 2.2, dt)
      mesh.current.position.x = THREE.MathUtils.damp(mesh.current.position.x, base.x + px * 0.4, 2.2, dt)
    }

    // dissolve / drift upward on scroll out of the hero
    const p = progress ? progress.get() : 0
    mesh.current.position.y = THREE.MathUtils.damp(mesh.current.position.y, base.y + p * 2.6, 3.5, dt)
    const s = base.scale * (1 - p * 0.45)
    const cur = mesh.current.scale.x
    mesh.current.scale.setScalar(THREE.MathUtils.damp(cur, s, 3.5, dt))
    if (mat.current) mat.current.opacity = Math.max(0, 1 - p * 1.15)
  })

  return (
    <mesh ref={mesh} position={[base.x, base.y, 0]} scale={base.scale}>
      <icosahedronGeometry args={[1.25, 48]} />
      <MeshDistortMaterial
        ref={mat}
        transparent
        color="#1D46D8"
        distort={0.42}
        speed={reduced ? 0 : 1.7}
        roughness={0.38}
        metalness={0.1}
        clearcoat={0.35}
        clearcoatRoughness={0.5}
        iridescence={0.5}
        iridescenceIOR={1.4}
      />
    </mesh>
  )
}

export default function BlobScene({ progress = null, reduced = false, small = false }) {
  // normalized cursor position, tracked globally so the canvas can stay
  // pointer-events: none and never block the page
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    if (reduced || small) return
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced, small])

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={reduced ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 5, 6]} intensity={1.05} />
      <pointLight position={[-5, -2, 4]} intensity={40} color="#2F6BFF" />
      <pointLight position={[3, 3, -2]} intensity={18} color="#DCE8F5" />
      <Blob progress={progress} reduced={reduced} pointer={pointer} small={small} />
    </Canvas>
  )
}
