// Genera public/og-directiva.png (1200×630) a partir de la portada de /directiva/.
// Uso: con `npx vite preview --port 4173` corriendo, node scripts/make-og-directiva.mjs
import { chromium } from '@playwright/test'
const base = process.argv[2] ?? 'http://localhost:4173'
const b = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {})
// 1200×686 deja 630 px de lámina sobre la barra de controles (56 px), que queda fuera del recorte.
const page = await b.newPage({ viewport: { width: 1200, height: 686 } })
await page.goto(`${base}/directiva/#/1`)
await page.waitForLoadState('networkidle')
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1200)
await page.addStyleTag({ content: '.dx-progress { display: none !important; }' })
await page.screenshot({ path: 'public/og-directiva.png', clip: { x: 0, y: 0, width: 1200, height: 630 } })
await b.close()
