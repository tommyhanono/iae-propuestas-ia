// Genera public/og.png (1200x630) y public/apple-touch-icon.png desde el lobby real.
// Uso: con `npx vite preview --port 4173` corriendo → node scripts/make-og.mjs
import { chromium } from '@playwright/test'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1600, height: 840 }, deviceScaleFactor: 0.75 })
await p.goto('http://localhost:4173/#lobby')
await p.addStyleTag({ content: 'nav, header { display: none !important; }' })
await p.waitForTimeout(3500)
await p.screenshot({ path: 'public/og.png' })
const i = await b.newPage({ viewport: { width: 180, height: 180 } })
await i.setContent(`<body style="margin:0;background:#10151F">${(await import('node:fs')).readFileSync('public/favicon.svg', 'utf8').replace('<svg ', '<svg width="180" height="180" ')}</body>`)
await i.screenshot({ path: 'public/apple-touch-icon.png' })
await b.close()
