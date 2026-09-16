import { animate, motion, type Variants } from 'framer-motion'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { COUNT, NODES, WORLDS } from '../data'
import { useReduced } from '../lib/useReduced'
import type { Visited } from '../lib/nav'

export type Phase = 'hidden' | 'show'

/** Contexto del nodo: si está recién llegando (para disparar gráficos y count-up). */
export const StageCtx = createContext<{ run: boolean; compact: boolean }>({ run: false, compact: false })
export const useStage = () => useContext(StageCtx)

/** Navegación disponible para el contenido (portales, "Volver al lobby"). */
export const NavCtx = createContext<{ go: (i: number) => void; openMap: () => void; visited: Visited }>({
  go: () => {}, openMap: () => {}, visited: { bc: false, cu: false },
})
export const useNav = () => useContext(NavCtx)

const EASE = [0.22, 0.9, 0.3, 1] as const

export const groupV: Variants = {
  hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}
export const itemV: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)', transition: { duration: 0.15 } },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE } },
}

type Box = { children?: ReactNode; className?: string; style?: React.CSSProperties }
export function G({ children, className, style }: Box) {
  return <motion.div variants={groupV} className={className} style={style}>{children}</motion.div>
}
export function R({ children, className, style }: Box) {
  return <motion.div variants={itemV} className={className} style={style}>{children}</motion.div>
}

export function Token({ ghost, className = '' }: { ghost?: boolean; className?: string }) {
  return <span aria-hidden className={`token ${ghost ? 'ghost' : ''} ${className}`} />
}

/** Encabezado de cada nodo: eyebrow con la propuesta y la posición, titular que es la conclusión. */
export function Header({ i, sub, className = '' }: { i: number; sub?: string; className?: string }) {
  const node = NODES[i]
  const w = node.world as 'bc' | 'cu'
  return (
    <G className={`mb-5 @4xl:mb-7 ${className}`}>
      <R className="flex items-center gap-3">
        <Token />
        <span className="eyebrow">
          {WORLDS[w].label} · {WORLDS[w].name} <span className="tabular text-muted">· {String(node.n).padStart(2, '0')}/{String(COUNT[w]).padStart(2, '0')}</span>
        </span>
      </R>
      <R><h2 className="h-title mt-2 @4xl:mt-3 text-balance">{node.title}</h2></R>
      {sub && <R><p className="h-sub mt-2 text-muted">{sub}</p></R>}
    </G>
  )
}

/** Punto clave con token de acento. */
export function Point({ lead, text, small }: { lead?: string; text: string; small?: boolean }) {
  return (
    <R className="flex gap-3">
      <Token className="mt-[0.45em]" />
      <p className={small ? 'body-sm' : 'body'}>
        {lead && <strong className="font-semibold text-paper">{lead}: </strong>}
        {text}
      </p>
    </R>
  )
}

export function CountUp({ value, format = String, delay = 0.35, duration = 1.2 }: { value: number; format?: (v: number) => string; delay?: number; duration?: number }) {
  const { run } = useStage()
  const reduced = useReduced()
  const [v, setV] = useState(value)
  useEffect(() => {
    if (!run || reduced) { setV(value); return }
    setV(0)
    const c = animate(0, value, { duration, delay, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [run, reduced, value, delay, duration])
  return <span className="tabular" aria-label={format(value)}><span aria-hidden>{format(v)}</span></span>
}

export function Chip({ k, v, className = '' }: { k?: string; v: string; className?: string }) {
  return (
    <R className={`panel flex items-center gap-3 px-4 py-2.5 @4xl:px-5 @4xl:py-3 ${className}`}>
      <Token ghost />
      <span className="body-sm">
        {k && <span className="label mr-2">{k}</span>}
        <span className="text-paper">{v}</span>
      </span>
    </R>
  )
}

const ICONS = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  back: 'M19 12H5M11 6l-6 6 6 6',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  map: 'M9 4L3 6.5v13.5L9 17.5l6 2.5 6-2.5V4l-6 2.5L9 4zM9 4v13.5M15 6.5V20',
  brain: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4H9zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4h1z',
  plug: 'M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8zM12 17v4',
  terminal: 'M4 5h16v14H4zM7.5 9.5l3 2.5-3 2.5M12.5 15h4',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
  spark: 'M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3',
  hammer: 'M14 4l6 6-3 3-6-6 3-3zM11 7l-7 7a2 2 0 0 0 3 3l7-7',
  people: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6 6 0 0 1 3 6',
  talk: 'M4 5h16v11H9l-5 4V5zM8 9.5h8M8 12.5h5',
  x: 'M6 6l12 12M18 6L6 18',
  grid: 'M4 4h16v16H4zM4 10h16M4 15h16M10 4v16M15 4v16',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5',
  school: 'M3 9l9-5 9 5-9 5-9-5zM7 11.5V16c0 1.5 2.5 3 5 3s5-1.5 5-3v-4.5M21 9v6',
} as const
export type IconName = keyof typeof ICONS

export function Svg({ name, size = 22, className = '', stroke = 1.8 }: { name: IconName; size?: number; className?: string; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d={ICONS[name]} />
    </svg>
  )
}

export function IconBadge({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <span className={`flex h-11 w-11 @4xl:h-14 @4xl:w-14 flex-none items-center justify-center rounded-full panel-acc panel text-acc ${className}`} aria-hidden>
      <Svg name={name} size={24} />
    </span>
  )
}
