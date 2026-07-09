import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Small still-life objects, one per project card. Toy-like, matte,
 * built from primitives only. Idle with a slow drift; tilt toward the
 * cursor while the card is hovered. Everything stops for
 * prefers-reduced-motion.
 */

const COBALT = '#1D46D8'
const PASTEL = '#DCE8F5'
const WARM = '#F0B7A4'

const Matte = ({ color }) => (
  <meshStandardMaterial color={color} roughness={0.65} metalness={0} />
)

/* soft fake contact shadow on the panel */
const Shadow = ({ y = -1.0, scale = 1 }) => (
  <mesh rotation-x={-Math.PI / 2} position={[0, y, 0]} scale={scale}>
    <circleGeometry args={[0.72, 32]} />
    <meshBasicMaterial color="#101623" transparent opacity={0.07} />
  </mesh>
)

function MailObject() {
  return (
    <group rotation={[0.12, -0.25, 0]}>
      {/* envelope body */}
      <mesh>
        <boxGeometry args={[1.5, 1.0, 0.14]} />
        <Matte color={COBALT} />
      </mesh>
      {/* flap fold lines */}
      <mesh position={[-0.36, 0.14, 0.08]} rotation-z={-0.32}>
        <boxGeometry args={[0.92, 0.05, 0.02]} />
        <Matte color={PASTEL} />
      </mesh>
      <mesh position={[0.36, 0.14, 0.08]} rotation-z={0.32}>
        <boxGeometry args={[0.92, 0.05, 0.02]} />
        <Matte color={PASTEL} />
      </mesh>
      {/* notification sphere on the corner */}
      <mesh position={[0.74, 0.52, 0.12]}>
        <sphereGeometry args={[0.17, 24, 24]} />
        <Matte color={WARM} />
      </mesh>
    </group>
  )
}

function RoadObject() {
  const arc = Math.PI * 0.85
  const dashes = [0.12, 0.3, 0.48, 0.66, 0.84]
  return (
    <group rotation={[0.9, 0.15, -0.4]} position={[0, -0.05, 0]}>
      {/* curved flat band, like a toy track piece */}
      <mesh scale={[1, 1, 0.22]}>
        <torusGeometry args={[0.85, 0.3, 16, 60, arc]} />
        <Matte color={COBALT} />
      </mesh>
      {/* dashed center line */}
      {dashes.map((f) => {
        const a = arc * f
        return (
          <mesh
            key={f}
            position={[Math.cos(a) * 0.85, Math.sin(a) * 0.85, 0.075]}
            rotation-z={a + Math.PI / 2}
          >
            <boxGeometry args={[0.16, 0.045, 0.02]} />
            <Matte color={PASTEL} />
          </mesh>
        )
      })}
      {/* destination pin at the far end */}
      <mesh position={[Math.cos(arc) * 0.85, Math.sin(arc) * 0.85, 0.16]}>
        <sphereGeometry args={[0.13, 20, 20]} />
        <Matte color={WARM} />
      </mesh>
    </group>
  )
}

function DialObject() {
  const ticks = [-0.9, -0.3, 0.3, 0.9]
  return (
    <group rotation={[0.95, 0, 0]}>
      {/* dial disc */}
      <mesh>
        <cylinderGeometry args={[0.88, 0.88, 0.16, 48]} />
        <Matte color={COBALT} />
      </mesh>
      {/* tick marks */}
      {ticks.map((a) => (
        <mesh
          key={a}
          position={[Math.sin(a) * 0.66, 0.1, -Math.cos(a) * 0.66]}
          rotation-y={-a}
        >
          <boxGeometry args={[0.06, 0.03, 0.18]} />
          <Matte color={PASTEL} />
        </mesh>
      ))}
      {/* needle, buried near redline */}
      <group rotation-y={-0.75}>
        <mesh position={[0, 0.11, -0.3]}>
          <boxGeometry args={[0.055, 0.03, 0.6]} />
          <Matte color={WARM} />
        </mesh>
      </group>
      {/* hub */}
      <mesh position={[0, 0.13, 0]}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <Matte color={PASTEL} />
      </mesh>
    </group>
  )
}

function QuestionObject() {
  return (
    <group rotation={[0.1, -0.15, 0]} position={[0, 0.08, 0]}>
      {/* the hook */}
      <mesh position={[0, 0.28, 0]} rotation-z={-1.9}>
        <torusGeometry args={[0.4, 0.14, 20, 40, Math.PI * 1.45]} />
        <Matte color={COBALT} />
      </mesh>
      {/* stem */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.3, 20]} />
        <Matte color={COBALT} />
      </mesh>
      {/* the dot */}
      <mesh position={[0, -0.68, 0]}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <Matte color={WARM} />
      </mesh>
    </group>
  )
}

const OBJECTS = {
  mail: MailObject,
  road: RoadObject,
  dial: DialObject,
  question: QuestionObject,
}

function Still({ kind, hover, pointer, reduced, pop }) {
  const group = useRef()
  const born = useRef(null)
  const Obj = OBJECTS[kind]

  useFrame((state, dt) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    if (born.current === null) born.current = t

    // spring pop-in for the declassified reveal
    if (pop && !reduced) {
      const e = t - born.current
      const s = Math.min(1.15, 1 - Math.exp(-5.5 * e) * Math.cos(7 * e)) // springy overshoot
      group.current.scale.setScalar(Math.max(0.001, e < 1.4 ? s : THREE.MathUtils.damp(group.current.scale.x, 1, 4, dt)))
    }

    if (reduced) return
    // slow few-degree idle drift
    const idleY = Math.sin(t * 0.4) * 0.09
    const idleX = Math.cos(t * 0.3) * 0.05
    // lean toward cursor on hover
    const tx = hover.current ? pointer.current.y * 0.3 : 0
    const ty = hover.current ? pointer.current.x * 0.4 : 0
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, idleX + tx, 3, dt)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, idleY + ty, 3, dt)
  })

  return (
    <group ref={group} scale={pop && !reduced ? 0.001 : 1}>
      <Obj />
    </group>
  )
}

export default function Vignette({ kind, hover, pointer, reduced = false, pop = false }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0.4, 3.6], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduced ? 'demand' : 'always'}
      style={{ pointerEvents: 'none' }}
    >
      {/* soft studio lighting */}
      <ambientLight intensity={0.85} />
      <directionalLight position={[2.5, 4, 4]} intensity={1.3} />
      <pointLight position={[-3, 1, 2]} intensity={6} color={PASTEL} />
      <Shadow />
      <Still kind={kind} hover={hover} pointer={pointer} reduced={reduced} pop={pop} />
    </Canvas>
  )
}
