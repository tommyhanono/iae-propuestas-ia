import { motion } from 'framer-motion'
import { LOBBY } from '../data'
import { useReduced } from '../lib/useReduced'
import { CountUp, G, Header, Point, R, Svg, Token, useNav, useStage } from '../components/primitives'

const EASE = [0.16, 1, 0.3, 1] as const

/** Anima solo cuando el nodo llega y no hay reduced-motion. */
function useRun() {
  const { run } = useStage()
  const reduced = useReduced()
  return run && !reduced
}

function Deliverable({ text }: { text: string }) {
  return (
    <R className="panel panel-acc flex items-center gap-3 px-4 py-3 @4xl:px-5 @4xl:py-4">
      <span className="label flex-none !text-acc-soft">Entregable</span>
      <span className="h-5 w-px flex-none bg-white/15" aria-hidden />
      <p className="body font-medium text-paper">{text}</p>
    </R>
  )
}

/* ─────────────── 1 · La progresión ─────────────── */
const STEPS = [
  { g: '8vo', verb: 'Leer', text: 'la estructura: entender cómo está hecho algo antes de crearlo.' },
  { g: '9no', verb: 'Pedir', text: 'bien: prompts con pasos y estructura.' },
  { g: '10mo', verb: 'Crear', text: 'libre: productos propios que sirven.' },
]

export function CU1() {
  const on = useRun()
  const { compact } = useStage()
  return (
    <div className="flex h-full flex-col">
      <Header i={9} sub="Un currículo escolar de 8vo a 10mo" />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 @4xl:grid-cols-12 @4xl:gap-8">
        <G className="flex flex-col justify-center gap-3 @4xl:col-span-4 @4xl:gap-5">
          <R className="flex items-baseline gap-3">
            <span className="stat-xl text-acc"><CountUp value={3} /></span>
            <span className="label">años · un entregable<br />concreto por año</span>
          </R>
          <Point text="Cada año se apoya en el anterior." small />
          <Point text="Excel, Word y PowerPoint como terreno de práctica." small />
          <Point text="Al final, un portafolio con producto real." small />
        </G>
        <G className="grid min-h-0 grid-cols-1 gap-3 @4xl:col-span-8 @4xl:grid-cols-3 @4xl:items-end @4xl:gap-4">
          {STEPS.map((st, k) => (
            <R key={st.g} className="flex min-h-0 flex-col @4xl:h-full @4xl:justify-end">
              <motion.div
                className={`panel flex flex-col p-4 @4xl:p-5 ${k === 2 ? 'panel-acc' : ''}`}
                style={compact ? undefined : { height: `${52 + k * 24}%`, transformOrigin: 'bottom' }}
                initial={false}
                animate={on ? { scaleY: [0.4, 1], opacity: [0, 1] } : { scaleY: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.35 + k * 0.3, ease: EASE }}
              >
                <span className="flex items-center justify-between">
                  <span className="label">{st.g}</span>
                  {k < 2 && !compact && <Svg name="arrow" size={18} className="-rotate-45 text-acc" />}
                </span>
                <span className="mt-1 font-display text-[32px] font-bold leading-none text-acc @4xl:text-[54px]">{st.verb}</span>
                <span className="body-sm mt-2 text-paper/85">{st.text}</span>
              </motion.div>
            </R>
          ))}
        </G>
      </div>
    </div>
  )
}

/* ─────────────── 2 · 8vo · Cimientos ─────────────── */
const COLS = ['A', 'B', 'C']
const ROWS: [string, string, string][] = [
  ['Mes', 'Ingreso', 'Gasto'],
  ['Ene', '120', '80'],
  ['Feb', '150', '95'],
  ['Mar', '140', '110'],
  ['Total', '=SUMA(B2:B4)', '=SUMA(C2:C4)'],
]

function Sheet() {
  const on = useRun()
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-ink/70 text-[12px] @4xl:text-[15px]" role="img" aria-label="Hoja de cálculo de ejemplo con la celda A5 resaltada">
      <div className="grid grid-cols-[28px_1fr_1.4fr_1.4fr] @4xl:grid-cols-[36px_1fr_1.5fr_1.5fr]">
        <span className="border-b border-r border-white/8 bg-white/4" />
        {COLS.map((c) => <span key={c} className="border-b border-r border-white/8 bg-white/4 py-1 text-center text-muted">{c}</span>)}
        {ROWS.map((r, ri) => (
          <div key={ri} className="contents">
            <span className="border-b border-r border-white/8 bg-white/4 py-1.5 text-center text-muted tabular">{ri + 1}</span>
            {r.map((v, ci) => {
              const hot = ri === 4 && ci === 0
              return (
                <span key={ci} className={`relative truncate border-b border-r border-white/8 px-2 py-1.5 tabular ${ri === 0 ? 'font-semibold text-paper' : 'text-paper/80'} ${v.startsWith('=') ? 'text-acc-soft' : ''}`}>
                  {hot && (
                    <motion.span aria-hidden className="absolute inset-0 border-2 border-acc bg-acc/15"
                      initial={false} animate={on ? { opacity: [0, 1, 0.6, 1] } : { opacity: 1 }} transition={{ duration: 1.2, delay: 1.1 }} />
                  )}
                  <span className="relative">{v}</span>
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function Bubble({ who, text, delay, right }: { who: string; text: string; delay: number; right?: boolean }) {
  const on = useRun()
  return (
    <motion.div className={`flex ${right ? 'justify-end' : ''}`}
      initial={false} animate={on ? { opacity: [0, 1], y: [8, 0] } : { opacity: 1, y: 0 }} transition={{ duration: 0.45, delay, ease: EASE }}>
      <div className={`max-w-[88%] rounded-2xl px-3.5 py-2 @4xl:px-4 @4xl:py-2.5 ${right ? 'rounded-br-md bg-white/8' : 'rounded-bl-md border border-acc/35 bg-acc/12'}`}>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${right ? 'text-muted' : 'text-acc-soft'}`}>{who}</p>
        <p className="body-sm text-paper">{text}</p>
      </div>
    </motion.div>
  )
}

export function CU2() {
  const on = useRun()
  return (
    <div className="flex h-full flex-col">
      <Header i={10} sub="Cimientos: Excel, Word y PowerPoint, aprendidos vía IA" />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 @4xl:grid-cols-12 @4xl:gap-8">
        <G className="flex flex-col gap-3 @4xl:col-span-5 @4xl:gap-4">
          <R className="flex flex-wrap items-center gap-2 text-[13px] @4xl:text-[15px]">
            {['Profe da el prompt', 'Alumno se lo pasa a Claude', 'Claude interroga'].map((t, k) => (
              <span key={t} className="flex items-center gap-2">
                {k > 0 && <Svg name="arrow" size={16} className="text-acc" />}
                <span className={`rounded-full border px-3 py-1 ${k === 2 ? 'border-acc/60 text-acc-soft' : 'border-white/15 text-paper/85'}`}>{t}</span>
              </span>
            ))}
          </R>
          <Point lead="Método invertido" text="Claude, conectado a Excel por MCP, le hace las preguntas al alumno." small />
          <Point lead="Responder, no memorizar" text="así se familiariza con la herramienta." small />
          <R className="panel p-3.5 @4xl:p-4">
            <p className="label">Progresión del año</p>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {['Navegar celdas', 'Entender fórmulas', 'Ver cómo se conectan'].map((t, k) => (
                <div key={t}>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <motion.div className="h-full origin-left rounded-full bg-acc" initial={false}
                      animate={on ? { scaleX: [0, 1] } : { scaleX: 1 }} transition={{ duration: 0.7, delay: 0.6 + k * 0.45, ease: EASE }} />
                  </div>
                  <p className="body-sm mt-1.5 leading-tight text-paper/85">{t}</p>
                </div>
              ))}
            </div>
          </R>
        </G>
        <G className="flex min-h-0 flex-col gap-3 @4xl:col-span-7">
          <R><Sheet /></R>
          <R className="flex flex-col gap-2">
            <Bubble who="Claude" text="¿Qué hay en A5?" delay={1.0} />
            <Bubble who="Alumno" text="La palabra Total: es la fila que suma todo." delay={1.6} right />
            <Bubble who="Claude" text="¿Y qué hace la fórmula de B5?" delay={2.2} />
          </R>
        </G>
      </div>
      <G className="mt-4 @4xl:mt-5"><Deliverable text="Leer y explicar un Excel real." /></G>
    </div>
  )
}

/* ─────────────── 3 · 9no · Pedir bien ─────────────── */
function MiniResult({ good }: { good?: boolean }) {
  const on = useRun()
  const rows = good ? [['Ana', '4.5', '4.0', '4.3'], ['Luis', '3.0', '2.5', '2.8'], ['Sara', '5.0', '4.5', '4.8']] : [['Ana 4.5 4'], ['luis 3,0 - 2.5'], ['Sara ??']]
  return (
    <motion.div className={`mt-3 overflow-hidden rounded-lg border text-[11.5px] @4xl:text-[14px] ${good ? 'border-acc/40' : 'border-white/10'}`}
      initial={false} animate={on ? { opacity: [0, 1] } : { opacity: 1 }} transition={{ duration: 0.5, delay: good ? 1.6 : 1.1 }}
      role="img" aria-label={good ? 'Resultado ordenado: columnas claras, promedio calculado y alerta en notas bajo 3.0' : 'Resultado desordenado: datos en una sola columna, sin fórmulas'}>
      {good && (
        <div className="grid grid-cols-4 bg-white/5 px-2 py-1 font-semibold text-muted">
          <span>Alumno</span><span>Nota 1</span><span>Nota 2</span><span>Prom.</span>
        </div>
      )}
      {rows.map((r, k) => (
        <div key={k} className={`grid ${good ? 'grid-cols-4' : 'grid-cols-1'} border-t border-white/6 px-2 py-1 tabular text-paper/85`}>
          {r.map((c, j) => (
            <span key={j} className={good && j === 3 ? (Number(c) < 3 ? 'font-semibold text-[#f2a38f]' : 'font-semibold text-acc-soft') : good ? '' : 'text-paper/60'}>
              {c}{good && j === 3 && Number(c) < 3 ? ' ▼' : ''}
            </span>
          ))}
        </div>
      ))}
    </motion.div>
  )
}

export function CU3() {
  return (
    <div className="flex h-full flex-col">
      <Header i={11} />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 @4xl:grid-cols-12 @4xl:gap-8">
        <G className="flex flex-col justify-center gap-3.5 @4xl:col-span-4 @4xl:gap-5">
          <Point lead="De responder a pedir" text="ahora el alumno es quien da las instrucciones." small />
          <Point lead="Pasos claros" text="para que la IA no se pierda." small />
          <Point lead="El cómo cambia el qué" text="la misma idea, pedida distinto, da otro producto." small />
          <Point lead="Ellos hacen los Excels" text="ya no solo los leen." small />
        </G>
        <G className="grid min-h-0 grid-cols-1 content-center items-start gap-3 @2xl:grid-cols-2 @4xl:col-span-8 @4xl:gap-4">
          <R className="panel flex flex-col p-4 @4xl:p-5">
            <p className="label flex items-center gap-2"><Svg name="x" size={15} /> Prompt vago</p>
            <p className="mt-2 rounded-lg bg-ink/60 px-3 py-2 font-mono text-[12.5px] text-paper/80 @4xl:text-[15px]">hazme un excel de notas</p>
            <MiniResult />
          </R>
          <R className="panel panel-acc flex flex-col p-4 @4xl:p-5">
            <p className="label flex items-center gap-2 !text-acc-soft"><Svg name="check" size={15} /> Prompt con estructura</p>
            <ol className="mt-2 space-y-1 rounded-lg bg-ink/60 px-3 py-2 font-mono text-[12.5px] leading-snug text-paper @4xl:text-[15px]">
              <li>1. Columnas: alumno, 2 notas, promedio</li>
              <li>2. Promedio con fórmula</li>
              <li>3. Marca si baja de 3.0</li>
            </ol>
            <MiniResult good />
          </R>
        </G>
      </div>
      <G className="mt-4 @4xl:mt-5"><Deliverable text="Un Excel construido por ellos, a punta de prompt bien estructurado." /></G>
    </div>
  )
}

/* ─────────────── 4 · 10mo · Crear ─────────────── */
const PIPE = [
  { icon: 'people' as const, k: 'Idea', v: 'Un sistema para un club' },
  { icon: 'grid' as const, k: 'Excel', v: 'Primera versión que funciona' },
  { icon: 'layers' as const, k: 'Google Sheets', v: 'Compartido y en uso' },
]

export function CU4() {
  const on = useRun()
  return (
    <div className="flex h-full flex-col">
      <Header i={12} sub="Cierran el aprendizaje con algo que alguien usa" />
      <G className="grid grid-cols-1 gap-3 @2xl:grid-cols-3 @4xl:gap-4">
        {[['Excels propios', 'grid'], ['Herramientas', 'hammer'], ['Sistemas para clubes', 'people']].map(([t, ic]) => (
          <R key={t} className="panel flex items-center gap-3 px-4 py-3 @4xl:px-5 @4xl:py-4">
            <Svg name={ic as 'grid'} className="flex-none text-acc" />
            <span className="body font-medium text-paper">{t}</span>
          </R>
        ))}
      </G>
      <G className="mt-4 flex min-h-0 flex-1 flex-col @4xl:mt-6">
        <R className="panel flex flex-1 flex-col p-4 @4xl:p-6">
          <p className="label">Ejemplo real · cómo creció un sistema de club</p>
          <div className="relative mt-4 flex flex-1 flex-col justify-center gap-3 @2xl:flex-row @2xl:items-center @2xl:gap-0">
            {PIPE.map((p, k) => (
              <div key={p.k} className="flex flex-col @2xl:flex-1 @2xl:flex-row @2xl:items-center">
                <motion.div className={`flex items-center gap-3 rounded-2xl border p-3 @2xl:flex-1 @2xl:flex-col @2xl:p-5 @2xl:text-center ${k === 2 ? 'border-acc/60 bg-acc/12' : 'border-white/10 bg-ink/50'}`}
                  initial={false} animate={on ? { opacity: [0, 1], scale: [0.92, 1] } : { opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.5 + k * 0.55, ease: EASE }}>
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-acc/50 text-acc @4xl:h-16 @4xl:w-16"><Svg name={p.icon} size={26} /></span>
                  <span>
                    <span className="block font-display text-[20px] font-semibold text-paper @4xl:text-[30px]">{p.k}</span>
                    <span className="body-sm text-paper/80">{p.v}</span>
                  </span>
                </motion.div>
                {k < 2 && (
                  <svg className="mx-auto my-1 h-6 w-6 rotate-90 text-acc @2xl:mx-2 @2xl:my-0 @2xl:h-10 @2xl:w-16 @2xl:rotate-0" viewBox="0 0 64 24" aria-hidden>
                    <motion.path d="M2 12 H56 M48 5 L58 12 L48 19" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      initial={false} animate={on ? { pathLength: [0, 1] } : { pathLength: 1 }} transition={{ duration: 0.45, delay: 0.85 + k * 0.55 }} />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </R>
      </G>
      <G className="mt-4 @4xl:mt-5"><Deliverable text="Un producto real terminado, que queda en su portafolio." /></G>
    </div>
  )
}

/* ─────────────── 5 · Conexión con el club ─────────────── */
const GRADES = ['8vo', '9no', '10mo', '11vo']

function Bands() {
  const on = useRun()
  const col = (i: number) => `${(i / 4) * 100}%`
  return (
    <div className="relative flex h-full min-h-[210px] flex-col justify-end" role="img" aria-label="El currículo cubre de 8vo a 10mo para todos; el Builders Club cubre de 9no a 11vo para quienes quieren más">
      <div className="relative flex-1">
        <motion.div className="w-bc absolute top-[8%] flex h-[38%] items-center rounded-2xl border border-acc/60 bg-acc/18 px-3 shadow-[0_0_60px_-16px_rgb(var(--acc-rgb)/0.8)] @4xl:px-5"
          style={{ left: col(1), width: col(3), transformOrigin: 'left' }}
          initial={false} animate={on ? { scaleX: [0, 1], opacity: [0, 1] } : { scaleX: 1, opacity: 1 }} transition={{ duration: 0.9, delay: 1.1, ease: EASE }}>
          <span className="min-w-0">
            <span className="block truncate font-display text-[16px] font-semibold text-acc-soft @4xl:text-[26px]">Builders Club</span>
            <span className="block truncate text-[11px] text-paper/85 @4xl:text-[15px]">9no a 11vo · quienes quieren más</span>
          </span>
        </motion.div>
        <motion.div className="w-cu absolute bottom-[6%] flex h-[42%] items-center rounded-2xl border border-acc/60 bg-acc/16 px-3 shadow-[0_0_60px_-16px_rgb(var(--acc-rgb)/0.8)] @4xl:px-5"
          style={{ left: col(0), width: col(3), transformOrigin: 'left' }}
          initial={false} animate={on ? { scaleX: [0, 1], opacity: [0, 1] } : { scaleX: 1, opacity: 1 }} transition={{ duration: 0.9, delay: 0.45, ease: EASE }}>
          <span className="min-w-0">
            <span className="block truncate font-display text-[16px] font-semibold text-acc-soft @4xl:text-[26px]">Currículo</span>
            <span className="block truncate text-[11px] text-paper/85 @4xl:text-[15px]">8vo a 10mo · la base para todos</span>
          </span>
        </motion.div>
      </div>
      <div className="grid grid-cols-4 border-t border-white/15 pt-2">
        {GRADES.map((g) => <span key={g} className="label text-center">{g}</span>)}
      </div>
    </div>
  )
}

export function CU5() {
  const { go, openMap } = useNav()
  return (
    <div className="flex h-full flex-col">
      <Header i={13} />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 @4xl:grid-cols-12 @4xl:gap-8">
        <G className="flex flex-col justify-center gap-3.5 @4xl:col-span-5 @4xl:gap-5">
          <R className="w-cu flex gap-3"><Token className="mt-[0.45em]" /><p className="body"><strong className="font-semibold text-paper">Currículo.</strong> La base para todos, de 8vo a 10mo.</p></R>
          <R className="w-bc flex gap-3"><Token className="mt-[0.45em]" /><p className="body"><strong className="font-semibold text-paper">Builders Club.</strong> De 9no a 11vo, donde los que quieren más siguen construyendo.</p></R>
          <R className="flex gap-3"><Token ghost className="mt-[0.45em]" /><p className="body text-paper/90">Una no reemplaza a la otra: <strong className="font-semibold text-paper">una pone el piso, la otra quita el techo.</strong></p></R>
        </G>
        <G className="flex min-h-0 flex-col @4xl:col-span-7">
          <R className="panel flex-1 p-4 @4xl:p-6"><Bands /></R>
        </G>
      </div>
      <G className="mt-4 @4xl:mt-5">
        <R className="flex flex-wrap items-center gap-2.5">
          <button type="button" data-back-lobby className="btn btn-acc h-12 px-5 text-[15px] font-semibold" onClick={() => go(LOBBY)}>
            <Svg name="back" size={18} /> Volver al lobby
          </button>
          <button type="button" data-open-map className="btn h-12 border border-acc/40 px-5 text-[15px] font-semibold text-acc-soft" onClick={openMap}>
            <Svg name="map" size={18} /> Ver las dos juntas
          </button>
        </R>
      </G>
    </div>
  )
}
