import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../AppContext.jsx'

export default function CommandPalette() {
  const { toggleTheme, scrollTo } = useApp()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)

  const commands = useMemo(() => [
    { label: 'Go to Intro', kind: 'nav', run: () => scrollTo('#intro') },
    { label: 'Go to About', kind: 'nav', run: () => scrollTo('#about') },
    { label: 'Go to Work', kind: 'nav', run: () => scrollTo('#work') },
    { label: 'Go to Contact', kind: 'nav', run: () => scrollTo('#contact') },
    { label: 'Toggle theme', kind: 'ui', run: () => toggleTheme() },
    { label: 'Email me', kind: 'link', run: () => { window.location.href = 'mailto:adamgarantche612@gmail.com' } },
    { label: 'Open GitHub', kind: 'link', run: () => window.open('https://github.com/Agarantche', '_blank', 'noopener') },
  ], [scrollTo, toggleTheme])

  const filtered = useMemo(
    () => commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [commands, query],
  )

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        setQuery('')
        setSelected(0)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30)
  }, [open])

  const runCommand = (cmd) => {
    setOpen(false)
    cmd.run()
  }

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter' && filtered[selected]) {
      runCommand(filtered[selected])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="palette-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="palette"
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(0) }}
              onKeyDown={onInputKey}
              placeholder="Type a command…"
              aria-label="Search commands"
            />
            <ul>
              {filtered.map((c, i) => (
                <li key={c.label} className={i === selected ? 'selected' : ''}>
                  <button onClick={() => runCommand(c)} onMouseEnter={() => setSelected(i)}>
                    {c.label}
                    <span className="kind">{c.kind}</span>
                  </button>
                </li>
              ))}
              {filtered.length === 0 && <li className="palette-empty">Nothing matches. Bold strategy.</li>}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
