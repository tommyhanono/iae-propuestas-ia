// Contenido de la presentación para la directiva: titulares, cuerpo, notas del orador y fuentes.
// Todo lo que se lee en pantalla vive aquí. scripts/content-check-directiva.mjs lo revisa antes de cada build.
// El detalle completo del currículo y del club vive en curriculo.ts y se reutiliza en el apéndice.
import { ACCESO, CLUB, ENCARGOS, ENSENAR, FORMACION, GRADES, PREGUNTAS } from './curriculo.ts'

export type Tone = 'navy' | 'paper'

export type SourceId = 'pew' | 'unesco' | 'kestin' | 'oecd' | 'estonia' | 'eef' | 'anthropic' | 'ley81'

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
  eef: {
    id: 'eef', short: 'Education Endowment Foundation', publisher: 'Education Endowment Foundation (Reino Unido)',
    title: 'Teaching and Learning Toolkit: Peer tutoring', date: 'consultado el 14 de octubre de 2026',
    url: 'https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/peer-tutoring',
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

export type Section = 'Apertura' | 'Currículo' | 'Aprender enseñando' | 'Builders Club' | 'Evidencia y garantías' | 'Plan y decisión' | 'Apéndice'

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
  | { layout: 'ask'; decisions: string[]; firstStep: { label: string; text: string }; invite: string; qr: { src: string; label: string }; presenter: string }
  | { layout: 'demo'; sheet: { caption: string; columns: string[]; rows: string[][]; focus: [number, number][][]; formula: string[] }; chat: { who: 'ia' | 'alumno'; text: string }[][]; line: string }
  | { layout: 'list'; items: { label: string; text: string }[]; footnote?: string }
  | { layout: 'sources' }
)

export const TARGET_SECONDS = 15 * 60
export const PRESENTER = 'Thomas Hanono'
export const DECK_TITLE = 'Construir con IA, no copiar con IA'

export const SLIDES: Slide[] = [
  {
    id: 'portada', section: 'Apertura', tone: 'navy', layout: 'cover', time: '0:20',
    eyebrow: 'Propuestas para la directiva del IAE',
    title: 'Construir con IA, no copiar con IA',
    lead: 'Alumnos que no solo usan la IA: la explican, la enseñan y construyen con ella para el colegio.',
    presenter: 'Presenta Thomas Hanono, candidato a presidente del Builders Club',
    notes: 'Les traigo una idea: que en el IAE los alumnos no solo usen la IA, sino que la expliquen, la enseñen y construyan con ella cosas que el colegio use. Son dos pasos concretos, y al final les pido tres decisiones.',
  },
  {
    id: 'oportunidad', section: 'Apertura', tone: 'paper', layout: 'stat', time: '0:40',
    title: 'Los estudiantes ya usan IA para estudiar. El IAE puede darle dirección.',
    value: '54', unit: '%',
    label: 'de los adolescentes de 13 a 17 años en EE. UU. ya usa chatbots de IA para ayudarse con tareas del colegio.',
    line: 'Lo que el colegio decide es qué aprenden a hacer con ella.',
    sources: ['pew'],
    notes: 'Empiezo con un dato. En Estados Unidos, más de la mitad de los adolescentes ya usa chatbots para el colegio, según una encuesta de Pew de este año. No tengo un dato igual de Panamá, pero ustedes lo ven en los pasillos. La IA ya está. Lo que podemos decidir es qué aprenden a hacer con ella. Mi propuesta es que aprendan a construir, y a enseñar lo que construyen.',
  },
  {
    id: 'piso-techo', section: 'Apertura', tone: 'paper', layout: 'floorCeiling', time: '0:40',
    title: 'El currículo pone el piso. El club quita el techo.',
    floor: { label: 'Currículo 8.º a 10.º', detail: 'Para todo el colegio, dentro de las clases.' },
    ceiling: { label: 'Builders Club 9.º a 11.º', detail: 'Voluntario, para quien quiera ir más lejos.' },
    link: 'En los dos, los alumnos enseñan lo que aprenden.',
    notes: 'Son dos propuestas y una sola progresión. El currículo es la base: llega a todos, de 8.º a 10.º, dentro de las clases. El club es voluntario, de 9.º a 11.º, para quien quiere ir más lejos. Y las dos comparten una idea: los alumnos enseñan lo que aprenden. Empiezo por el currículo.',
  },
  {
    id: 'clase-demo', section: 'Currículo', tone: 'paper', layout: 'demo', time: '1:00',
    title: 'Así es una clase de 8.º.',
    sheet: {
      caption: 'Torneo intercolegial',
      columns: ['', 'A', 'B', 'C'],
      rows: [
        ['1', 'Equipo', 'Ganados', 'Puntos'],
        ['2', 'Halcones', '3', '9'],
        ['3', 'Tiburones', '2', '6'],
        ['4', 'Águilas', '1', '3'],
      ],
      focus: [[[1, 3]], [[1, 3], [1, 2]], [[2, 2], [2, 3]]],
      formula: ['C2 = 9', 'C2 = B2*3', 'C3 = B3*3'],
    },
    chat: [
      [{ who: 'ia', text: '¿Qué hay en la celda C2?' }, { who: 'alumno', text: 'Los puntos de Halcones: 9.' }],
      [{ who: 'ia', text: '¿Y de dónde sale ese 9? Mira la fórmula.' }, { who: 'alumno', text: '=B2*3: cada partido ganado vale 3.' }],
      [{ who: 'ia', text: 'Si Tiburones gana otro partido, ¿qué cambia?' }, { who: 'alumno', text: 'B3 y C3: Tiburones llega a 9.' }],
    ],
    line: 'La IA nunca da la respuesta: pregunta. El alumno revisa en la hoja antes de contestar.',
    ownFigures: true,
    notes: 'Así se ve una clase de 8.º. Es al revés de lo normal: no es el alumno el que le pregunta a la IA, es la IA la que le pregunta al alumno. Qué hay en esta celda. De dónde sale este número. Qué cambia si pasa esto. El alumno tiene que mirar la hoja y razonar para contestar. La IA no le da la respuesta; le hace preguntas hasta que entiende. Así se aprende a leer cualquier archivo.',
  },
  {
    id: 'progresion', section: 'Currículo', tone: 'paper', layout: 'steps', time: '0:40',
    title: 'En tres años, cada alumno pasa de leer a pedir a crear.',
    steps: [
      { grade: '8.º', verb: 'Leer', line: 'Entiende cómo está hecho un archivo real.' },
      { grade: '9.º', verb: 'Pedir', line: 'Da instrucciones claras y construye con ellas.' },
      { grade: '10.º', verb: 'Crear', line: 'Hace un producto propio que alguien usa.' },
    ],
    note: 'La misma progresión del marco de competencias en IA de la UNESCO: comprender, aplicar, crear.',
    sources: ['unesco'],
    notes: 'Ese método es el primer escalón. En 8.º aprenden a leer cómo está hecho un archivo. En 9.º aprenden a pedir bien. En 10.º crean algo propio que alguien del colegio usa. No me la inventé: el marco de competencias en IA que la UNESCO publicó en 2024 usa la misma idea en tres niveles: comprender, aplicar y crear.',
  },
  {
    id: 'octavo', section: 'Currículo', tone: 'paper', layout: 'table', time: '0:40',
    title: 'En 8.º, cada alumno aprende a leer cualquier archivo.',
    columns: ['Trimestre', 'Unidad', 'Lo que logra el alumno'],
    rows: [
      ['1', 'Leer una hoja de cálculo', 'Explica celdas, rangos, tipos de datos y sus primeras fórmulas.'],
      ['2', 'Fórmulas que deciden', 'Entiende SI, CONTAR.SI, BUSCARV y qué dice cada mensaje de error.'],
      ['3', 'Cómo se conecta todo', 'Sigue un dato entre hojas y gráficos; lee documentos y presentaciones.'],
    ],
    beats: [[0, 1, 2]],
    callout: 'Proyecto final: explica un Excel real del colegio en 7 minutos, frente al profesor.',
    notes: 'En 8.º son tres unidades, una por trimestre: leer una hoja, entender las fórmulas que deciden y ver cómo se conecta todo, incluidos Word y PowerPoint. El proyecto final es explicar en siete minutos un Excel real del colegio, con los datos cambiados, frente al profesor. Las 30 clases, una por una, están en el documento del currículo completo.',
  },
  {
    id: 'noveno', section: 'Currículo', tone: 'paper', layout: 'table', time: '0:40',
    title: 'En 9.º, aprende a pedir bien y construye con lo que pide.',
    columns: ['Trimestre', 'Unidad', 'Lo que logra el alumno'],
    rows: [
      ['1', 'Cómo pedir bien', 'Escribe instrucciones tan claras que otro grupo las usa sin preguntarle nada.'],
      ['2', 'Construir un Excel pidiendo por pasos', 'Construye por pasos, lo prueba y deja escrito cómo se usa.'],
      ['3', 'El proyecto del año', 'Excel, informe y presentación para un pedido real del colegio.'],
    ],
    beats: [[0, 1, 2]],
    callout: 'Proyecto final: un Excel que funciona, construido a partir de sus propias instrucciones.',
    notes: 'En 9.º pasan de responder a pedir. Primero aprenden a escribir una buena instrucción: para quién es, qué se quiere, en qué pasos, en qué formato y cómo se va a revisar. La prueba es exigente: otro grupo usa su instrucción tal cual, sin preguntarles nada. Después construyen un Excel por pasos, y al final hacen el proyecto del año para un pedido real del colegio, como la tabla de un torneo o el control de un club.',
  },
  {
    id: 'decimo', section: 'Currículo', tone: 'paper', layout: 'table', time: '0:40',
    title: 'En 10.º, crea algo que alguien del colegio usa de verdad.',
    columns: ['Trimestre', 'Unidad', 'Lo que logra el alumno'],
    rows: [
      ['1', 'De la necesidad al diseño', 'Entrevista a alguien del colegio y diseña su producto en una página.'],
      ['2', 'Construir y probar', 'Construye dos versiones y las prueba con usuarios reales.'],
      ['3', 'Lanzar y presentar', 'Lo pone en uso dos semanas y lo presenta ante un panel de profesores.'],
    ],
    beats: [[0, 1, 2]],
    callout: 'Proyecto final: un producto en uso, que queda en su portafolio junto a lo de 8.º y 9.º.',
    notes: 'En 10.º crean. Cada alumno, solo o en pareja, entrevista a alguien del colegio, un profesor, un club o un departamento, y diseña su producto antes de construir. Lo construye, lo prueba con usuarios reales, lo pone en uso dos semanas y lo presenta ante un panel de profesores. Sale de 10.º con un portafolio de tres piezas que puede mostrar y explicar.',
  },
  {
    id: 'ensenar', section: 'Aprender enseñando', tone: 'navy', layout: 'pledges', time: '1:10',
    title: 'Aquí los alumnos no solo aprenden: enseñan.',
    items: [
      { label: 'La clase la dan ustedes', text: 'Cada trimestre, cada pareja da una mini-clase de 8 minutos a sus compañeros y comprueba con 3 preguntas que el grupo aprendió.' },
      { label: 'Alumnos guía', text: 'Tres por grupo, elegidos por postulación y una mini-clase de prueba. Preparan la sesión con el profesor y rotan cada trimestre.' },
      { label: 'Todo se presenta', text: 'Ningún proyecto se entrega sin presentarlo y responder preguntas. Y en el último trimestre, 10.º le enseña a 8.º.' },
    ],
    footnote: 'La tutoría entre compañeros suma en promedio unos seis meses de progreso en un año, sobre todo cuando los tutores se preparan.',
    sources: ['eef'],
    notes: 'Esto es lo que hace diferente a esta propuesta. La IA puede hacerle un trabajo a un alumno, pero no puede pararse frente a la clase por él. Por eso aquí todo lo que se aprende se enseña. Cada trimestre, cada pareja da una mini-clase a sus compañeros y comprueba con tres preguntas que aprendieron. En cada grupo hay tres alumnos guía, que se postulan y dan una clase de prueba, preparan la sesión con el profesor y rotan cada trimestre. Ningún proyecto se entrega sin presentarlo. Y al final del año, los de 10.º van a enseñarle a 8.º. La evidencia lo respalda: la fundación británica EEF estima que la tutoría entre compañeros suma en promedio unos seis meses de progreso en un año, sobre todo cuando los tutores se preparan, que es justo lo que hacen los alumnos guía.',
  },
  {
    id: 'club', section: 'Builders Club', tone: 'navy', layout: 'statement', time: '0:40',
    title: 'En el Builders Club, la IA es la herramienta y lo que importa es el producto.',
    lead: 'Un club voluntario de 9.º a 11.º donde se construyen herramientas reales que el colegio necesita.',
    quote: 'Construyo con IA todos los días y acompaño a otros a aprender.',
    attribution: 'Thomas Hanono, candidato a presidente del Builders Club',
    notes: 'La segunda propuesta es el Builders Club. Es un club voluntario donde se construyen herramientas que el colegio necesita. La IA es la herramienta, como en un taller; lo que importa es lo que sale del taller. Me postulo como presidente porque construyo con IA todos los días y acompaño a otros a aprender. La meta es que en unos meses los miembros construyan cosas que a mí no se me hubieran ocurrido.',
  },
  {
    id: 'seis-clases', section: 'Builders Club', tone: 'paper', layout: 'timeline', time: '0:50',
    title: 'En seis clases, cada miembro llega al Demo Day con un producto.',
    stations: [
      { n: '1', title: 'Primeros pasos', out: 'Resuelve algo suyo ese día.' },
      { n: '2', title: 'Segundo cerebro', out: 'Sus notas, en Obsidian.' },
      { n: '3', title: 'Elegir la herramienta', out: 'Qué usar para cada tarea.' },
      { n: '4', title: 'Conectar herramientas', out: 'La IA con Excel o Drive.' },
      { n: '5', title: 'Pedir bien para construir', out: 'Una mini-herramienta lista.' },
      { n: '6', title: 'Demo Day', out: 'Un producto para el colegio.' },
    ],
    beats: [[0, 1], [2, 3, 4], [5]],
    line: 'Una sesión por semana. Las clases las preparan y las dan los miembros.',
    notes: 'Este es el plan de arranque, una sesión por semana. Cada clase termina con algo hecho: en la primera, cada quien resuelve algo suyo; en la segunda ordenan sus notas en Obsidian; en la tercera aprenden qué herramienta usar para cada tarea; en la cuarta conectan la IA con Excel o Drive; en la quinta sale una mini-herramienta. La sexta es el Demo Day, el día de demostración: cada miembro o equipo presenta un producto para el colegio. Y siguiendo la misma idea, las clases las preparan y las dan los propios miembros.',
  },
  {
    id: 'productos', section: 'Builders Club', tone: 'paper', layout: 'locked', time: '0:50',
    title: 'El colegio pide herramientas. Los alumnos las construyen.',
    lead: 'Biblioteca, deportes, eventos y laboratorios dejan sus pedidos en un banco de encargos; los alumnos eligen de ahí sus proyectos.',
    card: {
      eyebrow: 'En reserva',
      title: 'Proyecto SAT',
      impact: 'Un proyecto de alumno que puede cambiar cómo se enseña el SAT.',
      meta: 'Hecho por un alumno del IAE',
    },
    line: 'Ya hay una prueba de que se puede. La muestro cerrada a propósito.',
    notes: 'La meta del club son herramientas que el colegio use. Para eso proponemos un banco de encargos: la biblioteca, deportes, eventos o los laboratorios dejan un pedido real, por ejemplo un registro de préstamos o una tabla de un torneo, y los alumnos eligen de ahí sus proyectos. Y ya hay una prueba de que se puede: un proyecto de alumno que puede cambiar cómo se enseña el SAT. Lo dejo cerrado a propósito; lo que importa es el nivel al que se puede llegar.',
  },
  {
    id: 'evidencia', section: 'Evidencia y garantías', tone: 'paper', layout: 'evidence', time: '1:00',
    title: 'La IA enseña cuando está pensada para enseñar.',
    items: [
      { claim: 'Más aprendizaje en menos tiempo', detail: 'Ensayo controlado con 194 estudiantes de física en Harvard: un tutor de IA con diseño pedagógico superó a la clase de aprendizaje activo.', source: 'kestin' },
      { claim: 'Con propósito y guía docente', detail: 'La OCDE recomienda usar la IA con un propósito pedagógico claro: así es como genera aprendizaje.', source: 'oecd' },
      { claim: 'Enseñar a otros', detail: 'La tutoría entre compañeros suma en promedio unos seis meses de progreso en un año escolar.', source: 'eef' },
    ],
    notes: 'Tres datos, con fuente en el apéndice. Uno: un ensayo controlado en Harvard encontró que un tutor de IA bien diseñado logró más aprendizaje en menos tiempo que una clase activa. Es un estudio con universitarios, en un solo curso, así que lo tomo como una señal. Dos: la OCDE, en su informe de 2026, dice que la IA de uso general ayuda a terminar tareas, pero que el aprendizaje llega cuando hay un propósito pedagógico y un docente detrás. Por eso en 8.º la IA pregunta en vez de contestar. Tres: la tutoría entre compañeros, que es la base de las mini-clases y de los alumnos guía, suma en promedio unos seis meses de progreso en un año, según la fundación británica EEF. Los resultados varían entre estudios, y funciona mejor cuando los tutores se preparan.',
    sources: ['kestin', 'oecd', 'eef'],
  },
  {
    id: 'garantias', section: 'Evidencia y garantías', tone: 'paper', layout: 'pledges', time: '1:00',
    title: 'Así cuidamos la integridad, la supervisión y los datos.',
    items: [
      { label: 'Integridad', text: 'Todo se presenta y se explica en vivo. Explicarlo frente a otros es la prueba de que es tuyo.' },
      { label: 'Supervisión', text: 'Un profesor responsable acompaña. Acceso del colegio, con herramientas aptas para la edad de cada grupo.' },
      { label: 'Datos', text: 'Sin datos personales en lo que se le pide a la IA. Consentimiento de los acudientes y principios de la Ley 81 de 2019.' },
    ],
    footnote: 'Detalle en los apéndices A10 y A11.',
    sources: ['ley81', 'anthropic'],
    notes: 'La primera pregunta de un colegio es cómo se cuida esto. Integridad: todo se presenta y se explica en vivo; en un club que construye no hay nada que copiar, porque el producto no existe hasta que alguien lo hace. Supervisión: un profesor responsable acompaña, y el acceso es del colegio, con herramientas aptas para la edad de cada grupo. Datos: nada personal en lo que se le pide a la IA, consentimiento de los acudientes y los principios de la Ley 81.',
  },
  {
    id: 'arranque', section: 'Evidencia y garantías', tone: 'paper', layout: 'twoCols', time: '0:50',
    title: 'Arranca desde el primer día.',
    left: { label: ACCESO.niveles[0].nombre, items: ACCESO.niveles[0].items },
    right: { label: ACCESO.niveles[1].nombre, items: ACCESO.niveles[1].items },
    footnote: 'Las cuentas personales de Anthropic son para mayores de 18 años: el nivel 1 no usa cuentas de alumnos.',
    sources: ['anthropic'],
    notes: 'Una pregunta lógica es con qué herramienta, si los alumnos son menores de edad. La respuesta es que no hay que esperar. En el nivel 1, desde el primer día, el profesor maneja la IA proyectada con su cuenta de adulto: la IA le pregunta al grupo y cada alumno responde en su hoja. Así funciona la clase de 8.º que vieron. Cuando el colegio apruebe una herramienta educativa apta para la edad, pasamos al nivel 2 y cada alumno trabaja con su cuenta del colegio. Esa herramienta la elegimos juntos en las dos semanas de preparación.',
  },
  {
    id: 'plan', section: 'Plan y decisión', tone: 'paper', layout: 'table', time: '1:00',
    title: 'En un año, esto es lo que ustedes van a ver.',
    columns: ['Fase', 'Cuándo', 'La meta'],
    rows: [
      ['Preparación', 'Semanas 1 y 2', 'Profesor nombrado y la IA lista en el nivel 1.'],
      ['Builders Club', 'Semanas 3 a 8', 'Demo Day con al menos 5 productos; 2 pasan a piloto.'],
      ['Piloto en 8.º', 'A confirmar', '80 % del grupo en Logrado o más, y cada pareja da su mini-clase.'],
      ['Muestra IAE', 'Fin de año', 'Productos de alumnos en uso, presentados a familias y directiva.'],
    ],
    beats: [[0], [1], [2, 3]],
    ownFigures: true,
    footnote: 'Metas propuestas, para ajustar con la coordinación. Con el informe de cada fase, ustedes deciden si se amplía.',
    sources: ['estonia'],
    notes: 'Así se ve el año, en semanas y no en fechas, porque depende de cuándo ustedes decidan. Y cada fase tiene una meta que se puede comprobar. Dos semanas de preparación. De la semana 3 a la 8 corre el club: la meta es un Demo Day con al menos cinco productos, y que dos pasen a piloto con alguien del colegio. El piloto del currículo arranca con un grupo de 8.º: la meta es que el 80 % llegue a Logrado o más en su proyecto y que cada pareja dé su mini-clase. Y al final del año, una Muestra IAE. Las metas las ajustamos con la coordinación, y con cada informe ustedes deciden si se amplía. Es el mismo orden que siguió Estonia en su programa nacional: primero los docentes, después los estudiantes.',
  },
  {
    id: 'apoyo', section: 'Plan y decisión', tone: 'paper', layout: 'twoCols', time: '0:45',
    title: 'El colegio pone el marco; los alumnos ponen el trabajo.',
    left: {
      label: 'Lo que pone el colegio',
      items: ['Un profesor responsable.', 'Un horario y un salón, una sesión por semana.', 'Acceso supervisado a una herramienta apta.'],
    },
    right: {
      label: 'Lo que ponemos nosotros',
      items: ['El plan, las clases y sus materiales.', 'Alumnos guía preparados para apoyar.', 'Un informe corto al cierre de cada fase.'],
    },
    footnote: 'Sin horas docentes extra: el profesor responsable acompaña y los miembros del club dan las sesiones.',
    notes: 'Esto es lo que cuesta, en tiempo y en decisiones. El colegio pone un profesor responsable, un horario y un salón una vez por semana, y el acceso supervisado a una herramienta apta para la edad. Nosotros ponemos el plan, las clases, los materiales, alumnos guía preparados y un informe al cierre de cada fase.',
  },
  {
    id: 'pedido', section: 'Plan y decisión', tone: 'navy', layout: 'ask', time: '1:00',
    title: 'Hoy les pido tres decisiones.',
    decisions: [
      'Aprobar el currículo de 8.º a 10.º, empezando con un grupo piloto de 8.º.',
      'Aprobar el Builders Club: seis clases hasta el Demo Day.',
      'Respaldar el acceso a la IA: primero con el profesor, después con una herramienta apta.',
    ],
    firstStep: { label: 'Primer paso, en las próximas dos semanas', text: 'Nombrar un profesor responsable y fijar el horario de la primera clase.' },
    invite: 'Y los invito al Demo Day de la semana 8, para que lo vean con sus propios ojos.',
    qr: { src: '/qr-curriculo.svg', label: 'El currículo completo, en su celular' },
    presenter: 'Thomas Hanono · Builders Club',
    notes: 'Cierro con lo que les pido hoy. Tres decisiones: aprobar el currículo empezando con un grupo piloto de 8.º, aprobar el club con sus seis clases y respaldar el acceso: desde el primer día con el profesor, y después con una herramienta apta para la edad. Un primer paso chico: en dos semanas, nombrar un profesor responsable y fijar el horario. Y una invitación: vengan al Demo Day de la semana 8 y véanlo con sus propios ojos. Con este código abren en su celular el currículo completo, clase por clase. Dejo esta lámina proyectada mientras conversamos. Quedo a la orden para sus preguntas.',
  },

  // ——— Apéndice ———
  {
    id: 'A1', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Las seis clases del club, una por una',
    items: [
      { label: '1 · Primeros pasos', text: 'Cada miembro deja lista su herramienta y resuelve algo suyo ese mismo día.' },
      { label: '2 · Segundo cerebro', text: 'Obsidian para organizar notas e ideas, y darle contexto a la IA.' },
      { label: '3 · Elegir la herramienta', text: 'La misma tarea en la terminal y en la app de escritorio, para saber qué conviene en cada caso.' },
      { label: '4 · Conectar herramientas', text: 'Conectores para que la IA trabaje con Excel, Drive u otras herramientas que ya usamos.' },
      { label: '5 · Pedir bien para construir', text: 'Pedir por pasos, revisar y corregir. Sale una mini-herramienta.' },
      { label: '6 · Demo Day (día de demostración)', text: 'Cada miembro o equipo presenta un producto que beneficie al colegio.' },
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
    footnote: `Proyecto final: ${g.entregable.nombre.charAt(0).toLowerCase()}${g.entregable.nombre.slice(1)}. Los cuatro niveles están en el currículo completo.`,
    notes: `Si preguntan cómo se evalúa ${g.grado}: esta es la rúbrica del proyecto final, con el nivel Logrado de cada criterio.`,
  })),
  {
    id: 'A5', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Alumnos guía',
    items: ENSENAR.guias.map((g) => ({ label: g.k, text: g.v })),
    notes: 'Si preguntan por los alumnos guía: cualquiera puede postularse, no depende solo de las notas. Dan una mini-clase de prueba, preparan la sesión con el profesor y rotan cada trimestre.',
  },
  {
    id: 'A6', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Banco de encargos',
    items: ENCARGOS.ejemplos.map((e) => ({ label: e.k, text: e.v })),
    footnote: ENCARGOS.como,
    notes: 'Si preguntan qué productos se harían: estos son ejemplos de encargos que un departamento podría dejar. Cada uno se describe en una página y nunca se construye con datos personales reales.',
  },
  {
    id: 'A7', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Ejemplos de instrucciones a la IA, por año',
    items: [
      { label: '8.º · Leer', text: '“Hazme preguntas, una por una, sobre esta hoja de cálculo hasta que pueda explicar qué hace cada columna. No me des las respuestas.”' },
      { label: '9.º · Pedir', text: '“Construye conmigo una hoja de asistencia en tres pasos: primero las columnas, después las fórmulas, al final el formato. Espera mi visto bueno en cada paso.”' },
      { label: '10.º · Crear', text: '“Quiero un sistema para inscribir miembros de un club. Antes de construir, hazme las preguntas que necesitas para entender a quién le sirve.”' },
    ],
    footnote: 'En los tres años, la IA guía y pregunta; el alumno decide y explica.',
    notes: 'Tres ejemplos de cómo se ve una instrucción a la IA en cada año. Fíjense que en los tres la IA pregunta o espera el visto bueno del alumno.',
  },
  {
    id: 'A8', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Formación docente antes de arrancar',
    items: FORMACION.slice(0, 4).map((f) => ({ label: f.k, text: f.v })),
    footnote: FORMACION[4].v,
    notes: 'Si preguntan cómo se prepara a los docentes: tres talleres cortos y una guía por unidad con las diez sesiones, sus prompts, los archivos de práctica y la rúbrica.',
  },
  {
    id: 'A9', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Cómo un producto del club llega a usarse en el colegio',
    items: CLUB.camino.map((c) => ({ label: c.k, text: c.v })),
    footnote: 'Después del primer Demo Day, el club trabaja en ciclos de seis semanas.',
    notes: 'Si preguntan cómo se decide qué producto usa el colegio: pasa por una ficha, la revisión del profesor responsable, un piloto de dos semanas y una presentación a la coordinación, que decide.',
  },
  {
    id: 'A10', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Acceso supervisado y términos del proveedor',
    items: [
      { label: 'Qué pedimos', text: 'Respaldo institucional para usar herramientas de IA aptas para su edad, con cuentas del colegio y un profesor responsable.' },
      { label: 'Un ejemplo verificado', text: 'Anthropic pide 18 años para sus cuentas personales. Para menores, contempla productos de organizaciones con salvaguardas: verificación de edad, moderación y supervisión.' },
      { label: 'Cómo se elige', text: 'En la preparación, el profesor responsable y la coordinación eligen la herramienta que cumple esos términos.' },
    ],
    footnote: 'Términos de consumo (8-oct-2025) y guía para menores (16-mar-2026).',
    sources: ['anthropic'],
    notes: 'Si preguntan por el acceso: pedimos respaldo institucional, no cuentas personales. Cada proveedor pone sus condiciones de edad, y elegimos la herramienta que las cumple. Por ejemplo, Anthropic pide 18 años para sus cuentas personales y, para menores, contempla productos de organizaciones con salvaguardas. Esa elección se hace en las dos semanas de preparación.',
  },
  {
    id: 'A11', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Datos personales: prácticas que seguimos',
    items: [
      { label: 'Finalidad y proporcionalidad', text: 'Solo se usa lo necesario para aprender. En lo que se le pide a la IA no van nombres, notas ni datos personales de nadie.' },
      { label: 'Consentimiento y transparencia', text: 'Los acudientes reciben una explicación clara y dan su consentimiento cuando corresponda.' },
      { label: 'Seguridad', text: 'Cuentas gestionadas por el colegio y revisión del profesor responsable.' },
    ],
    footnote: 'Principios de la Ley 81 de 2019 y del Decreto Ejecutivo 285 de 2021. Son prácticas y compromisos del club, no una opinión legal.',
    sources: ['ley81'],
    notes: 'Si preguntan por datos personales: seguimos los principios de la Ley 81, finalidad, proporcionalidad, seguridad, transparencia y consentimiento. No es una opinión legal; son las prácticas que nos comprometemos a seguir.',
  },
  {
    id: 'A12', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Preguntas frecuentes',
    items: PREGUNTAS.map((p) => ({ label: p.q, text: p.a })),
    notes: 'Preguntas que es probable que salgan, con su respuesta corta.',
  },
  {
    id: 'A13', section: 'Apéndice', tone: 'paper', layout: 'list', time: '0:00',
    title: 'Cronograma detallado, en semanas',
    items: [
      { label: 'Semanas 1 y 2', text: 'Profesor responsable nombrado, herramienta apta elegida, horario y salón definidos, aviso a los acudientes.' },
      { label: 'Semanas 3 a 8', text: 'Las seis clases del club, una por semana. Semana 8: Demo Day con invitados de la directiva.' },
      { label: 'Semana 9', text: 'Informe corto del club a la directiva: productos, asistencia y aprendizajes.' },
      { label: 'Arranque a confirmar', text: 'Piloto del currículo con un grupo de 8.º, cuando la coordinación lo programe, e informe al cierre del período.' },
    ],
    footnote: 'Las fechas exactas dependen del calendario del IAE y quedan a confirmar.',
    notes: 'El cronograma en semanas. Las fechas las fijamos con la coordinación según el calendario del colegio.',
  },
  {
    id: 'A14', section: 'Apéndice', tone: 'paper', layout: 'sources', time: '0:00',
    title: 'Fuentes',
    notes: 'Todas las fuentes, con su enlace. El detalle de cada cita está en el repositorio, en FUENTES-DIRECTIVA.md.',
  },
]

/** Índice del primer slide del apéndice. */
export const APPENDIX_START = SLIDES.findIndex((s) => s.section === 'Apéndice')
export const MAIN_COUNT = APPENDIX_START

export function beatsOf(s: Slide): number {
  if (s.layout === 'table' || s.layout === 'timeline') return s.beats.length
  if (s.layout === 'demo') return s.chat.length
  return s.layout === 'floorCeiling' ? 3 : 1
}

/** Número visible de una lámina: 01 / 14 … 14 / 14, o A1…A7 en el apéndice. */
export function slideNumber(i: number): string {
  return i >= APPENDIX_START ? SLIDES[i].id : `${String(i + 1).padStart(2, '0')} / ${MAIN_COUNT}`
}
