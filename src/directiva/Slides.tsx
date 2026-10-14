import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { MAIN_COUNT, SOURCES, slideNumber, type Slide, type SourceId } from './content'

export type Mode = 'stage' | 'flow'

const pad = (n: number) => String(n).padStart(2, '0')

/** Entrada sobria: un solo punto focal por lámina, salida suave de 500 ms. */
function Focal({ children, className, delay = 0.08 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

/** Elemento que aparece con un beat. Antes de revelarse ocupa su lugar pero no se ve. */
function Beat({ show, children, className, as = 'div' }: { show: boolean; children: ReactNode; className?: string; as?: 'div' | 'tr' }) {
  const reduced = useReducedMotion()
  const Tag = as === 'tr' ? motion.tr : motion.div
  return (
    <Tag
      className={`${className ?? ''} ${show ? '' : 'beat-hidden'}`}
      aria-hidden={show ? undefined : true}
      data-beat={show ? 'on' : 'off'}
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show || reduced ? 0 : 10 }}
      transition={{ duration: reduced ? 0 : 0.28, ease: 'easeOut' }}
    >
      {children}
    </Tag>
  )
}

function Cite({ id }: { id: SourceId }) {
  const s = SOURCES[id]
  return (
    <span className="src t-foot">
      <span className="src-k">Fuente</span>
      <a href={s.url} target="_blank" rel="noopener noreferrer">{s.short}</a>
    </span>
  )
}

function TitleBlock({ slide, index, mode }: { slide: Slide; index: number; mode: Mode }) {
  const navy = slide.tone === 'navy'
  return (
    <footer className="titleblock">
      <div className="tb-cell t-foot">
        <span className="tb-k">IAE · Directiva</span>
        <span>Propuestas de IA</span>
      </div>
      <span className="tb-sep" aria-hidden="true" />
      <div className="tb-cell t-foot">
        <span className="tb-k">Hoja</span>
        <span className="tabular">{slideNumber(index)}</span>
      </div>
      <span className="tb-sep" aria-hidden="true" />
      <div className="tb-cell t-foot">
        <span className="tb-k">Sección</span>
        <span>{slide.section}</span>
      </div>
      {navy ? (
        <img className="tb-logo" src="/brand/iae-escudo-blanco.png" alt="Escudo del Instituto Alberto Einstein" width={mode === 'stage' ? 64 : 48} height={mode === 'stage' ? 64 : 48} style={{ width: mode === 'stage' ? 64 : 48 }} />
      ) : (
        <img className="tb-logo" src="/brand/iae-logo-color-ib.png" alt="Instituto Alberto Einstein, IB World School" width={525} height={239} />
      )}
    </footer>
  )
}

function Head({ slide, eyebrow, display }: { slide: Slide; eyebrow?: string; display?: boolean }) {
  return (
    <header className="slide-head">
      {eyebrow && <p className="eyebrow" style={{ marginBottom: '0.7em' }}>{eyebrow}</p>}
      <h2 className={display ? 't-display' : 't-title'}>{slide.title}</h2>
    </header>
  )
}

interface ViewProps { slide: Slide; index: number; beat: number; mode: Mode }

function Body({ slide, beat, mode }: ViewProps) {
  const stage = mode === 'stage'
  const gap = (s: number, f: number) => (stage ? s : f)

  switch (slide.layout) {
    case 'cover':
      return (
        <div className="slide-body" style={{ justifyContent: 'space-between', paddingBottom: gap(72, 24) }}>
          <img src="/brand/iae-logo-horizontal-blanco.png" alt="Instituto Alberto Einstein" width={1600} height={399} style={{ width: gap(360, 220), height: 'auto' }} />
          <Focal>
            <p className="eyebrow" style={{ marginBottom: gap(28, 16), marginTop: gap(0, 40) }}>{slide.eyebrow}</p>
            <h2 className="t-display" style={{ maxWidth: '12em' }}>{slide.title}</h2>
            <hr className="rule-gold" style={{ width: gap(140, 72), margin: `${gap(40, 22)}px 0` }} />
            <p className="t-body muted" style={{ maxWidth: '30em', textWrap: 'balance' }}>{slide.lead}</p>
          </Focal>
          <p className="t-sec" style={{ marginTop: gap(0, 32) }}>{slide.presenter}</p>
        </div>
      )

    case 'stat':
      return (
        <div className="slide-body" style={{ justifyContent: 'center', gap: gap(40, 24) }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: gap(64, 16), marginTop: gap(0, 16) }}>
            <Focal className="serif tabular" delay={0.12}>
              <p aria-label={`${slide.value} por ciento`} style={{ fontSize: gap(260, 96), fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.04em', fontVariationSettings: '"opsz" 144' }}>
                {slide.value}<span style={{ color: 'var(--bronze)', fontSize: '0.5em', marginLeft: '0.06em' }}>{slide.unit}</span>
              </p>
            </Focal>
            <p className="t-body" style={{ flex: '1 1 320px', maxWidth: '22em' }}>{slide.label}</p>
          </div>
          <p className="t-sec" style={{ borderLeft: '4px solid var(--gold)', paddingLeft: gap(28, 16), maxWidth: '30em' }}>{slide.line}</p>
          {slide.sources?.map((s) => <Cite key={s} id={s} />)}
        </div>
      )

    case 'floorCeiling':
      return (
        <div className="slide-body" style={{ justifyContent: 'center', gap: gap(28, 18), paddingTop: gap(72, 44) }}>
          <figure aria-label="Corte de un edificio: el currículo es el piso y el club abre el techo" style={{ position: 'relative' }}>
            <Beat show={beat >= 1}>
              <div style={{ position: 'relative', borderLeft: '2px solid var(--ink-line)', borderRight: '2px solid var(--ink-line)', padding: gap(36, 18), paddingTop: gap(56, 34), marginInline: gap(48, 8) }}>
                <svg viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, width: '100%', height: gap(40, 24) }}>
                  <line x1="0" y1="2" x2="360" y2="2" stroke="#C8A24B" strokeWidth="4" strokeDasharray="18 12" vectorEffect="non-scaling-stroke" />
                  <line x1="640" y1="2" x2="1000" y2="2" stroke="#C8A24B" strokeWidth="4" strokeDasharray="18 12" vectorEffect="non-scaling-stroke" />
                </svg>
                <svg viewBox="0 0 60 80" aria-hidden="true" style={{ position: 'absolute', left: '50%', top: gap(-60, -36), width: gap(42, 26), transform: 'translateX(-50%)' }}>
                  <path d="M30 78 V6 M8 28 L30 6 L52 28" fill="none" stroke="#7A5A14" strokeWidth="5" strokeLinecap="square" />
                </svg>
                <p className="eyebrow">Techo abierto</p>
                <p className="t-body strong serif" style={{ marginTop: 6 }}>{slide.ceiling.label}</p>
                <p className="t-sec muted">{slide.ceiling.detail}</p>
              </div>
            </Beat>
            <Beat show={beat >= 0}>
              <div style={{ background: 'var(--navy)', color: 'var(--navy-text)', padding: `${gap(32, 18)}px ${gap(48, 18)}px`, boxShadow: 'var(--shadow-sheet)' }}>
                <p className="eyebrow" style={{ color: 'var(--gold)' }}>Piso</p>
                <p className="t-body strong serif" style={{ marginTop: 6 }}>{slide.floor.label}</p>
                <p className="t-sec" style={{ color: 'var(--navy-muted)' }}>{slide.floor.detail}</p>
              </div>
              <svg viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true" style={{ width: '100%', height: gap(24, 14) }}>
                {Array.from({ length: 50 }, (_, i) => <line key={i} x1={i * 20} y1="24" x2={i * 20 + 20} y2="0" stroke="#2B4066" strokeOpacity="0.35" strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
              </svg>
            </Beat>
          </figure>
          <Beat show={beat >= 2}>
            <p className="t-sec" style={{ textAlign: 'center' }}>{slide.link}</p>
          </Beat>
        </div>
      )

    case 'steps':
      return (
        <div className="slide-body" style={{ justifyContent: 'flex-end', gap: gap(28, 20), paddingTop: gap(32, 20) }}>
          <Focal>
            <div style={{ display: 'flex', flexDirection: stage ? 'row' : 'column', alignItems: stage ? 'flex-end' : 'stretch', gap: gap(0, 12) }}>
              {slide.steps.map((s, i) => (
                <div
                  key={s.grade}
                  className="sheet"
                  style={{
                    flex: 1,
                    height: stage ? [230, 300, 370][i] : undefined,
                    marginLeft: stage ? (i ? -1 : 0) : i * 16,
                    padding: gap(32, 16),
                    borderTop: `${gap(6, 4)}px solid ${i === 2 ? 'var(--gold)' : 'var(--ink-line)'}`,
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
                  }}
                >
                  <p className="eyebrow">{s.grade}</p>
                  <p className="serif" style={{ fontSize: gap(64, 28), fontWeight: 600, lineHeight: 1.05, letterSpacing: '-0.02em', marginTop: gap(8, 4) }}>{s.verb}</p>
                  <p className="t-small muted" style={{ marginTop: gap(12, 6) }}>{s.line}</p>
                </div>
              ))}
            </div>
          </Focal>
          <p className="t-foot" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', alignItems: 'baseline' }}>
            <span>{slide.note}</span>
            {slide.sources?.map((s) => <Cite key={s} id={s} />)}
          </p>
        </div>
      )

    case 'table': {
      const shown = (r: number) => slide.beats.findIndex((b) => b.includes(r)) <= beat
      const kind = ['octavo', 'noveno', 'decimo'].includes(slide.id) ? 'grade' : slide.columns[0] === 'Criterio' ? 'rubric' : slide.id === 'plan' ? 'plan' : 'default'
      const widths: Record<string, (string | undefined)[]> = {
        grade: ['13%', '33%', undefined],
        rubric: ['24%', '10%', undefined],
        plan: ['27%', '24%', undefined],
        default: ['9%', '50%', undefined],
      }
      const cls = (c: number, last: boolean) =>
        kind === 'grade' ? (c === 0 ? 't-sec strong serif tabular' : c === 1 ? 't-small strong' : 't-small')
          : kind === 'rubric' ? (c === 0 ? 't-dense strong serif' : c === 1 ? 't-dense tabular muted' : 't-dense')
            : c === 0 ? 't-sec strong serif' : last ? 't-small strong' : 't-small muted'
      return (
        <div className="slide-body" style={{ justifyContent: 'center', gap: gap(24, 16), paddingTop: gap(16, 16) }}>
          <table className="dx-table">
            <thead>
              <tr>{slide.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
            </thead>
            <tbody>
              {slide.rows.map((row, r) => (
                <Beat key={row[0] + row[1]} as="tr" show={shown(r)}>
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      data-k={c > 0 ? slide.columns[c] : undefined}
                      className={cls(c, c === row.length - 1)}
                      style={stage ? { width: widths[kind][c] } : undefined}
                    >
                      {kind === 'grade' && c === 0 ? <><span className="sr-only">Trimestre </span>T{cell}</> : cell}
                    </td>
                  ))}
                </Beat>
              ))}
            </tbody>
          </table>
          {slide.callout && <p className="t-sec strong" style={{ borderLeft: '4px solid var(--gold)', paddingLeft: gap(28, 16) }}>{slide.callout}</p>}
          {slide.footnote && <p className="t-foot">{slide.footnote}</p>}
        </div>
      )
    }

    case 'portfolio':
      return (
        <div className="slide-body" style={{ justifyContent: 'center', gap: gap(36, 20), paddingTop: gap(16, 16) }}>
          <Focal>
            <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column' }}>
              {slide.items.map((it, i) => (
                <li
                  key={it.grade}
                  className="sheet"
                  style={{ display: 'flex', alignItems: 'baseline', gap: gap(36, 14), padding: `${gap(22, 14)}px ${gap(32, 16)}px`, marginLeft: (stage ? 56 : 10) * i, marginTop: i ? -1 : 0 }}
                >
                  <span className="serif tabular" style={{ fontSize: gap(48, 24), fontWeight: 700, color: 'var(--bronze)', minWidth: '2.2em' }}>{it.grade}</span>
                  <span className="t-sec">{it.piece}</span>
                </li>
              ))}
            </ol>
          </Focal>
          <p className="t-sec strong" style={{ borderLeft: '4px solid var(--gold)', paddingLeft: gap(28, 16) }}>{slide.line}</p>
        </div>
      )

    case 'statement':
      return (
        <div className="slide-body" style={{ justifyContent: 'center', gap: gap(48, 24) }}>
          <p className="t-body" style={{ color: 'var(--navy-muted)', maxWidth: '28em' }}>{slide.lead}</p>
          <Focal>
            <blockquote style={{ borderLeft: `${gap(6, 4)}px solid var(--gold)`, paddingLeft: gap(40, 18) }}>
              <p className="serif" style={{ fontSize: gap(52, 22), fontStyle: 'italic', fontWeight: 600, lineHeight: 1.2, maxWidth: '24em' }}>“{slide.quote}”</p>
              <footer className="t-sec" style={{ marginTop: gap(20, 10), color: 'var(--navy-muted)' }}>{slide.attribution}</footer>
            </blockquote>
          </Focal>
        </div>
      )

    case 'timeline': {
      const shown = (k: number) => slide.beats.findIndex((b) => b.includes(k)) <= beat
      return (
        <div className="slide-body" style={{ justifyContent: 'center', gap: gap(24, 16), paddingTop: gap(16, 16) }}>
          <ol style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: stage ? '1fr 1fr' : '1fr', gridTemplateRows: stage ? 'repeat(3, auto)' : undefined, gridAutoFlow: stage ? 'column' : 'row', columnGap: 64, rowGap: gap(14, 10) }}>
            {slide.stations.map((st, k) => {
              const last = k === slide.stations.length - 1
              return (
                <li key={st.n}>
                  <Beat show={shown(k)}>
                    <div style={{ display: 'flex', gap: gap(24, 14), alignItems: 'flex-start', padding: `${gap(14, 10)}px ${gap(18, 12)}px`, background: last ? 'var(--navy)' : undefined, color: last ? 'var(--navy-text)' : undefined, boxShadow: last ? 'var(--shadow-sheet)' : undefined }}>
                      <span
                        className="serif tabular"
                        aria-hidden="true"
                        style={{ flex: 'none', width: gap(64, 36), height: gap(64, 36), borderRadius: 999, border: `${gap(3, 2)}px solid ${last ? 'var(--gold)' : 'var(--ink-line)'}`, display: 'grid', placeItems: 'center', fontSize: gap(32, 18), fontWeight: 700, color: last ? 'var(--gold)' : 'var(--ink)' }}
                      >
                        {st.n}
                      </span>
                      <div>
                        <p className="t-sec strong"><span className="sr-only">Clase {st.n}: </span>{st.title}</p>
                        <p className="t-small" style={{ color: last ? 'var(--navy-muted)' : 'var(--ink-muted)' }}>{st.out}</p>
                      </div>
                    </div>
                  </Beat>
                </li>
              )
            })}
          </ol>
          <p className="t-foot">{slide.line}</p>
        </div>
      )
    }

    case 'locked':
      return (
        <div className="slide-body" style={{ display: 'flex', flexDirection: stage ? 'row' : 'column', alignItems: stage ? 'center' : 'stretch', gap: gap(72, 24), paddingTop: gap(16, 20) }}>
          <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: gap(28, 14) }}>
            <p className="t-body">{slide.lead}</p>
            <p className="t-sec muted">{slide.line}</p>
          </div>
          <Focal className="locked-wrap" delay={0.1}>
            <article
              data-locked="sat"
              aria-label={`${slide.card.title}, en reserva. ${slide.card.impact}`}
              className="sheet"
              style={{ position: 'relative', width: stage ? 680 : '100%', overflow: 'hidden', borderTop: `${gap(6, 4)}px solid var(--gold)` }}
            >
              <div className="skeleton" aria-hidden="true" style={{ filter: 'blur(9px)', padding: gap(32, 18), display: 'flex', flexDirection: 'column', gap: gap(16, 10), opacity: 0.85 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: gap(56, 36), height: gap(56, 36), borderRadius: 999, background: '#c9cfda' }} />
                  <div style={{ flex: 1, height: gap(18, 12), background: '#c9cfda' }} />
                </div>
                {[92, 78, 85, 60].map((w, i) => <div key={i} style={{ width: `${w}%`, height: gap(16, 10), background: '#d6dbe3' }} />)}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: gap(90, 54) }}>
                  {[40, 70, 55, 85, 65].map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 3 ? '#e0cfa4' : '#d6dbe3' }} />)}
                </div>
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: gap(32, 18), background: 'linear-gradient(180deg, rgb(253 252 248 / 0.35) 0%, rgb(253 252 248 / 0.94) 46%, #fdfcf8 100%)' }}>
                <p className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: gap(30, 18), height: gap(30, 18) }}>
                    <rect x="4" y="10" width="16" height="11" rx="1" fill="none" stroke="#7A5A14" strokeWidth="2" />
                    <path d="M8 10 V7 a4 4 0 0 1 8 0 V10" fill="none" stroke="#7A5A14" strokeWidth="2" />
                  </svg>
                  {slide.card.eyebrow}
                </p>
                <h3 className="serif" style={{ fontSize: gap(56, 26), fontWeight: 600, letterSpacing: '-0.02em', marginTop: gap(10, 6) }}>{slide.card.title}</h3>
                <p className="t-small" style={{ marginTop: gap(8, 4) }}>{slide.card.impact}</p>
                <p className="t-foot" style={{ marginTop: gap(10, 6) }}>{slide.card.meta}</p>
              </div>
            </article>
          </Focal>
        </div>
      )

    case 'evidence':
      return (
        <div className="slide-body" style={{ justifyContent: 'center', paddingTop: gap(8, 16) }}>
          <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column' }}>
            {slide.items.map((it, i) => (
              <li key={it.claim} style={{ display: 'flex', flexDirection: stage ? 'row' : 'column', gap: gap(48, 6), padding: `${gap(20, 14)}px 0`, borderTop: i ? '1px solid rgb(43 64 102 / 0.2)' : '2px solid var(--ink)' }}>
                <div style={{ flex: stage ? '0 0 470px' : undefined, display: 'flex', flexDirection: 'column', gap: gap(8, 4) }}>
                  <p className="t-sec strong serif">{it.claim}</p>
                  <Cite id={it.source} />
                </div>
                <p className="t-small" style={{ flex: 1 }}>{it.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      )

    case 'pledges':
      return (
        <div className="slide-body" style={{ justifyContent: 'center', gap: gap(24, 16), paddingTop: gap(8, 16) }}>
          <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column' }}>
            {slide.items.map((it, i) => (
              <li key={it.label} style={{ display: 'flex', flexDirection: stage ? 'row' : 'column', gap: gap(48, 4), padding: `${gap(20, 14)}px 0`, borderTop: i ? '1px solid rgb(43 64 102 / 0.2)' : '2px solid var(--ink)' }}>
                <p className="t-sec strong serif" style={{ flex: stage ? '0 0 300px' : undefined, display: 'flex', gap: gap(18, 10), alignItems: 'baseline' }}>
                  <span className="tabular" style={{ color: 'var(--bronze)' }}>{pad(i + 1)}</span>{it.label}
                </p>
                <p className="t-small" style={{ flex: 1 }}>{it.text}</p>
              </li>
            ))}
          </ol>
          <p className="t-foot" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', alignItems: 'baseline' }}>
            <span>{slide.footnote}</span>
            {slide.sources?.map((s) => <Cite key={s} id={s} />)}
          </p>
        </div>
      )

    case 'twoCols':
      return (
        <div className="slide-body" style={{ justifyContent: 'center', gap: gap(28, 16), paddingTop: gap(8, 16) }}>
          <div style={{ display: 'flex', flexDirection: stage ? 'row' : 'column', gap: gap(48, 16) }}>
            {[slide.left, slide.right].map((col, c) => (
              <section key={col.label} className="sheet" aria-label={col.label} style={{ flex: 1, padding: gap(32, 18), borderTop: `${gap(6, 4)}px solid ${c === 0 ? 'var(--ink-line)' : 'var(--gold)'}` }}>
                <h3 className="eyebrow" style={{ marginBottom: gap(16, 10) }}>{col.label}</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {col.items.map((t, i) => (
                    <li key={t} className="t-small" style={{ padding: `${gap(14, 10)}px 0`, borderTop: i ? '1px solid rgb(43 64 102 / 0.16)' : undefined }}>{t}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <p className="t-foot">{slide.footnote}</p>
        </div>
      )

    case 'ask':
      return (
        <div className="slide-body" style={{ justifyContent: 'center', gap: gap(32, 20), paddingTop: gap(8, 16) }}>
          <ol style={{ listStyle: 'none', padding: 0 }}>
            {slide.decisions.map((d, i) => (
              <li key={d} className="t-sec" style={{ display: 'flex', gap: gap(24, 12), alignItems: 'baseline', padding: `${gap(14, 10)}px 0`, borderTop: i ? '1px solid rgb(235 238 242 / 0.14)' : undefined }}>
                <span className="serif tabular strong" style={{ color: 'var(--gold)', minWidth: '1.2em' }}>{i + 1}</span>
                <span>{d}</span>
              </li>
            ))}
          </ol>
          <Focal>
            <div style={{ border: '2px solid var(--gold)', padding: `${gap(24, 14)}px ${gap(32, 16)}px`, background: 'var(--navy-surface)', boxShadow: '0 1px 0 rgb(235 238 242 / 0.06) inset, 0 2px 4px rgb(4 8 16 / 0.4), 0 18px 36px -12px rgb(4 8 16 / 0.6)' }}>
              <p className="eyebrow">{slide.firstStep.label}</p>
              <p className="t-body serif strong" style={{ marginTop: gap(8, 4) }}>{slide.firstStep.text}</p>
            </div>
          </Focal>
          <p className="t-foot">{slide.more}</p>
        </div>
      )

    case 'list':
      return (
        <div className="slide-body" style={{ justifyContent: 'center', gap: gap(20, 14), paddingTop: gap(8, 16) }}>
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: stage && slide.items.length > 4 ? '1fr 1fr' : '1fr', columnGap: 56 }}>
            {slide.items.map((it, i) => (
              <div key={it.label} style={{ padding: `${gap(14, 10)}px 0`, borderTop: i < (stage && slide.items.length > 4 ? 2 : 1) ? '2px solid var(--ink)' : '1px solid rgb(43 64 102 / 0.2)' }}>
                <dt className="strong" style={{ fontSize: gap(30, 17), lineHeight: 1.3 }}>{it.label}</dt>
                <dd className="muted" style={{ margin: 0, fontSize: gap(30, 17), lineHeight: 1.36 }}>{it.text}</dd>
              </div>
            ))}
          </dl>
          {(slide.footnote || slide.sources) && (
            <p className="t-foot" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', alignItems: 'baseline' }}>
              {slide.footnote && <span>{slide.footnote}</span>}
              {slide.sources?.map((s) => <Cite key={s} id={s} />)}
            </p>
          )}
        </div>
      )

    case 'sources':
      return (
        <div className="slide-body" style={{ justifyContent: 'center', paddingTop: gap(8, 16) }}>
          <ol style={{ listStyle: 'none', padding: 0 }}>
            {Object.values(SOURCES).map((s, i) => (
              <li key={s.id} style={{ padding: `${gap(10, 10)}px 0`, borderTop: i ? '1px solid rgb(43 64 102 / 0.2)' : '2px solid var(--ink)', fontSize: gap(24, 16), lineHeight: 1.35 }}>
                <span className="strong">{s.publisher}</span> · {s.title} · {s.date}.{' '}
                <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-line)', wordBreak: 'break-word' }}>{new URL(s.url).hostname.replace(/^www\./, '')}</a>
              </li>
            ))}
          </ol>
        </div>
      )
  }
}

export function SlideView({ slide, index, beat, mode, print = false }: ViewProps & { print?: boolean }) {
  const appendix = slide.section === 'Apéndice'
  const label = appendix ? `Apéndice ${slide.id}: ${slide.title}` : `Lámina ${index + 1} de ${MAIN_COUNT}: ${slide.title}`
  return (
    <section
      className={`slide tone-${slide.tone}`}
      aria-roledescription="lámina"
      aria-label={label}
      data-slide={slide.id}
      data-layout={slide.layout}
    >
      {slide.layout === 'cover' ? null : (
        <Head
          slide={slide}
          eyebrow={appendix ? `Apéndice ${slide.id}` : slide.section === 'Builders Club' && slide.layout === 'statement' ? 'Builders Club · 9.º a 11.º' : undefined}
        />
      )}
      <Body slide={slide} index={index} beat={print ? 99 : beat} mode={mode} />
      {slide.layout !== 'cover' && <TitleBlock slide={slide} index={index} mode={mode} />}
    </section>
  )
}
