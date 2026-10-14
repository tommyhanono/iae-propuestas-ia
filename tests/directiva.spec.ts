import { expect, test, type Page } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { APPENDIX_START, MAIN_COUNT, SLIDES, beatsOf } from '../src/directiva/content'
import { measureSlide } from './directiva-measure'
import { watchErrors } from './helpers'

mkdirSync('tests/screenshots/directiva-tests', { recursive: true })

const VIEWPORTS = [
  { name: '320x640', width: 320, height: 640 },
  { name: '375x812', width: 375, height: 812 },
  { name: '414x896', width: 414, height: 896 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '812x375', width: 812, height: 375 },
]

const hashOf = (i: number) => (i >= APPENDIX_START ? SLIDES[i].id : String(i + 1))
const index = (page: Page) => page.getAttribute('[data-app]', 'data-index').then(Number)
const beat = (page: Page) => page.getAttribute('[data-app]', 'data-beat').then(Number)

async function open(page: Page, hash: string) {
  await page.goto(`/directiva/#/${hash}`)
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(650)
}

for (const vp of VIEWPORTS) {
  test.describe(`directiva @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })
    test('las 21 láminas: sin scroll lateral, sin choques, sin texto cortado ni errores', async ({ page }) => {
      const errors = watchErrors(page)
      for (const [i] of SLIDES.entries()) {
        await open(page, hashOf(i))
        expect(await index(page), `hash ${hashOf(i)}`).toBe(i)
        const m = await page.evaluate(measureSlide)
        const where = `${vp.name} · ${hashOf(i)} (${SLIDES[i].id})`
        expect(m.docScrollW, `${where}: scroll horizontal`).toBeLessThanOrEqual(m.vw)
        expect(m.collisions, `${where}: choques`).toEqual([])
        expect(m.cut, `${where}: texto cortado`).toEqual([])
        expect(m.minFont, `${where}: letra mínima (${m.minFontText})`).toBeGreaterThanOrEqual(m.mode === 'stage' ? 11 : 12)
        // En modo flujo, el contenido tiene que poder leerse entero con scroll dentro de la lámina.
        if (m.mode === 'flow') {
          const fits = await page.evaluate(() => {
            const s = document.querySelector('.dx-viewport .slide') as HTMLElement
            s.scrollTop = s.scrollHeight
            const last = s.querySelector('.titleblock, .slide-body > :last-child') as HTMLElement
            const r = last.getBoundingClientRect()
            const v = document.querySelector('.dx-viewport')!.getBoundingClientRect()
            return r.bottom <= v.bottom + 1
          })
          expect(fits, `${where}: el final de la lámina no se alcanza con scroll`).toBe(true)
        }
        if (['1', '3', '9', '10', '14'].includes(hashOf(i))) await page.screenshot({ path: `tests/screenshots/directiva-tests/${vp.name}-${hashOf(i)}.png` })
      }
      expect(errors).toEqual([])
    })
  })
}

test.describe('directiva · interacción 1366x768', () => {
  test.use({ viewport: { width: 1366, height: 768 } })

  test('→ recorre beats y láminas hasta la 14 y se detiene; ← vuelve', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, '1')
    let steps = 0
    for (let i = 0; i < MAIN_COUNT; i++) steps += beatsOf(SLIDES[i])
    for (let k = 1; k < steps; k++) await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(400)
    expect(await index(page)).toBe(MAIN_COUNT - 1)
    await expect(page).toHaveURL(/#\/14$/)
    await page.keyboard.press('ArrowRight')
    expect(await index(page), 'no salta al apéndice con →').toBe(MAIN_COUNT - 1)
    await page.keyboard.press('Home')
    expect(await index(page)).toBe(0)
    await page.keyboard.press('End')
    expect(await index(page)).toBe(MAIN_COUNT - 1)
    await page.keyboard.press('ArrowLeft')
    expect(await index(page)).toBe(MAIN_COUNT - 2)
    expect(errors).toEqual([])
  })

  test('beats: la lámina 3 revela piso, techo y vínculo en ese orden', async ({ page }) => {
    await open(page, '2')
    await page.keyboard.press('ArrowRight')
    expect(await index(page)).toBe(2)
    expect(await beat(page)).toBe(0)
    const visible = () => page.locator('.dx-viewport [data-beat="on"]').count()
    const v0 = await visible()
    await page.keyboard.press('ArrowRight')
    expect(await beat(page)).toBe(1)
    expect(await visible()).toBe(v0 + 1)
    await page.keyboard.press('ArrowRight')
    expect(await beat(page)).toBe(2)
    await page.keyboard.press('ArrowRight')
    expect(await index(page)).toBe(3)
    // ← vuelve a la lámina anterior completa.
    await page.keyboard.press('ArrowLeft')
    expect(await index(page)).toBe(2)
    expect(await beat(page)).toBe(2)
    // Lo que no se reveló no lo lee un lector de pantalla.
    await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowLeft')
    await expect(page.locator('.dx-viewport [data-beat="off"]').first()).toHaveAttribute('aria-hidden', 'true')
  })

  test('hash profundo: #/7 abre la 7, #/A3 abre el apéndice, un hash inválido abre la portada', async ({ page }) => {
    await open(page, '7')
    expect(await index(page)).toBe(6)
    await expect(page.locator('.dx-viewport h2').first()).toHaveText(SLIDES[6].title)
    await open(page, 'A3')
    expect(await index(page)).toBe(APPENDIX_START + 2)
    await page.goto('/directiva/#/99')
    await page.waitForTimeout(300)
    expect(await index(page)).toBe(0)
    await page.goto('/directiva/#cualquier-cosa')
    await page.waitForTimeout(300)
    expect(await index(page)).toBe(0)
    // Cambiar el hash a mano navega.
    await page.evaluate(() => { location.hash = '#/12' })
    await page.waitForTimeout(300)
    expect(await index(page)).toBe(11)
  })

  test('índice (O): abre, navega con teclado, Esc cierra; el foco queda dentro del diálogo', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, '1')
    await page.keyboard.press('o')
    const dialog = page.getByRole('dialog', { name: 'Índice' })
    await expect(dialog).toBeVisible()
    await expect(page.getByRole('button', { name: 'Cerrar' })).toBeFocused()
    // Las flechas no mueven la presentación con el diálogo abierto.
    await page.keyboard.press('ArrowRight')
    expect(await index(page)).toBe(0)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await page.getByRole('button', { name: /Índice de láminas/ }).click()
    await dialog.getByRole('button', { name: new RegExp(SLIDES[9].title.slice(0, 20)) }).click()
    await expect(dialog).toBeHidden()
    expect(await index(page)).toBe(9)
    await expect(page).toHaveURL(/#\/10$/)
    expect(errors).toEqual([])
  })

  test('notas (N), temporizador (T), ayuda (?), apéndice (A) y pantalla completa (F) sin errores', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, '5')
    await page.keyboard.press('n')
    const notes = page.getByRole('complementary', { name: 'Notas del orador' })
    await expect(notes).toContainText(SLIDES[4].notes.slice(0, 40))
    await expect(notes).toContainText('meta 1:15')
    await page.keyboard.press('n')
    await expect(notes).toBeHidden()
    await page.keyboard.press('t')
    await expect(page.getByRole('timer')).toContainText('/ 15:00')
    await page.waitForTimeout(1200)
    await expect(page.getByRole('timer')).toContainText(/0:0[1-3]/)
    await page.keyboard.press('?')
    await expect(page.getByRole('dialog', { name: 'Cómo se navega' })).toBeVisible()
    await page.keyboard.press('Escape')
    await page.keyboard.press('a')
    expect(await index(page)).toBe(APPENDIX_START)
    await page.keyboard.press('a')
    expect(await index(page)).toBe(4)
    await page.keyboard.press('f')
    await page.waitForTimeout(300)
    expect(errors).toEqual([])
  })

  test('foco de teclado visible en los controles', async ({ page }) => {
    await open(page, '2')
    await page.keyboard.press('Tab')
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      const cs = getComputedStyle(el)
      return { tag: el.tagName, style: cs.outlineStyle, width: parseFloat(cs.outlineWidth) }
    })
    expect(['A', 'BUTTON']).toContain(outline.tag)
    expect(outline.style).not.toBe('none')
    expect(outline.width).toBeGreaterThanOrEqual(2)
  })

  test('lectores de pantalla: un solo h1, anuncio del cambio de lámina, landmarks y lang', async ({ page }) => {
    await open(page, '1')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.getByRole('main')).toHaveCount(1)
    await expect(page.getByRole('navigation', { name: 'Controles de la presentación' })).toHaveCount(1)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('[aria-live="polite"]')).toHaveText(`Lámina 2 de 14: ${SLIDES[1].title}`)
  })

  test('tarjeta SAT: en reserva, esqueleto borroso sin texto real y oculto a lectores', async ({ page }) => {
    await open(page, '9')
    const card = page.locator('.dx-viewport [data-locked="sat"]')
    await expect(card).toBeVisible()
    const sk = card.locator('.skeleton')
    await expect(sk).toHaveAttribute('aria-hidden', 'true')
    expect((await sk.textContent())?.trim()).toBe('')
    expect(await sk.evaluate((el) => getComputedStyle(el).filter)).toContain('blur')
  })

  test('el cierre pide decisiones y no dice "Gracias"; nada de dinero en pantalla', async ({ page }) => {
    await open(page, '14')
    const text = (await page.locator('.dx-viewport .slide').innerText()).toLowerCase()
    expect(text).toContain('primer paso')
    expect(text).not.toContain('gracias')
    for (const [i] of SLIDES.entries()) {
      await open(page, hashOf(i))
      expect(await page.locator('.dx-viewport .slide').innerText(), hashOf(i)).not.toMatch(/\$|US\$|B\/\./)
    }
  })

  test('impresión: una lámina por página, con todos los beats y sin controles', async ({ page }) => {
    await open(page, '3')
    await page.emulateMedia({ media: 'print' })
    await expect(page.locator('.dx-print .print-page')).toHaveCount(SLIDES.length)
    await expect(page.locator('.dx-chrome')).toBeHidden()
    await expect(page.locator('.dx-print .print-page').first()).toBeVisible()
    expect(await page.locator('.dx-print .beat-hidden').evaluateAll((els) => els.filter((e) => getComputedStyle(e).visibility === 'hidden').length)).toBe(0)
    const pdf = await page.pdf({ width: '1600px', height: '900px', printBackground: true, preferCSSPageSize: true })
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
    expect(pages).toBe(SLIDES.length)
  })
})

test.describe('directiva · reduced motion', () => {
  test.use({ viewport: { width: 1366, height: 768 }, colorScheme: 'light' })
  test('con prefers-reduced-motion los beats aparecen sin animación', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await open(page, '4')
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(60)
    const op = await page.locator('.dx-viewport [data-beat="on"]').first().evaluate((el) => getComputedStyle(el).opacity)
    expect(Number(op)).toBe(1)
  })
})

test.describe('directiva · móvil 375x812', () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })
  test('deslizar avanza y retrocede; los controles miden al menos 44 px', async ({ page }) => {
    await open(page, '1')
    const swipe = async (dx: number) => {
      await page.evaluate((d) => {
        const el = document.querySelector('.dx-viewport')!
        const t = (x: number) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 400 })
        el.dispatchEvent(new TouchEvent('touchstart', { touches: [t(200)], changedTouches: [t(200)], bubbles: true }))
        el.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [t(200 + d)], bubbles: true }))
      }, dx)
      await page.waitForTimeout(350)
    }
    await swipe(-120)
    expect(await index(page)).toBe(1)
    await swipe(120)
    expect(await index(page)).toBe(0)
    const small = await page.$$eval('button', (bs) => bs.filter((b) => { const r = b.getBoundingClientRect(); return r.width > 0 && (r.width < 44 || r.height < 44) }).map((b) => b.getAttribute('aria-label')))
    expect(small).toEqual([])
    await expect(page.locator('meta[name="viewport"]')).not.toHaveAttribute('content', /user-scalable=no|maximum-scale=1/)
  })
})
