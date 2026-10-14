import { LIFT, LOBBY, NODES } from '../data'
import { chainControls, controlsToPath, sample3D, type P3 } from './geometry'

export type Way = 'bc' | 'cu'

/** Camino de cada propuesta: sale del lobby, recorre sus nodos y vuelve al lobby. */
function build(w: Way) {
  const L = NODES[LOBBY]
  const idx = NODES.map((_, i) => i).filter((i) => NODES[i].world === w)
  const side = w === 'bc' ? -1 : 1
  const pts = [
    { x: L.x + side * (L.w / 2), y: L.y - 200 },
    ...idx.map((i) => ({ x: NODES[i].x, y: NODES[i].y })),
    { x: L.x + side * (L.w / 2), y: L.y + 240 },
  ]
  const lifts = [LIFT[LOBBY], ...idx.map((i) => LIFT[i]), LIFT[LOBBY]]
  const controls = chainControls(pts)
  return {
    path: controlsToPath(controls),
    floor: sample3D(controls, lifts.map(() => 0), 140, 0),
    /** Builders Club: rampa de ladrillos con arcos. Currículo: escalera de peldaños casi rectos. */
    sky: sample3D(controls, lifts, w === 'bc' ? 210 : 260, w === 'bc' ? 150 : 40) as P3[],
  }
}

export const ROUTES = { bc: build('bc'), cu: build('cu') }
