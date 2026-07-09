import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { useApp } from '../AppContext.jsx'

const Vignette = lazy(() => import('./Vignette.jsx'))

const PROJECTS = [
  {
    id: 'mailflow',
    num: '01',
    title: 'MailFlow',
    status: 'in progress',
    vignette: 'mail',
    desc: 'AI email triage for Gmail. It reads the inbox so you don’t have to — categorizes, prioritizes, flags risk, and drafts replies it never dares send itself. OAuth handled server-side, Stripe scaffolding waiting patiently for its moment.',
    tech: 'Next.js · TypeScript · OpenAI · Supabase',
    links: [{ label: 'GitHub', href: 'https://github.com/Agarantche/MailFlow' }],
    cursor: 'view',
  },
  {
    id: 'drivescape',
    num: '02',
    title: 'DriveScape',
    vignette: 'road',
    desc: 'Forza Horizon energy, real-world roads. Open it and geolocation spawns six drivable routes snapped to actual asphalt via Mapbox Directions, each with a cinematic drive-through preview, three map modes, and route names written by Claude — because “Route 4” deserved better.',
    tech: 'React · Vite · Mapbox GL · Node/Express · Anthropic API',
    links: [{ label: 'GitHub', href: 'https://github.com/Agarantche/DriveScape' }],
    cursor: 'view',
  },
  {
    id: 'porsche',
    num: '03',
    title: '911 by the Numbers',
    vignette: 'dial',
    desc: 'Roughly 290 Porsche 911 variants across sixty-plus years, 232 scraped Nürburgring lap times, and engineered metrics like power-to-weight and a Driver Score — eight interactive Plotly charts settling air-cooled vs. water-cooled with data instead of forum arguments.',
    tech: 'Python · pandas · Plotly',
    links: [
      { label: 'Live demo', href: 'https://agarantche.github.io/Porsche-data-analysis/' },
      { label: 'GitHub', href: 'https://github.com/Agarantche/Porsche-data-analysis' },
    ],
    cursor: 'play',
  },
]

/* Lazy-mounts the 3D still-life only when the card is near the viewport. */
function Thumb({ vignette, pop = false }) {
  const { reduced } = useApp()
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const hover = useRef(false)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: '160px' },
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
    pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1
  }

  return (
    <div
      className="work-thumb"
      ref={ref}
      onPointerEnter={() => { hover.current = true }}
      onPointerLeave={() => { hover.current = false }}
      onPointerMove={onMove}
    >
      {inView && (
        <Suspense fallback={null}>
          <Vignette kind={vignette} hover={hover} pointer={pointer} reduced={reduced} pop={pop} />
        </Suspense>
      )}
    </div>
  )
}

function WorkItem({ project }) {
  const { reduced } = useApp()
  const ref = useRef(null)

  // thumbnails sharpen from 20px blur as they reach mid-viewport
  const { scrollYProgress: enter } = useScroll({
    target: ref,
    offset: ['start 0.95', 'start 0.45'],
  })
  const blurPx = useTransform(enter, [0, 1], [20, 0])
  const blur = useMotionTemplate`blur(${blurPx}px)`
  const thumbOpacity = useTransform(enter, [0, 1], [0.4, 1])

  // oversized numbers parallax slower than the content
  const { scrollYProgress: through } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const numY = useTransform(through, [0, 1], [70, -70])

  return (
    <article className="work-item" ref={ref} id={`work-${project.id}`}>
      <motion.span
        className="work-num sans"
        style={reduced ? undefined : { y: numY }}
        aria-hidden="true"
      >
        {project.num}
      </motion.span>

      <div className="work-body">
        <h3 className="work-title">
          <a
            href={project.links[0].href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor={project.cursor}
          >
            {project.title}
          </a>
          {project.status && <span className="work-status">{project.status}</span>}
        </h3>
        <p className="work-desc">{project.desc}</p>
        <p className="work-tech">{project.tech}</p>
        <div className="work-links">
          {project.links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" data-cursor={project.cursor}>
              {l.label} ↗
            </a>
          ))}
        </div>
      </div>

      <motion.div style={reduced ? undefined : { filter: blur, opacity: thumbOpacity }}>
        <Thumb vignette={project.vignette} />
      </motion.div>
    </article>
  )
}

/* The curiosity gate: deliberately obscured, honestly empty. */
function GatedItem() {
  const [revealed, setRevealed] = useState(false)

  if (revealed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94, filter: 'blur(14px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ type: 'spring', stiffness: 170, damping: 20 }}
      >
        <article className="work-item" id="work-redacted">
          <span className="work-num sans" aria-hidden="true">04</span>
          <div className="work-body">
            <h3 className="work-title">[REDACTED]</h3>
            <p className="work-desc">
              Next project is still in the lab. It involves my phone learning
              to tell Claude “yes.” That’s all you get. Check back.
            </p>
            <p className="work-tech">■■■■ · Claude · ■■■■■■</p>
          </div>
          <Thumb vignette="question" pop />
        </article>
      </motion.div>
    )
  }

  return (
    <div className="gate-wrap">
      <div className="work-item" aria-hidden="true">
        <span className="work-num sans">04</span>
        <div className="work-body">
          <h3 className="work-title">■■■■■■■■■</h3>
          <p className="work-desc">Something is being built. It has not shipped. Clicking will not change that, but it will feel like progress.</p>
          <p className="work-tech">■■■ · ■■■■■■ · ■■</p>
        </div>
        <div className="work-thumb" />
      </div>
      <button
        className="gate-cover"
        onClick={() => setRevealed(true)}
        aria-label="Reveal the hidden project"
        data-cursor="reveal"
      >
        <span>
          <span className="q">?</span>
          <span className="hint" style={{ display: 'block' }}>click to declassify</span>
        </span>
      </button>
    </div>
  )
}

export default function Work() {
  return (
    <section id="work" data-section>
      <div className="container">
        <h2 className="giant-word">
          Work<span className="dot">.</span>
        </h2>
        {PROJECTS.map((p) => (
          <WorkItem key={p.id} project={p} />
        ))}
        <GatedItem />
      </div>
    </section>
  )
}
