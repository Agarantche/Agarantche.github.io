// Local visual verification — not part of the site build.
import puppeteer from 'puppeteer-core'

const OUT = process.env.SHOT_DIR || '.'
const URL = 'http://localhost:4173/'

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--window-size=1440,900'],
  defaultViewport: { width: 1440, height: 900 },
})
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()) })

await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 2500)) // let blob mount + idle

const shot = (name) => page.screenshot({ path: `${OUT}/shot-${name}.png` })

// 1. hero light
await shot('01-hero-light')

// 2. scroll to about (statements mid-darken)
await page.evaluate(() => window.scrollTo(0, document.getElementById('about').offsetTop - 200))
await new Promise((r) => setTimeout(r, 1200))
await shot('02-about')

// 3. work section, first items
await page.evaluate(() => window.scrollTo(0, document.getElementById('work').offsetTop - 60))
await new Promise((r) => setTimeout(r, 1200))
await shot('03-work-top')

// 4. gate (unrevealed) — scroll near the end of work
await page.evaluate(() => {
  const gate = document.querySelector('.gate-cover')
  gate.scrollIntoView({ block: 'center' })
})
await new Promise((r) => setTimeout(r, 1200))
await shot('04-gate-hidden')

// 5. click the gate → revealed project
await page.click('.gate-cover')
await new Promise((r) => setTimeout(r, 900))
await shot('05-gate-revealed')

// 6. contact + footer (echo blob)
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await new Promise((r) => setTimeout(r, 1500))
await shot('06-contact-footer')

// 7. command palette
await page.keyboard.down('Control')
await page.keyboard.press('k')
await page.keyboard.up('Control')
await new Promise((r) => setTimeout(r, 600))
await shot('07-palette')
await page.keyboard.press('Escape')

// 8. dark mode hero
await page.evaluate(() => window.scrollTo(0, 0))
await page.click('.theme-toggle')
await new Promise((r) => setTimeout(r, 1200))
await shot('08-hero-dark')

// 9. dark mode contact
await page.evaluate(() => window.scrollTo(0, document.getElementById('contact').offsetTop - 100))
await new Promise((r) => setTimeout(r, 1000))
await shot('09-contact-dark')

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO CONSOLE/PAGE ERRORS')
await browser.close()
