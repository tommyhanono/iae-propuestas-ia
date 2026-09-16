import { expect, type Page } from '@playwright/test'

export const KEYS = ['lobby', ...Array.from({ length: 8 }, (_, i) => `bc-${i + 1}`), ...Array.from({ length: 5 }, (_, i) => `cu-${i + 1}`)]
export const SIZE = (key: string) => (key === 'lobby' || key === 'bc-5' ? { w: 1520, h: 900 } : { w: 1280, h: 760 })

export const VIEWPORTS = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1280x720', width: 1280, height: 720 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '414x896', width: 414, height: 896 },
  { name: '375x812', width: 375, height: 812 },
  { name: '320x640', width: 320, height: 640 },
  { name: '812x375', width: 812, height: 375 },
]

export const REVEAL_MS = 1900

export function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`) })
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('requestfailed', (r) => { if (!r.url().includes('fonts.g')) errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`) })
  page.on('response', (r) => { if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`) })
  return errors
}

export const keyOf = (page: Page) => page.getAttribute('[data-app]', 'data-key')

export async function waitSettled(page: Page, key?: string) {
  if (key !== undefined) {
    await page.waitForFunction((k) => document.querySelector('[data-app]')?.getAttribute('data-key') === k, key)
  }
  await page.waitForTimeout(220)
  await page.waitForFunction(() => document.querySelector('[data-app]')?.getAttribute('data-camera-settled') === 'true', null, { timeout: 20_000 })
}

export async function open(page: Page, key = 'lobby') {
  await page.goto(`/#${key}`)
  await waitSettled(page, key)
  await page.waitForTimeout(REVEAL_MS)
}

export async function measure(page: Page, key: string) {
  return page.evaluate((k) => {
    const app = document.querySelector('[data-app]') as HTMLElement
    const card = document.querySelector(`[data-node="${k}"]`) as HTMLElement | null
    const r = card?.getBoundingClientRect()
    const inner = card?.querySelector('.node-inner') as HTMLElement | null
    const others = [...document.querySelectorAll<HTMLElement>('[data-node]')]
      .filter((el) => el !== card)
      .map((el) => { const b = el.getBoundingClientRect(); return { key: el.dataset.node!, left: b.left, top: b.top, right: b.right, bottom: b.bottom } })
    const textOverflow: string[] = []
    card?.querySelectorAll<HTMLElement>('p, h1, h2, span.label, .panel, button, li').forEach((el) => {
      if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).textOverflow !== 'ellipsis') textOverflow.push(`${el.tagName}.${el.className}: "${el.textContent?.slice(0, 40)}" ${el.scrollWidth}>${el.clientWidth}`)
    })
    // Todo hijo visible del contenido tiene que caber dentro del nodo.
    const clipped: string[] = []
    if (inner && r) {
      inner.querySelectorAll<HTMLElement>('p, h1, h2, button, .panel').forEach((el) => {
        const b = el.getBoundingClientRect()
        if (b.width === 0 || getComputedStyle(el).visibility === 'hidden') return
        const tol = 2 * (r.width / (card!.offsetWidth || 1)) + 1
        if (b.bottom > r.bottom + tol || b.right > r.right + tol || b.left < r.left - tol || b.top < r.top - tol) clipped.push(`${el.tagName}: "${el.textContent?.slice(0, 30)}" [${Math.round(b.top)},${Math.round(b.bottom)}] vs card [${Math.round(r.top)},${Math.round(r.bottom)}]`)
      })
    }
    const world = document.querySelector('[data-world-layer]') as HTMLElement | null
    const nav = document.querySelector('nav') as HTMLElement
    const notes = document.querySelector('aside[aria-label="Notas del orador"]') as HTMLElement | null
    return {
      mode: app.dataset.mode!,
      vw: window.innerWidth, vh: window.innerHeight,
      area: (app.dataset.area || '').split(',').map(Number),
      card: r ? { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height } : null,
      others,
      transform: world?.style.transform ?? '',
      filter: world ? getComputedStyle(world).filter : 'none',
      docScrollW: document.documentElement.scrollWidth,
      textOverflow,
      clipped,
      controlsTop: Math.min(...[...nav.querySelectorAll('button, div.glass-ui')].map((b) => b.getBoundingClientRect()).filter((b) => b.width > 0 && b.height > 0).map((b) => b.top)),
      notesTop: notes ? notes.getBoundingClientRect().top : null,
    }
  }, key)
}

/** Centrado, visibilidad, sin apilado, sin recorte y sin overflow para el nodo activo. */
export async function assertNode(page: Page, key: string, label: string) {
  const m = await measure(page, key)
  const ctx = `[${label} · ${key}]`
  expect(m.card, `${ctx} nodo existe`).not.toBeNull()
  const c = m.card!
  expect(m.docScrollW, `${ctx} sin scroll horizontal`).toBeLessThanOrEqual(m.vw)
  expect(m.textOverflow, `${ctx} texto desbordado`).toEqual([])
  expect(m.clipped, `${ctx} contenido recortado`).toEqual([])

  if (m.mode === 'desktop') {
    const [al, at, aw, ah] = m.area
    expect(Math.abs((c.left + c.right) / 2 - (al + aw / 2)), `${ctx} centrado X`).toBeLessThanOrEqual(4)
    expect(Math.abs((c.top + c.bottom) / 2 - (at + ah / 2)), `${ctx} centrado Y`).toBeLessThanOrEqual(4)
    expect(c.left, `${ctx} dentro (izq)`).toBeGreaterThanOrEqual(-0.5)
    expect(c.top, `${ctx} dentro (arriba)`).toBeGreaterThanOrEqual(-0.5)
    expect(c.right, `${ctx} dentro (der)`).toBeLessThanOrEqual(m.vw + 0.5)
    expect(c.bottom, `${ctx} no tapado por controles`).toBeLessThanOrEqual(m.controlsTop + 0.5)
    if (m.notesTop !== null) expect(c.bottom, `${ctx} no tapado por notas`).toBeLessThanOrEqual(m.notesTop + 0.5)
    for (const o of m.others) {
      const ix = Math.min(c.right, o.right) - Math.max(c.left, o.left)
      const iy = Math.min(c.bottom, o.bottom) - Math.max(c.top, o.top)
      expect(ix > 0 && iy > 0, `${ctx} ${o.key} encima del activo`).toBe(false)
    }
    expect(m.transform, `${ctx} rotación final 0`).toContain('rotate(0deg)')
    const scale = Number(/scale\(([\d.]+)\)/.exec(m.transform)?.[1])
    const { w, h } = SIZE(key)
    expect(Math.abs(scale - Math.min(aw / w, ah / h)), `${ctx} escala = fit`).toBeLessThan(0.003)
    expect(m.filter, `${ctx} sin blur residual`).toBe('none')
    const veil = await page.evaluate(() => {
      const v = [...document.querySelectorAll<HTMLElement>('div.fixed.inset-0.z-10')].pop()
      return v ? Number(getComputedStyle(v).opacity) : 0
    })
    expect(veil, `${ctx} sin velo residual`).toBeLessThan(0.02)
  } else {
    expect(Math.abs((c.left + c.right) / 2 - m.vw / 2), `${ctx} centrado horizontal`).toBeLessThanOrEqual(4)
    expect(c.left, `${ctx} gutter izq ≥16`).toBeGreaterThanOrEqual(15.5)
    expect(c.right, `${ctx} gutter der ≥16`).toBeLessThanOrEqual(m.vw - 15.5)
  }
}
