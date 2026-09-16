import { NODES, type NodeMeta, type World } from '../data'

export interface Rect { left: number; top: number; width: number; height: number }
export interface CameraTarget { fx: number; fy: number; s: number }

export const MIN_GAP_RATIO = 0.5

export function nodeRect(n: NodeMeta): Rect {
  return { left: n.x - n.w / 2, top: n.y - n.h / 2, width: n.w, height: n.h }
}

export function boundsOf(list: NodeMeta[], pad = 0): Rect {
  const l = Math.min(...list.map((s) => s.x - s.w / 2)) - pad
  const t = Math.min(...list.map((s) => s.y - s.h / 2)) - pad
  const r = Math.max(...list.map((s) => s.x + s.w / 2)) + pad
  const b = Math.max(...list.map((s) => s.y + s.h / 2)) + pad
  return { left: l, top: t, width: r - l, height: b - t }
}

export function worldBounds(w: World): Rect {
  return boundsOf(NODES.filter((s) => s.world === w), 260)
}

/** Todo el tablero, con aire arriba para los nombres de las constelaciones. */
export const MAP_BOUNDS: Rect = (() => {
  const b = boundsOf(NODES, 340)
  return { left: b.left, top: b.top - 560, width: b.width, height: b.height + 560 }
})()

/** Área útil de pantalla: descuenta barra superior, controles y panel de notas. */
export function usableArea(vw: number, vh: number, notesOpen: boolean): Rect {
  const padX = Math.max(24, vw * 0.055)
  const top = Math.max(56, vh * 0.06)
  const controls = 92
  const notes = notesOpen ? Math.min(220, vh * 0.28) + 12 : 0
  const bottom = controls + notes + vh * 0.02
  return { left: padX, top, width: vw - padX * 2, height: Math.max(120, vh - top - bottom) }
}

/** Fit-to-viewport: escala y foco para que el rect quede centrado y completo en el área. */
export function fitRect(rect: Rect, area: Rect): CameraTarget {
  const s = Math.min(area.width / rect.width, area.height / rect.height)
  return { fx: rect.left + rect.width / 2, fy: rect.top + rect.height / 2, s }
}

/** Falla si dos nodos se intersectan o quedan más cerca que el mínimo en ambos ejes. */
export function assertNoOverlap(list: NodeMeta[] = NODES): string[] {
  const problems: string[] = []
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = nodeRect(list[i])
      const b = nodeRect(list[j])
      const minGap = Math.min(a.width, b.width) * MIN_GAP_RATIO
      const gapX = Math.max(b.left - (a.left + a.width), a.left - (b.left + b.width))
      const gapY = Math.max(b.top - (a.top + a.height), a.top - (b.top + b.height))
      if (gapX < minGap && gapY < minGap) {
        problems.push(`Nodos ${list[i].key} y ${list[j].key}: gapX=${gapX}, gapY=${gapY} < ${minGap}`)
      }
    }
  }
  return problems
}

/** Curva suave (Catmull-Rom → Bézier) por los centros, un path por tramo. */
export function chainPaths(list: NodeMeta[]): string[] {
  const p = list.map((s) => [s.x, s.y] as const)
  const out: string[] = []
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2
    const t = 0.18
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t]
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t]
    out.push(`M${p1[0]},${p1[1]} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`)
  }
  return out
}

/** Arco entre dos puntos, curvado hacia un lado. */
export function arcPath(a: { x: number; y: number }, b: { x: number; y: number }, bend = 0.22): string {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  return `M${a.x},${a.y} Q${mx - dy * bend},${my + dx * bend} ${b.x},${b.y}`
}

/** Campo de estrellas determinista (mismo cielo en cada carga). */
export function starField(bounds: Rect, count: number) {
  let seed = 20261001
  const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296 }
  return Array.from({ length: count }, () => ({
    x: bounds.left + rnd() * bounds.width,
    y: bounds.top + rnd() * bounds.height,
    r: 2.5 + rnd() * rnd() * 9,
    o: 0.12 + rnd() * 0.42,
    tone: rnd(),
  }))
}
