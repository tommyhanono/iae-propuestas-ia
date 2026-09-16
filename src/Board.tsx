import {
  animate, motion, useMotionValue, useTransform,
  type AnimationPlaybackControls, type MotionValue,
} from 'framer-motion'
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ACCENT, FLAVORS, LOBBY, NODES, PORTALS, RANGE, WORLDS, type NodeMeta } from './data'
import { StageCtx, groupV, type Phase } from './components/primitives'
import {
  MAP_BOUNDS, arcPath, chainPaths, fitRect, nodeRect, starField, usableArea, worldBounds,
} from './lib/geometry'
import { NODE_VIEWS } from './views'
import { useReduced } from './lib/useReduced'

type NodePhase = 'idle' | 'incoming' | 'active'

const BC_NODES = NODES.filter((n) => n.world === 'bc')
const CU_NODES = NODES.filter((n) => n.world === 'cu')
const BC_PATHS = chainPaths(BC_NODES)
const CU_PATHS = chainPaths(CU_NODES)
/** Tramo de cadena por índice global menor del par vecino. */
const SEGMENT: Record<number, { d: string; color: string }> = {}
BC_PATHS.forEach((d, k) => { SEGMENT[RANGE.bc.first + k] = { d, color: ACCENT.bc } })
CU_PATHS.forEach((d, k) => { SEGMENT[RANGE.cu.first + k] = { d, color: ACCENT.cu } })
const L = NODES[LOBBY]
const LINKS = [
  { d: arcPath({ x: L.x - L.w / 2, y: L.y - 120 }, NODES[RANGE.bc.first], -0.18), color: ACCENT.bc, dashed: false },
  { d: arcPath(NODES[RANGE.bc.last], { x: L.x - L.w / 2, y: L.y + 160 }, -0.25), color: ACCENT.bc, dashed: true },
  { d: arcPath({ x: L.x + L.w / 2, y: L.y - 120 }, NODES[RANGE.cu.first], 0.18), color: ACCENT.cu, dashed: false },
  { d: arcPath(NODES[RANGE.cu.last], { x: L.x + L.w / 2, y: L.y + 160 }, 0.25), color: ACCENT.cu, dashed: true },
]
const STARS = starField(MAP_BOUNDS, 280)
const LABELS = (['bc', 'cu'] as const).map((w) => {
  const b = worldBounds(w)
  return { w, x: b.left + b.width / 2, y: b.top - 150 }
})

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
      animate={{ opacity: map ? 1 : active ? 1 : 0.18, scale: map || active ? 1 : 0.96 }}
      transition={{ duration: 0.6, ease: [0.22, 0.9, 0.3, 1] }}
    >
      <StageCtx.Provider value={{ run: phase === 'active' && !map, compact: false }}>
        <motion.div className="node-inner" variants={groupV} initial={false} animate={content} inert={map || !active}>
          <View />
        </motion.div>
      </StageCtx.Provider>
      {map && current && <div aria-hidden className="pointer-events-none absolute -inset-12 rounded-[60px] border-[18px] border-acc/80" />}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 rounded-[28px]"
        style={{ background: 'radial-gradient(closest-side, rgb(16 21 31 / 0.92), rgb(16 21 31 / 0.76))' }}
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

export default function Board({ index, map, notesOpen, onEnter, onSettled, onArea, onWorldShift }: Props) {
  const reduced = useReduced()
  const fx = useMotionValue(0)
  const fy = useMotionValue(0)
  const s = useMotionValue(0.2)
  const rot = useMotionValue(0)
  const blur = useMotionValue(0)
  const acx = useMotionValue(0)
  const acy = useMotionValue(0)
  const fade = useMotionValue(0)
  const veil = useMotionValue(0)
  const transform = useTransform([fx, fy, s, rot, acx, acy] as MotionValue<number>[], ([x, y, k, r, cx, cy]: number[]) =>
    `translate3d(${cx}px, ${cy}px, 0) rotate(${r}deg) scale(${k}) translate3d(${-x}px, ${-y}px, 0)`)
  const filter = useTransform(blur, (b) => (b > 0.05 ? `blur(${b}px)` : 'none'))
  const glowX = useTransform(fx, (v) => v * -0.006)
  const glowY = useTransform(fy, (v) => v * -0.006)

  const [phases, setPhases] = useState<NodePhase[]>(() => NODES.map((_, i) => (i === index ? 'incoming' : 'idle')))
  const [flying, setFlying] = useState(false)
  const [veilColor, setVeilColor] = useState(ACCENT.bc)
  const [trail, setTrail] = useState<{ seg: number; key: number } | null>(null)
  const ctrls = useRef<AnimationPlaybackControls[]>([])
  const timers = useRef<number[]>([])
  const gen = useRef(0)
  const cur = useRef({ index, map, notesOpen, ready: false })

  const target = useCallback((i: number, m: boolean, notes: boolean) => {
    const area = usableArea(window.innerWidth, window.innerHeight, m ? false : notes)
    const t = fitRect(m ? MAP_BOUNDS : nodeRect(NODES[i]), area)
    return { t, area }
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

  const finish = (g: number, arrivalIndex: number | null) => {
    if (g !== gen.current) return
    rot.set(0); blur.set(0); veil.set(0)
    setFlying(false)
    if (arrivalIndex !== null) setPhase((i) => (i === arrivalIndex ? 'active' : 'idle'))
    onSettled(true)
  }

  /** Coloca la cámara sin animación (arranque, resize). */
  const snap = useCallback((i: number, m: boolean, notes: boolean, settle = true) => {
    stopAll()
    const { t, area } = target(i, m, notes)
    const c = applyArea(area)
    fx.set(t.fx); fy.set(t.fy); s.set(t.s); rot.set(0); blur.set(0); veil.set(0); acx.set(c.cx); acy.set(c.cy)
    gen.current++
    setFlying(false)
    onWorldShift(i)
    onSettled(settle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  const fly = useCallback((from: number, to: number, fromMap: boolean, toMap: boolean, notes: boolean) => {
    stopAll()
    const g = ++gen.current
    onSettled(false)
    const { t, area } = target(to, toMap, notes)
    const c = applyArea(area)
    const s0 = s.get(), fx0 = fx.get(), fy0 = fy.get()
    const fromW = NODES[from].world
    const toW = NODES[to].world
    // Una sola animación viva por motion value: si un estilo la redefine, reemplaza a la base.
    const byValue = new Map<MotionValue<number>, AnimationPlaybackControls>()
    const go = (mv: MotionValue<number>, kf: number[] | number, opts: Parameters<typeof animate>[2]) => {
      byValue.get(mv)?.stop()
      byValue.set(mv, animate(mv, kf as never, opts as never))
    }
    const later = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(() => { if (g === gen.current) fn() }, ms))
    }

    if (!toMap) setPhase((i) => (i === to ? 'incoming' : 'idle'))

    // ——— Reduced motion: cross-fade simple ———
    if (reduced) {
      const out = animate(fade, 0, { duration: 0.16 })
      ctrls.current = [out]
      later(170, () => {
        fx.set(t.fx); fy.set(t.fy); s.set(t.s); rot.set(0); blur.set(0); veil.set(0); acx.set(c.cx); acy.set(c.cy)
        onWorldShift(toMap ? -1 : to)
        const back = animate(fade, 1, { duration: 0.24 })
        ctrls.current.push(back)
        back.finished.then(() => finish(g, toMap ? null : to), () => undefined)
      })
      return
    }

    setFlying(true)
    go(acx, c.cx, { duration: 0.5, ease: 'easeInOut' })
    go(acy, c.cy, { duration: 0.5, ease: 'easeInOut' })
    go(rot, 0, { duration: 0.4 })
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
    const viaOverview = (ov: { fx: number; fy: number; s: number }, d: number, times: number[]) => {
      dur = d
      go(fx, [fx0, ov.fx, ov.fx, t.fx], { duration: d, times, ease: ['easeInOut', 'linear', [0.3, 0, 0.1, 1]] })
      go(fy, [fy0, ov.fy, ov.fy, t.fy], { duration: d, times, ease: ['easeInOut', 'linear', [0.3, 0, 0.1, 1]] })
      go(s, [s0, ov.s, ov.s, t.s], { duration: d, times, ease: ['easeInOut', 'linear', [0.3, 0, 0.1, 1]] })
    }

    if (fromMap || toMap) {
      dur = toMap ? 1.1 : 1.25
      worldShiftAt = 0.3
      go(fx, t.fx, { duration: dur, ease: [0.45, 0, 0.2, 1] })
      go(fy, t.fy, { duration: dur, ease: [0.45, 0, 0.2, 1] })
      go(s, toMap ? t.s : [s0, t.s * 1.06, t.s], toMap
        ? { duration: dur, ease: [0.45, 0, 0.2, 1] }
        : { duration: dur, times: [0, 0.8, 1], ease: [[0.5, 0, 0.2, 1], 'easeOut'] })
    } else if (fromW === 'lobby' && toW !== 'lobby') {
      // ——— Portal: empuje hacia el portal, velo del color del mundo, constelación, aterrizaje ———
      dur = 2.6
      worldShiftAt = 0.36
      setVeilColor(ACCENT[toW])
      const p = PORTALS[toW]
      const ov = fitRect(worldBounds(toW), area)
      const times = [0, 0.34, 0.345, 0.58, 1]
      go(fx, [fx0, p.x, ov.fx, ov.fx, t.fx], { duration: dur, times, ease: ['easeIn', 'linear', 'easeOut', [0.3, 0, 0.1, 1]] })
      go(fy, [fy0, p.y, ov.fy, ov.fy, t.fy], { duration: dur, times, ease: ['easeIn', 'linear', 'easeOut', [0.3, 0, 0.1, 1]] })
      go(s, [s0, s0 * 3.4, ov.s * 0.8, ov.s, t.s], { duration: dur, times, ease: [[0.5, 0, 0.9, 0.6], 'linear', 'easeOut', [0.3, 0, 0.1, 1]] })
      go(veil, [0, 0, 1, 1, 0, 0], { duration: dur, times: [0, 0.16, 0.33, 0.38, 0.56, 1], ease: 'easeInOut' })
      go(blur, [0, 0, 5, 0, 0], { duration: dur, times: [0, 0.18, 0.33, 0.4, 1] })
    } else if (toW === 'lobby' && fromW !== 'lobby') {
      // ——— Regreso: alejarse hasta ver la constelación y volar al lobby con rebote suave ———
      dur = 2.3
      worldShiftAt = 0.5
      const ov = fitRect(worldBounds(fromW), area)
      const times = [0, 0.36, 0.46, 0.9, 1]
      go(fx, [fx0, ov.fx, ov.fx, t.fx, t.fx], { duration: dur, times, ease: ['easeInOut', 'linear', [0.4, 0, 0.1, 1], 'linear'] })
      go(fy, [fy0, ov.fy, ov.fy, t.fy, t.fy], { duration: dur, times, ease: ['easeInOut', 'linear', [0.4, 0, 0.1, 1], 'linear'] })
      go(s, [s0, ov.s, ov.s * 0.92, t.s * 1.05, t.s], { duration: dur, times, ease: ['easeInOut', 'linear', [0.4, 0, 0.2, 1], 'easeInOut'] })
    } else if (fromW !== toW) {
      // ——— Salto entre propuestas: pasa por la vista de todo el tablero ———
      worldShiftAt = 0.45
      viaOverview({ ...fitRect(MAP_BOUNDS, area), s: fitRect(MAP_BOUNDS, area).s * 1.12 }, 2.7, [0, 0.36, 0.5, 1])
    } else if (Math.abs(to - from) !== 1) {
      hop(0.3, 1.7)
    } else {
      switch (FLAVORS[Math.min(from, to)]) {
        case 'panRight':
          hop(0.72, 1.15)
          break
        case 'zoomThrough':
          dur = 1.55
          go(fx, t.fx, { duration: dur, ease: E })
          go(fy, t.fy, { duration: dur, ease: E })
          go(s, [s0, s0 * 0.3, t.s * 1.08, t.s], { duration: dur, times: [0, 0.45, 0.86, 1], ease: ['easeIn', 'easeOut', 'easeInOut'] })
          break
        case 'diagonalTilt':
          hop(0.6, 1.35)
          go(rot, [rot.get(), -2.2, 0], { duration: 1.35, times: [0, 0.35, 1], ease: ['easeOut', 'easeInOut'] })
          break
        case 'tiltRight':
          hop(0.55, 1.35)
          go(rot, [rot.get(), 2.2, 0], { duration: 1.35, times: [0, 0.4, 1], ease: ['easeOut', 'easeInOut'] })
          break
        case 'worldView': {
          const ov = fitRect(worldBounds(toW), area)
          viaOverview(ov, 2.1, [0, 0.4, 0.58, 1])
          break
        }
        case 'dropOvershoot':
          dur = 1.2
          go(fx, t.fx, { type: 'spring', stiffness: 55, damping: 9.5, mass: 1, restDelta: 0.5, restSpeed: 2 })
          go(fy, t.fy, { type: 'spring', stiffness: 55, damping: 9.5, mass: 1, restDelta: 0.5, restSpeed: 2 })
          go(s, [s0, Math.min(s0, t.s) * 0.62, t.s], { duration: 1.3, times: [0, 0.45, 1], ease: ['easeOut', [0.34, 1.4, 0.64, 1]] })
          break
        case 'slideBlur':
          hop(0.8, 1.0)
          go(blur, [0, 9, 0], { duration: 1.0, times: [0, 0.5, 1], ease: ['easeIn', 'easeOut'] })
          break
        case 'zoomStrong': {
          dur = 1.6
          const times = [0, 0.4, 0.78, 1]
          go(fx, [fx0, (fx0 + t.fx) / 2, t.fx, t.fx], { duration: dur, times, ease: ['easeIn', 'easeOut', 'linear'] })
          go(fy, [fy0, (fy0 + t.fy) / 2, t.fy, t.fy], { duration: dur, times, ease: ['easeIn', 'easeOut', 'linear'] })
          go(s, [s0, s0 * 0.45, t.s * 1.9, t.s], { duration: dur, times, ease: ['easeInOut', 'easeIn', [0.16, 1, 0.3, 1]] })
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
    Promise.all(run.map((r) => r.finished.catch(() => undefined))).then(() => finish(g, toMap ? null : to))
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
      const { t, area } = target(index, map, notesOpen)
      const c = applyArea(area)
      const d = reduced ? 0.01 : 0.45
      const run = [fx, fy, s].map((mv, k) => animate(mv, [t.fx, t.fy, t.s][k], { duration: d, ease: 'easeInOut' }))
      run.push(animate(acx, c.cx, { duration: d }), animate(acy, c.cy, { duration: d }), animate(rot, 0, { duration: d }), animate(veil, 0, { duration: d }), animate(blur, 0, { duration: d }))
      ctrls.current = run
      Promise.all(run.map((r) => r.finished.catch(() => undefined))).then(() => finish(g, map ? null : index))
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
        if (c.map) onWorldShift(-1)
        else setPhase((i) => (i === c.index ? 'active' : 'idle'))
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
        <motion.div className="absolute inset-0" style={reduced ? undefined : { x: glowX, y: glowY }}>
          <div className="glow gold" />
          <div className="glow cian" />
          <div className="glow silver" />
        </motion.div>
        <div className="grain" />
        <div className="vignette" />
      </div>
      <motion.div className="fixed inset-0 overflow-hidden" style={{ opacity: fade }}>
        <motion.div
          data-world-layer
          className="absolute left-0 top-0"
          style={{ transform, filter, transformOrigin: '0 0', willChange: flying ? 'transform' : 'auto', width: 1, height: 1 }}
        >
          <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1" aria-hidden>
            {STARS.map((st, k) => (
              <circle key={k} cx={st.x} cy={st.y} r={map ? st.r * 2.4 : st.r} fill={st.tone < 0.2 ? ACCENT.bc : st.tone > 0.82 ? ACCENT.cu : '#EFEAE0'} opacity={st.o} />
            ))}
            {LINKS.map((l, k) => (
              <path key={`l${k}`} d={l.d} fill="none" stroke={l.color} strokeOpacity={map ? 0.6 : 0.26} strokeWidth={map ? 16 : 6}
                strokeDasharray={l.dashed ? (map ? '4 60' : '2 26') : undefined} strokeLinecap="round" />
            ))}
            {[...BC_PATHS.map((d) => ({ d, c: ACCENT.bc })), ...CU_PATHS.map((d) => ({ d, c: ACCENT.cu }))].map((p, k) => (
              <path key={`p${k}`} d={p.d} fill="none" stroke={p.c} strokeOpacity={map ? 0.6 : 0.26} strokeWidth={map ? 14 : 7} strokeDasharray={map ? '2 46' : '2 30'} strokeLinecap="round" />
            ))}
            {trail && !map && SEGMENT[trail.seg] && (
              <motion.path key={trail.key} d={SEGMENT[trail.seg].d} fill="none" stroke={SEGMENT[trail.seg].color} strokeWidth={6} strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0.95 }} animate={{ pathLength: 1, opacity: [0.95, 0.95, 0.35] }}
                transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }} style={{ filter: `drop-shadow(0 0 12px ${SEGMENT[trail.seg].color})` }} />
            )}
          </svg>
          {LABELS.map((lb) => (
            <motion.div key={lb.w} aria-hidden className={`w-${lb.w} pointer-events-none absolute whitespace-nowrap text-center`}
              style={{ left: lb.x, top: lb.y, transform: 'translate(-50%, -100%)' }}
              initial={false} animate={{ opacity: map ? 1 : 0.1 }} transition={{ duration: 0.5 }}>
              <span className="block font-sans text-[120px] font-semibold uppercase tracking-[0.3em] text-acc">{WORLDS[lb.w].label}</span>
              <span className="block font-display text-[300px] font-semibold leading-none text-paper">{WORLDS[lb.w].name}</span>
            </motion.div>
          ))}
          {NODES.map((node, i) => (
            <Node key={node.key} node={node} i={i} phase={map ? 'idle' : phases[i]} map={map} current={i === index} onEnter={onEnter} />
          ))}
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
