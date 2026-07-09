import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useApp } from '../AppContext.jsx'

/** Wraps a child in a magnetic field: it leans toward the cursor. */
export default function Magnetic({ children, strength = 0.35 }) {
  const { reduced } = useApp()
  const ref = useRef(null)
  const x = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 })
  const y = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 })

  const onMove = (e) => {
    if (reduced || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.span
      ref={ref}
      style={{ display: 'inline-block', x, y }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.span>
  )
}
