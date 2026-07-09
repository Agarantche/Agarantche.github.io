import { useEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import { AppContext } from './AppContext.jsx'
import Header from './components/Header.jsx'
import RailNav from './components/RailNav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Work from './components/Work.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './components/Cursor.jsx'
import CommandPalette from './components/CommandPalette.jsx'

export default function App() {
  const reduced = useReducedMotion()
  const lenisRef = useRef(null)
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch { /* private mode */ }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  // Lenis smooth scroll (skipped for reduced motion)
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.1 })
    lenisRef.current = lenis
    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  const scrollTo = useCallback((selector) => {
    const el = document.querySelector(selector)
    if (!el) return
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: 0 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <AppContext.Provider value={{ theme, toggleTheme, scrollTo, reduced: !!reduced }}>
      <Cursor />
      <CommandPalette />
      <Header />
      <RailNav />
      <main>
        <Hero />
        <About />
        <Work />
        <Contact />
      </main>
      <Footer />
    </AppContext.Provider>
  )
}
