import { useEffect, useState } from 'react'
import { useApp } from '../AppContext.jsx'

const SECTIONS = [
  { id: 'intro', label: 'INTRO' },
  { id: 'about', label: 'ABOUT' },
  { id: 'work', label: 'WORK' },
  { id: 'contact', label: 'CONTACT' },
]

export default function RailNav() {
  const { scrollTo } = useApp()
  const [active, setActive] = useState('intro')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="rail" aria-label="Section navigation">
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={active === id ? 'active' : ''}
          onClick={(e) => { e.preventDefault(); scrollTo(`#${id}`) }}
        >
          <span className="tick" aria-hidden="true" />
          {label}
        </a>
      ))}
    </nav>
  )
}
