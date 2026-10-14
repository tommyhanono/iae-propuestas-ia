import { SOURCES } from '../content'
import { CLUB, FORMACION, GRADES, IMPLEMENTACION, MARCO, METRICAS, NIVELES, PORTAFOLIO, type Grade } from '../curriculo'

const TOC = [
  { id: 'resumen', t: 'Resumen' },
  { id: 'como-funciona', t: 'Cómo funciona' },
  ...GRADES.map((g) => ({ id: `grado-${g.id}`, t: `${g.grado} · ${g.verbo}` })),
  { id: 'portafolio', t: 'El portafolio' },
  { id: 'evaluacion', t: 'Evaluación' },
  { id: 'formacion', t: 'Formación docente' },
  { id: 'club', t: 'Builders Club' },
  { id: 'garantias', t: 'Garantías' },
  { id: 'implementacion', t: 'Implementación y métricas' },
  { id: 'fuentes', t: 'Fuentes' },
]

function KV({ items }: { items: { k: string; v: string }[] }) {
  return (
    <dl className="kv">
      {items.map((it) => (
        <div key={it.k}>
          <dt>{it.k}</dt>
          <dd>{it.v}</dd>
        </div>
      ))}
    </dl>
  )
}

function GradeSection({ g }: { g: Grade }) {
  return (
    <section id={`grado-${g.id}`} className="grade" aria-labelledby={`h-grado-${g.id}`}>
      <header className="grade-head">
        <p className="eyebrow">{g.grado} · {g.verbo}</p>
        <h2 id={`h-grado-${g.id}`}>{g.lema}</h2>
        <p className="lead">{g.objetivo}</p>
      </header>

      <h3>Lo que el alumno sabe hacer al terminar el año</h3>
      <ul className="checks">
        {g.competencias.map((c) => <li key={c}>{c}</li>)}
      </ul>

      <h3>Las 30 sesiones, unidad por unidad</h3>
      {g.unidades.map((u) => (
        <div key={u.nombre} className="unit">
          <div className="unit-head">
            <p className="eyebrow">{u.trimestre}</p>
            <h4>{u.nombre}</h4>
            <p>{u.meta}</p>
          </div>
          <table className="sessions">
            <thead>
              <tr><th scope="col">Semana</th><th scope="col">Tema</th><th scope="col">Qué hace el alumno</th></tr>
            </thead>
            <tbody>
              {u.sesiones.map((s) => (
                <tr key={s.n}>
                  <td className="num">{s.n}</td>
                  <td className="tema">{s.tema}</td>
                  <td>{s.hace}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="evidence"><span>Evidencia de la unidad</span>{u.evidencia}</p>
        </div>
      ))}

      <h3>Así es una clase de 45 minutos</h3>
      <ol className="timeline">
        {g.claseTipo.map((c) => (
          <li key={c.min}>
            <span className="min">{c.min} min</span>
            <span><strong>{c.momento}.</strong> {c.detalle}</span>
          </li>
        ))}
      </ol>

      <h3>Prompt de ejemplo</h3>
      <blockquote className="prompt">{g.prompt}</blockquote>

      <h3>Entregable del año: {g.entregable.nombre}</h3>
      <p>{g.entregable.descripcion}</p>
      <ul className="checks">
        {g.entregable.formato.map((f) => <li key={f}>{f}</li>)}
      </ul>

      <h3>Rúbrica del entregable</h3>
      <div className="rubric-wrap">
        <table className="rubric">
          <thead>
            <tr>
              <th scope="col">Criterio</th>
              {NIVELES.map((n) => <th scope="col" key={n}>{n}</th>)}
            </tr>
          </thead>
          <tbody>
            {g.rubrica.map((r) => (
              <tr key={r.criterio}>
                <th scope="row">{r.criterio}<span className="peso">{r.peso}</span></th>
                {r.niveles.map((d, i) => <td key={i} data-k={NIVELES[i]}>{d}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function Doc() {
  return (
    <div className="doc">
      <header className="cover">
        <div className="cover-inner">
          <img src="/brand/iae-logo-horizontal-blanco.png" alt="Instituto Alberto Einstein" width={1600} height={399} className="cover-logo" />
          <p className="eyebrow">Propuesta para la directiva del IAE · documento completo</p>
          <h1>Currículo de IA de 8.º a 10.º y Builders Club</h1>
          <p className="lead">{MARCO.resumen}</p>
          <p className="by">Presenta Thomas Hanono, candidato a presidente del Builders Club · <a href="/directiva/">Ver la presentación</a></p>
        </div>
      </header>

      <div className="layout">
        <nav className="toc" aria-label="Contenido">
          <p className="eyebrow">Contenido</p>
          <ol>
            {TOC.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.t}</a></li>)}
          </ol>
        </nav>

        <main className="content">
          <section id="resumen" aria-labelledby="h-resumen">
            <h2 id="h-resumen">Resumen</h2>
            <table className="overview">
              <thead>
                <tr><th scope="col">Año</th><th scope="col">Verbo</th><th scope="col">Unidades</th><th scope="col">Entregable del año</th></tr>
              </thead>
              <tbody>
                {GRADES.map((g) => (
                  <tr key={g.id}>
                    <th scope="row">{g.grado}</th>
                    <td>{g.verbo}</td>
                    <td>{g.unidades.map((u) => u.nombre).join(' · ')}</td>
                    <td>{g.entregable.nombre}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">9.º a 11.º</th>
                  <td>Construir</td>
                  <td>Builders Club: seis clases y ciclos de seis semanas</td>
                  <td>Un producto presentado en el Demo Day</td>
                </tr>
              </tbody>
            </table>
            <p>El currículo pone el piso para todos; el club quita el techo para quien quiera ir más lejos. Una propuesta no reemplaza a la otra.</p>
          </section>

          <section id="como-funciona" aria-labelledby="h-como">
            <h2 id="h-como">Cómo funciona</h2>
            <KV items={MARCO.carga} />
            <h3>Principios</h3>
            <KV items={MARCO.principios} />
            <h3>La bitácora de IA</h3>
            <p>Cada sesión cierra con cuatro líneas escritas por el alumno:</p>
            <ol className="numbered">
              {MARCO.bitacora.map((b) => <li key={b}>{b}</li>)}
            </ol>
          </section>

          {GRADES.map((g) => <GradeSection key={g.id} g={g} />)}

          <section id="portafolio" aria-labelledby="h-portafolio">
            <h2 id="h-portafolio">El portafolio con que sale cada alumno</h2>
            <table className="overview">
              <thead><tr><th scope="col">Año</th><th scope="col">Pieza</th><th scope="col">Qué incluye</th></tr></thead>
              <tbody>
                {PORTAFOLIO.map((p) => <tr key={p.grado}><th scope="row">{p.grado}</th><td>{p.pieza}</td><td>{p.incluye}</td></tr>)}
              </tbody>
            </table>
          </section>

          <section id="evaluacion" aria-labelledby="h-evaluacion">
            <h2 id="h-evaluacion">Evaluación</h2>
            <p>Propuesta de ponderación dentro de la nota de Tecnología, a confirmar con la coordinación:</p>
            <KV items={MARCO.calificacion} />
            <p>Las rúbricas de cada año usan cuatro niveles: Inicial, En desarrollo, Logrado y Destacado. La meta del piloto es que el grupo llegue a Logrado o Destacado en el entregable de la unidad 1.</p>
          </section>

          <section id="formacion" aria-labelledby="h-formacion">
            <h2 id="h-formacion">Formación docente</h2>
            <KV items={FORMACION} />
          </section>

          <section id="club" aria-labelledby="h-club" className="grade">
            <header className="grade-head">
              <p className="eyebrow">9.º a 11.º · voluntario</p>
              <h2 id="h-club">Builders Club: la IA es la herramienta, lo que importa es el producto</h2>
              <p className="lead">Un club donde se construyen productos reales que le sirvan al colegio. Cada sesión termina con algo hecho.</p>
            </header>
            <KV items={CLUB.ficha} />
            <h3>Las seis clases, minuto a minuto</h3>
            {CLUB.sesiones.map((s) => (
              <div key={s.n} className="unit">
                <div className="unit-head">
                  <p className="eyebrow">Clase {s.n} · 60 minutos</p>
                  <h4>{s.nombre}</h4>
                  <p>{s.objetivo}</p>
                </div>
                <ol className="timeline">
                  {s.agenda.map((a) => <li key={a.min}><span className="min">{a.min} min</span><span>{a.que}</span></li>)}
                </ol>
                <p className="evidence"><span>Sale de la clase</span>{s.sale}</p>
              </div>
            ))}
            <h3>Cómo se evalúa un producto en el Demo Day</h3>
            <KV items={CLUB.demoRubrica} />
            <h3>Después del primer Demo Day</h3>
            <KV items={CLUB.despues} />
            <h3>Cómo un producto llega a usarse en el colegio</h3>
            <KV items={CLUB.camino} />
            <h3>Reglas de uso del club</h3>
            <ol className="numbered">
              {CLUB.reglas.map((r) => <li key={r}>{r}</li>)}
            </ol>
          </section>

          <section id="garantias" aria-labelledby="h-garantias">
            <h2 id="h-garantias">Garantías: integridad, supervisión y datos</h2>
            <KV items={[
              { k: 'Integridad', v: 'Todo entregable se explica en voz alta y lleva bitácora de IA. En el club, cada producto se presenta en vivo. Los trabajos con reglas propias, como AP Research, siguen sus reglas tal cual.' },
              { k: 'Supervisión', v: 'Un docente enlace acompaña el club y el docente de Tecnología guía el currículo. El acceso es institucional, con la herramienta que el colegio apruebe para la edad de cada grupo y dentro de los términos de cada proveedor.' },
              { k: 'Datos personales', v: 'En los prompts no se ingresan nombres, notas ni datos de nadie; los archivos de práctica usan datos ficticios o anonimizados. Los acudientes reciben una explicación clara y dan su consentimiento cuando corresponda.' },
              { k: 'Marco', v: 'Seguimos los principios de la Ley 81 de 2019 y su reglamento (Decreto Ejecutivo 285 de 2021): finalidad, proporcionalidad, seguridad, transparencia y consentimiento. Son prácticas y compromisos, no una opinión legal.' },
              { k: 'Términos del proveedor', v: 'Las herramientas de IA tienen requisitos de edad. Por ejemplo, Anthropic pide 18 años para sus cuentas personales y, para menores, contempla productos de organizaciones con salvaguardas. Por eso pedimos respaldo institucional, no cuentas personales.' },
            ]} />
          </section>

          <section id="implementacion" aria-labelledby="h-impl">
            <h2 id="h-impl">Implementación y métricas</h2>
            <table className="overview">
              <thead><tr><th scope="col">Cuándo</th><th scope="col">Qué pasa</th><th scope="col">Quién</th></tr></thead>
              <tbody>
                {IMPLEMENTACION.map((r) => <tr key={r.cuando}><th scope="row">{r.cuando}</th><td>{r.que}</td><td>{r.quien}</td></tr>)}
              </tbody>
            </table>
            <h3>Cómo sabremos que funciona</h3>
            <KV items={METRICAS} />
            <h3>Lo que pone el colegio y lo que ponemos nosotros</h3>
            <KV items={[
              { k: 'El colegio', v: 'Un docente enlace para el club, el período semanal de Tecnología para el currículo, un horario y un salón para el club, y el acceso supervisado a una herramienta apta.' },
              { k: 'Nosotros', v: 'El plan de las seis clases y sus materiales, la coordinación del club, apoyo para preparar las guías de cada unidad e informes al cierre de cada fase.' },
            ]} />
            <p className="note">Las fechas exactas dependen del calendario del IAE y quedan a confirmar.</p>
          </section>

          <section id="fuentes" aria-labelledby="h-fuentes">
            <h2 id="h-fuentes">Fuentes</h2>
            <ol className="numbered sources">
              {Object.values(SOURCES).map((s) => (
                <li key={s.id}><strong>{s.publisher}</strong> · {s.title} · {s.date}. <a href={s.url} target="_blank" rel="noopener noreferrer">{new URL(s.url).hostname.replace(/^www\./, '')}</a></li>
              ))}
            </ol>
          </section>
        </main>
      </div>

      <footer className="doc-foot">
        <img src="/brand/iae-logo-color-ib.png" alt="Instituto Alberto Einstein, IB World School" width={525} height={239} />
        <p>Propuesta para la directiva del IAE · <a href="/directiva/">Volver a la presentación</a></p>
      </footer>
    </div>
  )
}
