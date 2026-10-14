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

// ——— 3D ———
type P2 = { x: number; y: number }
export type P3 = { x: number; y: number; z: number }

/** Puntos de control Catmull-Rom → Bézier por tramo. */
export function chainControls(list: P2[]): [P2, P2, P2, P2][] {
  const out: [P2, P2, P2, P2][] = []
  for (let i = 0; i < list.length - 1; i++) {
    const p0 = list[i - 1] ?? list[i]
    const p1 = list[i]
    const p2 = list[i + 1]
    const p3 = list[i + 2] ?? p2
    const t = 0.18
    out.push([p1, { x: p1.x + (p2.x - p0.x) * t, y: p1.y + (p2.y - p0.y) * t }, { x: p2.x - (p3.x - p1.x) * t, y: p2.y - (p3.y - p1.y) * t }, p2])
  }
  return out
}

export const controlsToPath = (c: [P2, P2, P2, P2][]) =>
  c.map(([a, b, d, e], k) => `${k === 0 ? `M${a.x},${a.y} ` : ''}C${b.x},${b.y} ${d.x},${d.y} ${e.x},${e.y}`).join(' ')

function bez(c: [P2, P2, P2, P2], t: number): P2 {
  const u = 1 - t
  const [a, b, d, e] = c
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * d.x + t * t * t * e.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * d.y + t * t * t * e.y,
  }
}

/** Muestrea un camino 3D: la altura va de z1 a z2 con un arco de puente entre nodos. */
export function sample3D(controls: [P2, P2, P2, P2][], zs: number[], spacing = 240, arch = 160): P3[] {
  const pts: P3[] = []
  controls.forEach((c, k) => {
    const len = Math.hypot(c[3].x - c[0].x, c[3].y - c[0].y)
    const n = Math.max(3, Math.round(len / spacing))
    for (let j = k === 0 ? 0 : 1; j <= n; j++) {
      const t = j / n
      const p = bez(c, t)
      pts.push({ ...p, z: zs[k] + (zs[k + 1] - zs[k]) * t + Math.sin(Math.PI * t) * arch })
    }
  })
  return pts
}

export interface Cam3D { fx: number; fy: number; s: number; rx: number; rz: number }

/** Proyecta un punto de mundo a pantalla con la misma cadena de transforms que la cámara CSS. */
export function project(p: P3, cam: Cam3D, cx: number, cy: number, d: number): P2 & { k: number; depth: number } {
  let x = (p.x - cam.fx) * cam.s
  let y = (p.y - cam.fy) * cam.s
  let z = p.z * cam.s
  const rz = (cam.rz * Math.PI) / 180
  ;[x, y] = [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz)]
  const rx = (cam.rx * Math.PI) / 180
  ;[y, z] = [y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)]
  const k = d / (d - z)
  return { x: cx + x * k, y: cy + y * k, k, depth: z }
}

/** Ajusta foco y escala para que todos los puntos proyectados quepan centrados en el área. */
export function fitProjected(points: P3[], area: Rect, rx: number, rz: number, d: number): CameraTarget {
  const cx = area.left + area.width / 2
  const cy = area.top + area.height / 2
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  let fx = (Math.min(...xs) + Math.max(...xs)) / 2
  let fy = (Math.min(...ys) + Math.max(...ys)) / 2
  let s = Math.min(area.width / (Math.max(...xs) - Math.min(...xs)), area.height / (Math.max(...ys) - Math.min(...ys)))
  const box = () => {
    const pr = points.map((p) => project(p, { fx, fy, s, rx, rz }, cx, cy, d))
    const px = pr.map((p) => p.x)
    const py = pr.map((p) => p.y)
    return { l: Math.min(...px), r: Math.max(...px), t: Math.min(...py), b: Math.max(...py) }
  }
  for (let i = 0; i < 30; i++) {
    const b = box()
    s *= Math.min(area.width / (b.r - b.l), area.height / (b.b - b.t))
    const b2 = box()
    const ox = (b2.l + b2.r) / 2 - cx
    const oy = (b2.t + b2.b) / 2 - cy
    const wy = oy / Math.cos((rx * Math.PI) / 180)
    const a = (-rz * Math.PI) / 180
    fx += (ox * Math.cos(a) - wy * Math.sin(a)) / s
    fy += (ox * Math.sin(a) + wy * Math.cos(a)) / s
  }
  s *= 0.96
  return { fx, fy, s }
}
