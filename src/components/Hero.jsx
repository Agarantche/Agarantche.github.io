import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useScroll } from 'framer-motion'
import { useApp } from '../AppContext.jsx'

const BlobScene = lazy(() => import('./BlobScene.jsx'))

export default function Hero() {
  const { reduced } = useApp()
  const ref = useRef(null)
  const [mountCanvas, setMountCanvas] = useState(false)

  // lazy-mount the canvas after first paint / idle
  useEffect(() => {
    const mount = () => setMountCanvas(true)
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(mount, { timeout: 1200 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(mount, 300)
    return () => clearTimeout(id)
  }, [])

  // 0 at top, 1 when hero has fully scrolled away — drives the dissolve
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end 0.25'],
  })

  return (
    <section id="intro" data-section className="hero" ref={ref}>
      <h1 className="hero-name">
        <span className="hero-row hero-row-1">Adam</span>
        <span className="hero-row hero-row-2">Garantche</span>
      </h1>

      {mountCanvas && (
        <div className="hero-canvas" aria-hidden="true">
          <Suspense fallback={null}>
            <BlobScene progress={scrollYProgress} reduced={reduced} />
          </Suspense>
        </div>
      )}

      <div className="hero-foot">
        <p className="hero-sub">
          I'm a CS student who builds web things that actually ship.
          The blob is decorative — <em>it cost me a weekend and I regret nothing.</em>
        </p>
        <p className="currently">
          currently → building <b>MailFlow</b>
          <br />
          learning <b>WebGL</b> (exhibit A, above)
          <br />
          listening to <b>lo-fi I claim helps me focus</b>
        </p>
      </div>

      <span className="scroll-hint" aria-hidden="true">SCROLL</span>
    </section>
  )
}
