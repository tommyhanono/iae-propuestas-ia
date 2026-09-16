import { expect, test, type Page } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { KEYS, REVEAL_MS, assertNode, keyOf, measure, open, waitSettled, watchErrors } from './helpers'

mkdirSync('tests/screenshots/interaccion', { recursive: true })
const shot = (page: Page, name: string) => page.screenshot({ path: `tests/screenshots/interaccion/${name}.png` })

test.describe('desktop 1440x900', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('recorrido completo con →: lobby → club → lobby → currículo → lobby', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'lobby')
    await expect(page.locator('[data-next]')).toHaveText(/Entrar a Builders Club/)
    const tour = ['bc-1', 'bc-2', 'bc-3', 'bc-4', 'bc-5', 'bc-6', 'bc-7', 'bc-8', 'lobby', 'cu-1', 'cu-2', 'cu-3', 'cu-4', 'cu-5', 'lobby']
    for (const key of tour) {
      await page.keyboard.press('ArrowRight')
      await waitSettled(page, key)
      await page.waitForTimeout(700)
      await assertNode(page, key, 'tour')
      if (key === 'lobby') await shot(page, `tour-lobby-${await page.locator('[data-portal] >> text=Vista').count()}`)
    }
    // Con las dos vistas, el lobby marca ambas y → vuelve a empezar por el club.
    await expect(page.locator('[data-portal] >> text=Vista')).toHaveCount(2)
    // ← desde el primer nodo de una propuesta vuelve al lobby; en el lobby no hace nada.
    await page.keyboard.press('ArrowRight'); await waitSettled(page, 'bc-1')
    await page.keyboard.press('ArrowLeft'); await waitSettled(page, 'lobby')
    await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(400)
    expect(await keyOf(page)).toBe('lobby')
    expect(errors).toEqual([])
  })

  test('el lobby sugiere la propuesta 2 después de ver la 1; Espacio avanza', async ({ page }) => {
    await open(page, 'bc-8')
    await expect(page.locator('[data-next]')).toHaveText(/Volver al lobby/)
    await page.keyboard.press('Space'); await waitSettled(page, 'lobby')
    await expect(page.locator('[data-next]')).toHaveText(/Entrar a Currículo 8–10/)
    await page.keyboard.press('Space'); await waitSettled(page, 'cu-1')
    await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'cu-1', 'space')
  })

  test('portales: clic en cada portal vuela adentro; "Volver al lobby" regresa', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'lobby')
    // A mitad del vuelo por el portal hay velo del color del mundo.
    await page.click('[data-portal="cu"]')
    let midVeil = 0
    for (let k = 0; k < 40 && midVeil < 0.9; k++) {
      await page.waitForTimeout(50)
      midVeil = Math.max(midVeil, await page.evaluate(() => Number(getComputedStyle([...document.querySelectorAll<HTMLElement>('div.fixed.inset-0.z-10')].pop()!).opacity)))
    }
    expect(midVeil).toBeGreaterThan(0.5)
    await waitSettled(page, 'cu-1'); await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'cu-1', 'portal cu')
    expect(await page.getAttribute('[data-app]', 'data-world')).toBe('cu')
    await open(page, 'cu-5')
    await page.click('[data-node="cu-5"] [data-back-lobby]')
    await waitSettled(page, 'lobby'); await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'lobby', 'volver desde cu-5')
    await page.click('[data-portal="bc"]')
    await waitSettled(page, 'bc-1'); await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'bc-1', 'portal bc')
    expect(await page.getAttribute('[data-app]', 'data-world')).toBe('bc')
    await open(page, 'bc-8')
    await page.click('[data-node="bc-8"] [data-back-lobby]')
    await waitSettled(page, 'lobby'); await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'lobby', 'volver desde bc-8')
    expect(errors).toEqual([])
  })

  test('dots: saltos dentro y entre propuestas quedan centrados', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'lobby')
    for (const key of ['bc-6', 'cu-3', 'bc-2', 'lobby', 'cu-5', 'cu-1', 'bc-8', 'bc-5', 'cu-4', 'lobby']) {
      await page.click(`[data-dot="${key}"]`)
      await waitSettled(page, key)
      await page.waitForTimeout(600)
      await assertNode(page, key, `dot ${key}`)
    }
    expect(errors).toEqual([])
  })

  test('cada estilo de vuelo termina centrado (vecinos en ambos sentidos)', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'bc-1')
    for (const key of ['bc-2', 'bc-3', 'bc-4', 'bc-5', 'bc-6', 'bc-7', 'bc-8']) { await page.keyboard.press('ArrowRight'); await waitSettled(page, key); await assertNode(page, key, 'vuelo →') }
    for (const key of ['bc-7', 'bc-6', 'bc-5', 'bc-4', 'bc-3', 'bc-2', 'bc-1']) { await page.keyboard.press('ArrowLeft'); await waitSettled(page, key); await assertNode(page, key, 'vuelo ←') }
    await open(page, 'cu-1')
    for (const key of ['cu-2', 'cu-3', 'cu-4', 'cu-5']) { await page.keyboard.press('ArrowRight'); await waitSettled(page, key); await assertNode(page, key, 'vuelo →') }
    for (const key of ['cu-4', 'cu-3', 'cu-2', 'cu-1']) { await page.keyboard.press('ArrowLeft'); await waitSettled(page, key); await assertNode(page, key, 'vuelo ←') }
    expect(errors).toEqual([])
  })

  test('la inclinación diagonal rota la cámara a mitad del vuelo y vuelve a 0', async ({ page }) => {
    await open(page, 'bc-3')
    await page.keyboard.press('ArrowRight')
    let maxRot = 0
    for (let k = 0; k < 12; k++) {
      await page.waitForTimeout(70)
      const t = await page.evaluate(() => (document.querySelector('[data-world-layer]') as HTMLElement).style.transform)
      maxRot = Math.max(maxRot, Math.abs(Number(/rotate\((-?[\d.]+)deg\)/.exec(t)?.[1] ?? 0)))
    }
    expect(maxRot).toBeGreaterThan(0.5)
    await waitSettled(page, 'bc-4')
    await assertNode(page, 'bc-4', 'tilt')
  })

  test('martillar → 25 veces con interrupciones termina en el nodo correcto y centrado', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'lobby')
    for (let k = 0; k < 25; k++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(40) }
    // lobby→bc1..bc8 (8) → lobby (9) → cu1..cu5 (14) → lobby (15) → bc1..bc8 (23) → lobby (24) → bc1 (25, ya vio las dos)
    await waitSettled(page, 'bc-1')
    await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'bc-1', 'martillar')
    for (let k = 0; k < 4; k++) { await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(150) }
    await waitSettled(page, 'lobby')
    await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'lobby', 'interrupciones')
    expect(errors).toEqual([])
  })

  test('O abre el mapa con las dos constelaciones y el lobby; clic entra; Esc vuelve', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'bc-3')
    await page.keyboard.press('o')
    await page.waitForFunction(() => document.querySelector('[data-app]')?.hasAttribute('data-map-open'))
    await waitSettled(page)
    await page.waitForTimeout(600)
    const rects = await page.$$eval('[data-node]', (els) => els.map((e) => e.getBoundingClientRect().toJSON()))
    expect(rects).toHaveLength(14)
    for (const r of rects) {
      expect(r.left).toBeGreaterThanOrEqual(0)
      expect(r.top).toBeGreaterThanOrEqual(0)
      expect(r.right).toBeLessThanOrEqual(1440)
      expect(r.bottom).toBeLessThanOrEqual(900 - 80)
    }
    // Lobby al centro: BC a la izquierda, currículo a la derecha.
    const pos = await page.$$eval('[data-node]', (els) => Object.fromEntries(els.map((e) => [e.getAttribute('data-node'), e.getBoundingClientRect().left])))
    expect(pos['bc-1']).toBeLessThan(pos['lobby'])
    expect(pos['cu-1']).toBeGreaterThan(pos['lobby'])
    await shot(page, 'mapa')
    await page.click('[data-node="cu-4"]')
    await waitSettled(page, 'cu-4')
    await page.waitForTimeout(REVEAL_MS)
    expect(await page.getAttribute('[data-app]', 'data-map-open')).toBeNull()
    await assertNode(page, 'cu-4', 'mapa→cu-4')
    await page.keyboard.press('O'); await waitSettled(page); await page.waitForTimeout(300)
    await page.click('[data-node="lobby"]')
    await waitSettled(page, 'lobby'); await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'lobby', 'mapa→lobby')
    await page.keyboard.press('o'); await waitSettled(page); await page.waitForTimeout(300)
    await page.keyboard.press('Escape')
    await waitSettled(page, 'lobby')
    await page.waitForTimeout(REVEAL_MS)
    expect(await page.getAttribute('[data-app]', 'data-map-open')).toBeNull()
    await assertNode(page, 'lobby', 'Esc desde mapa')
    // Botón del último nodo del currículo abre el mapa.
    await open(page, 'cu-5')
    await page.click('[data-node="cu-5"] [data-open-map]')
    await page.waitForFunction(() => document.querySelector('[data-app]')?.hasAttribute('data-map-open'))
    await waitSettled(page)
    expect(errors).toEqual([])
  })

  test('en el mapa, Tab + Enter entra a un nodo (teclado)', async ({ page }) => {
    await open(page, 'lobby')
    await page.keyboard.press('o'); await waitSettled(page); await page.waitForTimeout(300)
    await page.focus('[data-node="bc-7"]')
    await page.keyboard.press('Enter')
    await waitSettled(page, 'bc-7'); await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'bc-7', 'mapa teclado')
  })

  test('N abre las notas del nodo actual y el nodo se re-centra sin quedar tapado', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'bc-3')
    await page.keyboard.press('n')
    await expect(page.getByLabel('Notas del orador').first()).toBeVisible()
    await waitSettled(page)
    await page.waitForTimeout(700)
    await expect(page.locator('aside')).toContainText('nadie está obligado a pagar')
    await assertNode(page, 'bc-3', 'notas abiertas')
    await shot(page, 'notas')
    await page.keyboard.press('ArrowRight'); await waitSettled(page, 'bc-4'); await page.waitForTimeout(REVEAL_MS)
    await expect(page.locator('aside')).toContainText('Obsidian como segundo cerebro')
    await assertNode(page, 'bc-4', 'notas en bc-4')
    await page.click('[data-dot="lobby"]'); await waitSettled(page, 'lobby'); await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'lobby', 'notas en lobby')
    await page.keyboard.press('n'); await waitSettled(page); await page.waitForTimeout(600)
    await assertNode(page, 'lobby', 'notas cerradas')
    expect(errors).toEqual([])
  })

  test('todos los nodos tienen guion en las notas', async ({ page }) => {
    await open(page, 'lobby')
    await page.keyboard.press('n')
    for (const key of KEYS) {
      await page.goto(`/#${key}`)
      await waitSettled(page, key)
      if (!(await page.locator('aside').count())) await page.keyboard.press('n')
      const txt = (await page.locator('aside p').textContent()) ?? ''
      expect(txt.length, key).toBeGreaterThan(120)
    }
  })

  test('? abre y cierra la ayuda; F y L funcionan sin errores', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'cu-2')
    await page.keyboard.press('?')
    await expect(page.getByRole('dialog', { name: 'Teclas' })).toBeVisible()
    await shot(page, 'ayuda')
    await page.keyboard.press('ArrowRight') // bloqueado mientras la ayuda está abierta
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Teclas' })).toBeHidden()
    expect(await keyOf(page)).toBe('cu-2')
    await page.keyboard.press('f'); await page.waitForTimeout(300); await page.keyboard.press('f')
    await page.keyboard.press('l')
    await waitSettled(page, 'lobby')
    expect(errors).toEqual([])
  })

  test('refrescar con #cu-3 abre ese nodo centrado; hash inválido cae al lobby', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'cu-3')
    await page.reload()
    await waitSettled(page, 'cu-3'); await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'cu-3', 'reload')
    await page.goto('/#no-existe')
    await waitSettled(page, 'lobby')
    expect(errors).toEqual([])
  })

  test('resize 1440→375→1440→1100x700 en caliente', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'bc-5')
    await page.setViewportSize({ width: 375, height: 812 })
    await page.waitForFunction(() => document.querySelector('[data-app]')?.getAttribute('data-mode') === 'mobile')
    await waitSettled(page, 'bc-5'); await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'bc-5', 'resize→375')
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.waitForFunction(() => document.querySelector('[data-app]')?.getAttribute('data-mode') === 'desktop')
    await waitSettled(page, 'bc-5'); await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'bc-5', 'resize→1440')
    await page.setViewportSize({ width: 1100, height: 700 })
    await page.waitForTimeout(400); await waitSettled(page, 'bc-5')
    await assertNode(page, 'bc-5', 'resize→1100x700')
    expect(errors).toEqual([])
  })

  test('tarjeta SAT bloqueada: candado + blur, sin detalles del cómo en el DOM', async ({ page }) => {
    await open(page, 'bc-6')
    const card = page.locator('[data-locked="sat"]')
    await expect(card).toBeVisible()
    const skeletonText = await card.locator('.skeleton').textContent()
    expect(skeletonText?.trim()).toBe('')
    expect(await card.locator('.skeleton').evaluate((el) => getComputedStyle(el).filter)).toContain('blur')
    const text = (await card.textContent())!.replace(/\s+/g, ' ')
    expect(text).toContain('Proyecto SAT')
    expect(text).toContain('Bloqueado')
    // Solo estas frases visibles; nada más largo que explique el funcionamiento.
    expect(text.length).toBeLessThan(200)
  })

  test('contenido: textos clave presentes y charlistas solo como idea a futuro', async ({ page, request }) => {
    await open(page, 'lobby')
    const all = (await page.locator('[data-world-layer]').textContent())!.replace(/\s+/g, ' ')
    for (const s of [
      'Builders Club', 'Currículo 8–10', 'Thomas Hanono', 'candidato a presidente', 'una cuenta de Claude por estudiante',
      'Gemini', 'Obsidian', 'MCPs', 'Seis clases', 'Demo Day', 'el temario lo definen los miembros', 'Proyecto SAT',
      'no se imponen en un reglamento duro', 'Charlistas externos invitados', 'Posibilidades a futuro', 'Una versión para profesores',
      'leer, pedir, crear', '¿Qué hay en A5?', 'Leer y explicar un Excel real', 'la forma del prompt diferencia el producto',
      'Google Sheets', 'portafolio', 'quita el techo', '9no a 11vo', 'Oct',
    ]) expect(all, s).toContain(s)
    expect(all).not.toMatch(/vos |tenés|podés|querés/)
    expect(await page.title()).toContain('IA en el IAE')
    expect((await request.get('/favicon.svg')).status()).toBe(200)
  })

  test('foco de teclado visible', async ({ page }) => {
    await open(page, 'lobby')
    await page.keyboard.press('Tab')
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineStyle)
    expect(outline).not.toBe('none')
  })
})

test.describe('reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, contextOptions: { reducedMotion: 'reduce' } })

  test('cross-fade, números finales directo, sin glows animados, todo centrado', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'bc-4')
    await page.keyboard.press('ArrowRight')
    await waitSettled(page, 'bc-5')
    await page.waitForTimeout(450)
    expect(await page.locator('[data-node="bc-5"] .stat-xl').textContent()).toBe('6')
    await assertNode(page, 'bc-5', 'reduced')
    for (const key of ['bc-6', 'bc-7', 'bc-8', 'lobby', 'cu-1']) {
      await page.keyboard.press('ArrowRight'); await waitSettled(page, key); await page.waitForTimeout(500); await assertNode(page, key, 'reduced')
    }
    expect(await page.locator('[data-node="cu-1"] .stat-xl').textContent()).toBe('3')
    const anim = await page.evaluate(() => [getComputedStyle(document.querySelector('.glow') as Element).animationName, getComputedStyle(document.querySelector('.portal-ring .spin') as Element).animationName])
    expect(anim).toEqual(['none', 'none'])
    await page.keyboard.press('o'); await waitSettled(page); await page.waitForTimeout(300)
    await page.click('[data-node="bc-2"]'); await waitSettled(page, 'bc-2'); await page.waitForTimeout(500)
    await assertNode(page, 'bc-2', 'reduced mapa')
    expect(errors).toEqual([])
  })
})

test.describe('móvil 375x812', () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })

  const swipe = async (page: Page, dx: number) => {
    await page.evaluate((d) => {
      const el = document.querySelector('.mobile-scroller') as HTMLElement
      const mk = (x: number) => new Touch({ identifier: 1, target: el, clientX: x, clientY: 400 })
      el.dispatchEvent(new TouchEvent('touchstart', { touches: [mk(200)], changedTouches: [mk(200)], bubbles: true }))
      el.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [mk(200 + d)], bubbles: true }))
    }, dx)
  }

  test('swipe recorre lobby → club → lobby → currículo; swipe vertical no navega', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'lobby')
    const tour = ['bc-1', 'bc-2', 'bc-3', 'bc-4', 'bc-5', 'bc-6', 'bc-7', 'bc-8', 'lobby', 'cu-1', 'cu-2', 'cu-3', 'cu-4', 'cu-5', 'lobby']
    for (const key of tour) { await swipe(page, -160); await waitSettled(page, key); await assertNode(page, key, 'swipe') }
    // En el lobby no hay anterior: swipe atrás no se mueve. Un swipe corto tampoco navega.
    await swipe(page, 160); await page.waitForTimeout(500)
    expect(await keyOf(page)).toBe('lobby')
    await swipe(page, -160); await waitSettled(page, 'bc-1')
    await swipe(page, 160); await waitSettled(page, 'lobby')
    await swipe(page, -30); await page.waitForTimeout(500)
    expect(await keyOf(page)).toBe('lobby')
    expect(errors).toEqual([])
  })

  test('portal por toque, botones, mapa móvil, notas y toques ≥44px', async ({ page }) => {
    const errors = watchErrors(page)
    await open(page, 'lobby')
    await page.tap('[data-portal="cu"]')
    await waitSettled(page, 'cu-1'); await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'cu-1', 'portal móvil')
    await page.getByRole('button', { name: 'Siguiente' }).click(); await waitSettled(page, 'cu-2')
    await page.getByRole('button', { name: 'Abrir mapa de propuestas' }).click()
    await expect(page.getByRole('dialog', { name: 'Mapa de propuestas' })).toBeVisible()
    await shot(page, 'movil-mapa')
    await page.click('[data-map-node="bc-6"]')
    await waitSettled(page, 'bc-6'); await page.waitForTimeout(REVEAL_MS)
    await assertNode(page, 'bc-6', 'mapa móvil→bc-6')
    const small = await page.$$eval('nav button, [data-portal], [data-back-lobby]', (els) => els.map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && (r.width < 44 || r.height < 44)).length)
    expect(small).toBe(0)
    await page.getByRole('button', { name: 'Notas del orador' }).click()
    await expect(page.locator('aside')).toBeVisible()
    await page.evaluate(() => { const s = document.querySelector('.mobile-scroller') as HTMLElement; s.scrollTo({ top: s.scrollHeight }) })
    await page.waitForTimeout(300)
    const m = await measure(page, 'bc-6')
    expect(m.card!.bottom).toBeLessThanOrEqual(m.notesTop! + 1)
    await shot(page, 'movil-notas')
    expect(errors).toEqual([])
  })

  test('al final del scroll, los controles no tapan el contenido (14 nodos)', async ({ page }) => {
    for (const key of KEYS) {
      await open(page, key)
      await page.evaluate(() => { const s = document.querySelector('.mobile-scroller') as HTMLElement; s.scrollTo({ top: s.scrollHeight }) })
      await page.waitForTimeout(150)
      const m = await measure(page, key)
      expect(m.card!.bottom, key).toBeLessThanOrEqual(m.controlsTop + 1)
      expect(m.docScrollW, key).toBeLessThanOrEqual(375)
    }
  })
})
