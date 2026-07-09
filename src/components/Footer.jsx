import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useApp } from '../AppContext.jsx'

const BlobScene = lazy(() => import('./BlobScene.jsx'))

export default function Footer() {
  const { reduced } = useApp()
  const ref = useRef(null)
  const [showEcho, setShowEcho] = useState(false)

  // mount the small 3D echo only when the footer approaches
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setShowEcho(true) },
      { rootMargin: '200px' },
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <footer className="footer" ref={ref}>
      {showEcho && (
        <div className="echo" aria-hidden="true">
          <Suspense fallback={null}>
            <BlobScene small reduced={reduced} />
          </Suspense>
        </div>
      )}
      <div className="container">
        <div className="footer-grid">
          <span>
            ADAM GARANTCHE — v2.0.0 · © {new Date().getFullYear()}
            <br />
            hand-coded with React, Three.js, Framer Motion &amp; a stubborn attention to kerning.
          </span>
          <span>
            <a href="https://github.com/Agarantche/Agarantche.github.io" target="_blank" rel="noopener noreferrer" data-cursor="view">view source ↗</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
