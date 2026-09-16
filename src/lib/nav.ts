import { LOBBY, NODES, RANGE, type World } from '../data'

export type Visited = { bc: boolean; cu: boolean }

export const worldOf = (i: number): World => NODES[i].world

/** Siguiente paso. En el lobby entra a la propuesta que falta; al final de una propuesta, vuelve al lobby. */
export function nextOf(i: number, visited: Visited): number {
  if (i === LOBBY) return !visited.bc || visited.cu ? RANGE.bc.first : RANGE.cu.first
  const w = worldOf(i) as 'bc' | 'cu'
  return i === RANGE[w].last ? LOBBY : i + 1
}

/** Paso anterior. Desde el primer nodo de una propuesta, al lobby. En el lobby no hay anterior. */
export function prevOf(i: number): number | null {
  if (i === LOBBY) return null
  const w = worldOf(i) as 'bc' | 'cu'
  return i === RANGE[w].first ? LOBBY : i - 1
}

/** La propuesta que el lobby sugiere entrar ahora. */
export function suggested(visited: Visited): 'bc' | 'cu' {
  return !visited.bc || visited.cu ? 'bc' : 'cu'
}

export function readHash(): number {
  const h = window.location.hash.replace('#', '')
  const i = NODES.findIndex((n) => n.key === h)
  return i >= 0 ? i : LOBBY
}
