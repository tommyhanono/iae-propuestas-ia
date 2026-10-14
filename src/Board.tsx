import {
  animate, motion, useMotionValue, useTransform,
  type AnimationPlaybackControls, type MotionValue,
} from 'framer-motion'
import { Fragment, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ACCENT, FLAVORS, LIFT, LOBBY, MAP_PITCH, MAP_ROT, NODES, PERSPECTIVE, PORTALS, RANGE, WORLDS, type NodeMeta,
} from './data'
import { StageCtx, groupV, type Phase } from './components/primitives'
import {
  MAP_BOUNDS, chainControls, chainPaths, controlsToPath, fitProjected, fitRect, nodeRect, sample3D,
  starField, usableArea, worldBounds, type CameraTarget, type P3, type Rect,
} from './lib/geometry'
import { NODE_VIEWS } from './views'
import { useReduced } from './lib/useReduced'

type NodePhase = 'idle' | 'incoming' | 'active'
type W = 'bc' | 'cu'

/** Profundidad de los nodos que no están activos: se hunden detrás del activo. */
const IDLE_Z = -220

// ——— Caminos: en el piso (SVG) y en el aire (puntos 3D a la altura de cada nodo) ———
const L = NODES[LOBBY]
const ROUTE = (w: W) => {
  const idx = NODES.map((_, i) => i).filter((i) => NODES[i].world === w)
  const side = w === 'bc' ? -1 : 1
  const anchorIn = { x: L.x + side * (L.w / 2), y: L.y - 200 }
  const anchorOut = { x: L.x + side * (L.w / 2), y: L.y + 240 }
  const pts = [anchorIn, ...idx.map((i) => ({ x: NODES[i].x, y: NODES[i].y })), anchorOut]
  const zs = [LIFT[LOBBY], ...idx.map((i) => LIFT[i]), LIFT[LOBBY]]
  const controls = chainControls(pts)
  return { path: controlsToPath(controls), dots: sample3D(controls, zs, w === 'bc' ? 230 : 300, w === 'bc' ? 140 : 60) }
}
const ROUTES = { bc: ROUTE('bc'), cu: ROUTE('cu') }

/** Tramo del piso por índice global menor del par vecino (para la estela al avanzar). */
const SEGMENT: Record<number, { d: string; color: string }> = {}
chainPaths(NODES.filter((n) => n.world === 'bc')).forEach((d, k) => { SEGMENT[RANGE.bc.first + k] = { d, color: ACCENT.bc } })
chainPaths(NODES.filter((n) => n.world === 'cu')).forEach((d, k) => { SEGMENT[RANGE.cu.first + k] = { d, color: ACCENT.cu } })

const grow = (r: Rect, x: number, y: number): Rect => ({ left: r.left - x, top: r.top - y, width: r.width + 2 * x, height: r.height + 2 * y })
const STAR_LAYERS = [
  { z: -1800, stars: starField(grow(MAP_BOUNDS, 3000, 2000), 160), cls: 'twinkle-a', k: 1.8 },
  { z: -900, stars: starField(grow(MAP_BOUNDS, 1500, 1000), 140), cls: 'twinkle-b', k: 1.3 },
  { z: -320, stars: starField(MAP_BOUNDS, 110), cls: 'twinkle-c', k: 1 },
]
const LABEL_Z = 1750
const LABEL_H = 470
const LABELS = (['bc', 'cu'] as const).map((w) => {
  const b = worldBounds(w)
  return { w, x: b.left + b.width / 2, y: b.top - 80 }
})
const GRID = grow(MAP_BOUNDS, 2400, 1600)

/** Puntos que tienen que caber en pantalla con el mapa inclinado. */
const MAP_POINTS: P3[] = (() => {
  const pts: P3[] = []
  NODES.forEach((n, i) => {
    const r = nodeRect(n)
    for (const x of [r.left, r.left + r.width]) for (const y of [r.top, r.top + r.height]) pts.push({ x, y, z: LIFT[i] }, { x, y, z: 0 })
  })
  const c = Math.cos((MAP_PITCH * Math.PI) / 180)
  const sn = Math.sin((MAP_PITCH * Math.PI) / 180)
  LABELS.forEach((lb) => {
    for (const dx of [-1350, 1350]) pts.push({ x: lb.x + dx, y: lb.y, z: LABEL_Z }, { x: lb.x + dx, y: lb.y - LABEL_H * c, z: LABEL_Z + LABEL_H * sn })
  })
  return pts
})()
const mapFitCache = new Map<string, CameraTarget>()
function mapFit(area: Rect): CameraTarget {
  const k = `${area.left},${area.top},${area.width},${area.height}`
  if (!mapFitCache.has(k)) mapFitCache.set(k, fitProjected(MAP_POINTS, area, MAP_PITCH, MAP_ROT, PERSPECTIVE))
  return mapFitCache.get(k)!
}

interface Props {
  index: number
  map: boolean
  notesOpen: boolean
  onEnter: (i: number) => void
  onSettled: (settled: boolean) => void
  onArea: (area: string) => void
  onWorldShift: (i: number) => void
}

const Node = memo(function Node({ node, i, phase, map, current, onEnter }: { node: NodeMeta; i: number; phase: NodePhase; map: boolean; current: boolean; onEnter: (i: number) => void }) {
  const View = NODE_VIEWS[i]
  const content: Phase = phase === 'incoming' ? 'hidden' : 'show'
  const r = nodeRect(node)
  const active = phase !== 'idle'
  const label = node.world === 'lobby' ? 'Lobby' : `${WORLDS[node.world].name} ${node.n}: ${node.short}`
  return (
    <motion.section
      data-node={node.key}
      data-active={phase === 'active' || undefined}
      aria-label={label}
      aria-hidden={!map && !active ? true : undefined}
      role={map ? 'button' : undefined}
      tabIndex={map ? 0 : -1}
      onClick={map ? () => onEnter(i) : undefined}
      onKeyDown={map ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onEnter(i) } } : undefined}
      className={`node w-${node.world} ${map ? 'cursor-pointer' : ''}`}
      style={{ left: r.left, top: r.top, width: r.width, height: r.height, pointerEvents: map || active ? 'auto' : 'none' }}
      initial={false}
      animate={{ opacity: map ? 1 : active ? 1 : 0.2, scale: map || active ? 1 : 0.94, z: map ? LIFT[i] : active ? 0 : IDLE_Z }}
      transition={{ duration: map ? 1.1 : 0.7, ease: [0.22, 0.9, 0.3, 1] }}
    >
      <span aria-hidden className="aura" />
      <StageCtx.Provider value={{ run: phase === 'active' && !map, compact: false }}>
        <motion.div className="node-inner" variants={groupV} initial={false} animate={content} inert={map || !active}>
          <View />
        </motion.div>
      </StageCtx.Provider>
      {map && current && <div aria-hidden className="map-current pointer-events-none absolute -inset-12 rounded-[60px] border-[18px] border-acc/80" />}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 rounded-[28px]"
        style={{ background: 'radial-gradient(closest-side, rgb(16 21 31 / 0.9), rgb(16 21 31 / 0.72))' }}
        initial={false}
        animate={{ opacity: map ? 1 : 0 }}
        transition={{ duration: 0.45 }}
      >
        <span className="flex h-[300px] w-[300px] items-center justify-center rounded-full font-display text-[170px] font-bold"
          style={{ background: node.world === 'lobby' ? '#EFEAE0' : 'var(--acc)', color: '#10151f', boxShadow: '0 0 110px -10px var(--acc)' }}>
          {node.world === 'lobby' ? '◎' : node.n}
        </span>
        <span className="max-w-[92%] text-center font-display text-[140px] font-semibold leading-[1.02] text-paper">{node.short}</span>
      </motion.div>
    </motion.section>
  )
})

/** Piso: sombra y poste bajo cada nodo, y los dos caminos con estilos distintos. */
const Floor = memo(function Floor({ map, reduced }: { map: boolean; reduced: boolean }) {
  return (
    <>
      {NODES.map((n, i) => {
        const r = nodeRect(n)
        return (
          <Fragment key={`f${n.key}`}>
            <motion.div aria-hidden className={`floor-shadow w-${n.world}`} style={{ left: r.left - 120, top: r.top - 60, width: r.width + 240, height: r.height + 120 }}
              initial={false} animate={{ opacity: map ? 1 : 0 }} transition={{ duration: 0.8 }} />
            <motion.div aria-hidden className={`stem w-${n.world}`} style={{ left: n.x - 7, top: n.y, height: LIFT[i] }}
              initial={false} animate={{ opacity: map ? 1 : 0 }} transition={{ duration: 0.8, delay: map ? 0.3 : 0 }} />
          </Fragment>
        )
      })}
      <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1" aria-hidden>
        <defs>
          <filter id="glow-road" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18" /></filter>
        </defs>
        {/* Builders Club: forja. Cinta dorada ancha, ladrillos que fluyen y chispas que viajan. */}
        <g opacity={map ? 1 : 0.55} style={{ transition: 'opacity .8s' }}>
          <path d={ROUTES.bc.path} fill="none" stroke={ACCENT.bc} strokeOpacity={map ? 0.16 : 0.07} strokeWidth={map ? 190 : 110} strokeLinecap="round" />
          <path d={ROUTES.bc.path} fill="none" stroke={ACCENT.bc} strokeOpacity={0.5} strokeWidth={map ? 30 : 16} strokeLinecap="round" filter="url(#glow-road)" />
          <path className={reduced ? '' : 'flow-bc'} d={ROUTES.bc.path} fill="none" stroke="#E2C77F" strokeOpacity={map ? 0.85 : 0.4} strokeWidth={map ? 44 : 22} strokeDasharray="120 70" />
          {!reduced && [0, 1, 2, 3].map((k) => (
            <circle key={k} r={map ? 34 : 20} fill="#F4DDA0" style={{ filter: 'drop-shadow(0 0 30px #C8A24B)' }}>
              <animateMotion dur="14s" repeatCount="indefinite" begin={`${-k * 3.5}s`} path={ROUTES.bc.path} />
            </circle>
          ))}
        </g>
        {/* Currículo: cianotipo. Dos rieles con peldaños y un pulso de luz que sube. */}
        <g opacity={map ? 1 : 0.55} style={{ transition: 'opacity .8s' }}>
          <path d={ROUTES.cu.path} fill="none" stroke={ACCENT.cu} strokeOpacity={map ? 0.9 : 0.5} strokeWidth={map ? 120 : 70} />
          <path d={ROUTES.cu.path} fill="none" stroke="#10151F" strokeWidth={map ? 96 : 56} />
          <path d={ROUTES.cu.path} fill="none" stroke={ACCENT.cu} strokeOpacity={map ? 0.8 : 0.45} strokeWidth={map ? 120 : 70} strokeDasharray="10 90" />
          <path className={reduced ? '' : 'flow-cu'} d={ROUTES.cu.path} fill="none" stroke="#CFEAFB" strokeWidth={map ? 26 : 14} strokeDasharray="260 1600" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 26px #6FB8E8)' }} />
        </g>
      </svg>
    </>
  )
})

/** Caminos en el aire: una cadena de piezas a la altura de cada nodo, con una onda de luz que avanza. */
const SkyPaths = memo(function SkyPaths({ map }: { map: boolean }) {
  return (
    <div aria-hidden className={`sky ${map ? 'on' : ''}`}>
      {(['bc', 'cu'] as const).map((w) => ROUTES[w].dots.map((p, k) => (
        <span key={`${w}${k}`} className={`sky-dot w-${w}`} style={{ transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateX(${-MAP_PITCH}deg)` }}>
          <i className={w === 'bc' ? 'brick' : 'rung'} style={{ animationDelay: `${(k * (w === 'bc' ? 0.11 : 0.16)).toFixed(2)}s`, transitionDelay: map ? `${Math.min(1.2, k * 0.012).toFixed(3)}s` : '0s' }} />
        </span>
      )))}
    </div>
  )
})

export default function Board({ index, map, notesOpen, onEnter, onSettled, onArea, onWorldShift }: Props) {
  const reduced = useReduced()
  const fx = useMotionValue(0)
  const fy = useMotionValue(0)
  const s = useMotionValue(0.2)
  const rot = useMotionValue(0)
  const pitch = useMotionValue(0)
  const yaw = useMotionValue(0)
  const blur = useMotionValue(0)
  const acx = useMotionValue(0)
  const acy = useMotionValue(0)
  const fade = useMotionValue(0)
  const veil = useMotionValue(0)
  const transform = useTransform([fx, fy, s, rot, acx, acy, pitch, yaw] as MotionValue<number>[], ([x, y, k, r, cx, cy, p, yw]: number[]) =>
    `translate3d(${cx}px, ${cy}px, 0) rotateX(${p}deg) rotateY(${yw}deg) rotate(${r}deg) scale3d(${k}, ${k}, ${k}) translate3d(${-x}px, ${-y}px, 0)`)
  const origin = useTransform([acx, acy] as MotionValue<number>[], ([x, y]: number[]) => `${x}px ${y}px`)
  const filter = useTransform(blur, (b) => (b > 0.05 ? `blur(${b}px)` : 'none'))
  const gridOpacity = useTransform(pitch, (p) => Math.min(1, Math.abs(p) / 40))
  const gridDisplay = useTransform(pitch, (p) => (Math.abs(p) < 0.5 ? 'none' : 'block'))

  const [phases, setPhases] = useState<NodePhase[]>(() => NODES.map((_, i) => (i === index ? 'incoming' : 'idle')))
  const [flying, setFlying] = useState(false)
  const [veilColor, setVeilColor] = useState(ACCENT.bc)
  const [trail, setTrail] = useState<{ seg: number; key: number } | null>(null)
  const [burst, setBurst] = useState<{ w: W; key: number } | null>(null)
  const ctrls = useRef<AnimationPlaybackControls[]>([])
  const timers = useRef<number[]>([])
  const gen = useRef(0)
  const cur = useRef({ index, map, notesOpen, ready: false })

  const target = useCallback((i: number, m: boolean, notes: boolean) => {
    const area = usableArea(window.innerWidth, window.innerHeight, m ? false : notes)
    const t = m ? mapFit(area) : fitRect(nodeRect(NODES[i]), area)
    return { t, area, p: m ? MAP_PITCH : 0, r: m ? MAP_ROT : 0 }
  }, [])

  const stopAll = () => {
    ctrls.current.forEach((c) => c.stop())
    ctrls.current = []
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const setPhase = (fn: (i: number) => NodePhase) => setPhases(NODES.map((_, i) => fn(i)))

  const applyArea = (area: ReturnType<typeof usableArea>) => {
    onArea(`${area.left},${area.top},${area.width},${area.height}`)
    return { cx: area.left + area.width / 2, cy: area.top + area.height / 2 }
  }

  const finish = (g: number, arrivalIndex: number | null, toMap: boolean) => {
    if (g !== gen.current) return
    rot.set(toMap ? MAP_ROT : 0); pitch.set(toMap ? MAP_PITCH : 0); yaw.set(0); blur.set(0); veil.set(0)
    setFlying(false)
    if (arrivalIndex !== null) setPhase((i) => (i === arrivalIndex ? 'active' : 'idle'))
    onSettled(true)
  }

  /** Coloca la cámara sin animación (arranque, resize). */
  const snap = useCallback((i: number, m: boolean, notes: boolean, settle = true) => {
    stopAll()
    const { t, area, p, r } = target(i, m, notes)
    const c = applyArea(area)
    fx.set(t.fx); fy.set(t.fy); s.set(t.s); rot.set(r); pitch.set(p); yaw.set(0); blur.set(0); veil.set(0); acx.set(c.cx); acy.set(c.cy)
    gen.current++
    setFlying(false)
    onWorldShift(m ? -1 : i)
    onSettled(settle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  const fly = useCallback((from: number, to: number, fromMap: boolean, toMap: boolean, notes: boolean) => {
    stopAll()
    const g = ++gen.current
    onSettled(false)
    const { t, area, p: tp, r: tr } = target(to, toMap, notes)
    const c = applyArea(area)
    const s0 = s.get(), fx0 = fx.get(), fy0 = fy.get(), p0 = pitch.get(), r0 = rot.get(), y0 = yaw.get()
    const fromW = NODES[from].world
    const toW = NODES[to].world
    const dir = Math.sign(t.fx - fx0) || 1
    // Una sola animación viva por motion value: si un estilo la redefine, reemplaza a la base.
    const byValue = new Map<MotionValue<number>, AnimationPlaybackControls>()
    const go = (mv: MotionValue<number>, kf: number[] | number, opts: Parameters<typeof animate>[2]) => {
      byValue.get(mv)?.stop()
      byValue.set(mv, animate(mv, kf as never, opts as never))
    }
    const later = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(() => { if (g === gen.current) fn() }, ms))
    }
    /** Inclinación o giro que sale de donde está la cámara, pasa por los picos y aterriza en el destino. */
    const swing = (mv: MotionValue<number>, from0: number, peaks: number[], end: number, d: number, times?: number[]) => {
      const kf = [from0, ...peaks, end]
      go(mv, kf, { duration: d, times: times ?? kf.map((_, k) => k / (kf.length - 1)), ease: 'easeInOut' })
    }

    if (!toMap) setPhase((i) => (i === to ? 'incoming' : 'idle'))

    // ——— Reduced motion: cross-fade simple ———
    if (reduced) {
      const out = animate(fade, 0, { duration: 0.16 })
      ctrls.current = [out]
      later(170, () => {
        fx.set(t.fx); fy.set(t.fy); s.set(t.s); rot.set(tr); pitch.set(tp); yaw.set(0); blur.set(0); veil.set(0); acx.set(c.cx); acy.set(c.cy)
        onWorldShift(toMap ? -1 : to)
        const back = animate(fade, 1, { duration: 0.24 })
        ctrls.current.push(back)
        back.finished.then(() => finish(g, toMap ? null : to, toMap), () => undefined)
      })
      return
    }

    setFlying(true)
    go(acx, c.cx, { duration: 0.5, ease: 'easeInOut' })
    go(acy, c.cy, { duration: 0.5, ease: 'easeInOut' })
    go(rot, tr, { duration: 0.5 })
    go(pitch, tp, { duration: 0.6, ease: 'easeInOut' })
    go(yaw, 0, { duration: 0.5 })
    go(blur, 0, { duration: 0.3 })
    go(veil, 0, { duration: 0.3 })

    const E: [number, number, number, number] = [0.65, 0, 0.35, 1]
    let dur = 1.3
    let worldShiftAt = 0.5
    const hop = (depth: number, d: number) => {
      dur = d
      const low = Math.min(s0, t.s) * depth
      go(fx, t.fx, { duration: d, ease: E })
      go(fy, t.fy, { duration: d, ease: E })
      go(s, [s0, low, t.s], { duration: d, times: [0, 0.5, 1], ease: ['easeInOut', [0.16, 1, 0.3, 1]] })
    }
    const viaOverview = (ov: CameraTarget, d: number, times: number[]) => {
      dur = d
      go(fx, [fx0, ov.fx, ov.fx, t.fx], { duration: d, times, ease: ['easeInOut', 'linear', [0.3, 0, 0.1, 1]] })
      go(fy, [fy0, ov.fy, ov.fy, t.fy], { duration: d, times, ease: ['easeInOut', 'linear', [0.3, 0, 0.1, 1]] })
      go(s, [s0, ov.s, ov.s, t.s], { duration: d, times, ease: ['easeInOut', 'linear', [0.3, 0, 0.1, 1]] })
    }

    if (fromMap || toMap) {
      // ——— Mapa: la mesa se inclina y gira mientras la cámara sube (o baja en picada a un nodo) ———
      dur = toMap ? 1.5 : 1.45
      worldShiftAt = 0.3
      go(fx, t.fx, { duration: dur, ease: [0.45, 0, 0.2, 1] })
      go(fy, t.fy, { duration: dur, ease: [0.45, 0, 0.2, 1] })
      go(s, toMap ? [s0, t.s * 0.92, t.s] : [s0, t.s * 1.08, t.s], { duration: dur, times: [0, 0.8, 1], ease: [[0.5, 0, 0.2, 1], 'easeOut'] })
      swing(pitch, p0, toMap ? [MAP_PITCH + 8] : [MAP_PITCH * 0.6, -6], tp, dur, toMap ? [0, 0.75, 1] : [0, 0.45, 0.85, 1])
      swing(rot, r0, [toMap ? MAP_ROT - 8 : 4], tr, dur, [0, 0.6, 1])
      swing(yaw, y0, [dir * (toMap ? 10 : -8)], 0, dur)
    } else if (fromW === 'lobby' && toW !== 'lobby') {
      // ——— Portal: onda expansiva, picada hacia el portal, velo, constelación inclinada, aterrizaje ———
      dur = 2.8
      worldShiftAt = 0.36
      setVeilColor(ACCENT[toW])
      setBurst({ w: toW, key: g })
      const pt = PORTALS[toW]
      const ov = fitRect(worldBounds(toW), area)
      const times = [0, 0.34, 0.345, 0.6, 1]
      const ease = ['easeIn', 'linear', 'easeOut', [0.3, 0, 0.1, 1]] as NonNullable<Parameters<typeof animate>[2]>['ease']
      go(fx, [fx0, pt.x, ov.fx, ov.fx, t.fx], { duration: dur, times, ease })
      go(fy, [fy0, pt.y, ov.fy, ov.fy, t.fy], { duration: dur, times, ease })
      go(s, [s0, s0 * 3.4, ov.s * 0.7, ov.s * 0.95, t.s], { duration: dur, times, ease: [[0.5, 0, 0.9, 0.6], 'linear', 'easeOut', [0.3, 0, 0.1, 1]] })
      go(pitch, [p0, 58, 44, 36, 0], { duration: dur, times, ease })
      go(yaw, [y0, 0, dir * 14, dir * 6, 0], { duration: dur, times, ease: ['linear', 'linear', 'easeOut', 'easeInOut'] })
      go(rot, [r0, 0, dir * -6, dir * -3, 0], { duration: dur, times, ease: ['linear', 'linear', 'easeOut', 'easeInOut'] })
      go(veil, [0, 0, 1, 1, 0, 0], { duration: dur, times: [0, 0.14, 0.3, 0.42, 0.58, 1], ease: 'easeInOut' })
      go(blur, [0, 0, 5, 0, 0], { duration: dur, times: [0, 0.18, 0.33, 0.4, 1] })
    } else if (toW === 'lobby' && fromW !== 'lobby') {
      // ——— Regreso: sube en 3D hasta ver la constelación y vuela al lobby con rebote suave ———
      dur = 2.5
      worldShiftAt = 0.5
      const ov = fitRect(worldBounds(fromW), area)
      const times = [0, 0.36, 0.46, 0.9, 1]
      go(fx, [fx0, ov.fx, ov.fx, t.fx, t.fx], { duration: dur, times, ease: ['easeInOut', 'linear', [0.4, 0, 0.1, 1], 'linear'] })
      go(fy, [fy0, ov.fy, ov.fy, t.fy, t.fy], { duration: dur, times, ease: ['easeInOut', 'linear', [0.4, 0, 0.1, 1], 'linear'] })
      go(s, [s0, ov.s * 0.9, ov.s * 0.82, t.s * 1.05, t.s], { duration: dur, times, ease: ['easeInOut', 'linear', [0.4, 0, 0.2, 1], 'easeInOut'] })
      go(pitch, [p0, 46, 46, 10, 0], { duration: dur, times, ease: ['easeInOut', 'linear', [0.4, 0, 0.2, 1], 'easeInOut'] })
      go(yaw, [y0, dir * -10, dir * -10, dir * 4, 0], { duration: dur, times, ease: 'easeInOut' })
    } else if (fromW !== toW) {
      // ——— Salto entre propuestas: pasa por la mesa completa inclinada ———
      worldShiftAt = 0.45
      const ov = mapFit(area)
      viaOverview({ ...ov, s: ov.s * 1.1 }, 2.9, [0, 0.36, 0.5, 1])
      go(pitch, [p0, MAP_PITCH, MAP_PITCH, 0], { duration: 2.9, times: [0, 0.36, 0.5, 1], ease: 'easeInOut' })
      go(rot, [r0, MAP_ROT, MAP_ROT, 0], { duration: 2.9, times: [0, 0.36, 0.5, 1], ease: 'easeInOut' })
    } else if (Math.abs(to - from) !== 1) {
      hop(0.3, 1.8)
      swing(pitch, p0, [34], 0, 1.8)
      swing(yaw, y0, [dir * -12], 0, 1.8)
    } else {
      switch (FLAVORS[Math.min(from, to)]) {
        case 'panRight':
          hop(0.72, 1.3)
          swing(yaw, y0, [dir * -18], 0, 1.3)
          swing(pitch, p0, [14], 0, 1.3)
          break
        case 'zoomThrough':
          dur = 1.65
          go(fx, t.fx, { duration: dur, ease: E })
          go(fy, t.fy, { duration: dur, ease: E })
          go(s, [s0, s0 * 0.3, t.s * 1.08, t.s], { duration: dur, times: [0, 0.45, 0.86, 1], ease: ['easeIn', 'easeOut', 'easeInOut'] })
          swing(pitch, p0, [40], 0, dur, [0, 0.45, 1])
          break
        case 'diagonalTilt':
          hop(0.6, 1.5)
          go(rot, [r0, -3, 0], { duration: 1.5, times: [0, 0.35, 1], ease: ['easeOut', 'easeInOut'] })
          swing(pitch, p0, [24], 0, 1.5)
          swing(yaw, y0, [12], 0, 1.5)
          break
        case 'tiltRight':
          hop(0.55, 1.5)
          go(rot, [r0, 3, 0], { duration: 1.5, times: [0, 0.4, 1], ease: ['easeOut', 'easeInOut'] })
          swing(pitch, p0, [24], 0, 1.5)
          swing(yaw, y0, [-12], 0, 1.5)
          break
        case 'worldView': {
          const ov = fitRect(worldBounds(toW), area)
          viaOverview(ov, 2.3, [0, 0.4, 0.58, 1])
          go(pitch, [p0, 44, 44, 0], { duration: 2.3, times: [0, 0.4, 0.58, 1], ease: 'easeInOut' })
          go(yaw, [y0, dir * 8, dir * -8, 0], { duration: 2.3, times: [0, 0.4, 0.58, 1], ease: 'easeInOut' })
          break
        }
        case 'dropOvershoot':
          dur = 1.4
          go(fx, t.fx, { type: 'spring', stiffness: 55, damping: 9.5, mass: 1, restDelta: 0.5, restSpeed: 2 })
          go(fy, t.fy, { type: 'spring', stiffness: 55, damping: 9.5, mass: 1, restDelta: 0.5, restSpeed: 2 })
          go(s, [s0, Math.min(s0, t.s) * 0.62, t.s], { duration: 1.3, times: [0, 0.45, 1], ease: ['easeOut', [0.34, 1.4, 0.64, 1]] })
          swing(pitch, p0, [30, -7], 0, dur, [0, 0.45, 0.8, 1])
          break
        case 'slideBlur':
          hop(0.8, 1.15)
          go(blur, [0, 9, 0], { duration: 1.15, times: [0, 0.5, 1], ease: ['easeIn', 'easeOut'] })
          swing(yaw, y0, [dir * -26], 0, 1.15)
          break
        case 'zoomStrong': {
          dur = 1.7
          const times = [0, 0.4, 0.78, 1]
          go(fx, [fx0, (fx0 + t.fx) / 2, t.fx, t.fx], { duration: dur, times, ease: ['easeIn', 'easeOut', 'linear'] })
          go(fy, [fy0, (fy0 + t.fy) / 2, t.fy, t.fy], { duration: dur, times, ease: ['easeIn', 'easeOut', 'linear'] })
          go(s, [s0, s0 * 0.45, t.s * 1.9, t.s], { duration: dur, times, ease: ['easeInOut', 'easeIn', [0.16, 1, 0.3, 1]] })
          swing(pitch, p0, [26], 0, dur, [0, 0.4, 1])
          swing(yaw, y0, [dir * -10], 0, dur, [0, 0.4, 1])
          break
        }
        default:
          hop(0.6, 1.3)
      }
    }

    const run = [...byValue.values()]
    if (!fromMap && !toMap && fromW === toW && Math.abs(to - from) === 1) setTrail({ seg: Math.min(from, to), key: g })
    ctrls.current = run
    later(dur * worldShiftAt * 1000, () => onWorldShift(toMap ? -1 : to))
    if (!toMap) later(dur * 640, () => setPhase((i) => (i === to ? 'active' : 'idle')))
    else setPhase(() => 'idle')
    Promise.all(run.map((r) => r.finished.catch(() => undefined))).then(() => finish(g, toMap ? null : to, toMap))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, target])

  // Arranque: esperar fuentes para no "saltar".
  useLayoutEffect(() => {
    snap(index, map, notesOpen, false)
    let cancelled = false
    const start = () => {
      if (cancelled) return
      cur.current.ready = true
      snap(cur.current.index, cur.current.map, cur.current.notesOpen)
      animate(fade, 1, { duration: reduced ? 0.2 : 0.7 })
      setPhase((i) => (i === cur.current.index && !cur.current.map ? 'active' : 'idle'))
    }
    const fonts = document.fonts?.ready ?? Promise.resolve()
    Promise.race([fonts, new Promise((r) => setTimeout(r, 2500))]).then(start)
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cambios de nodo / mapa / notas.
  useEffect(() => {
    const prev = cur.current
    if (!prev.ready) { cur.current = { index, map, notesOpen, ready: false }; return }
    if (prev.index === index && prev.map === map && prev.notesOpen === notesOpen) return
    const fromIdx = prev.index
    const fromMap = prev.map
    cur.current = { index, map, notesOpen, ready: true }
    if (fromIdx === index && fromMap === map) {
      // Solo cambió el panel de notas: re-centrar suave.
      stopAll()
      const g = ++gen.current
      onSettled(false)
      const { t, area, p, r } = target(index, map, notesOpen)
      const c = applyArea(area)
      const d = reduced ? 0.01 : 0.45
      const run = [fx, fy, s].map((mv, k) => animate(mv, [t.fx, t.fy, t.s][k], { duration: d, ease: 'easeInOut' }))
      run.push(animate(acx, c.cx, { duration: d }), animate(acy, c.cy, { duration: d }), animate(rot, r, { duration: d }), animate(pitch, p, { duration: d }), animate(yaw, 0, { duration: d }), animate(veil, 0, { duration: d }), animate(blur, 0, { duration: d }))
      ctrls.current = run
      Promise.all(run.map((x) => x.finished.catch(() => undefined))).then(() => finish(g, map ? null : index, map))
      return
    }
    fly(fromIdx, index, fromMap, map, notesOpen)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, map, notesOpen])

  // Resize: recolocar al instante.
  useEffect(() => {
    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!cur.current.ready) return
        const c = cur.current
        snap(c.index, c.map, c.notesOpen)
        if (!c.map) setPhase((i) => (i === c.index ? 'active' : 'idle'))
      })
    }
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap])

  useEffect(() => () => stopAll(), [])

  return (
    <>
      <div className="canvas-bg" aria-hidden>
        <div className="absolute inset-0 overflow-hidden">
          <div className="glow gold" />
          <div className="glow cian" />
          <div className="glow silver" />
        </div>
        <div className="grain" />
        <div className="vignette" />
      </div>
      <motion.div className="fixed inset-0 overflow-hidden" style={{ opacity: fade, perspective: PERSPECTIVE, perspectiveOrigin: origin }}>
        <motion.div className={`${reduced ? '' : 'sway'} ${map && !reduced ? 'sway-map' : ''} absolute left-0 top-0 h-full w-full`} style={{ transformOrigin: origin, transformStyle: 'preserve-3d' }}>
          <motion.div
            data-world-layer
            className="absolute left-0 top-0"
            style={{ transform, filter, transformOrigin: '0 0', transformStyle: 'preserve-3d', willChange: flying ? 'transform' : 'auto', width: 1, height: 1 }}
          >
            {/* Rejilla del piso: aparece cuando la cámara se inclina */}
            <motion.svg aria-hidden className="absolute" style={{ left: GRID.left, top: GRID.top, width: GRID.width, height: GRID.height, opacity: gridOpacity, display: gridDisplay }} viewBox={`0 0 ${GRID.width} ${GRID.height}`}>
              <defs>
                <pattern id="grid" width="500" height="500" patternUnits="userSpaceOnUse">
                  <path d="M500 0H0V500" fill="none" stroke="#D9DEE7" strokeOpacity="0.11" strokeWidth="7" />
                </pattern>
                <radialGradient id="grid-fade">
                  <stop offset="0.35" stopColor="#fff" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
                <mask id="grid-mask"><rect width={GRID.width} height={GRID.height} fill="url(#grid-fade)" /></mask>
              </defs>
              <rect width={GRID.width} height={GRID.height} fill="url(#grid)" mask="url(#grid-mask)" />
            </motion.svg>

            {/* Estrellas en tres profundidades: parallax real cuando la cámara vuela */}
            {STAR_LAYERS.map((layer) => (
              <svg key={layer.z} aria-hidden className={`absolute left-0 top-0 overflow-visible ${reduced ? '' : layer.cls}`} width="1" height="1" style={{ transform: `translateZ(${layer.z}px)` }}>
                {layer.stars.map((st, k) => (
                  <circle key={k} cx={st.x} cy={st.y} r={st.r * layer.k * (map ? 2.2 : 1)} fill={st.tone < 0.2 ? ACCENT.bc : st.tone > 0.82 ? ACCENT.cu : '#EFEAE0'} opacity={st.o} />
                ))}
              </svg>
            ))}

            <Floor map={map} reduced={reduced} />

            <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1" aria-hidden>
              {trail && !map && SEGMENT[trail.seg] && (
                <motion.path key={trail.key} d={SEGMENT[trail.seg].d} fill="none" stroke={SEGMENT[trail.seg].color} strokeWidth={10} strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 1 }} animate={{ pathLength: 1, opacity: [1, 1, 0.35] }}
                  transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }} style={{ filter: `drop-shadow(0 0 18px ${SEGMENT[trail.seg].color})` }} />
              )}
            </svg>

            <SkyPaths map={map} />

            {LABELS.map((lb) => (
              <motion.div key={lb.w} aria-hidden className={`w-${lb.w} map-label pointer-events-none absolute whitespace-nowrap text-center`}
                style={{ left: lb.x, top: lb.y, transformOrigin: '50% 100%', transform: `translate3d(-50%, -100%, ${LABEL_Z}px) rotateX(${-MAP_PITCH}deg)` }}
                initial={false} animate={{ opacity: map ? 1 : 0 }} transition={{ duration: 0.6, delay: map ? 0.5 : 0 }}>
                <span className="block font-sans text-[110px] font-semibold uppercase tracking-[0.3em] text-acc">{WORLDS[lb.w].label} · {lb.w === 'bc' ? 'rampa' : 'escalera'}</span>
                <span className="block font-display text-[300px] font-semibold leading-none text-paper">{WORLDS[lb.w].name}</span>
              </motion.div>
            ))}

            {burst && !reduced && (
              <div key={burst.key} aria-hidden className={`w-${burst.w} absolute`} style={{ left: PORTALS[burst.w].x, top: PORTALS[burst.w].y, transform: 'translateZ(30px)' }}>
                {[0, 0.14, 0.28].map((dl) => (
                  <motion.span key={dl} className="burst-ring" initial={{ scale: 0.3, opacity: 0.95 }} animate={{ scale: 7, opacity: 0 }} transition={{ duration: 1.1, delay: dl, ease: [0.16, 1, 0.3, 1] }} />
                ))}
              </div>
            )}

            {NODES.map((node, i) => (
              <Node key={node.key} node={node} i={i} phase={map ? 'idle' : phases[i]} map={map} current={i === index} onEnter={onEnter} />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-10"
        style={{ opacity: veil, background: `radial-gradient(circle at 50% 50%, ${veilColor}ee 0%, ${veilColor}88 30%, #10151f 78%)` }}
      />
    </>
  )
}
