import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ACCENT, COUNT, LOBBY, NODES, RANGE, WORLDS } from './data'
import { MAP_BOUNDS, chainControls, controlsToPath } from './lib/geometry'
import { useReduced } from './lib/useReduced'
import { Svg } from './components/primitives'

interface Props {
  index: number
  mobile: boolean
  map: boolean
  notesOpen: boolean
  helpOpen: boolean
  hasPrev: boolean
  nextLabel: string
  go: (i: number) => void
  next: () => void
  prev: () => void
  toggleMap: () => void
  toggleNotes: () => void
  toggleHelp: () => void
  fullscreen: () => void
}

function where(i: number, mobile: boolean) {
  const n = NODES[i]
  if (n.world === 'lobby') return mobile ? 'Lobby' : 'Lobby · elige una propuesta'
  const w = n.world
  const pos = `${String(n.n).padStart(2, '0')}/${String(COUNT[w]).padStart(2, '0')}`
  return mobile ? `${WORLDS[w].name} · ${pos}` : `${WORLDS[w].label} · ${WORLDS[w].name} · ${pos}`
}

export function Chrome(p: Props) {
  const { index, mobile, map, notesOpen, helpOpen, go } = p
  const node = NODES[index]
  const worldClass = map ? 'w-lobby' : `w-${node.world}`
  return (
    <div className={worldClass}>
      {/* Barra superior */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <img src="/favicon.svg" alt="" width="26" height="26" className="flex-none" />
          <span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.16em] text-paper/85 sm:text-[13px]">
            IA en el IAE <span className="hidden text-muted md:inline">· Dos propuestas</span>
          </span>
        </div>
        <span className="min-w-0 truncate text-right text-[12px] font-medium tracking-wide text-acc sm:text-[13px]" data-where>
          {map ? (mobile ? 'Mapa' : 'Mapa · las dos propuestas') : where(index, mobile)}
        </span>
      </header>

      {/* Notas del orador */}
      <AnimatePresence>
        {notesOpen && (
          <motion.aside
            key="notes"
            aria-label="Notas del orador"
            className="glass-ui fixed inset-x-3 z-30 overflow-y-auto rounded-2xl p-4 sm:inset-x-6 sm:p-5"
            style={{ bottom: mobile ? 84 : 92, maxHeight: mobile ? '45vh' : 'min(220px, 28vh)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="token" aria-hidden />
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-acc">Notas del orador · {node.world === 'lobby' ? 'Lobby' : `${WORLDS[node.world].name} ${node.n}`}</span>
            </div>
            <p className="font-display text-[16px] leading-relaxed text-paper sm:text-[19px]">{node.notes}</p>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Controles */}
      <nav aria-label="Navegación de la presentación" className="fixed inset-x-0 bottom-0 z-40 flex items-end justify-between gap-2 px-3 pb-3 sm:px-6 sm:pb-5">
        {mobile ? (
          <>
            <button className="btn glass-ui h-14 w-14 [@media(max-height:500px)]:h-11" onClick={p.prev} disabled={!p.hasPrev} aria-label="Anterior"><Svg name="back" size={22} /></button>
            <button className="btn glass-ui h-14 min-w-0 flex-1 px-3 text-[14px] font-semibold [@media(max-height:500px)]:h-11" onClick={p.toggleMap} aria-label="Abrir mapa de propuestas" aria-expanded={map}>
              <Svg name="map" /> <span className="truncate tabular">{node.world === 'lobby' ? 'Lobby' : <><span className="hidden min-[360px]:inline">{node.world === 'bc' ? 'Club' : 'Currículo'} </span>{node.n}/{COUNT[node.world]}</>}</span>
            </button>
            <button className={`btn glass-ui h-14 w-14 [@media(max-height:500px)]:h-11 ${notesOpen ? 'text-acc' : ''}`} onClick={p.toggleNotes} aria-label="Notas del orador" aria-pressed={notesOpen}><Svg name="talk" size={22} /></button>
            <button className="btn btn-acc h-14 w-14 [@media(max-height:500px)]:h-11" onClick={p.next} aria-label={p.nextLabel}><Svg name="arrow" size={22} /></button>
          </>
        ) : (
          <>
            <div className="flex gap-2">
              <button className={`btn glass-ui h-12 px-4 text-[14px] font-medium ${map ? 'text-acc' : ''}`} onClick={p.toggleMap} aria-pressed={map} title="Mapa (O)"><Svg name="map" /> Mapa</button>
              <button className={`btn glass-ui h-12 w-12 ${notesOpen ? 'text-acc' : ''}`} onClick={p.toggleNotes} aria-label="Notas del orador (N)" aria-pressed={notesOpen} title="Notas (N)"><Svg name="talk" /></button>
              <button className="btn glass-ui h-12 w-12" onClick={p.toggleHelp} aria-label="Ayuda de teclas (?)" title="Ayuda (?)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M9.2 9.2a2.9 2.9 0 1 1 4 2.7c-.8.4-1.2 1-1.2 1.9v.4M12 17.6v.1" /></svg>
              </button>
              <button className="btn glass-ui h-12 w-12" onClick={p.fullscreen} aria-label="Pantalla completa (F)" title="Pantalla completa (F)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
              </button>
            </div>
            <div className="glass-ui hidden items-center rounded-2xl px-2 lg:flex" role="group" aria-label="Estaciones">
              {NODES.map((s, i) => {
                const isCur = i === index && !map
                const done = s.world !== 'lobby' && node.world === s.world && i < index
                return (
                  <span key={s.key} className={`w-${s.world} flex items-center`}>
                    {(i === RANGE.bc.first || i === RANGE.cu.first) && <span aria-hidden className="mx-1 h-5 w-px bg-white/15" />}
                    <button
                      data-dot={s.key}
                      className="group relative flex h-11 w-8 items-center justify-center rounded-lg"
                      onClick={() => go(i)}
                      aria-label={i === LOBBY ? 'Ir al lobby' : `Ir a ${WORLDS[s.world].name} ${s.n}: ${s.short}`}
                      aria-current={isCur ? 'step' : undefined}
                    >
                      {i === LOBBY ? (
                        <span className={`block rounded-full border-2 transition-all duration-300 ${isCur ? 'h-4 w-4 border-silver bg-silver/40' : 'h-3 w-3 border-silver/60'}`} />
                      ) : (
                        <span className={`block rounded-full bg-acc transition-all duration-300 ${isCur ? 'h-3.5 w-3.5 shadow-[0_0_12px_var(--acc)]' : done ? 'h-2 w-2 opacity-70' : 'h-2 w-2 opacity-30 group-hover:opacity-70'}`} />
                      )}
                      <span className="pointer-events-none absolute bottom-full mb-2 hidden whitespace-nowrap rounded-lg bg-ink-2 px-2 py-1 text-[12px] text-paper group-hover:block group-focus-visible:block">
                        {i === LOBBY ? 'Lobby' : `${WORLDS[s.world].name} ${s.n} · ${s.short}`}
                      </span>
                    </button>
                  </span>
                )
              })}
            </div>
            <div className="flex gap-2">
              <button className="btn glass-ui h-12 w-12" onClick={p.prev} disabled={!p.hasPrev} aria-label="Anterior"><Svg name="back" size={20} /></button>
              <button className="btn btn-acc h-12 px-5 text-[14px] font-semibold" onClick={p.next} aria-label={p.nextLabel} data-next>
                {p.nextLabel} <Svg name="arrow" size={20} />
              </button>
            </div>
          </>
        )}
      </nav>

      {mobile && <MobileMap open={map} index={index} go={go} close={p.toggleMap} />}
      <Help open={helpOpen} close={p.toggleHelp} />
    </div>
  )
}

function MobileMap({ open, index, go, close }: { open: boolean; index: number; go: (i: number) => void; close: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="mm" className="fixed inset-0 z-50 flex flex-col bg-ink/80 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Mapa de propuestas" onClick={close}>
          <motion.div className="glass-ui mt-auto max-h-[88vh] overflow-y-auto rounded-t-3xl p-4 pb-6" initial={{ y: 60, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 60, scale: 0.96 }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-[22px] font-semibold">Mapa</span>
              <button className="btn" onClick={close} aria-label="Cerrar mapa"><Svg name="x" /></button>
            </div>
            <MiniMap index={index} />
            <button data-map-node="lobby" onClick={() => go(LOBBY)} className={`mb-3 flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 text-left ${index === LOBBY ? 'border-silver/60 bg-ink-3' : 'border-white/10 bg-ink-2/60'}`}>
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 border-silver/70" aria-hidden />
              <span className="text-[15px]">Lobby</span>
            </button>
            {(['bc', 'cu'] as const).map((w) => (
              <div key={w} className={`w-${w} mb-3`}>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-acc">{WORLDS[w].label} · {WORLDS[w].name}</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {NODES.map((s, i) => s.world === w && (
                    <button key={s.key} data-map-node={s.key} onClick={() => go(i)} className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 text-left ${i === index ? 'border-acc/60 bg-ink-3' : 'border-white/10 bg-ink-2/60'}`}>
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-acc font-display font-bold text-ink">{s.n}</span>
                      <span className="text-[15px]">{s.short}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Help({ open, close }: { open: boolean; close: () => void }) {
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => { if (open) btn.current?.focus() }, [open])
  const rows: [string, string][] = [
    ['→  ·  Espacio', 'Avanzar (en el lobby, entra a la propuesta que sigue)'],
    ['←', 'Retroceder'],
    ['L  ·  Inicio', 'Volver al lobby'],
    ['O', 'Mapa: las dos propuestas juntas'],
    ['Esc', 'Salir del mapa o de la ayuda'],
    ['N', 'Notas del orador'],
    ['F', 'Pantalla completa'],
    ['?', 'Esta ayuda'],
    ['Swipe', 'En el celular, desliza para avanzar'],
  ]
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="help" className="w-lobby fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} role="dialog" aria-modal="true" aria-labelledby="help-title">
          <motion.div className="glass-ui w-full max-w-lg rounded-3xl p-6" initial={{ scale: 0.94, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96 }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 id="help-title" className="font-display text-[26px] font-semibold">Teclas</h2>
              <button ref={btn} className="btn" onClick={close} aria-label="Cerrar ayuda"><Svg name="x" /></button>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-right"><kbd className="whitespace-nowrap rounded-md border border-white/15 bg-ink px-2 py-0.5 text-[13px] text-silver">{k}</kbd></dt>
                  <dd className="text-[15px] text-paper/90">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Mini mesa 3D para el celular: los dos caminos inclinados, con un pulso que recorre cada uno. */
function MiniMap({ index }: { index: number }) {
  const reduced = useReduced()
  const b = MAP_BOUNDS
  const L = NODES[LOBBY]
  const route = (w: 'bc' | 'cu') => {
    const side = w === 'bc' ? -1 : 1
    const pts = [{ x: L.x + side * (L.w / 2), y: L.y - 200 }, ...NODES.filter((n) => n.world === w).map((n) => ({ x: n.x, y: n.y })), { x: L.x + side * (L.w / 2), y: L.y + 240 }]
    return controlsToPath(chainControls(pts))
  }
  const paths = { bc: route('bc'), cu: route('cu') }
  return (
    <div aria-hidden className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-ink/60" style={{ perspective: 700 }}>
      <div className={reduced ? '' : 'minimap-tilt'} style={{ transform: 'rotateX(50deg) rotateZ(-6deg) scale(1.15)', transformOrigin: '50% 55%' }}>
        <svg viewBox={`${b.left} ${b.top} ${b.width} ${b.height}`} className="block h-auto w-full">
          <defs>
            <pattern id="mgrid" width="600" height="600" patternUnits="userSpaceOnUse"><path d="M600 0H0V600" fill="none" stroke="#D9DEE7" strokeOpacity="0.12" strokeWidth="14" /></pattern>
          </defs>
          <rect x={b.left} y={b.top} width={b.width} height={b.height} fill="url(#mgrid)" />
          <path d={paths.bc} fill="none" stroke={ACCENT.bc} strokeWidth="130" strokeOpacity="0.9" strokeDasharray="220 110" className={reduced ? '' : 'flow-bc-mini'} />
          <path d={paths.cu} fill="none" stroke={ACCENT.cu} strokeWidth="170" strokeOpacity="0.9" />
          <path d={paths.cu} fill="none" stroke="#10151F" strokeWidth="110" />
          <path d={paths.cu} fill="none" stroke={ACCENT.cu} strokeWidth="170" strokeDasharray="30 150" />
          {NODES.map((n, i) => (
            <g key={n.key}>
              <circle cx={n.x} cy={n.y} r={i === index ? 460 : 330} fill={n.world === 'lobby' ? '#EFEAE0' : ACCENT[n.world]} stroke="#10151F" strokeWidth="60" />
              <text x={n.x} y={n.y + 150} textAnchor="middle" fontSize="420" fontWeight="700" fill="#10151F" fontFamily="Fraunces, Georgia, serif">{n.world === 'lobby' ? '' : n.n}</text>
            </g>
          ))}
          {!reduced && (['bc', 'cu'] as const).map((w) => (
            <circle key={w} r="220" fill="#FFFFFF" style={{ filter: `drop-shadow(0 0 120px ${ACCENT[w]})` }}>
              <animateMotion dur={w === 'bc' ? '6s' : '8s'} repeatCount="indefinite" path={paths[w]} />
            </circle>
          ))}
        </svg>
      </div>
      <div className="flex justify-between px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
        <span className="text-gold">Builders Club · rampa</span>
        <span className="text-cian">Currículo · escalera</span>
      </div>
    </div>
  )
}
