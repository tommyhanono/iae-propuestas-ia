import { SLIDES } from '../content'
import { ACCESO, ENSENAR, GRADES, METRICAS } from '../curriculo'

const pedido = SLIDES.find((s) => s.layout === 'ask')

/** Resumen de una página para imprimir y entregar en la reunión. */
export default function Resumen() {
  return (
    <main className="resumen">
      <header className="r-head">
        <div>
          <p className="eyebrow">Propuesta para la directiva del IAE · resumen de una página</p>
          <h1>Construir con IA, no copiar con IA</h1>
          <p className="r-by">Presenta Thomas Hanono, candidato a presidente del Builders Club</p>
        </div>
        <img src="/brand/iae-logo-color-ib.png" alt="Instituto Alberto Einstein, IB World School" width={525} height={239} />
      </header>

      <p className="r-lead">{ENSENAR.idea}</p>

      <div className="r-cols">
        <section>
          <h2>Currículo de 8.º a 10.º · para todos</h2>
          <ul>
            {GRADES.map((g) => (
              <li key={g.id}><strong>{g.grado} · {g.verbo}.</strong> {g.lema}. Proyecto final: {g.entregable.nombre.charAt(0).toLowerCase() + g.entregable.nombre.slice(1)}.</li>
            ))}
            <li>Un período semanal de 45 minutos dentro de Tecnología: 30 clases por año.</li>
          </ul>
        </section>
        <section>
          <h2>Builders Club de 9.º a 11.º · voluntario</h2>
          <ul>
            <li>Seis clases de 60 minutos hasta el Demo Day: cada miembro presenta un producto para el colegio.</li>
            <li>Banco de encargos: biblioteca, deportes, eventos y laboratorios piden herramientas; los alumnos las construyen.</li>
            <li>Las clases las preparan y las dan los propios miembros.</li>
          </ul>
        </section>
      </div>

      <div className="r-cols">
        <section>
          <h2>Aprender enseñando</h2>
          <ul>
            {ENSENAR.mecanismos.slice(0, 4).map((m) => <li key={m.nombre}><strong>{m.nombre}.</strong> {m.como.split('. ')[0]}.</li>)}
          </ul>
        </section>
        <section>
          <h2>Arranca el primer día</h2>
          <ul>
            {ACCESO.niveles.map((n) => <li key={n.nombre}><strong>{n.nombre}.</strong> {n.items[0]}</li>)}
          </ul>
          <h2 className="r-h2b">Metas del primer año</h2>
          <ul>
            {METRICAS.slice(0, 2).map((m) => <li key={m.k}><strong>{m.k}.</strong> {m.v}</li>)}
          </ul>
        </section>
      </div>

      {pedido?.layout === 'ask' && (
        <section className="r-ask">
          <h2>Lo que pedimos hoy</h2>
          <ol>
            {pedido.decisions.map((d) => <li key={d}>{d}</li>)}
          </ol>
          <p><strong>{pedido.firstStep.label}:</strong> {pedido.firstStep.text}</p>
        </section>
      )}

      <footer className="r-foot">
        <img src="/qr-curriculo.svg" alt="Código QR del currículo completo" width={96} height={96} />
        <p>
          Currículo completo, clase por clase: <a href="/directiva/curriculo/">iae-propuestas-ia.vercel.app/directiva/curriculo</a>
          <br />Presentación: <a href="/directiva/">iae-propuestas-ia.vercel.app/directiva</a>
        </p>
      </footer>
    </main>
  )
}
