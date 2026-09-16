// Contenido de las dos propuestas + geometría del tablero.
// x, y = centro del nodo en coordenadas de mundo; w, h = tamaño de diseño fijo.
// Índice global: 0 = lobby · 1–8 = Builders Club · 9–13 = Currículo.

export type World = 'lobby' | 'bc' | 'cu'
export type Flavor =
  | 'panRight'
  | 'zoomThrough'
  | 'diagonalTilt'
  | 'tiltRight'
  | 'worldView'
  | 'dropOvershoot'
  | 'slideBlur'
  | 'zoomStrong'

export interface NodeMeta {
  key: string
  world: World
  /** Número dentro de su propuesta (0 en el lobby). */
  n: number
  short: string
  title: string
  x: number
  y: number
  w: number
  h: number
  notes: string
}

export const WORLDS: Record<World, { label: string; name: string; grades: string }> = {
  lobby: { label: 'Lobby', name: 'Sala de propuestas', grades: '' },
  bc: { label: 'Propuesta 1', name: 'Builders Club', grades: '9no a 11vo' },
  cu: { label: 'Propuesta 2', name: 'Currículo 8–10', grades: '8vo a 10mo' },
}

const W = 1280
const H = 760
const BW = 1520
const BH = 900

export const NODES: NodeMeta[] = [
  {
    key: 'lobby', world: 'lobby', n: 0, short: 'Lobby', title: 'Construir con IA, no copiar con IA',
    x: 0, y: 0, w: BW, h: BH,
    notes: 'Traigo dos propuestas que se complementan. La primera es un club voluntario para los que quieren construir. La segunda es un currículo para todos, de 8vo a 10mo. Empiezo por el club porque es lo que puedo arrancar en octubre; después te muestro cómo el currículo le da la base a todo el colegio. Si en algún momento quieres ver las dos juntas, aprieto O y sale el mapa.',
  },

  // ——— Propuesta 1 · Builders Club ———
  {
    key: 'bc-1', world: 'bc', n: 1, short: 'Visión', title: 'Aquí no se usa la IA para hacer tareas. Se usa para construir.',
    x: -3000, y: -1300, w: W, h: H,
    notes: 'El Builders Club no es un club de "usar IA para la tarea". Es un club donde se construyen productos reales que le sirvan al colegio. La IA es la herramienta, igual que un taller tiene herramientas; lo que importa es lo que sale del taller. Yo me postulo como presidente, y en las próximas estaciones te explico por qué, qué pido y cómo funcionaría.',
  },
  {
    key: 'bc-2', world: 'bc', n: 2, short: 'Por qué presidente', title: 'Me postulo porque ya construyo con esto todos los días',
    x: -5100, y: -1450, w: W, h: H,
    notes: '¿Por qué yo? No porque lo sepa todo, sino porque ya recorrí el camino que el club quiere recorrer. Construyo apps que están en producción, he sido mentor en cursos de IA y uso Claude a fondo todos los días: terminal, MCPs, segundo cerebro. La idea no es que el club dependa de mí; es que en unos meses los miembros construyan cosas que a mí no se me hubieran ocurrido.',
  },
  {
    key: 'bc-3', world: 'bc', n: 3, short: 'La apuesta', title: 'La apuesta: una cuenta de Claude por estudiante',
    x: -7200, y: -1250, w: W, h: H,
    notes: 'Esta es la apuesta concreta. Para construir de verdad, cada estudiante necesita su propia cuenta. Le pido a la junta que apoye al club con una cuenta de Claude por estudiante. ¿Por qué Claude? Porque es donde tengo el conocimiento profundo y donde el club tiene más posibilidades de despegar. Si no se puede, Gemini es el plan B, pero quiero ser honesto: no está a la par. Y algo importante: nadie está obligado a pagar. Lo que pido es que el colegio apoye al club.',
  },
  {
    key: 'bc-4', world: 'bc', n: 4, short: 'Qué se enseña', title: 'Qué se enseña: las herramientas de alguien que construye',
    x: -7300, y: 150, w: W, h: H,
    notes: 'Esto es lo que se enseña. Obsidian como segundo cerebro. MCPs para conectar a Claude con las herramientas que ya usamos. La diferencia entre la terminal, con Claude Code, y la app de escritorio. Cuándo usar cada modelo. Y prompting. Nada es teórico: cada tema tiene su práctica, y todos salen de la sesión con algo hecho.',
  },
  {
    key: 'bc-5', world: 'bc', n: 5, short: 'Plan clase por clase', title: 'Seis clases para pasar de cero a construir',
    x: -5100, y: 50, w: BW, h: BH,
    notes: 'Este es el plan de arranque, clase por clase. Uno: fundamentos y setup, y cada quien resuelve algo suyo ese mismo día. Dos: segundo cerebro con Obsidian, cada uno monta su vault. Tres: modelos y superficies, la misma tarea en terminal y en desktop. Cuatro: MCPs, conectar a Claude con Excel, WhatsApp o Drive. Cinco: prompting de construcción, y sale una mini-herramienta. Seis: Demo Day, cada quien o cada equipo presenta un producto que beneficie al colegio. De ahí en adelante, el temario lo definen los miembros.',
  },
  {
    key: 'bc-6', world: 'bc', n: 6, short: 'La meta', title: 'La meta: productos que el colegio use de verdad',
    x: -2950, y: 150, w: W, h: H,
    notes: 'La meta del club son productos que el colegio use. Y no es hipotético: ya existe un proyecto de alumno que puede cambiar cómo se enseña el SAT. Lo dejo bloqueado a propósito; es una prueba de concepto de lo que el club puede producir, no una receta. Lo que importa es el nivel al que se puede llegar.',
  },
  {
    key: 'bc-7', world: 'bc', n: 7, short: 'Integridad', title: 'Integridad: la IA para construir, no para copiar',
    x: -3700, y: 1650, w: W, h: H,
    notes: 'Sé que el miedo del colegio es que la IA se use para copiar tareas, y lo entiendo. Mi respuesta no es un reglamento duro, porque esos se esquivan. Es hablar las reglas de uso con los miembros desde el primer día, para que queden claras entre todos. Y hay algo de fondo: en un club que construye no hay nada que copiar. El producto no existe hasta que tú lo haces.',
  },
  {
    key: 'bc-8', world: 'bc', n: 8, short: 'Logística y cierre', title: 'Lo que pido: tu apoyo para arrancar en octubre',
    x: -6100, y: 1600, w: W, h: H,
    notes: 'Para cerrar, la logística. Es gratis, más o menos una sesión por semana, para 9no a 11vo, y arranca en octubre de 2026. A futuro hay dos ideas abiertas: traer charlistas externos y abrir una versión para profesores. Pero hoy lo que te pido es concreto: tu apoyo para que el club arranque en octubre y para llevar a la junta el pedido de las cuentas. Ahora vuelvo al lobby y te muestro la segunda propuesta, que es para todo el colegio.',
  },

  // ——— Propuesta 2 · Currículo 8–10 ———
  {
    key: 'cu-1', world: 'cu', n: 1, short: 'La progresión', title: 'Tres años, una progresión: leer, pedir, crear',
    x: 3000, y: -1300, w: W, h: H,
    notes: 'La segunda propuesta es para todos, no solo para los que se apuntan a un club. Es un currículo de tres años con una progresión simple: en 8vo leen la estructura, en 9no aprenden a pedir bien y en 10mo crean libre. Cada año cierra con un entregable concreto.',
  },
  {
    key: 'cu-2', world: 'cu', n: 2, short: '8vo · Cimientos', title: '8vo: la IA pregunta, el alumno responde',
    x: 5150, y: -1050, w: W, h: H,
    notes: 'En 8vo el método es invertido. El profe da un prompt; el alumno se lo pasa a Claude, que está conectado a Excel por MCP, y es Claude el que lo interroga: ¿qué hay en A5?, ¿qué hace esta fórmula? El alumno se familiariza respondiendo, no memorizando. En el año pasan de navegar celdas, a entender fórmulas, a ver cómo se conectan. Aplica igual a Word y PowerPoint. El entregable: leer y explicar un Excel real.',
  },
  {
    key: 'cu-3', world: 'cu', n: 3, short: '9no · Pedir bien', title: '9no: la forma del prompt diferencia el producto',
    x: 5250, y: 500, w: W, h: H,
    notes: 'En 9no pasan de responder a pedir. Aprenden a redactar prompts, a dar pasos claros para que la IA no se pierda, y a ver por qué el cómo pides cambia el resultado. Aquí ya empiezan a hacer ellos los Excels. El entregable es un Excel construido por ellos, a punta de un prompt bien estructurado.',
  },
  {
    key: 'cu-4', world: 'cu', n: 4, short: '10mo · Crear', title: '10mo: crean productos que sirven',
    x: 3050, y: 650, w: W, h: H,
    notes: 'En 10mo cierran el aprendizaje y crean productos que sirvan: Excels propios, herramientas, sistemas para clubes. Un ejemplo real: un sistema de club que empezó como idea, pasó a Excel y después a Google Sheets para que todos lo usaran. El entregable es un producto real terminado, que queda en su portafolio.',
  },
  {
    key: 'cu-5', world: 'cu', n: 5, short: 'Conexión con el club', title: 'El currículo da la base a todos. El club lleva más lejos a quien quiera.',
    x: 4300, y: 2050, w: W, h: H,
    notes: 'Y así se conectan. El currículo le da la base a todos, de 8vo a 10mo. El club, de 9no a 11vo, es donde los que quieren más siguen construyendo. Una propuesta no reemplaza a la otra: una pone el piso y la otra quita el techo. Te dejo el mapa completo para que veas las dos juntas.',
  },
]

export const LOBBY = 0
export const RANGE: Record<Exclude<World, 'lobby'>, { first: number; last: number }> = {
  bc: { first: 1, last: 8 },
  cu: { first: 9, last: 13 },
}
export const COUNT: Record<Exclude<World, 'lobby'>, number> = { bc: 8, cu: 5 }

/** Estilo de vuelo entre nodos vecinos, por el índice menor del par. */
export const FLAVORS: Record<number, Flavor> = {
  1: 'panRight',
  2: 'zoomThrough',
  3: 'diagonalTilt',
  4: 'worldView',
  5: 'dropOvershoot',
  6: 'slideBlur',
  7: 'zoomStrong',
  9: 'tiltRight',
  10: 'dropOvershoot',
  11: 'zoomThrough',
  12: 'worldView',
}

/** Centro aproximado de cada portal dentro del lobby, en coordenadas de mundo. */
export const PORTALS: Record<Exclude<World, 'lobby'>, { x: number; y: number }> = {
  bc: { x: -372, y: 40 },
  cu: { x: 372, y: 40 },
}

export const ACCENT: Record<World, string> = {
  lobby: '#D9DEE7',
  bc: '#C8A24B',
  cu: '#6FB8E8',
}
