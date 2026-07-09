import { useEffect, useState } from 'react'
import { useApp } from '../AppContext.jsx'

const fmt = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'America/New_York',
})

export default function Header() {
  const { theme, toggleTheme } = useApp()
  const [time, setTime] = useState(() => fmt.format(new Date()))

  useEffect(() => {
    const id = setInterval(() => setTime(fmt.format(new Date())), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="header">
      <div className="left">Adam Garantche — Columbus, OH</div>
      <div className="right">
        <span className="clock" aria-label="Local time in Columbus, Ohio">
          {time} EST
        </span>
        <span className="kbd-hint" aria-hidden="true">ctrl+k</span>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          data-cursor="theme"
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><g stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="23" /><line x1="1" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="23" y2="12" /><line x1="4.2" y1="4.2" x2="6.3" y2="6.3" /><line x1="17.7" y1="17.7" x2="19.8" y2="19.8" /><line x1="4.2" y1="19.8" x2="6.3" y2="17.7" /><line x1="17.7" y1="6.3" x2="19.8" y2="4.2" /></g></svg>
          ) : (
            <svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
          )}
        </button>
      </div>
    </header>
  )
}
