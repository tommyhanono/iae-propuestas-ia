import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { APPENDIX_START, MAIN_COUNT, SLIDES, TARGET_SECONDS, beatsOf, slideNumber } from './content'
import { SlideView, type Mode } from './Slides'

const STAGE_W = 1600
const STAGE_H = 900
const CHROME_H = 56

/** `#/7` → lámina 7 · `#/A3` → apéndice A3. Cualquier otra cosa → portada. */
function parseHash(hash: string): number {
  const m = hash.match(/^#\/(A?)(\d+)$/i)
  if (!m) return 0
  const n = Number(m[2])
  const i = m[1] ? APPENDIX_START + n - 1 : n - 1
  if (m[1] ? n < 1 || i >= SLIDES.length : n < 1 || n > MAIN_COUNT) return 0
  return i
}
const hashOf = (i: number) => (i >= APPENDIX_START ? `#/${SLIDES[i].id}` : `#/${i + 1}`)

function measure(): { mode: Mode; scale: number } {
  const w = window.innerWidth
  const h = window.innerHeight
  const stage = w >= 900 && h >= 560 && w / h >= 1.15
  return { mode: stage ? 'stage' : 'flow', scale: Math.min(w / STAGE_W, (h - CHROME_H) / STAGE_H) }
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

type Dialog = null | 'index' | 'help'

export default function App() {
  const [index, setIndex] = useState(() => parseHash(window.location.hash))
  const [beat, setBeat] = useState(() => beatsOf(SLIDES[parseHash(window.location.hash)]) - 1)
  const [{ mode, scale }, setLayout] = useState(measure)
  const [dialog, setDialog] = useState<Dialog>(null)
  const [notes, setNotes] = useState(false)
  const [timerOn, setTimerOn] = useState(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const lastMain = useRef(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const slide = SLIDES[index]
  const beats = beatsOf(slide)

  const go = useCallback((i: number, at: 'start' | 'end' = 'end') => {
    const next = Math.max(0, Math.min(SLIDES.length - 1, i))
    setIndex(next)
    setBeat(at === 'start' ? 0 : beatsOf(SLIDES[next]) - 1)
  }, [])

  const next = useCallback(() => {
    if (mode === 'stage' && beat < beats - 1) return setBeat(beat + 1)
    const last = index >= APPENDIX_START ? SLIDES.length - 1 : MAIN_COUNT - 1
    if (index < last) go(index + 1, 'start')
  }, [mode, beat, beats, index, go])

  const prev = useCallback(() => {
    if (mode === 'stage' && beat > 0) return setBeat(beat - 1)
    const first = index >= APPENDIX_START ? APPENDIX_START : 0
    if (index > first) go(index - 1, 'end')
  }, [mode, beat, index, go])

  const toggleAppendix = useCallback(() => {
    if (index >= APPENDIX_START) go(lastMain.current)
    else go(APPENDIX_START)
  }, [index, go])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    else document.documentElement.requestFullscreen?.().catch(() => {})
  }, [])

  const toggleTimer = useCallback(() => {
    setTimerOn((on) => !on)
    setStartedAt((t) => t ?? Date.now())
  }, [])

  useEffect(() => { if (index < APPENDIX_START) lastMain.current = index }, [index])

  // Hash profundo: la URL siempre dice en qué lámina estás.
  useEffect(() => {
    const h = hashOf(index)
    if (window.location.hash !== h) window.history.replaceState(null, '', h)
  }, [index])
  useEffect(() => {
    const on = () => go(parseHash(window.location.hash))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [go])

  useLayoutEffect(() => {
    const on = () => setLayout(measure())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  // En modo flujo, cada lámina nueva empieza arriba.
  useEffect(() => { viewportRef.current?.querySelector('.slide')?.scrollTo?.({ top: 0 }) }, [index])

  useEffect(() => {
    if (!timerOn) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [timerOn])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Escape') {
        if (dialog) { e.preventDefault(); setDialog(null) }
        else if (notes) setNotes(false)
        return
      }
      if (dialog) return
      const k = e.key
      const flow = mode === 'flow'
      const onButton = (e.target as HTMLElement)?.closest?.('button, a')
      if (k === 'ArrowRight' || k === 'PageDown' || (!flow && k === 'ArrowDown') || (k === ' ' && !onButton)) { e.preventDefault(); next() }
      else if (k === 'ArrowLeft' || k === 'PageUp' || (!flow && k === 'ArrowUp') || k === 'Backspace') { e.preventDefault(); prev() }
      else if (k === 'Home') { e.preventDefault(); go(0, 'start') }
      else if (k === 'End') { e.preventDefault(); go(MAIN_COUNT - 1) }
      else if (k === 'o' || k === 'O') setDialog('index')
      else if (k === 'n' || k === 'N') setNotes((v) => !v)
      else if (k === 't' || k === 'T') toggleTimer()
      else if (k === 'f' || k === 'F') toggleFullscreen()
      else if (k === 'a' || k === 'A') toggleAppendix()
      else if (k === '?') setDialog('help')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dialog, notes, mode, next, prev, go, toggleTimer, toggleFullscreen, toggleAppendix])

  // Toques: deslizar a los lados; en pantalla ancha, tocar el tercio derecho o izquierdo.
  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }
  const onTouchEnd = (e: React.TouchEvent) => {
    const t = touch.current
    touch.current = null
    if (!t) return
    const dx = e.changedTouches[0].clientX - t.x
    const dy = e.changedTouches[0].clientY - t.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)()
  }
  const onClick = (e: React.MouseEvent) => {
    if (mode !== 'stage') return
    if ((e.target as HTMLElement).closest('a, button, [role="dialog"]')) return
    const x = e.clientX / window.innerWidth
    if (x > 0.62) next()
    else if (x < 0.38) prev()
  }

  const elapsed = startedAt ? Math.max(0, Math.round((now - startedAt) / 1000)) : 0
  const appendix = index >= APPENDIX_START
  const progress = appendix ? 1 : (index + (mode === 'stage' && beats > 1 ? (beat + 1) / beats : 1)) / MAIN_COUNT
  const shownBeat = mode === 'stage' ? beat : beats - 1
  const atStart = (appendix ? index === APPENDIX_START : index === 0) && (mode === 'flow' || beat === 0)
  const atEnd = appendix ? index === SLIDES.length - 1 : index === MAIN_COUNT - 1 && shownBeat === beats - 1
  const announce = appendix ? `Apéndice ${slide.id}: ${slide.title}` : `Lámina ${index + 1} de ${MAIN_COUNT}: ${slide.title}`

  return (
    <div className="dx-app" data-app data-mode={mode} data-index={index} data-beat={beat} data-key={slide.id}>
      <h1 className="sr-only">Construir con IA, no copiar con IA · Propuestas para la directiva del IAE</h1>
      <div className="dx-progress" aria-hidden="true"><span style={{ width: `${progress * 100}%` }} /></div>

      <main
        ref={viewportRef}
        className="dx-viewport"
        inert={dialog ? true : undefined}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onClick}
      >
        <div className="dx-stage" data-mode={mode} style={{ ['--s' as string]: scale }}>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={slide.id}
              style={{ position: 'absolute', inset: 0 }}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.28, ease: 'easeOut' }}
            >
              {/* En celular la lámina se lee sola: se muestra completa, sin beats. */}
              <SlideView slide={slide} index={index} beat={mode === 'flow' ? 99 : beat} mode={mode} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <p className="sr-only" aria-live="polite" aria-atomic="true">{announce}</p>

      {timerOn && (
        <div className="dx-timer" role="timer" aria-label={`Tiempo: ${fmt(elapsed)} de ${fmt(TARGET_SECONDS)}`} data-over={elapsed > TARGET_SECONDS}>
          {fmt(elapsed)} <span className="goal">/ {fmt(TARGET_SECONDS)}</span>
        </div>
      )}

      {notes && (
        <aside className="dx-notes" aria-label="Notas del orador">
          <h2>Notas · {slideNumber(index)} · {slide.time === '0:00' ? 'apéndice' : `meta ${slide.time}`}</h2>
          <p>{slide.notes}</p>
        </aside>
      )}

      <nav className="dx-chrome" aria-label="Controles de la presentación" inert={dialog ? true : undefined}>
        <p className="dx-where">
          <span className="n">{appendix ? slide.id : `${index + 1} / ${MAIN_COUNT}`}</span>
          <span className="sec">{slide.section}</span>
        </p>
        <button type="button" className="dx-btn" onClick={() => setDialog('index')} aria-label="Índice de láminas (O)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
          <span className="lbl">Índice</span>
        </button>
        <button type="button" className="dx-btn" onClick={() => setNotes((v) => !v)} aria-pressed={notes} aria-label="Notas del orador (N)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5z M8 9h8 M8 13h8 M8 17h5" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
          <span className="lbl">Notas</span>
        </button>
        <button type="button" className="dx-btn" onClick={() => setDialog('help')} aria-label="Ayuda y atajos de teclado (?)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5V14 M12 17.2v.3" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
          <span className="lbl">Ayuda</span>
        </button>
        <button type="button" className="dx-btn" onClick={prev} disabled={atStart} aria-label="Anterior">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
        </button>
        <button type="button" className="dx-btn" onClick={next} disabled={atEnd} aria-label="Siguiente">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
        </button>
      </nav>

      {dialog && (
        <div className="dx-scrim" onClick={(e) => { if (e.target === e.currentTarget) setDialog(null) }}>
          <div className={`dx-dialog ${dialog === 'index' ? 'dx-index' : 'dx-help'}`} role="dialog" aria-modal="true" aria-labelledby="dx-dialog-title">
            <div className="head">
              <h2 id="dx-dialog-title">{dialog === 'index' ? 'Índice' : 'Cómo se navega'}</h2>
              <button type="button" className="dx-btn" onClick={() => setDialog(null)} aria-label="Cerrar" autoFocus>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
              </button>
            </div>
            {dialog === 'index' ? <IndexList current={index} onPick={(i) => { go(i); setDialog(null) }} /> : <HelpTable />}
          </div>
        </div>
      )}

      <div className="dx-print" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <div key={s.id} className="print-page" data-mode="stage">
            <SlideView slide={s} index={i} beat={99} mode="stage" print />
          </div>
        ))}
      </div>
    </div>
  )
}

function IndexList({ current, onPick }: { current: number; onPick: (i: number) => void }) {
  const groups: { name: string; items: number[] }[] = []
  SLIDES.forEach((s, i) => {
    const g = groups[groups.length - 1]
    if (g && g.name === s.section) g.items.push(i)
    else groups.push({ name: s.section, items: [i] })
  })
  return (
    <div>
      {groups.map((g) => (
        <div key={g.name}>
          <h3>{g.name}</h3>
          <ol>
            {g.items.map((i) => (
              <li key={i}>
                <button type="button" aria-current={i === current ? 'true' : undefined} onClick={() => onPick(i)}>
                  <span className="num">{i >= APPENDIX_START ? SLIDES[i].id : i + 1}</span>
                  <span>{SLIDES[i].title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}

const KEYS: [string, string][] = [
  ['→ · Espacio · AvPág', 'Avanzar (primero los pasos de la lámina, después la lámina)'],
  ['← · RePág', 'Retroceder'],
  ['Inicio · Fin', 'Portada · última lámina'],
  ['O', 'Índice de láminas'],
  ['N', 'Notas del orador'],
  ['T', 'Temporizador (meta: 15:00)'],
  ['F', 'Pantalla completa'],
  ['A', 'Apéndice (y volver)'],
  ['?', 'Esta ayuda'],
  ['Esc', 'Cerrar'],
]

function HelpTable() {
  return (
    <>
      <table>
        <tbody>
          {KEYS.map(([k, v]) => (
            <tr key={k}><td><kbd>{k}</kbd></td><td>{v}</td></tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 16, fontSize: 16, color: 'var(--navy-muted)', lineHeight: 1.5 }}>
        En el celular: desliza a los lados para avanzar o retroceder. Para imprimir o guardar en PDF, usa Imprimir del navegador: sale una lámina por página.
      </p>
    </>
  )
}
