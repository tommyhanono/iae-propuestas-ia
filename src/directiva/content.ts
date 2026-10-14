// Contenido de la presentación para la directiva: titulares, cuerpo, notas del orador y fuentes.
// Todo lo que se lee en pantalla vive aquí. scripts/content-check-directiva.mjs lo revisa antes de cada build.
// El detalle completo del currículo y del club vive en curriculo.ts y se reutiliza en el apéndice.
import { CLUB, FORMACION, GRADES } from './curriculo.ts'

export type Tone = 'navy' | 'paper'

export type SourceId = 'pew' | 'unesco' | 'kestin' | 'oecd' | 'estonia' | 'anthropic' | 'ley81'

export interface Source {
  id: SourceId
  /** Cómo se cita en pantalla. */
  short: string
  publisher: string
  title: string
  date: string
  url: string
}

export const SOURCES: Record<SourceId, Source> = {
  pew: {
    id: 'pew', short: 'Pew Research Center, 2026', publisher: 'Pew Research Center',
    title: 'How Teens Use and View AI', date: '24 de febrero de 2026',
    url: 'https://www.pewresearch.org/internet/2026/02/24/how-teens-use-and-view-ai/',
  },
  unesco: {
    id: 'unesco', short: 'UNESCO, 2024', publisher: 'UNESCO',
    title: 'AI competency framework for students', date: '2024',
    url: 'https://www.unesco.org/en/articles/ai-competency-framework-students',
  },
  kestin: {
    id: 'kestin', short: 'Scientific Reports, 2025', publisher: 'Scientific Reports (Nature Portfolio)',
    title: 'AI tutoring outperforms in-class active learning: an RCT introducing a novel research-based design in an authentic educational setting',
    date: '2025', url: 'https://www.nature.com/articles/s41598-025-97652-6',
  },
  oecd: {
    id: 'oecd', short: 'OCDE, 2026', publisher: 'OCDE',
    title: 'OECD Digital Education Outlook 2026: Exploring Effective Uses of Generative AI in Education',
    date: 'enero de 2026', url: 'https://www.oecd.org/en/publications/oecd-digital-education-outlook-2026_062a7394-en.html',
  },
  estonia: {
    id: 'estonia', short: 'Gobierno de Estonia, 2025', publisher: 'Ministerio de Educación e Investigación de Estonia',
    title: 'AI Leap Programme to Bring AI Tools to All Schools', date: 'febrero de 2025',
    url: 'https://www.hm.ee/en/news/estonia-announces-groundbreaking-national-initiative-ai-leap-programme-bring-ai-tools-all',
  },
  anthropic: {
    id: 'anthropic', short: 'Términos de Anthropic, 2025–2026', publisher: 'Anthropic',
    title: 'Consumer Terms of Service y guía para organizaciones que atienden a menores', date: '8 de octubre de 2025 y 16 de marzo de 2026',
    url: 'https://www.anthropic.com/legal/consumer-terms',
  },
  ley81: {
    id: 'ley81', short: 'Ley 81 de 2019, Panamá', publisher: 'Asamblea Nacional de Panamá · ANTAI',
    title: 'Ley 81 de 2019 sobre protección de datos personales y Decreto Ejecutivo 285 de 2021', date: '26 de marzo de 2019',
    url: 'https://s3-legispan.asamblea.gob.pa/legispan/NORMAS/2010/2019/LEY/Administrador%20Legispan_28743-A_2019_3_29_ASAMBLEA%20NACIONAL_81.pdf',
  },
}

export type Section = 'Apertura' | 'Currículo' | 'Builders Club' | 'Evidencia y garantías' | 'Plan y decisión' | 'Apéndice'

interface Base {
  /** Identificador estable para pruebas y hash del apéndice (A1…A7). */
  id: string
  section: Section
  tone: Tone
  /** Titular: una conclusión, no un tema. */
  title: string
  /** Tiempo objetivo en m:ss (0:00 en el apéndice). */
  time: string
  /** Guion hablado, en primera persona, a "ustedes". */
  notes: string
  sources?: SourceId[]
  /** Las cifras de la lámina son de la propia propuesta (pesos de rúbrica, semanas), no datos externos. */
  ownFigures?: true
}

export type Slide = Base & (
  | { layout: 'cover'; eyebrow: string; lead: string; presenter: string }
  | { layout: 'stat'; value: string; unit: string; label: string; line: string }
  | { layout: 'floorCeiling'; floor: { label: string; detail: string }; ceiling: { label: string; detail: string }; link: string }
  | { layout: 'steps'; steps: { grade: string; verb: string; line: string }[]; note: string }
  | { layout: 'table'; columns: string[]; rows: string[][]; beats: number[][]; footnote?: string; callout?: string }
  | { layout: 'portfolio'; items: { grade: string; piece: string }[]; line: string }
  | { layout: 'statement'; lead: string; quote: string; attribution: string }
  | { layout: 'timeline'; stations: { n: string; title: string; out: string }[]; beats: number[][]; line: string }
  | { layout: 'locked'; lead: string; card: { eyebrow: string; title: string; impact: string; meta: string }; line: string }
  | { layout: 'evidence'; items: { claim: string; detail: string; source: SourceId }[] }
  | { layout: 'pledges'; items: { label: string; text: string }[]; footnote: string }
  | { layout: 'twoCols'; left: { label: string; items: string[] }; right: { label: string; items: string[] }; footnote: string }
  | { layout: 'ask'; decisions: string[]; firstStep: { label: string; text: string }; presenter: string; more: string }
  | { layout: 'list'; items: { label: string; text: string }[]; footnote?: string }
  | { layout: 'sources' }
)

export const TARGET_SECONDS = 15 * 60
export const PRESENTER = 'Thomas Hanono'
export const DECK_TITLE = 'Construir con IA, no copiar con IA'

export const SLIDES: Slide[] = [
  {
    id: 'portada', section: 'Apertura', tone: 'navy', layout: 'cover', time: '0:30',
    eyebrow: 'Propuestas para la directiva del IAE',
    title: 'Construir con IA, no copiar con IA',
    lead: 'Dos pasos concretos: un currículo de 8.º a 10.º y el Builders Club.',
    presenter: 'Presenta Thomas Hanono, candidato a presidente del Builders Club',
    notes: 'Les traigo una sola idea para que se la lleven hoy: el IAE puede formar estudiantes que construyen con IA, y puede empezar con dos pasos concretos. En catorce minutos les muestro cuáles son, qué evidencia los respalda y qué les pido al final.',
  },
  {
    id: 'oportunidad', section: 'Apertura', tone: 'paper', layout: 'stat', time: '0:45',
    title: 'Los estudiantes ya usan IA para estudiar. El IAE puede darle dirección.',
    value: '54', unit: '%',
    label: 'de los adolescentes de 13 a 17 años en EE. UU. ya usa chatbots de IA para ayudarse con tareas del colegio.',
    line: 'Lo que el colegio decide es qué aprenden a hacer con ella.',
    sources: ['pew'],
    notes: 'Empiezo con un dato. En Estados Unidos, más de la mitad de los adolescentes ya usa chatbots para el colegio, según una encuesta de Pew de este año. No tengo un dato igual de Panamá, pero ustedes lo ven en los pasillos. La IA ya está; lo que todavía podemos decidir es qué aprenden a hacer con ella. Mi propuesta es que aprendan a construir.',
  },
  {
    id: 'piso-techo', section: 'Apertura', tone: 'paper', layout: 'floorCeiling', time: '0:45',
    title: 'El currículo pone el piso. El club quita el techo.',
    floor: { label: 'Currículo 8.º a 10.º', detail: 'Para todo el colegio, dentro de las clases.' },
    ceiling: { label: 'Builders Club 9.º a 11.º', detail: 'Voluntario, para quien quiera ir más lejos.' },
    link: 'Una no reemplaza a la otra: se apoyan.',
    notes: 'Son dos propuestas y una sola progresión. El currículo es la base: llega a todos, de 8.º a 10.º. El club es voluntario, de 9.º a 11.º, para quien quiere seguir construyendo. Una no reemplaza a la otra. Empiezo por el currículo porque es la base.',
  },
  {
    id: 'progresion', section: 'Currículo', tone: 'paper', layout: 'steps', time: '0:45',
    title: 'En tres años, cada alumno pasa de leer a pedir a crear.',
    steps: [
      { grade: '8.º', verb: 'Leer', line: 'Entiende cómo está hecho un archivo real.' },
      { grade: '9.º', verb: 'Pedir', line: 'Da instrucciones claras y construye con ellas.' },
      { grade: '10.º', verb: 'Crear', line: 'Hace un producto propio que sirve.' },
    ],
    note: 'La misma progresión del marco de competencias en IA de la UNESCO: comprender, aplicar, crear.',
    sources: ['unesco'],
    notes: 'El currículo tiene una progresión simple. En 8.º aprenden a leer cómo está hecho un archivo. En 9.º aprenden a pedir bien. En 10.º crean algo propio. No me la inventé de la nada: el marco de competencias en IA que la UNESCO publicó en 2024 usa la misma idea, en tres niveles, comprender, aplicar y crear.',
  },
  {
    id: 'octavo', section: 'Currículo', tone: 'paper', layout: 'table', time: '0:50',
    title: 'En 8.º, cada alumno aprende a leer cualquier archivo.',
    columns: ['Trimestre', 'Unidad', 'Lo que logra el alumno'],
    rows: [
      ['1', 'Leer una hoja de cálculo', 'Explica celdas, rangos, tipos de datos y sus primeras fórmulas.'],
      ['2', 'Fórmulas que deciden', 'Entiende SI, CONTAR.SI, BUSCARV y qué dice cada mensaje de error.'],
      ['3', 'Cómo se conecta todo', 'Sigue un dato entre hojas y gráficos; lee documentos y presentaciones.'],
    ],
    beats: [[0, 1, 2]],
    callout: 'Entregable: lee y explica un Excel real del colegio en 7 minutos.',
    notes: 'En 8.º el método es al revés de lo normal. El profesor entrega un prompt, el alumno se lo pasa a la IA, y es la IA la que le pregunta a él: qué hay en A5, qué hace esta fórmula. El alumno verifica en la hoja antes de responder. Son tres unidades, una por trimestre: leer una hoja, entender fórmulas que deciden, y ver cómo se conecta todo, incluidos Word y PowerPoint. Al final del año lee y explica un Excel real del colegio en siete minutos, y se evalúa con una rúbrica de cuatro niveles. Las 30 sesiones, una por una, están en el documento del currículo completo.',
  },
  {
    id: 'noveno', section: 'Currículo', tone: 'paper', layout: 'table', time: '0:50',
    title: 'En 9.º, aprende a pedir bien y construye con lo que pide.',
    columns: ['Trimestre', 'Unidad', 'Lo que logra el alumno'],
    rows: [
      ['1', 'Anatomía de un buen pedido', 'Escribe prompts de cinco partes que otro grupo ejecuta sin preguntas.'],
      ['2', 'Construir un Excel desde un prompt', 'Construye por pasos, prueba con datos y documenta cómo se usa.'],
      ['3', 'El producto del año', 'Excel, informe y presentación para un encargo real del colegio.'],
    ],
    beats: [[0, 1, 2]],
    callout: 'Entregable: un Excel construido desde un prompt bien estructurado, con su bitácora de versiones.',
    notes: 'En 9.º pasan de responder a pedir. El primer trimestre aprenden las cinco partes de un buen prompt: contexto, objetivo, pasos, formato y criterios de revisión. La prueba es dura: otro grupo ejecuta su prompt tal cual, sin preguntarles nada. El segundo trimestre construyen un Excel por pasos, dando visto bueno en cada uno y probando con datos. El tercero hacen el producto del año para un encargo real del colegio, como la tabla de un torneo o el control de un club. Entregan el archivo, el prompt y la bitácora de cada corrección.',
  },
  {
    id: 'decimo', section: 'Currículo', tone: 'paper', layout: 'table', time: '0:50',
    title: 'En 10.º, crea un producto que alguien del colegio usa de verdad.',
    columns: ['Trimestre', 'Unidad', 'Lo que logra el alumno'],
    rows: [
      ['1', 'De la necesidad al diseño', 'Entrevista a un usuario del colegio y diseña el producto en una ficha.'],
      ['2', 'Construir y probar', 'Construye dos versiones y las prueba con usuarios reales.'],
      ['3', 'Lanzar y presentar', 'Lo pone en uso dos semanas y lo presenta ante un panel de docentes.'],
    ],
    beats: [[0, 1, 2]],
    callout: 'Entregable: un producto terminado, con evidencia de uso, en su portafolio.',
    notes: 'En 10.º crean. El primer trimestre cada alumno, solo o en pareja, entrevista a un usuario del colegio, un profesor, un club o un departamento, y diseña su producto en una ficha de una página antes de construir. El segundo trimestre construyen dos versiones y las prueban con usuarios reales. El tercero lo ponen en uso dos semanas, miden si sirve y lo presentan ante un panel de docentes. Un ejemplo real: un sistema de club que empezó como idea y terminó en una hoja que todos usan.',
  },
  {
    id: 'portafolio', section: 'Currículo', tone: 'paper', layout: 'portfolio', time: '0:30',
    title: 'Al terminar 10.º, cada alumno sale con un portafolio propio.',
    items: [
      { grade: '8.º', piece: 'Un Excel real, leído y explicado con sus palabras.' },
      { grade: '9.º', piece: 'Un Excel construido desde su propio prompt.' },
      { grade: '10.º', piece: 'Un producto terminado que alguien usa.' },
    ],
    line: 'Tres piezas que muestran lo que sabe hacer, no lo que copió.',
    notes: 'El resultado es concreto. Al terminar 10.º, cada alumno tiene tres piezas en su portafolio, una por año. No es una nota: es algo que puede mostrar y explicar. Ahora paso al club.',
  },
  {
    id: 'club', section: 'Builders Club', tone: 'navy', layout: 'statement', time: '0:45',
    title: 'En el Builders Club, la IA es la herramienta y lo que importa es el producto.',
    lead: 'Un club voluntario de 9.º a 11.º donde se construyen productos reales que le sirvan al colegio.',
    quote: 'Construyo con IA todos los días y acompaño a otros a aprender.',
    attribution: 'Thomas Hanono, candidato a presidente del Builders Club',
    notes: 'El Builders Club es la segunda propuesta. Es un club donde se construyen productos reales para el colegio. La IA es la herramienta, como en un taller; lo que importa es lo que sale del taller. Me postulo como presidente por una razón simple: construyo con IA todos los días y acompaño a otros a aprender. La idea es que en unos meses los miembros construyan cosas que a mí no se me hubieran ocurrido.',
  },
  {
    id: 'seis-clases', section: 'Builders Club', tone: 'paper', layout: 'timeline', time: '1:15',
    title: 'En seis clases, cada miembro llega al Demo Day con un producto.',
    stations: [
      { n: '1', title: 'Fundamentos', out: 'Resuelve algo suyo ese día.' },
      { n: '2', title: 'Segundo cerebro', out: 'Sus notas, en Obsidian.' },
      { n: '3', title: 'Modelos y superficies', out: 'Terminal o escritorio.' },
      { n: '4', title: 'Conectar herramientas', out: 'La IA con Excel o Drive.' },
      { n: '5', title: 'Prompting de construcción', out: 'Una mini-herramienta lista.' },
      { n: '6', title: 'Demo Day', out: 'Un producto para el colegio.' },
    ],
    beats: [[0, 1], [2, 3, 4], [5]],
    line: 'Una sesión por semana. Después del Demo Day, el temario lo definen los miembros.',
    notes: 'Este es el plan de arranque, una sesión por semana. En la primera, cada quien resuelve algo suyo ese mismo día. En la segunda montan su segundo cerebro en Obsidian. En la tercera hacen la misma tarea en la terminal y en la app de escritorio, para ver cuándo conviene cada una. En la cuarta conectan la IA con herramientas que ya usamos, como Excel o Drive. En la quinta sale una mini-herramienta. Y la sexta es el Demo Day: cada miembro o equipo presenta un producto que le sirva al colegio. Cada sesión termina con algo hecho.',
  },
  {
    id: 'productos', section: 'Builders Club', tone: 'paper', layout: 'locked', time: '0:45',
    title: 'La meta son productos que el colegio use de verdad.',
    lead: 'Ya hay una prueba de que se puede.',
    card: {
      eyebrow: 'En reserva',
      title: 'Proyecto SAT',
      impact: 'Un proyecto de alumno que puede cambiar cómo se enseña el SAT.',
      meta: 'Hecho por un alumno del IAE',
    },
    line: 'Lo muestro cerrado a propósito: lo que importa es el nivel al que se puede llegar.',
    notes: 'La meta del club son productos que el colegio use. Y ya hay un ejemplo: un proyecto de alumno que puede cambiar cómo se enseña el SAT. Lo dejo cerrado a propósito; es una prueba de concepto, no una receta. Lo que quiero que vean es el nivel al que puede llegar un estudiante con buenas herramientas y un espacio para construir.',
  },
  {
    id: 'evidencia', section: 'Evidencia y garantías', tone: 'paper', layout: 'evidence', time: '1:15',
    title: 'La IA enseña cuando está pensada para enseñar.',
    items: [
      { claim: 'Más aprendizaje en menos tiempo', detail: 'Ensayo controlado con 194 estudiantes de física en Harvard: un tutor de IA con diseño pedagógico superó a la clase de aprendizaje activo.', source: 'kestin' },
      { claim: 'Con propósito y guía docente', detail: 'La OCDE recomienda usar la IA con un propósito pedagógico claro: así es como genera aprendizaje.', source: 'oecd' },
      { claim: 'Un país que ya empezó', detail: 'Estonia lanzó en 2025 un programa nacional para 20.000 estudiantes de 10.º y 11.º, empezando por sus docentes.', source: 'estonia' },
    ],
    notes: 'Tres datos, todos con fuente en el apéndice. Uno: un ensayo controlado en Harvard, publicado en 2025, encontró que un tutor de IA bien diseñado logró más aprendizaje en menos tiempo que una clase activa. Es un estudio con universitarios, en un solo curso, así que lo tomo como una señal, no como una ley. Dos: la OCDE, en su informe de 2026, dice que la IA de uso general ayuda a terminar tareas, pero que el aprendizaje llega cuando la herramienta tiene un propósito pedagógico y un docente detrás. Por eso el currículo pone a la IA a preguntar, no a contestar. Tres: Estonia ya lo hace a escala nacional, y empezó por sus docentes. Es el mismo orden que les propongo.',
    sources: ['kestin', 'oecd', 'estonia'],
  },
  {
    id: 'garantias', section: 'Evidencia y garantías', tone: 'paper', layout: 'pledges', time: '1:15',
    title: 'Así cuidamos la integridad, la supervisión y los datos.',
    items: [
      { label: 'Integridad', text: 'Reglas de uso conversadas desde el primer día. Cada producto se presenta y se explica en vivo.' },
      { label: 'Supervisión', text: 'Un docente enlace acompaña. Acceso institucional, con herramientas aptas para su edad.' },
      { label: 'Datos', text: 'Sin datos personales en los prompts. Consentimiento de los acudientes y principios de la Ley 81 de 2019.' },
    ],
    footnote: 'Detalle en los apéndices A8 y A9.',
    sources: ['ley81', 'anthropic'],
    notes: 'Sé que la primera pregunta de un colegio es cómo se cuida esto. Tres compromisos. Integridad: las reglas se hablan con los miembros desde el primer día, y como cada producto se presenta y se explica en vivo, el trabajo se ve. En un club que construye no hay nada que copiar: el producto no existe hasta que alguien lo hace. Supervisión: un docente enlace acompaña, y el acceso es institucional, con herramientas aptas para la edad y dentro de los términos de cada proveedor. Datos: en los prompts no van datos personales, y seguimos los principios de la Ley 81, finalidad, proporcionalidad, seguridad y consentimiento.',
  },
  {
    id: 'plan', section: 'Plan y decisión', tone: 'paper', layout: 'table', time: '1:15',
    title: 'Cada fase deja algo que se puede ver.',
    columns: ['Fase', 'Cuándo', 'Cómo sabremos que funciona'],
    rows: [
      ['Preparación', 'Semanas 1 y 2', 'Docente enlace nombrado y herramienta apta elegida.'],
      ['Builders Club', 'Semanas 3 a 8', 'Cada equipo presenta un producto en el Demo Day.'],
      ['Piloto del currículo', 'A confirmar', 'Un grupo de 8.º lee y explica un Excel real.'],
      ['Ampliación', 'Según resultados', 'La directiva decide con cada informe.'],
    ],
    beats: [[0], [1], [2, 3]],
    notes: 'Así se ve el plan, en semanas y no en fechas, porque depende de cuándo ustedes decidan. Las dos primeras semanas son de preparación: nombrar al docente enlace y elegir la herramienta. De la semana 3 a la 8 corre el club, hasta el Demo Day. El piloto del currículo arranca con un solo grupo de 8.º, cuando la coordinación lo vea posible. Y cada fase termina con un informe corto para que ustedes decidan si se amplía.',
  },
  {
    id: 'apoyo', section: 'Plan y decisión', tone: 'paper', layout: 'twoCols', time: '1:00',
    title: 'El colegio pone el marco; el club pone el trabajo.',
    left: {
      label: 'Lo que pone el colegio',
      items: ['Un docente enlace.', 'Un horario y un salón, una sesión por semana.', 'Acceso supervisado a una herramienta apta.'],
    },
    right: {
      label: 'Lo que ponemos nosotros',
      items: ['El plan de las seis clases y sus materiales.', 'La coordinación del club cada semana.', 'Un informe corto al cierre de cada fase.'],
    },
    footnote: 'Gratis para el colegio en horas docentes: el docente enlace acompaña y el club dicta las sesiones.',
    notes: 'Esto es lo que cuesta, y lo digo en tiempo y en decisiones. El colegio pone un docente enlace, un horario y un salón una vez por semana, y el acceso supervisado a una herramienta apta para la edad. Nosotros ponemos el plan, los materiales, la coordinación y un informe al cierre de cada fase. No pide horas docentes adicionales: el docente enlace acompaña y el club dicta.',
  },
  {
    id: 'pedido', section: 'Plan y decisión', tone: 'navy', layout: 'ask', time: '1:15',
    title: 'Hoy les pido tres decisiones.',
    decisions: [
      'Aprobar el currículo de 8.º a 10.º, empezando con un grupo piloto de 8.º.',
      'Aprobar el Builders Club: seis clases hasta el Demo Day.',
      'Respaldar el acceso supervisado de los estudiantes a herramientas de IA aptas para su edad.',
    ],
    firstStep: { label: 'Primer paso, en las próximas dos semanas', text: 'Nombrar un docente enlace y fijar el horario de la primera clase.' },
    presenter: 'Thomas Hanono · Builders Club',
    more: 'El currículo completo, semana por semana: iae-propuestas-ia.vercel.app/directiva/curriculo',
    notes: 'Cierro con lo que les pido hoy. Tres decisiones: aprobar el currículo empezando con un grupo piloto de 8.º, aprobar el club con sus seis clases, y respaldar el acceso supervisado a herramientas de IA aptas para la edad de los estudiantes. Y un primer paso, chico y con fecha: en las próximas dos semanas, nombrar un docente enlace y fijar el horario de la primera clase. Dejo esta lámina proyectada mientras conversamos. Quedo a la orden para sus preguntas.',
  },

  // ——— Apéndice ———
  {
    id: 'A1', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Las seis clases del club, una por una',
    items: [
      { label: '1 · Fundamentos y configuración', text: 'Cada miembro deja lista su herramienta y resuelve algo suyo ese mismo día.' },
      { label: '2 · Segundo cerebro', text: 'Obsidian para organizar notas e ideas, y darle contexto a la IA.' },
      { label: '3 · Modelos y superficies', text: 'La misma tarea en la terminal y en la app de escritorio; cuándo conviene cada modelo.' },
      { label: '4 · Conectar herramientas', text: 'Conectores (MCP) para que la IA trabaje con Excel, Drive u otras herramientas que ya usamos.' },
      { label: '5 · Prompting de construcción', text: 'Pedir por pasos, revisar, corregir. Sale una mini-herramienta.' },
      { label: '6 · Demo Day', text: 'Cada miembro o equipo presenta un producto que beneficie al colegio.' },
    ],
    footnote: 'A futuro, como posibilidad: charlistas invitados y una versión del club para profesores.',
    notes: 'Si preguntan por el detalle de las clases, aquí está una por una. A futuro hay dos ideas abiertas, como posibilidad: charlistas invitados y una versión para profesores.',
  },
  ...GRADES.map((g, i): Slide => ({
    id: `A${i + 2}`, section: 'Apéndice', tone: 'paper', layout: 'table', time: '0:00',
    title: `Rúbrica de ${g.grado}`,
    columns: ['Criterio', 'Peso', 'Nivel Logrado'],
    ownFigures: true,
    rows: g.rubrica.map((r) => [r.criterio, r.peso, r.niveles[2]]),
    beats: [g.rubrica.map((_, i) => i)],
    footnote: `${g.entregable.nombre}. Niveles completos en el currículo completo.`,
    notes: `Si preguntan cómo se evalúa ${g.grado}: esta es la rúbrica del entregable del año, con el nivel Logrado de cada criterio.`,
  })),
  {
    id: 'A5', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Ejemplos de prompts por año',
    items: [
      { label: '8.º · Leer', text: '“Hazme preguntas, una por una, sobre esta hoja de cálculo hasta que pueda explicar qué hace cada columna. No me des las respuestas.”' },
      { label: '9.º · Pedir', text: '“Construye conmigo una hoja de asistencia en tres pasos: primero las columnas, después las fórmulas, al final el formato. Espera mi visto bueno en cada paso.”' },
      { label: '10.º · Crear', text: '“Quiero un sistema para inscribir miembros de un club. Antes de construir, hazme las preguntas que necesitas para entender a quién le sirve.”' },
    ],
    footnote: 'En los tres años, la IA guía y pregunta; el alumno decide y explica.',
    notes: 'Tres ejemplos de cómo se ve un prompt en cada año. Fíjense que en los tres la IA pregunta o espera el visto bueno del alumno.',
  },
  {
    id: 'A6', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Formación docente antes de arrancar',
    items: FORMACION.slice(0, 4).map((f) => ({ label: f.k, text: f.v })),
    footnote: FORMACION[4].v,
    notes: 'Si preguntan cómo se prepara a los docentes: tres talleres cortos y una guía por unidad con las diez sesiones, sus prompts, los archivos de práctica y la rúbrica.',
  },
  {
    id: 'A7', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Cómo un producto del club llega a usarse en el colegio',
    items: CLUB.camino.map((c) => ({ label: c.k, text: c.v })),
    footnote: 'Después del primer Demo Day, el club trabaja en ciclos de seis semanas.',
    notes: 'Si preguntan cómo se decide qué producto usa el colegio: pasa por una ficha, la revisión del docente enlace, un piloto de dos semanas y una presentación a la coordinación, que decide.',
  },
  {
    id: 'A8', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Acceso supervisado y términos del proveedor',
    items: [
      { label: 'Qué pedimos', text: 'Respaldo institucional para usar herramientas de IA aptas para su edad, con cuentas del colegio y un docente enlace.' },
      { label: 'Un ejemplo verificado', text: 'Anthropic pide 18 años para sus cuentas personales. Para menores, contempla productos de organizaciones con salvaguardas: verificación de edad, moderación y supervisión.' },
      { label: 'Cómo se elige', text: 'En la preparación, el docente enlace y la coordinación eligen la herramienta que cumple esos términos.' },
    ],
    footnote: 'Términos de consumo (8-oct-2025) y guía para menores (16-mar-2026).',
    sources: ['anthropic'],
    notes: 'Si preguntan por el acceso: pedimos respaldo institucional, no cuentas personales. Cada proveedor pone sus condiciones de edad, y elegimos la herramienta que las cumple. Por ejemplo, Anthropic pide 18 años para sus cuentas personales y, para menores, contempla productos de organizaciones con salvaguardas. Esa elección se hace en las dos semanas de preparación.',
  },
  {
    id: 'A9', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Datos personales: prácticas que seguimos',
    items: [
      { label: 'Finalidad y proporcionalidad', text: 'Solo se usa lo necesario para aprender. En los prompts no se ingresan nombres, notas ni datos personales de nadie.' },
      { label: 'Consentimiento y transparencia', text: 'Los acudientes reciben una explicación clara y dan su consentimiento cuando corresponda.' },
      { label: 'Seguridad', text: 'Cuentas gestionadas por el colegio y revisión del docente enlace.' },
    ],
    footnote: 'Principios de la Ley 81 de 2019 y del Decreto Ejecutivo 285 de 2021. Son prácticas y compromisos del club, no una opinión legal.',
    sources: ['ley81'],
    notes: 'Si preguntan por datos personales: seguimos los principios de la Ley 81, finalidad, proporcionalidad, seguridad, transparencia y consentimiento. No es una opinión legal; son las prácticas que nos comprometemos a seguir.',
  },
  {
    id: 'A10', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Preguntas frecuentes',
    items: [
      { label: '¿Cómo sabemos que el aprendizaje es del alumno?', text: 'Porque lo explica: en 8.º responde las preguntas de la IA y en el Demo Day presenta y defiende su producto.' },
      { label: '¿Quién acompaña al club?', text: 'Un docente enlace que nombra el colegio. Las sesiones las prepara y dicta el club.' },
      { label: '¿Qué pasa con los trabajos que tienen reglas propias, como AP Research?', text: 'Siguen sus reglas tal cual. El club y el currículo trabajan con productos propios, no con trabajos evaluados externamente.' },
      { label: '¿Qué hace falta para empezar?', text: 'Un docente enlace, un horario, un salón y la decisión de hoy. Lo demás se evalúa con el informe de cada fase.' },
    ],
    notes: 'Preguntas que es probable que salgan, con su respuesta corta.',
  },
  {
    id: 'A11', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Cronograma detallado, en semanas',
    items: [
      { label: 'Semanas 1 y 2', text: 'Docente enlace nombrado, herramienta apta elegida, horario y salón definidos, aviso a los acudientes.' },
      { label: 'Semanas 3 a 8', text: 'Las seis clases del club, una por semana. Semana 8: Demo Day con invitados de la directiva.' },
      { label: 'Semana 9', text: 'Informe corto del club a la directiva: productos, asistencia y aprendizajes.' },
      { label: 'Arranque a confirmar', text: 'Piloto del currículo con un grupo de 8.º, cuando la coordinación lo programe, e informe al cierre del período.' },
    ],
    footnote: 'Las fechas exactas dependen del calendario del IAE y quedan a confirmar.',
    notes: 'El cronograma en semanas. Las fechas las fijamos con la coordinación según el calendario del colegio.',
  },
  {
    id: 'A12', section: 'Apéndice', tone: 'paper', layout: 'sources', time: '0:00',
    title: 'Fuentes',
    notes: 'Todas las fuentes, con su enlace. El detalle de cada cita está en el repositorio, en FUENTES-DIRECTIVA.md.',
  },
]

/** Índice del primer slide del apéndice. */
export const APPENDIX_START = SLIDES.findIndex((s) => s.section === 'Apéndice')
export const MAIN_COUNT = APPENDIX_START

export function beatsOf(s: Slide): number {
  return s.layout === 'table' || s.layout === 'timeline' ? s.beats.length : s.layout === 'floorCeiling' ? 3 : 1
}

/** Número visible de una lámina: 01 / 14 … 14 / 14, o A1…A7 en el apéndice. */
export function slideNumber(i: number): string {
  return i >= APPENDIX_START ? SLIDES[i].id : `${String(i + 1).padStart(2, '0')} / ${MAIN_COUNT}`
}
