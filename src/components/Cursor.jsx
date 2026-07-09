import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useApp } from '../AppContext.jsx'

/** Ink-dot cursor: grows over interactive elements and shows their label. */
export default function Cursor() {
  const { reduced } = useApp()
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')
  const [hovering, setHovering] = useState(false)

  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)
  const x = useSpring(mx, { stiffness: 500, damping: 40, mass: 0.5 })
  const y = useSpring(my, { stiffness: 500, damping: 40, mass: 0.5 })

  useEffect(() => {
    if (reduced) return
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    setEnabled(true)
    document.documentElement.classList.add('has-custom-cursor')

    const onMove = (e) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      const target = e.target.closest('a, button, [data-cursor]')
      if (target) {
        setHovering(true)
        setLabel(target.getAttribute('data-cursor') || '')
      } else {
        setHovering(false)
        setLabel('')
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [reduced, mx, my])

  if (!enabled) return null

  const scale = hovering ? (label ? 7 : 3.4) : 1

  return (
    <motion.div
      className="cursor-dot"
      style={{ x, y }}
      animate={{ scale }}
      transition={{ type: 'spring', stiffness: 350, damping: 24 }}
      aria-hidden="true"
    >
      {label && <span className="cursor-label">{label}</span>}
    </motion.div>
  )
}
