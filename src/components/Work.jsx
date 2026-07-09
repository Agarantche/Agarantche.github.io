import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { useApp } from '../AppContext.jsx'

/* Abstract editorial thumbnails, drawn inline so nothing is fetched. */
const THUMBS = {
  mailflow: (
    <svg viewBox="0 0 200 150" aria-hidden="true">
      <rect className="stroke" x="30" y="35" width="140" height="80" />
      <path className="stroke" d="M30 40 L100 95 L170 40" />
      <circle className="fill" cx="160" cy="45" r="10" />
      <path className="stroke" d="M45 130 h40 M95 130 h60" strokeDasharray="3 6" />
    </svg>
  ),
  drivescape: (
    <svg viewBox="0 0 200 150" aria-hidden="true">
      <path className="stroke" d="M20 130 C 60 130, 50 60, 95 60 S 130 110, 180 30" strokeDasharray="10 7" />
      <circle className="fill" cx="20" cy="130" r="7" />
      <circle className="stroke" cx="180" cy="30" r="9" />
      <path className="stroke" d="M150 115 l14 -8 M40 45 l12 10" />
    </svg>
  ),
  porsche: (
    <svg viewBox="0 0 200 150" aria-hidden="true">
      <path className="stroke" d="M25 125 h150 M25 125 v-100" />
      <path className="stroke" d="M25 105 L60 92 L90 100 L125 60 L160 42" />
      <circle className="fill" cx="125" cy="60" r="5" />
      <circle className="fill" cx="160" cy="42" r="5" />
      <path className="stroke" d="M25 75 h150" strokeDasharray="2 8" opacity="0.5" />
    </svg>
  ),
  partyflix: (
    <svg viewBox="0 0 200 150" aria-hidden="true">
      <rect className="stroke" x="30" y="30" width="85" height="60" />
      <rect className="stroke" x="85" y="60" width="85" height="60" />
      <path className="fill" d="M62 48 l18 12 -18 12 z" />
      <path className="fill" d="M117 78 l18 12 -18 12 z" />
    </svg>
  ),
}

const PROJECTS = [
  {
    id: 'mailflow',
    num: '01',
    title: 'MailFlow',
    status: 'in progress',
    desc: 'AI email triage for Gmail. It reads the inbox so you don’t have to — categorizes, prioritizes, flags risk, and drafts replies it never dares send itself.',
    tech: 'Next.js · Supabase · OpenAI',
    links: [{ label: 'GitHub', href: 'https://github.com/Agarantche/MailFlow' }],
    cursor: 'view',
  },
  {
    id: 'drivescape',
    num: '02',
    title: 'DriveScape',
    desc: 'An app for finding fun drives — twisty, scenic, open. Because the fastest route is almost never the best one.',
    tech: 'React · Vite · Mapbox',
    links: [{ label: 'GitHub', href: 'https://github.com/Agarantche/DriveScape' }],
    cursor: 'view',
  },
  {
    id: 'porsche',
    num: '03',
    title: '911 by the Numbers',
    desc: 'Fifty-plus years of Porsche 911 performance data in one interactive dashboard. Air-cooled vs. water-cooled, settled with charts.',
    tech: 'Python · pandas · Plotly',
    links: [
      { label: 'Live demo', href: 'https://agarantche.github.io/Porsche-data-analysis/' },
      { label: 'GitHub', href: 'https://github.com/Agarantche/Porsche-data-analysis' },
    ],
    cursor: 'play',
  },
]

const GATE_PROJECT = {
  id: 'partyflix',
  num: '04',
  title: 'PartyFlix',
  desc: 'A Chrome extension that syncs Netflix play/pause between friends in real time. Built for long-distance anime night. DRM-safe; the lawyers can relax.',
  tech: 'React · Socket.IO · Manifest V3',
  links: [{ label: 'GitHub', href: 'https://github.com/Agarantche/PartyFlix' }],
  cursor: 'view',
}

function WorkItem({ project, gated = false }) {
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

      <motion.div
        className="work-thumb"
        style={reduced ? undefined : { filter: blur, opacity: thumbOpacity }}
      >
        {THUMBS[project.id]}
      </motion.div>
    </article>
  )
}

/* The curiosity gate: one deliberately obscured project. */
function GatedItem() {
  const [revealed, setRevealed] = useState(false)

  if (revealed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94, filter: 'blur(14px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ type: 'spring', stiffness: 170, damping: 20 }}
      >
        <WorkItem project={GATE_PROJECT} />
      </motion.div>
    )
  }

  return (
    <div className="gate-wrap">
      <div className="work-item" aria-hidden="true">
        <span className="work-num sans">04</span>
        <div className="work-body">
          <h3 className="work-title">■■■■■■■■■</h3>
          <p className="work-desc">Something about watching things together, apart. It involves a browser and mild legal caution.</p>
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
