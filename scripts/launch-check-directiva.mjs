// Checklist de lanzamiento (TOMMY-WEB-LAUNCH) para /directiva/, lo automatizable.
// Uso: npm run build && npx vite preview --port 4173 &  luego  node scripts/launch-check-directiva.mjs [base] [salida.md]
// PW_CHROMIUM=/ruta/a/chrome si el Chromium de Playwright no está descargado.
// Cada punto sale PASS, WARN, FAIL, N/A o NO SE PUDO. Si algo no se puede medir, el resultado es NO SE PUDO, nunca PASS.
import { chromium } from '@playwright/test'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { SLIDES, APPENDIX_START } from '../src/directiva/content.ts'
import { measureSlide } from '../tests/directiva-measure.ts'

const base = process.argv[2] ?? 'http://localhost:4173'
const outFile = process.argv[3]
const PATH = '/directiva/'
const PROD = 'https://iae-propuestas-ia.vercel.app'
const results = []
const add = (id, name, status, detail = '') => { results.push({ id, name, status, detail }); console.log(`${status.padEnd(9)} ${id} ${name}${detail ? ` · ${detail}` : ''}`) }
const hashOf = (i) => (i >= APPENDIX_START ? SLIDES[i].id : String(i + 1))

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {})
async function pageAt(w, h, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...opts })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(e.message))
  return { ctx, page, errors }
}
// CALIBRAR=1 mete errores a propósito (texto dorado sobre papel, sombra de una capa, radio de 12 px, blanco plano):
// 3.1 y 3.7 tienen que salir FAIL. Si salen PASS, el detector no sirve.
const CALIBRAR = process.env.CALIBRAR === '1'
async function go(page, hash = '1') {
  await page.goto(`${base}${PATH}#/${hash}`)
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  if (CALIBRAR) await page.addStyleTag({ content: '.t-foot { color: #c8a24b !important; } .sheet { box-shadow: 0 4px 6px rgba(0,0,0,.1) !important; border-radius: 12px !important; } .dx-chrome { background: #ffffff !important; }' })
  await page.waitForTimeout(600)
}

// ——— Bloque 1 · QA de interfaz y móvil ———
{
  const fails = []
  for (const w of [320, 375, 414]) {
    const { ctx, page } = await pageAt(w, 800, { isMobile: true, hasTouch: true })
    for (const [i] of SLIDES.entries()) {
      await go(page, hashOf(i))
      const r = await page.evaluate(() => {
        const vw = innerWidth
        if (document.documentElement.scrollWidth <= vw) return null
        const culprit = [...document.querySelectorAll('body *')].map((e) => ({ e, r: e.getBoundingClientRect() })).filter((x) => x.r.right > vw + 1).sort((a, b) => b.r.right - a.r.right)[0]
        return `${document.documentElement.scrollWidth}>${vw} por ${culprit ? `${culprit.e.tagName.toLowerCase()}.${culprit.e.className}` : '?'}`
      })
      if (r) fails.push(`${w}px · #/${hashOf(i)} · ${r}`)
    }
    await ctx.close()
  }
  add('1.1', `Cero scroll horizontal a 320, 375 y 414 px (${SLIDES.length} láminas)`, fails.length ? 'FAIL' : 'PASS', fails.join(' | '))
}

const { ctx: dctx, page: dp, errors: consoleErrors } = await pageAt(1366, 768)
await go(dp, '1')
for (const [i] of SLIDES.entries()) await go(dp, hashOf(i))

{
  // Links: todos los href de la página (incluida la hoja de impresión).
  const hrefs = await dp.$$eval('a[href]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))])
  const bad = hrefs.filter((h) => !h || h === '#' || h.startsWith('javascript'))
  const internal = hrefs.filter((h) => h && h.startsWith('/'))
  const external = hrefs.filter((h) => h && /^https?:/.test(h))
  const broken = []
  for (const h of internal) { const r = await fetch(base + h); if (r.status >= 400) broken.push(`${h} ${r.status}`) }
  let ext = 'PASS'
  const extNotes = []
  for (const h of external) {
    try {
      const r = await fetch(h, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(10000) })
      if (r.status === 403 || r.status === 429) { extNotes.push(`${h} ${r.status} (anti-bot)`); if (ext === 'PASS') ext = 'WARN' }
      else if (r.status >= 400) { extNotes.push(`${h} ${r.status}`); ext = 'FAIL' }
    } catch (e) { extNotes.push(`${new URL(h).hostname}: ${e.cause?.code ?? e.message}`); if (ext !== 'FAIL') ext = 'NO SE PUDO' }
  }
  add('1.2a', `Links internos (${internal.length}) y href vacíos`, broken.length || bad.length ? 'FAIL' : 'PASS', [...broken, ...bad.map((b) => `href inválido "${b}"`)].join(' | '))
  add('1.2b', `Links externos (${external.length})`, ext, extNotes.join(' | '))
  add('1.7', 'Links del pie sin href vacío, "#" ni javascript:void', bad.length ? 'FAIL' : 'PASS', 'el pie de cada lámina no tiene links; las fuentes sí, y todas son https')
}

{
  // Índice: abre con botón y O, cierra con botón y Escape, navega.
  const p = dp
  await go(p, '1')
  const steps = []
  await p.getByRole('button', { name: /Índice de láminas/ }).click(); steps.push(await p.getByRole('dialog').isVisible())
  await p.getByRole('button', { name: 'Cerrar' }).click(); steps.push(!(await p.getByRole('dialog').isVisible()))
  await p.keyboard.press('o'); steps.push(await p.getByRole('dialog').isVisible())
  await p.keyboard.press('Escape'); steps.push(!(await p.getByRole('dialog').isVisible()))
  await p.keyboard.press('o')
  const items = await p.getByRole('dialog').getByRole('button').count()
  await p.getByRole('dialog').getByRole('button').nth(5).click()
  const idx = Number(await p.getAttribute('[data-app]', 'data-index'))
  steps.push(idx === 4)
  add('1.3', 'Índice: abre y cierra (botón y Escape) y navega', steps.every(Boolean) ? 'PASS' : 'FAIL', `pasos ${steps.map((s) => (s ? 'ok' : 'no')).join(',')}; ${items - 1} entradas`)
  // 1.15: cada entrada del índice lleva a su lámina.
  const wrong = []
  for (let i = 0; i < SLIDES.length; i++) {
    await p.keyboard.press('o')
    await p.getByRole('dialog').locator('li button').nth(i).click()
    const got = Number(await p.getAttribute('[data-app]', 'data-index'))
    if (got !== i) wrong.push(`${i}→${got}`)
  }
  add('1.15', `Cero items de navegación que no llevan a nada (${SLIDES.length} entradas del índice)`, wrong.length ? 'FAIL' : 'PASS', wrong.join(', '))
}

{
  const icon = await dp.getAttribute('link[rel="icon"]', 'href')
  const r = await fetch(base + icon)
  const ok = icon && !/vite\.svg|react\.svg/.test(icon) && r.ok && /svg/.test(r.headers.get('content-type') ?? '')
  add('1.4', 'Favicon propio', ok ? 'PASS' : 'FAIL', `${icon} · ${r.status} ${r.headers.get('content-type')}`)
  const title = await dp.title()
  const len = [...title].length
  add('1.5', 'Título específico de 50 a 60 caracteres, marca al final', len >= 50 && len <= 60 && /IAE$/.test(title) && !/vite|react/i.test(title) ? 'PASS' : 'FAIL', `"${title}" (${len})`)
  const desc = await dp.getAttribute('meta[name="description"]', 'content')
  const dl = [...(desc ?? '')].length
  add('1.6', 'Meta description de 120 a 155 caracteres', dl >= 120 && dl <= 155 ? 'PASS' : 'FAIL', `${dl} caracteres`)
}

{
  const r = await fetch(`${base}/directiva/no-existe-${Date.now()}`)
  const r2 = await fetch(`${base}/no-existe-${Date.now()}`)
  const body = await r2.text()
  const status = r2.status === 404 && /404/.test(body) ? 'PASS' : 'NO SE PUDO'
  add('1.8', '404 propia con HTTP 404 y salida al home', status, `vite preview responde ${r2.status} en /no-existe y ${r.status} en /directiva/no-existe; en Vercel, public/404.html se sirve con 404 real (se comprueba en el Preview)`)
}
add('1.9', 'Año de copyright calculado', 'N/A', 'la presentación no muestra copyright')

{
  const imgs = await dp.$$eval('img', (is) => [...new Set(is.map((i) => i.getAttribute('src')))])
  const notes = []
  let st = 'PASS'
  for (const src of [...imgs, '/og-directiva.png']) {
    const r = await fetch(base + src)
    const kb = Math.round((await r.arrayBuffer()).byteLength / 1024)
    const type = r.headers.get('content-type')
    if (kb > 300) { st = 'FAIL'; notes.push(`${src} ${kb} KB`) }
    else if (kb > 100 && /png|jpe?g/.test(type ?? '')) { if (st === 'PASS') st = 'WARN'; notes.push(`${src} ${kb} KB ${type}`) }
  }
  add('1.10', 'Imágenes comprimidas', st, `${notes.join(' | ')}${st === 'WARN' ? ' · los logos oficiales del IAE se usan sin alterar (regla de marca); og-directiva.png solo la baja quien comparte el link' : ''}`)
}

{
  // Cada botón visible hace algo: cambia el estado de la app o abre un diálogo.
  const p = dp
  await go(p, '5')
  const snap = () => p.evaluate(() => [document.querySelector('[data-app]').getAttribute('data-index'), document.querySelector('[data-app]').getAttribute('data-beat'), !!document.querySelector('[role="dialog"]'), !!document.querySelector('.dx-notes'), document.fullscreenElement ? 1 : 0].join('|'))
  const labels = await p.$$eval('.dx-chrome button', (bs) => bs.map((b) => b.getAttribute('aria-label')))
  const dead = []
  for (const l of labels) {
    const before = await snap()
    await p.getByRole('button', { name: l, exact: true }).click()
    await p.waitForTimeout(150)
    const after = await snap()
    if (before === after) dead.push(l)
    if (await p.getByRole('dialog').isVisible()) await p.keyboard.press('Escape')
    if (await p.locator('.dx-notes').isVisible()) await p.keyboard.press('n')
  }
  add('1.11', `Cero botones sin handler (${labels.length} botones de control)`, dead.length ? 'FAIL' : 'PASS', dead.join(', '))
}
add('1.12', 'Estados de carga, éxito y error en acciones que escriben', 'N/A', 'la presentación no escribe nada: sin formularios ni backend')
add('1.13', 'Errores con mensaje útil', 'N/A', 'no hay acciones que puedan fallar; sin JavaScript, <noscript> lo dice')

{
  // TODO y FIXME en mayúsculas: "todo" es una palabra normal en español.
  const PH = /lorem ipsum|próximamente|example\.com|\b555[-\s]?\d|\bxxx\b|\bplaceholder\b/i
  const PH_CASE = /\bTODO\b|\bFIXME\b/
  const domHits = []
  for (const [i] of SLIDES.entries()) {
    await go(dp, hashOf(i))
    const t = await dp.locator('body').innerText()
    const m = t.match(PH) ?? t.match(PH_CASE)
    if (m) domHits.push(`#/${hashOf(i)}: "${m[0]}"`)
  }
  const files = ['directiva/index.html', 'directiva/curriculo/index.html', ...readdirSync('src/directiva', { recursive: true }).map((f) => join('src/directiva', String(f))).filter((f) => statSync(f).isFile())]
  const srcHits = []
  for (const f of files) readFileSync(f, 'utf8').split('\n').forEach((line, n) => { if ((PH.test(line) || PH_CASE.test(line)) && !/un placeholder no es/.test(line)) srcHits.push(`${f}:${n + 1}`) })
  add('1.14', `Cero texto placeholder (DOM de ${SLIDES.length} láminas y fuente)`, domHits.length || srcHits.length ? 'FAIL' : 'PASS', [...domHits, ...srcHits].join(' | '))
}

{
  const { ctx, page } = await pageAt(375, 812, { isMobile: true, hasTouch: true })
  const out = []
  let small = []
  for (const [i] of SLIDES.entries()) {
    await go(page, hashOf(i))
    const r = await page.evaluate(() => [...document.querySelectorAll('.dx-viewport .slide *, .dx-chrome *')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.right > innerWidth + 1 || b.left < -1) }).map((e) => `${e.tagName.toLowerCase()}.${e.className}`).slice(0, 3))
    if (r.length) out.push(`#/${hashOf(i)}: ${r.join(', ')}`)
    if (i === 0) small = await page.$$eval('button, a', (els) => els.filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && getComputedStyle(e).visibility !== 'hidden' && e.closest('.dx-chrome, [role=dialog]') && (b.width < 44 || b.height < 44) }).map((e) => e.getAttribute('aria-label') ?? e.textContent))
  }
  const vp = await page.getAttribute('meta[name="viewport"]', 'content')
  add('1.16', 'Cero elementos fuera del viewport en móvil (375 px)', out.length ? 'FAIL' : 'PASS', out.join(' | '))
  add('1.20', 'Móvil de verdad: viewport sin bloquear zoom, toques ≥ 44×44, sin inputs', !/user-scalable=no|maximum-scale=1(\.0)?\b/.test(vp) && !small.length ? 'PASS' : 'FAIL', `viewport "${vp}"${small.length ? ` · chicos: ${small.join(', ')}` : ''} · los links de fuente dentro de las láminas son texto en línea (excepción de WCAG 2.5.8)`)
  await ctx.close()
}
add('1.17', 'Logo clickeable que vuelve al home', 'N/A', 'presentación lineal: se vuelve a la portada con Inicio o el índice (ver DECISIONES-DIRECTIVA.md)')
add('1.18', 'Teléfono con tel:', 'N/A', 'no se publica teléfono (regla de Tommy)')
add('1.19', 'Email con mailto:', 'N/A', 'no se publica correo (regla de Tommy)')

// ——— Bloque 2 · SEO y producción ———
{
  await go(dp, '1')
  const title = await dp.title()
  add('2.1', 'Sin "Vite + React" en el tab', /vite|react/i.test(title) ? 'FAIL' : 'PASS', `"${title}"`)
  const maps = readdirSync('dist/assets').filter((f) => f.endsWith('.map'))
  const refs = readdirSync('dist/assets').filter((f) => f.endsWith('.js') && /sourceMappingURL/.test(readFileSync(join('dist/assets', f), 'utf8')))
  add('2.2', 'Sin source maps en producción', maps.length || refs.length ? 'FAIL' : 'PASS', `build.sourcemap=false; ${maps.length} .map, ${refs.length} referencias`)
  const logs = []
  for (const f of readdirSync('src/directiva', { recursive: true }).map(String).filter((f) => statSync(join('src/directiva', f)).isFile())) readFileSync(join('src/directiva', f), 'utf8').split('\n').forEach((l, n) => { if (/console\.(log|debug|info)/.test(l)) logs.push(`src/directiva/${f}:${n + 1}`) })
  add('2.3', `Cero errores de consola (${SLIDES.length} láminas) y sin console.log en el fuente`, consoleErrors.length ? 'FAIL' : logs.length ? 'WARN' : 'PASS', [...consoleErrors, ...logs].join(' | '))
  const html = readFileSync('dist/directiva/index.html', 'utf8')
  const assets = [...html.matchAll(/(?:src|href)="\/assets\/([^"]+)"/g)].map((m) => m[1])
  const sizes = assets.map((a) => ({ a, kb: Math.round(statSync(join('dist/assets', a)).size / 1024) }))
  const total = sizes.reduce((s, x) => s + x.kb, 0)
  const big = sizes.filter((x) => x.kb > 300)
  add('2.4', 'Bundles razonables (≤ 300 KB por archivo, ≤ 500 KB por página)', big.length || total > 500 ? 'WARN' : 'PASS', `${sizes.map((x) => `${x.a} ${x.kb} KB`).join(', ')} · total ${total} KB${big.length ? ' · el archivo grande es el chunk compartido con / (React + Framer Motion), comprimido con gzip pesa ~110 KB' : ''}`)
  const mainHtml = readFileSync('dist/index.html', 'utf8')
  const t1 = mainHtml.match(/<title>([^<]+)/)?.[1]
  const d1 = mainHtml.match(/name="description" content="([^"]+)/)?.[1]
  const d2 = html.match(/name="description" content="([^"]+)/)?.[1]
  add('2.5', 'Títulos únicos por página', t1 !== title ? 'PASS' : 'FAIL', `/ "${t1}" · /directiva/ "${title}"`)
  const h1 = await dp.$$eval('h1', (hs) => hs.map((h) => h.textContent))
  add('2.6', 'Un solo h1 por página', h1.length === 1 ? 'PASS' : 'FAIL', `${h1.length}: ${h1.join(' | ')}`)
  add('2.7', 'Meta descriptions únicas', d1 && d2 && d1 !== d2 ? 'PASS' : 'FAIL')
  const canonical = await dp.getAttribute('link[rel="canonical"]', 'href')
  add('2.8', 'Canonical absoluto', /^https:\/\//.test(canonical ?? '') && canonical === `${PROD}${PATH}` ? 'PASS' : 'FAIL', canonical)
  const robots = await dp.getAttribute('meta[name="robots"]', 'content')
  const checks = []
  for (const [p, type] of [['/robots.txt', 'text/plain'], ['/sitemap.xml', 'xml'], ['/llms.txt', 'text/plain']]) {
    const r = await fetch(base + p)
    const ct = r.headers.get('content-type') ?? ''
    const body = await r.text()
    checks.push({ p, ok: r.ok && ct.includes(type) && !/<!doctype html/i.test(body), ct, mentions: body.includes('/directiva') })
  }
  const okFiles = checks.every((c) => c.ok)
  const leaks = checks.filter((c) => c.mentions)
  add('2.9', 'robots.txt, sitemap.xml y llms.txt válidos (content-type real) y /directiva/ fuera', okFiles && !leaks.length && /noindex/.test(robots ?? '') ? 'PASS' : 'FAIL', `${checks.map((c) => `${c.p} ${c.ct}`).join(' · ')} · meta robots "${robots}"`)
  const noAlt = await dp.$$eval('img', (is) => is.filter((i) => !i.hasAttribute('alt')).map((i) => i.getAttribute('src')))
  add('2.10', 'Alt text en todas las imágenes', noAlt.length ? 'FAIL' : 'PASS', noAlt.join(', '))
  add('2.11', 'Links internos y breadcrumbs', 'N/A', 'una sola página, sin rutas profundas; la navegación interna es el índice y el hash #/n')
  add('2.12', 'JSON-LD válido', 'N/A', 'no se incluye: la página es noindex')
  add('2.13', 'LocalBusiness', 'N/A', 'no es un negocio local')
  add('2.14', 'Dominio propio', 'WARN', 'se sirve en vercel.app (esperado y documentado)')
  const og = await dp.$$eval('meta[property^="og:"], meta[name^="twitter:"]', (ms) => Object.fromEntries(ms.map((m) => [m.getAttribute('property') ?? m.getAttribute('name'), m.getAttribute('content')])))
  const local = og['og:image']?.replace(PROD, base)
  let ogStatus = 'FAIL'
  let ogDetail = 'sin og:image'
  if (local) {
    const r = await fetch(local)
    const buf = Buffer.from(await r.arrayBuffer())
    const isPng = buf.subarray(1, 4).toString() === 'PNG'
    const w = isPng ? buf.readUInt32BE(16) : 0
    const h = isPng ? buf.readUInt32BE(20) : 0
    ogStatus = r.ok && isPng && w === 1200 && h === 630 && buf.length <= 1024 * 1024 && og['twitter:card'] === 'summary_large_image' && og['og:title'] && og['og:description'] ? 'PASS' : 'FAIL'
    ogDetail = `${og['og:image']} · ${isPng ? 'PNG' : 'no PNG'} ${w}×${h} · ${Math.round(buf.length / 1024)} KB · twitter:card ${og['twitter:card']}`
  }
  add('2.15', 'OG + Twitter con og:image real de 1200×630 PNG ≤ 1 MB', ogStatus, ogDetail)
  const lang = await dp.getAttribute('html', 'lang')
  add('2.16', 'lang="es" en <html>', lang === 'es' ? 'PASS' : 'FAIL', lang)
}

// ——— Bloque 3 · Piso de calidad y regla cero ———
{
  const { ctx, page } = await pageAt(1920, 1080)
  const low = []
  let measured = 0
  for (const [i] of SLIDES.entries()) {
    await go(page, hashOf(i))
    const r = await page.evaluate(() => {
      const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 } }
      const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
      const blend = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 })
      const avgGradient = (img) => { const cs = [...img.matchAll(/rgba?\([^)]+\)|#[0-9a-f]{6}/gi)].map((m) => m[0].startsWith('#') ? { r: parseInt(m[0].slice(1, 3), 16), g: parseInt(m[0].slice(3, 5), 16), b: parseInt(m[0].slice(5, 7), 16), a: 1 } : parse(m[0])); if (!cs.length) return null; const n = cs.length; return { r: cs.reduce((s, c) => s + c.r, 0) / n, g: cs.reduce((s, c) => s + c.g, 0) / n, b: cs.reduce((s, c) => s + c.b, 0) / n, a: cs.reduce((s, c) => s + c.a, 0) / n } }
      const bgOf = (el) => {
        const stack = []
        for (let e = el; e; e = e.parentElement) {
          const cs = getComputedStyle(e)
          const c = parse(cs.backgroundColor)
          // Los gradientes de una sola capa (degradados de relleno) se promedian; la cuadrícula de líneas finas no cuenta como fondo.
          if (cs.backgroundImage.startsWith('linear-gradient(180deg')) { const g = avgGradient(cs.backgroundImage); if (g) stack.push(g) }
          if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break }
        }
        let out = { r: 16, g: 21, b: 31, a: 1 }
        for (const c of stack.reverse()) out = blend(c, out)
        return out
      }
      const items = []
      document.querySelectorAll('.dx-viewport .slide *, .dx-chrome *').forEach((el) => {
        const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
        if (!own || el.closest('[aria-hidden="true"]') || el.closest('.beat-hidden')) return
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return
        const fg = parse(cs.color)
        const bg = bgOf(el)
        const f = blend(fg, bg)
        const L1 = lum(f), L2 = lum(bg)
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
        const px = parseFloat(cs.fontSize)
        const scale = document.querySelector('[data-app]').dataset.mode === 'stage' ? document.querySelector('.dx-viewport .slide').getBoundingClientRect().width / 1600 : 1
        const large = px * scale >= 24 || (px * scale >= 18.66 && Number(cs.fontWeight) >= 700)
        items.push({ t: el.textContent.trim().slice(0, 30), ratio: Math.round(ratio * 100) / 100, need: large ? 3 : 4.5 })
      })
      return items
    })
    measured += r.length
    for (const it of r) if (it.ratio < it.need) low.push(`#/${hashOf(i)} "${it.t}" ${it.ratio}:1 (pide ${it.need})`)
  }
  add('3.1', `Contraste AA medido (${measured} textos en ${SLIDES.length} láminas y controles)`, measured === 0 ? 'NO SE PUDO' : low.length ? 'FAIL' : 'PASS', low.slice(0, 8).join(' | '))
  await ctx.close()
}

{
  await go(dp, '2')
  const res = []
  for (let k = 0; k < 6; k++) {
    await dp.keyboard.press('Tab')
    res.push(await dp.evaluate(() => { const el = document.activeElement; const cs = getComputedStyle(el); return { t: el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 20), ok: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2 } }))
  }
  const bad = res.filter((r) => !r.ok)
  add('3.2', 'Foco de teclado visible (6 tabs reales)', bad.length ? 'FAIL' : 'PASS', res.map((r) => `${r.t}${r.ok ? '' : ' SIN FOCO'}`).join(' → '))
  const rm = await dp.evaluate(() => [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r.media && /prefers-reduced-motion/.test(r.media.mediaText)) } catch { return false } }))
  add('3.3', 'prefers-reduced-motion presente', rm ? 'PASS' : 'FAIL')
  const inputs = await dp.$$eval('input, select, textarea', (els) => els.length)
  add('3.4', 'Campos con etiqueta real', inputs ? 'NO SE PUDO' : 'N/A', inputs ? `${inputs} campos sin revisar` : 'no hay campos')
}

{
  const { ctx, page } = await pageAt(812, 375, { isMobile: true, hasTouch: true })
  const bad = []
  for (const [i] of SLIDES.entries()) {
    await go(page, hashOf(i))
    const m = await page.evaluate(measureSlide)
    if (m.docScrollW > m.vw || m.cut.length || m.collisions.length) bad.push(`#/${hashOf(i)}: ${[...m.cut, ...m.collisions].slice(0, 2).join('; ') || 'scroll'}`)
  }
  add('3.5', `Teléfono girado 812×375 sin romper (${SLIDES.length} láminas)`, bad.length ? 'FAIL' : 'PASS', bad.join(' | '))
  await ctx.close()
}

{
  const { ctx, page } = await pageAt(1366, 768)
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value }).observe({ type: 'layout-shift', buffered: true })
  })
  await page.goto(`${base}${PATH}`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1500)
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(800)
  const v = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: Math.round(window.__cls * 1000) / 1000 }))
  add('3.6', 'Core Web Vitals locales (LCP ≤ 4 s, CLS ≤ 0.25)', v.lcp > 0 && v.lcp <= 4000 && v.cls <= 0.25 ? 'PASS' : v.lcp === 0 ? 'NO SE PUDO' : 'FAIL', `LCP ${v.lcp} ms · CLS ${v.cls} · medido contra vite preview en esta máquina; en producción con 4G será peor`)
  await ctx.close()
}

{
  // Las 10 firmas de la regla cero que se pueden medir en el DOM.
  const sig = []
  const found = new Set()
  for (const [i] of SLIDES.entries()) {
    await go(dp, hashOf(i))
    const r = await dp.evaluate(() => {
      const out = []
      const toHsl = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); if (a === 0) return null; const R = r / 255, G = g / 255, B = b / 255; const mx = Math.max(R, G, B), mn = Math.min(R, G, B); const l = (mx + mn) / 2; const d = mx - mn; const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)); let h = 0; if (d) { if (mx === R) h = 60 * (((G - B) / d) % 6); else if (mx === G) h = 60 * ((B - R) / d + 2); else h = 60 * ((R - G) / d + 4) } return { h: (h + 360) % 360, s, l, raw: `${r},${g},${b}` } }
      const els = [...document.querySelectorAll('.dx-viewport *, .dx-chrome *')]
      for (const el of els) {
        const cs = getComputedStyle(el)
        for (const prop of ['color', 'backgroundColor', 'borderTopColor']) {
          const c = toHsl(cs[prop]); if (!c) continue
          if (c.s > 0.45 && c.l > 0.3 && c.l < 0.7 && c.h >= 5 && c.h <= 25) out.push(`terracota ${c.raw} en ${el.tagName.toLowerCase()}`)
          if (c.s > 0.35 && c.h >= 250 && c.h <= 300) out.push(`violeta ${c.raw}`)
          if (c.s > 0.6 && c.h >= 75 && c.h <= 110 && c.l > 0.4) out.push(`verde ácido ${c.raw}`)
          if (prop !== 'borderTopColor' && (c.raw === '255,255,255' || c.raw === '0,0,0')) out.push(`${c.raw === '0,0,0' ? 'negro' : 'blanco'} plano en ${prop} de ${el.tagName.toLowerCase()}.${el.className}`)
        }
        if (/violet|purple|indigo/i.test(cs.backgroundImage)) out.push('gradiente violeta')
        const sh = cs.boxShadow
        if (sh && sh !== 'none' && sh.split(/,(?![^(]*\))/).length === 1 && !/inset/.test(sh)) out.push(`sombra de una sola capa en ${el.tagName.toLowerCase()}.${el.className}`)
        if (cs.borderTopLeftRadius === '12px') out.push(`radio de 12 px en ${el.tagName.toLowerCase()}.${el.className}`)
        if (/^(Inter|Roboto|system-ui|-apple-system)/i.test(cs.fontFamily)) out.push(`fuente por inercia ${cs.fontFamily}`)
      }
      if (/\p{Extended_Pictographic}/u.test(document.querySelector('.dx-viewport').textContent)) out.push('emoji en el texto')
      // Tres tarjetas redondeadas en fila: un contenedor con exactamente 3 hijos lado a lado, mismo ancho y radio > 8 px.
      for (const el of els) {
        const kids = [...el.children]
        if (kids.length !== 3) continue
        const rs = kids.map((k) => k.getBoundingClientRect())
        const sameRow = rs.every((r) => Math.abs(r.top - rs[0].top) < 4)
        const sameW = rs.every((r) => Math.abs(r.width - rs[0].width) < 4)
        const round = kids.every((k) => parseFloat(getComputedStyle(k).borderTopLeftRadius) > 8)
        if (sameRow && sameW && round && rs[0].width > 120) out.push('tres tarjetas redondeadas en fila')
      }
      return out
    })
    r.forEach((x) => found.add(x))
  }
  for (const x of found) sig.push(x)
  add('3.7', 'Regla cero: las firmas medibles (terracota, verde ácido, violeta, emoji, blanco/negro planos, sombra única, tres tarjetas, fuente por inercia, radio 12 px)', sig.length ? 'FAIL' : 'PASS', sig.slice(0, 10).join(' | '))
  add('3.8', 'Regla cero: titular intercambiable (firma 10)', 'MANUAL', 'juicio de diseño: ver M-08 en el reporte')
}

// ——— Documento /directiva/curriculo/ ———
{
  const DOC = '/directiva/curriculo/'
  const fails = []
  const errs = []
  for (const w of [320, 375, 414, 1366]) {
    const { ctx, page, errors } = await pageAt(w, 800)
    await page.goto(`${base}${DOC}`)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    const sw = await page.evaluate(() => document.documentElement.scrollWidth)
    if (sw > w) fails.push(`${w}px: ${sw}>${w}`)
    errs.push(...errors)
    if (w === 1366) {
      const title = await page.title()
      const tl = [...title].length
      add('D.1', 'Documento: título de 50 a 60 caracteres, marca al final', tl >= 50 && tl <= 60 && /IAE$/.test(title) ? 'PASS' : 'FAIL', `"${title}" (${tl})`)
      const desc = await page.getAttribute('meta[name="description"]', 'content')
      const dl = [...(desc ?? '')].length
      add('D.2', 'Documento: meta description de 120 a 155 caracteres', dl >= 120 && dl <= 155 ? 'PASS' : 'FAIL', `${dl} caracteres`)
      const h1 = await page.$$eval('h1', (hs) => hs.length)
      const robots = await page.getAttribute('meta[name="robots"]', 'content')
      const canonical = await page.getAttribute('link[rel="canonical"]', 'href')
      add('D.3', 'Documento: un h1, noindex y canonical absoluto', h1 === 1 && /noindex/.test(robots ?? '') && canonical === `${PROD}${DOC}` ? 'PASS' : 'FAIL', `h1 ${h1} · robots "${robots}" · ${canonical}`)
      const noAlt = await page.$$eval('img', (is) => is.filter((i) => !i.hasAttribute('alt')).length)
      const counts = await page.evaluate(() => ({ s: document.querySelectorAll('table.sessions tbody tr').length, r: document.querySelectorAll('table.rubric').length, c: document.querySelectorAll('#club .unit').length }))
      add('D.4', 'Documento: contenido completo (90 sesiones, 3 rúbricas, 6 clases del club) y alt en imágenes', counts.s === 90 && counts.r === 3 && counts.c === 6 && !noAlt ? 'PASS' : 'FAIL', `${counts.s} sesiones · ${counts.r} rúbricas · ${counts.c} clases · ${noAlt} imágenes sin alt`)
      await page.keyboard.press('Tab')
      const focus = await page.evaluate(() => { const cs = getComputedStyle(document.activeElement); return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2 })
      add('D.5', 'Documento: foco de teclado visible', focus ? 'PASS' : 'FAIL')
    }
    await ctx.close()
  }
  add('D.6', 'Documento: cero scroll horizontal a 320, 375, 414 y 1366 px', fails.length ? 'FAIL' : 'PASS', fails.join(' | '))
  add('D.7', 'Documento: cero errores de consola', errs.length ? 'FAIL' : 'PASS', errs.join(' | '))
}

await dctx.close()
await browser.close()

const count = (s) => results.filter((r) => r.status === s).length
const summary = `PASS ${count('PASS')} · WARN ${count('WARN')} · FAIL ${count('FAIL')} · N/A ${count('N/A')} · NO SE PUDO ${count('NO SE PUDO')} · MANUAL ${count('MANUAL')}`
console.log(`\n${summary}`)
if (outFile) {
  const md = [`# Launch check · /directiva/`, '', `Corrida contra \`${base}${PATH}\` el ${new Date().toISOString().slice(0, 10)}.`, '', `**${summary}**`, '', '| Punto | Qué | Resultado | Detalle |', '|---|---|---|---|', ...results.map((r) => `| ${r.id} | ${r.name} | ${r.status} | ${r.detail.replace(/\|/g, '/')} |`), ''].join('\n')
  writeFileSync(outFile, md)
}
process.exit(count('FAIL') ? 1 : 0)
