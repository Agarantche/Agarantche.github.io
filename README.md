# agarantche.github.io

My about-me page — an editorial, typography-led single page with one 3D moment.

**Stack:** Vite + React · React Three Fiber + drei · Framer Motion · Lenis

## Develop

```bash
npm install
npm run dev       # dev server
npm run build     # static build → dist/
npm run preview   # serve the build locally
node verify.mjs   # headless visual check (needs Edge + `npm run preview` running)
```

## Deploy

Pushed to `main` → built and published by GitHub Actions (`.github/workflows/deploy.yml`).
Pages must be set to **Settings → Pages → Source: GitHub Actions**.
