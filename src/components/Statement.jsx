import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useApp } from '../AppContext.jsx'

/**
 * Large serif statement where key phrases are full ink and the rest
 * sits at 40% opacity, darkening to full as it scrolls past.
 * segments: array of { t: string, key?: bool, href?: string }
 */
export default function Statement({ segments }) {
  const ref = useRef(null)
  const { reduced } = useApp()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.38'],
  })
  const dim = useTransform(scrollYProgress, [0, 1], [0.4, 1])

  return (
    <p className="statement" ref={ref}>
      {segments.map((s, i) => {
        if (s.key && s.href) {
          return (
            <a key={i} className="key" href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="visit">
              {s.t}
            </a>
          )
        }
        if (s.key) return <span key={i} className="key">{s.t}</span>
        return (
          <motion.span key={i} style={{ opacity: reduced ? 1 : dim }}>
            {s.t}
          </motion.span>
        )
      })}
    </p>
  )
}
