import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Board from './Board'
import { Chrome } from './Chrome'
import MobileDeck from './MobileDeck'
import { LOBBY, NODES, WORLDS, type World } from './data'
import { NavCtx } from './components/primitives'
import { assertNoOverlap } from './lib/geometry'
import { nextOf, prevOf, readHash, suggested, type Visited } from './lib/nav'

const MOBILE_QUERY = '(max-width: 768px), (max-height: 500px)'

if (import.meta.env.DEV) {
  const problems = assertNoOverlap()
  if (problems.length) console.warn('[tablero] nodos demasiado cerca:\n' + problems.join('\n'))
}

const markVisited = (v: Visited, i: number): Visited => {
  const w = NODES[i].world
  return w === 'lobby' || v[w] ? v : { ...v, [w]: true }
}

export default function App() {
  const [index, setIndex] = useState(readHash)
  const [visited, setVisited] = useState<Visited>(() => markVisited({ bc: false, cu: false }, readHash()))
  const [map, setMap] = useState(false)
  const [notesOpen, setNotes] = useState(false)
  const [helpOpen, setHelp] = useState(false)
  const [settled, setSettled] = useState(false)
  const [area, setArea] = useState('')
  const [bgWorld, setBgWorld] = useState<World | 'map'>(() => NODES[readHash()].world)
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches)
  const state = useRef({ index, visited })
  useLayoutEffect(() => { state.current = { index, visited } }, [index, visited])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const on = () => { setMobile(mq.matches); setMap(false) }
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const go = useCallback((i: number) => {
    const n = Math.max(0, Math.min(NODES.length - 1, i))
    setIndex(n)
    setVisited((v) => markVisited(v, n))
    setMap(false)
  }, [])
  const next = useCallback(() => go(nextOf(state.current.index, state.current.visited)), [go])
  const prev = useCallback(() => {
    const p = prevOf(state.current.index)
    if (p !== null) go(p)
    else setMap(false)
  }, [go])

  useEffect(() => {
    const n = NODES[index]
    history.replaceState(null, '', `#${n.key}`)
    document.title = n.world === 'lobby'
      ? 'IA en el IAE · Dos propuestas'
      : `${n.short} · ${WORLDS[n.world].name} · IA en el IAE`
  }, [index])

  useEffect(() => {
    const onHash = () => { const i = readHash(); if (i !== state.current.index) go(i) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [go])

  // En móvil no hay vuelo: el fondo cambia de mundo al instante.
  useEffect(() => { if (mobile) setBgWorld(map ? 'map' : NODES[index].world) }, [mobile, map, index])

  const fullscreen = useCallback(() => {
    const d = document
    if (d.fullscreenElement) d.exitFullscreen?.().catch(() => {})
    else d.documentElement.requestFullscreen?.().catch(() => {})
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target as HTMLElement
      const onControl = el?.tagName === 'BUTTON' || el?.getAttribute?.('role') === 'button'
      if (helpOpen) {
        if (e.key === 'Escape' || e.key === '?') { e.preventDefault(); setHelp(false) }
        return
      }
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case 'PageDown':
          e.preventDefault(); next(); break
        case ' ':
          if (onControl) return
          e.preventDefault(); next(); break
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp':
          e.preventDefault(); prev(); break
        case 'Home': case 'l': case 'L':
          e.preventDefault(); go(LOBBY); break
        case 'o': case 'O': e.preventDefault(); setMap((m) => !m); break
        case 'Escape': setMap(false); break
        case 'n': case 'N': e.preventDefault(); setNotes((v) => !v); break
        case 'f': case 'F': e.preventDefault(); fullscreen(); break
        case '?': e.preventDefault(); setHelp(true); break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [helpOpen, go, next, prev, fullscreen])

  const onWorldShift = useCallback((i: number) => setBgWorld(i < 0 ? 'map' : NODES[i].world), [])
  const nextIdx = nextOf(index, visited)
  const nextLabel = index === LOBBY
    ? `Entrar a ${WORLDS[suggested(visited)].name}`
    : nextIdx === LOBBY ? 'Volver al lobby' : 'Siguiente'

  return (
    <NavCtx.Provider value={{ go, openMap: () => setMap(true), visited }}>
      <div
        className="fixed inset-0"
        data-app
        data-mode={mobile ? 'mobile' : 'desktop'}
        data-index={index}
        data-key={NODES[index].key}
        data-world={bgWorld === 'map' ? undefined : bgWorld}
        data-map={map || bgWorld === 'map' ? true : undefined}
        data-map-open={map || undefined}
        data-notes={notesOpen || undefined}
        data-camera-settled={settled ? 'true' : 'false'}
        data-area={area}
      >
        <h1 className="sr-only">IA en el IAE · Dos propuestas: Builders Club y Currículo 8–10</h1>
        {mobile ? (
          <MobileDeck index={index} notesOpen={notesOpen} onNext={next} onPrev={prev} onSettled={setSettled} />
        ) : (
          <Board index={index} map={map} notesOpen={notesOpen} onEnter={go} onSettled={setSettled} onArea={setArea} onWorldShift={onWorldShift} />
        )}
        <Chrome
          index={index}
          mobile={mobile}
          map={map}
          notesOpen={notesOpen}
          helpOpen={helpOpen}
          hasPrev={index !== LOBBY}
          nextLabel={nextLabel}
          go={go}
          next={next}
          prev={prev}
          toggleMap={() => setMap((m) => !m)}
          toggleNotes={() => setNotes((v) => !v)}
          toggleHelp={() => setHelp((v) => !v)}
          fullscreen={fullscreen}
        />
        <p className="sr-only" aria-live="polite">
          {NODES[index].world === 'lobby' ? 'Lobby' : `${WORLDS[NODES[index].world].name}, estación ${NODES[index].n}: ${NODES[index].short}`}
        </p>
      </div>
    </NavCtx.Provider>
  )
}
