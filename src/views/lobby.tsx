import { motion } from 'framer-motion'
import { RANGE, WORLDS } from '../data'
import { suggested } from '../lib/nav'
import { useReduced } from '../lib/useReduced'
import { G, R, Svg, Token, useNav, useStage } from '../components/primitives'

function Portal({ world, float }: { world: 'bc' | 'cu'; float: string }) {
  const { go, visited } = useNav()
  const { compact } = useStage()
  const next = suggested(visited) === world
  const seen = visited[world]
  const info = {
    bc: { lead: 'Un club donde se construyen productos reales para el colegio.', meta: '9no a 11vo · 8 estaciones', glyph: 'hammer' as const },
    cu: { lead: 'Tres años para pasar de leer un Excel a crear herramientas propias.', meta: '8vo a 10mo · 5 estaciones', glyph: 'layers' as const },
  }[world]
  return (
    <R className={`w-${world} flex min-w-0 flex-1`}>
      <div className="flex w-full">
        <button
          type="button"
          data-portal={world}
          className="portal"
          onClick={() => go(RANGE[world].first)}
          aria-label={`Entrar a ${WORLDS[world].label}: ${WORLDS[world].name}`}
        >
          <span className={`portal-ring ${compact ? '' : float}`} aria-hidden>
            <span className="spin" />
            <span className="core" />
            <span className="absolute inset-0 flex items-center justify-center text-acc-soft">
              <Svg name={info.glyph} size={compact ? 40 : 58} stroke={1.4} />
            </span>
          </span>
          <span className="eyebrow mt-4 @4xl:mt-6">{WORLDS[world].label}</span>
          <span className="mt-1.5 font-display text-[30px] font-semibold leading-[1.02] tracking-tight text-paper @4xl:text-[54px]" style={{ fontVariationSettings: '"opsz" 144' }}>
            {WORLDS[world].name}
          </span>
          <span className="body-sm mt-2 max-w-[34ch] text-paper/85 @4xl:mt-3">{info.lead}</span>
          <span className="mt-4 flex flex-wrap items-center justify-center gap-2 @4xl:mt-5">
            <span className="label">{info.meta}</span>
            {seen && (
              <span className="flex items-center gap-1 rounded-full border border-acc/40 px-2.5 py-0.5 text-[12px] font-semibold text-acc-soft">
                <Svg name="check" size={14} /> Vista
              </span>
            )}
          </span>
          <span className={`btn mt-4 h-12 px-5 text-[15px] font-semibold @4xl:mt-5 @4xl:text-[17px] ${next ? 'btn-acc' : 'border border-acc/40 text-acc-soft'}`}>
            {seen ? 'Volver a entrar' : 'Entrar'} <Svg name="arrow" size={18} />
          </span>
        </button>
      </div>
    </R>
  )
}

export function Lobby() {
  const reduced = useReduced()
  const { compact, run } = useStage()
  return (
    <div className="flex h-full flex-col">
      <G className="text-center">
        <R className="flex items-center justify-center gap-3">
          <Token />
          <span className="eyebrow">Coordinación académica · Instituto Alberto Einstein · 2026</span>
        </R>
        <R>
          <h2 className="mt-3 font-display font-semibold leading-[1] tracking-tight text-[36px] @4xl:mt-4 @4xl:text-[84px]" style={{ fontVariationSettings: '"opsz" 144' }}>
            Construir con IA, <span className="italic text-silver/80">no copiar con IA.</span>
          </h2>
        </R>
        <R><p className="h-sub mx-auto mt-3 max-w-[60ch] text-balance text-muted @4xl:mt-4">Dos propuestas para el IAE que se complementan. Elige una puerta.</p></R>
      </G>

      <G className="relative mt-6 flex min-h-0 flex-1 flex-col items-stretch gap-4 @2xl:flex-row @2xl:items-center @4xl:mt-8 @4xl:gap-[180px]">
        {!compact && (
          <svg className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 @2xl:block" width="200" height="120" viewBox="0 0 200 120" aria-hidden>
            <defs>
              <linearGradient id="bridge" x1="0" x2="1">
                <stop offset="0" stopColor="#C8A24B" />
                <stop offset="1" stopColor="#6FB8E8" />
              </linearGradient>
            </defs>
            <motion.path d="M0 60 C 60 10, 140 110, 200 60" fill="none" stroke="url(#bridge)" strokeWidth="2" strokeDasharray="3 7"
              initial={false} animate={run && !reduced ? { pathLength: [0, 1] } : { pathLength: 1 }} transition={{ duration: 1.2, delay: 0.5 }} />
            <circle cx="100" cy="60" r="7" fill="#EFEAE0" />
            <circle cx="100" cy="60" r="16" fill="none" stroke="#EFEAE0" strokeOpacity="0.3" />
          </svg>
        )}
        <Portal world="bc" float="float" />
        <Portal world="cu" float="float late" />
      </G>

      <G className="mt-6 @4xl:mt-8">
        <R className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-4 text-center @2xl:flex-row @2xl:text-left">
          <p className="body-sm text-muted"><span className="font-medium text-paper">Presenta Thomas Hanono</span> · 11vo grado</p>
          {!compact && (
            <p className="body-sm text-muted">
              <kbd className="rounded-md border border-white/15 bg-ink px-1.5 text-silver">O</kbd> mapa completo ·{' '}
              <kbd className="rounded-md border border-white/15 bg-ink px-1.5 text-silver">N</kbd> notas ·{' '}
              <kbd className="rounded-md border border-white/15 bg-ink px-1.5 text-silver">→</kbd> avanzar
            </p>
          )}
        </R>
      </G>
    </div>
  )
}
