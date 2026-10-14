// Medición de una lámina de /directiva/ dentro del navegador. Se pasa tal cual a page.evaluate:
// no puede usar nada de fuera de la función.
export interface SlideReport {
  mode: string
  docScrollW: number
  vw: number
  /** Elementos de texto que se montan sobre el pie, el titular o se salen de la lámina. */
  collisions: string[]
  /** Elementos de texto con scroll horizontal propio (texto cortado). */
  cut: string[]
  /** Tamaño de letra más chico visible, en px de pantalla. */
  minFont: number
  minFontText: string
}

export function measureSlide(): SlideReport {
  const app = document.querySelector('[data-app]') as HTMLElement
  const slide = document.querySelector('.dx-viewport .slide') as HTMLElement
  const sr = slide.getBoundingClientRect()
  const head = slide.querySelector('.slide-head') as HTMLElement | null
  const foot = slide.querySelector('.titleblock') as HTMLElement | null
  const headBottom = head ? head.getBoundingClientRect().bottom : sr.top
  const footTop = foot ? foot.getBoundingClientRect().top : sr.bottom - sr.height * 0.06
  const stage = app.dataset.mode === 'stage'
  const collisions: string[] = []
  const cut: string[] = []
  let minFont = Infinity
  let minFontText = ''
  const scale = stage ? sr.width / 1600 : 1
  const tol = 1.5
  const label = (el: Element) => `${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 40)}"`
  slide.querySelectorAll<HTMLElement>('.slide-body p, .slide-body li, .slide-body h3, .slide-body td, .slide-body dt, .slide-body dd, .slide-body blockquote, .slide-body figure, .slide-body article, .slide-head h2, .slide-head p, .titleblock span').forEach((el) => {
    const cs = getComputedStyle(el)
    if (el.closest('[aria-hidden="true"]') || cs.visibility === 'hidden' || el.closest('.beat-hidden')) return
    const b = el.getBoundingClientRect()
    if (b.width === 0 || b.height === 0) return
    const inBody = !!el.closest('.slide-body')
    if (stage && inBody && b.bottom > footTop + tol) collisions.push(`${label(el)} baja hasta ${Math.round(b.bottom)} y el pie empieza en ${Math.round(footTop)}`)
    if (stage && inBody && b.top < headBottom - tol) collisions.push(`${label(el)} sube hasta ${Math.round(b.top)} y el titular termina en ${Math.round(headBottom)}`)
    if (b.right > sr.right + tol || b.left < sr.left - tol) collisions.push(`${label(el)} se sale por los lados [${Math.round(b.left)}, ${Math.round(b.right)}] vs [${Math.round(sr.left)}, ${Math.round(sr.right)}]`)
    if (stage && (b.right > sr.right - sr.width * 0.06 + tol || b.left < sr.left + sr.width * 0.06 - tol)) collisions.push(`${label(el)} entra al margen seguro del 6 %`)
    if (el.scrollWidth > el.clientWidth + 1 && cs.overflowX !== 'visible') cut.push(`${label(el)} ${el.scrollWidth}>${el.clientWidth}`)
    const hasOwnText = [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent || '').trim())
    if (hasOwnText) {
      const px = parseFloat(cs.fontSize) * scale
      if (px < minFont) { minFont = px; minFontText = label(el) }
    }
  })
  return { mode: app.dataset.mode!, docScrollW: document.documentElement.scrollWidth, vw: window.innerWidth, collisions, cut, minFont: Math.round(minFont * 10) / 10, minFontText }
}
