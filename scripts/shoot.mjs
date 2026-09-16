// Screenshots de cada nodo: node scripts/shoot.mjs [base] [outdir]
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
const base = process.argv[2] ?? 'http://localhost:4173'
const out = process.argv[3] ?? 'tests/screenshots/nodos'
mkdirSync(out, { recursive: true })
const keys = ['lobby', ...Array.from({ length: 8 }, (_, i) => `bc-${i + 1}`), ...Array.from({ length: 5 }, (_, i) => `cu-${i + 1}`)]
const b = await chromium.launch()
for (const vp of [{ n: 'd1440', w: 1440, h: 900 }, { n: 'm375', w: 375, h: 812, mobile: true }]) {
  const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.mobile, hasTouch: !!vp.mobile, deviceScaleFactor: vp.mobile ? 2 : 1 })
  const page = await ctx.newPage()
  const errs = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('pageerror', (e) => errs.push(e.message))
  for (const k of keys) {
    await page.goto(`${base}/#${k}`)
    await page.waitForFunction(() => document.querySelector('[data-app]')?.getAttribute('data-camera-settled') === 'true')
    await page.waitForTimeout(3200)
    const info = await page.evaluate((key) => {
      const el = document.querySelector(`[data-node="${key}"] .node-inner`)
      return el ? { sh: el.scrollHeight, ch: el.clientHeight, sw: el.scrollWidth, cw: el.clientWidth, doc: document.documentElement.scrollWidth } : null
    }, k)
    console.log(vp.n, k, JSON.stringify(info))
    await page.screenshot({ path: `${out}/${vp.n}-${k}.png`, fullPage: false })
  }
  if (errs.length) console.log('ERRORS', vp.n, errs)
  await ctx.close()
}
await b.close()
