import { motion } from 'framer-motion'
import { LOBBY } from '../data'
import { useReduced } from '../lib/useReduced'
import {
  Chip, CountUp, G, Header, IconBadge, Point, R, Svg, Token, useNav, type IconName,
} from '../components/primitives'

/* ─────────────── 1 · Visión ─────────────── */
export function BC1() {
  return (
    <div className="flex h-full flex-col">
      <G className="flex items-center gap-3">
        <R className="flex items-center gap-3">
          <Token />
          <span className="eyebrow">Propuesta 1 · Visión <span className="tabular text-muted">· 01/08</span></span>
        </R>
      </G>
      <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-6 @4xl:mt-6 @4xl:grid-cols-12 @4xl:gap-10">
        <G className="flex flex-col justify-center @4xl:col-span-7">
          <R>
            <p className="font-display font-bold leading-[0.92] tracking-tight text-acc text-[52px] @4xl:text-[124px]" style={{ fontVariationSettings: '"opsz" 144' }}>
              Builders<br />Club
            </p>
          </R>
          <R><h2 className="h-title mt-4 max-w-[22ch] text-balance @4xl:mt-6">Aquí no se usa la IA para hacer tareas. Se usa para construir.</h2></R>
          <R className="mt-5 flex items-center gap-3 @4xl:mt-8">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-acc/50 font-display text-[17px] font-semibold text-acc-soft">TH</span>
            <p className="body-sm text-muted"><span className="font-medium text-paper">Thomas Hanono</span><br />candidato a presidente del club</p>
          </R>
        </G>
        <G className="flex flex-col justify-center gap-3 @4xl:col-span-5 @4xl:gap-4">
          <R className="panel p-4 @4xl:p-6">
            <p className="label flex items-center gap-2"><Svg name="x" size={16} /> No es</p>
            <p className="body mt-1.5 text-paper/80 line-through decoration-white/30">Un club para que la IA haga la tarea</p>
          </R>
          <R className="panel panel-acc p-4 @4xl:p-6">
            <p className="label flex items-center gap-2 !text-acc-soft"><Svg name="check" size={16} /> Sí es</p>
            <p className="body mt-1.5 font-medium text-paper">Un club donde se construyen productos reales que benefician al colegio</p>
          </R>
          <Point text="La IA es la herramienta. El producto es la meta." small />
          <Point text="Cada proyecto tiene que servirle a alguien del colegio." small />
        </G>
      </div>
    </div>
  )
}

/* ─────────────── 2 · Por qué presidente ─────────────── */
function Cred({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <R className="panel flex gap-4 p-4 @4xl:gap-5 @4xl:p-5">
      <IconBadge name={icon} />
      <div className="min-w-0">
        <p className="font-display text-[19px] font-semibold leading-tight text-paper @4xl:text-[26px]">{title}</p>
        <p className="body-sm mt-1 text-paper/80">{text}</p>
      </div>
    </R>
  )
}

export function BC2() {
  return (
    <div className="flex h-full flex-col">
      <Header i={2} />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 @4xl:grid-cols-12 @4xl:gap-8">
        <G className="flex flex-col gap-3 @4xl:col-span-7 @4xl:gap-4">
          <Cred icon="hammer" title="Construyo apps en producción" text="Herramientas que hoy usan personas reales: una plataforma para profesores, trackers para equipos deportivos, un asistente propio." />
          <Cred icon="people" title="Mentor de cursos de IA" text="Ya acompañé a otros a aprender IA: sé dónde se traban y cómo destrabarlos." />
          <Cred icon="terminal" title="Dominio profundo de Claude" text="Terminal, app de escritorio, MCPs y segundo cerebro. Lo uso a diario, no lo leí en un tutorial." />
        </G>
        <G className="flex flex-col justify-center @4xl:col-span-5">
          <R className="panel panel-acc relative p-6 @4xl:p-9">
            <span aria-hidden className="absolute -top-3 left-6 font-display text-[70px] leading-none text-acc @4xl:-top-6 @4xl:text-[120px]">“</span>
            <p className="font-display text-[22px] font-medium leading-[1.2] text-paper @4xl:text-[36px]">
              No vengo a que el club dependa de mí. Vengo a que construya más de lo que yo construiría solo.
            </p>
            <p className="label mt-4 @4xl:mt-6">El rol del presidente</p>
          </R>
        </G>
      </div>
    </div>
  )
}

/* ─────────────── 3 · La apuesta ─────────────── */
function PlanRow({ k, a, b }: { k: string; a: string; b: string }) {
  return (
    <div className="grid grid-cols-[1.25fr_1fr_1fr] items-center gap-2 border-t border-white/8 py-2.5 @2xl:gap-3 @4xl:py-3.5">
      <span className="body-sm min-w-0 text-paper/85">{k}</span>
      <span className="body-sm flex min-w-0 items-center gap-1.5 font-semibold text-acc-soft"><Svg name="check" size={16} className="hidden flex-none @2xl:block" /><span className="min-w-0 break-words">{a}</span></span>
      <span className="body-sm min-w-0 break-words text-muted">{b}</span>
    </div>
  )
}

export function BC3() {
  return (
    <div className="flex h-full flex-col">
      <Header i={3} />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 @4xl:grid-cols-12 @4xl:gap-9">
        <G className="flex flex-col justify-center gap-3.5 @4xl:col-span-5 @4xl:gap-5">
          <Point lead="El pedido" text="que la junta apoye al club con una cuenta de Claude por estudiante." />
          <Point lead="Nadie está obligado a pagar" text="lo que se pide es que el colegio apoye el club." />
          <Point lead="Claude primero" text="es donde está mi conocimiento y donde hay más posibilidades." />
          <Point lead="Gemini, plan B" text="queda como respaldo, pero no está a la par." />
        </G>
        <G className="flex flex-col justify-center @4xl:col-span-7">
          <R className="panel p-4 @4xl:p-7">
            <div className="grid grid-cols-[1.25fr_1fr_1fr] items-end gap-2 pb-3 @2xl:gap-3">
              <span className="label hidden min-w-0 @2xl:block">Para construir</span><span aria-hidden className="@2xl:hidden" />
              <span>
                <span className="label !text-acc">Plan A</span>
                <span className="block font-display text-[19px] font-semibold text-paper @2xl:text-[22px] @4xl:text-[34px]">Claude</span>
              </span>
              <span>
                <span className="label">Plan B</span>
                <span className="block font-display text-[19px] font-semibold text-paper/70 @2xl:text-[22px] @4xl:text-[34px]">Gemini</span>
              </span>
            </div>
            <PlanRow k="Donde tengo experiencia real" a="Sí" b="Menos" />
            <PlanRow k="Terminal y MCPs" a="Completo" b="Parcial" />
            <PlanRow k="Nivel para construir" a="Referencia" b="No a la par" />
          </R>
          <R className="mt-3 flex items-center gap-3 @4xl:mt-4">
            <Token ghost />
            <p className="body-sm text-muted">Primero se intenta con Claude. Gemini, solo si no se puede.</p>
          </R>
        </G>
      </div>
    </div>
  )
}

/* ─────────────── 4 · Qué se enseña ─────────────── */
const TOOLS: { icon: IconName; name: string; text: string }[] = [
  { icon: 'brain', name: 'Obsidian', text: 'Segundo cerebro: capturar y conectar lo que aprendes.' },
  { icon: 'plug', name: 'MCPs', text: 'Conectar a Claude con Excel, Drive o WhatsApp.' },
  { icon: 'terminal', name: 'Terminal vs. desktop', text: 'Claude Code para construir; la app para pensar.' },
  { icon: 'layers', name: 'Modelos', text: 'Cuál usar para qué, y por qué cambia el resultado.' },
  { icon: 'talk', name: 'Prompting', text: 'La forma del pedido define el producto.' },
]

export function BC4() {
  return (
    <div className="flex h-full flex-col">
      <Header i={4} />
      <G className="grid min-h-0 flex-1 grid-cols-1 gap-3 @2xl:grid-cols-6 @4xl:gap-4">
        {TOOLS.map((t, k) => (
          <R key={t.name} className={`panel flex gap-4 p-4 @4xl:flex-col @4xl:gap-3 @4xl:p-6 ${k < 2 ? '@2xl:col-span-3' : '@2xl:col-span-2'}`}>
            <IconBadge name={t.icon} />
            <div className="min-w-0">
              <p className="font-display text-[20px] font-semibold leading-tight text-paper @4xl:text-[28px]">{t.name}</p>
              <p className="body-sm mt-1 text-paper/80">{t.text}</p>
            </div>
          </R>
        ))}
      </G>
      <G className="mt-4 @4xl:mt-5">
        <R className="panel panel-acc flex items-center gap-4 px-5 py-3.5 @4xl:py-4">
          <Svg name="hammer" className="flex-none text-acc" />
          <p className="body text-paper"><strong className="font-semibold">Todo con prácticas interactivas.</strong> Nadie sale de una sesión sin haber hecho algo.</p>
        </R>
      </G>
    </div>
  )
}

/* ─────────────── 5 · Plan clase por clase ─────────────── */
const CLASSES = [
  { t: 'Fundamentos + setup', d: 'Qué es la IA hoy, cómo pensar con Claude, crear la cuenta y el primer prompt real.', p: 'Resolver algo tuyo ese mismo día.' },
  { t: 'Segundo cerebro', d: 'Obsidian: capturar y conectar conocimiento.', p: 'Montar tu propio vault.' },
  { t: 'Modelos y superficies', d: 'Cuándo usar cada modelo. Terminal vs. desktop.', p: 'La misma tarea en ambas, para sentir la diferencia.' },
  { t: 'MCPs', d: 'Conectar a Claude con el mundo: Excel, WhatsApp, Drive.', p: 'Conectar un MCP y ponerlo a trabajar.' },
  { t: 'Prompting de construcción', d: 'La forma del prompt cambia el producto: pasos, estructura, iteración.', p: 'Construir una mini-herramienta.' },
  { t: 'Demo Day', d: 'Cada quien o cada equipo construye un producto que beneficie al colegio y lo presenta.', p: 'Presentar el producto terminado.' },
]

export function BC5() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3 @4xl:flex-row @4xl:items-end @4xl:justify-between">
        <Header i={5} className="!mb-0" />
        <G className="flex-none">
          <R className="flex items-baseline gap-3 @4xl:pb-1">
            <span className="stat-xl text-acc"><CountUp value={6} /></span>
            <span className="label">clases de arranque<br />~1 por semana</span>
          </R>
        </G>
      </div>
      <div className="relative mt-5 min-h-0 flex-1 @4xl:mt-7">
        <G className="relative grid h-full grid-cols-1 gap-3 @2xl:grid-cols-2 @4xl:grid-cols-3 @4xl:grid-rows-2 @4xl:gap-5">
          {CLASSES.map((c, k) => {
            const demo = k === 5
            return (
              <R key={c.t} className={`panel flex flex-col p-4 @4xl:p-6 ${demo ? 'panel-acc' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-full font-display text-[16px] font-bold @4xl:h-11 @4xl:w-11 @4xl:text-[19px] ${demo ? 'bg-acc text-ink' : 'border border-acc/50 text-acc-soft'}`}>{k + 1}</span>
                  <p className="font-display text-[19px] font-semibold leading-tight text-paper @4xl:text-[26px]">{c.t}</p>
                </div>
                <p className="body-sm mt-2.5 text-paper/85">{c.d}</p>
                <p className="body-sm mt-auto flex gap-2 pt-3 text-acc-soft"><Svg name="hammer" size={18} className="mt-0.5 flex-none" /><span><span className="font-semibold">Práctica:</span> {c.p}</span></p>
              </R>
            )
          })}
        </G>
      </div>
      <G className="mt-4 @4xl:mt-5">
        <R className="flex items-center gap-3">
          <Token />
          <p className="body text-paper">Después del Demo Day, <strong className="font-semibold text-acc-soft">el temario lo definen los miembros.</strong></p>
        </R>
      </G>
    </div>
  )
}

/* ─────────────── 6 · La meta + tarjeta bloqueada ─────────────── */
function LockedProject() {
  const reduced = useReduced()
  // El esqueleto es decorativo: no contiene texto real, solo formas. Nada del "cómo" vive en el DOM.
  return (
    <R className="flex min-h-0 flex-1 flex-col">
      <motion.div
        data-locked="sat"
        className="locked flex min-h-[300px] flex-1 flex-col"
        role="group"
        aria-label="Proyecto SAT, bloqueado. Prueba de concepto de un alumno."
        whileHover={reduced ? undefined : { x: [0, -5, 5, -3, 3, 0], transition: { duration: 0.45 } }}
      >
        <div className="skeleton" aria-hidden>
          <div className="flex gap-3">
            <div className="h-10 w-10 rounded-full bg-acc/60" />
            <div className="flex-1 space-y-2 pt-1"><div className="h-3 w-2/3 rounded bg-paper/50" /><div className="h-3 w-1/3 rounded bg-paper/30" /></div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[70, 45, 90, 60, 30, 80].map((h, k) => <div key={k} className="rounded-lg bg-acc/40" style={{ height: h }} />)}
          </div>
          <div className="mt-4 space-y-2">{[90, 75, 82, 60].map((w, k) => <div key={k} className="h-3 rounded bg-paper/35" style={{ width: `${w}%` }} />)}</div>
        </div>
        <div className="veil" aria-hidden />
        <div className="relative flex flex-1 flex-col items-center justify-center p-5 text-center @4xl:p-8">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-acc/60 bg-ink/80 text-acc shadow-[0_0_40px_-6px_rgb(var(--acc-rgb)/0.7)] @4xl:h-20 @4xl:w-20">
            <Svg name="lock" size={34} />
          </span>
          <p className="label mt-4 !text-acc">Bloqueado · prueba de concepto</p>
          <p className="mt-2 font-display text-[26px] font-semibold leading-tight text-paper @4xl:text-[40px]">Proyecto SAT</p>
          <p className="body-sm mt-2 max-w-[32ch] text-paper/85">Un proyecto de alumno que puede cambiar cómo se enseña esa materia.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="rounded-full border border-white/15 px-3 py-1 text-[12px] font-medium text-muted @4xl:text-[14px]">Hecho por un alumno</span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-[12px] font-medium text-muted @4xl:text-[14px]">Detalles en reserva</span>
          </div>
        </div>
      </motion.div>
    </R>
  )
}

export function BC6() {
  return (
    <div className="flex h-full flex-col">
      <Header i={6} />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 @4xl:grid-cols-12 @4xl:gap-9">
        <G className="flex flex-col justify-center gap-3.5 @4xl:col-span-6 @4xl:gap-5">
          <Point lead="Problemas reales" text="cada proyecto nace de algo que al colegio le cuesta hoy." />
          <Point lead="Con quien lo usa" text="se presenta, se prueba y se mejora con esas personas." />
          <Point lead="No es hipotético" text="ya existe una prueba de concepto hecha por un alumno." />
          <R className="mt-1 flex items-center gap-3 @4xl:mt-3">
            <Svg name="arrow" className="flex-none text-acc" />
            <p className="body-sm text-muted">Se ve que existe y su impacto. El cómo queda en reserva.</p>
          </R>
        </G>
        <G className="flex min-h-0 flex-col @4xl:col-span-6">
          <LockedProject />
        </G>
      </div>
    </div>
  )
}

/* ─────────────── 7 · Integridad ─────────────── */
export function BC7() {
  return (
    <div className="flex h-full flex-col">
      <Header i={7} />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 @4xl:grid-cols-12 @4xl:gap-9">
        <G className="flex flex-col justify-center gap-3.5 @4xl:col-span-6 @4xl:gap-5">
          <Point lead="El miedo es válido" text="la IA también puede usarse para no aprender." />
          <Point lead="Reglas habladas" text="las reglas de uso se conversan con los miembros, no se imponen en un reglamento duro." />
          <Point lead="Nada que copiar" text="en un club que construye, el producto no existe hasta que tú lo haces." />
        </G>
        <G className="flex flex-col justify-center gap-3 @4xl:col-span-6 @4xl:gap-4">
          <R className="panel panel-acc p-5 @4xl:p-7">
            <p className="label flex items-center gap-2 !text-acc-soft"><Svg name="hammer" size={16} /> Herramienta para construir</p>
            <ul className="mt-3 space-y-2">
              {['Crear algo que no existía', 'Entender cómo funciona lo que hiciste', 'Presentarlo y defenderlo'].map((t) => (
                <li key={t} className="body flex gap-2.5 text-paper"><Svg name="check" size={20} className="mt-0.5 flex-none text-acc" />{t}</li>
              ))}
            </ul>
          </R>
          <R className="panel p-5 @4xl:p-7">
            <p className="label flex items-center gap-2"><Svg name="x" size={16} /> Atajo para copiar</p>
            <p className="body mt-3 flex gap-2.5 text-paper/75"><Svg name="x" size={20} className="mt-0.5 flex-none text-muted" />Entregar tareas hechas por la IA</p>
          </R>
          <R className="flex items-center gap-3 px-1">
            <Svg name="talk" className="flex-none text-acc" />
            <p className="body-sm text-muted">Acordado entre todos desde la primera sesión.</p>
          </R>
        </G>
      </div>
    </div>
  )
}

/* ─────────────── 8 · Logística y cierre ─────────────── */
function Stat({ value, pre = '', unit, label, text }: { value?: number; pre?: string; unit: string; label: string; text?: string }) {
  return (
    <R className="panel flex flex-col justify-between p-4 @4xl:p-5">
      <span className="label">{label}</span>
      <span className="mt-2 flex items-baseline gap-2">
        <span className="stat text-acc">{pre}{text ?? <CountUp value={value ?? 0} />}</span>
        <span className="body-sm text-paper/85">{unit}</span>
      </span>
    </R>
  )
}

export function BC8() {
  const { go } = useNav()
  return (
    <div className="flex h-full flex-col">
      <Header i={8} />
      <G className="grid grid-cols-2 gap-3 @4xl:grid-cols-4 @4xl:gap-4">
        <Stat label="Costo" pre="$" value={0} unit="gratis" />
        <Stat label="Frecuencia" pre="~" value={1} unit="sesión / semana" />
        <Stat label="Para" value={3} unit="grados: 9no a 11vo" />
        <Stat label="Arranca" text="Oct" unit="2026" />
      </G>
      <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 @4xl:mt-5 @4xl:grid-cols-12 @4xl:gap-6">
        <G className="flex flex-col gap-3 @4xl:col-span-5">
          <R><p className="label">Posibilidades a futuro</p></R>
          <Chip k="Idea" v="Charlistas externos invitados" />
          <Chip k="Idea" v="Una versión para profesores" />
          <R className="mt-1 flex items-center gap-3 px-1">
            <Token ghost />
            <p className="body-sm text-muted">Son ideas abiertas, no compromisos. Primero, que el club arranque.</p>
          </R>
        </G>
        <G className="flex flex-col @4xl:col-span-7">
          <R className="panel panel-acc flex flex-1 flex-col justify-center p-5 @4xl:p-7">
            <p className="label !text-acc-soft">El pedido concreto</p>
            <p className="mt-2 font-display text-[21px] font-semibold leading-[1.2] text-paper @4xl:text-[31px]">
              Tu apoyo para que el Builders Club arranque en octubre, y para llevar a la junta el pedido de las cuentas.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5 @4xl:mt-5">
              <button type="button" data-back-lobby className="btn btn-acc h-12 px-5 text-[15px] font-semibold" onClick={() => go(LOBBY)}>
                <Svg name="back" size={18} /> Volver al lobby
              </button>
              <span className="body-sm flex items-center text-muted">y entrar a la propuesta 2</span>
            </div>
          </R>
        </G>
      </div>
    </div>
  )
}
