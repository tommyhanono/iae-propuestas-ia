// Capturas de cada lámina y de cada beat de /directiva/.
// Uso: node scripts/shoot-directiva.mjs [base] [outdir]   (con `npx vite preview --port 4173` corriendo)
// PW_CHROMIUM=/ruta/a/chrome si el Chromium de Playwright no está descargado.
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { SLIDES, beatsOf } from '../src/directiva/content.ts'
import { measureSlide } from '../tests/directiva-measure.ts'

const base = process.argv[2] ?? 'http://localhost:4173'
const out = process.argv[3] ?? 'tests/screenshots/directiva'
mkdirSync(out, { recursive: true })
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {})
const sizes = [
  { n: 'd1920', w: 1920, h: 1080 },
  { n: 'd1366', w: 1366, h: 768 },
  { n: 'm390', w: 390, h: 844, mobile: true },
]
const only = process.env.ONLY ? process.env.ONLY.split(',') : null
for (const vp of sizes) {
  if (only && !only.includes(vp.n)) continue
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.mobile, hasTouch: !!vp.mobile, deviceScaleFactor: vp.mobile ? 2 : 1 })
  const page = await ctx.newPage()
  const errs = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  page.on('pageerror', (e) => errs.push(e.message))
  for (const [i, s] of SLIDES.entries()) {
    const hash = s.section === 'Apéndice' ? s.id : String(i + 1)
    await page.goto(`${base}/directiva/#/${hash}`)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    const beats = beatsOf(s)
    for (let b = 0; b < beats; b++) {
      if (beats > 1 && b === 0) {
        // Al abrir por hash la lámina llega completa: se retrocede al primer beat.
        for (let k = 0; k < beats - 1; k++) await page.keyboard.press('ArrowLeft')
      } else if (b > 0) await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(800)
      const name = `${vp.n}-${hash.padStart(2, '0')}-${s.id}${beats > 1 ? `-b${b + 1}` : ''}.png`
      const m = await page.evaluate(measureSlide)
      const bad = m.collisions.length || m.cut.length || m.docScrollW > m.vw
      console.log(`${bad ? 'FAIL' : 'ok  '} ${name} · letra mínima ${m.minFont}px (${m.minFontText})${bad ? '\n     ' + [...m.collisions, ...m.cut, m.docScrollW > m.vw ? `scroll horizontal ${m.docScrollW}>${m.vw}` : ''].filter(Boolean).join('\n     ') : ''}`)
      await page.screenshot({ path: `${out}/${name}` })
    }
  }
  if (errs.length) console.log('ERRORES', vp.n, errs)
  await ctx.close()
}
await browser.close()
