// Currículo completo de 8.º a 10.º y plan completo del Builders Club.
// Lo usan el documento /directiva/curriculo/ y las láminas de detalle de /directiva/.
// scripts/content-check-directiva.mjs revisa también este archivo.

export interface Session {
  /** Semana dentro del año (1–30). */
  n: number
  tema: string
  /** Qué hace el alumno en la sesión. */
  hace: string
}

export interface Unit {
  trimestre: string
  nombre: string
  meta: string
  sesiones: Session[]
  /** Evidencia que queda al cierre de la unidad. */
  evidencia: string
}

export interface RubricRow {
  criterio: string
  peso: string
  /** Inicial · En desarrollo · Logrado · Destacado */
  niveles: [string, string, string, string]
}

export interface Grade {
  id: '8' | '9' | '10'
  grado: string
  verbo: string
  lema: string
  objetivo: string
  competencias: string[]
  unidades: Unit[]
  claseTipo: { min: string; momento: string; detalle: string }[]
  entregable: { nombre: string; descripcion: string; formato: string[] }
  rubrica: RubricRow[]
  prompt: string
}

export const NIVELES = ['Inicial', 'En desarrollo', 'Logrado', 'Destacado'] as const

export const MARCO = {
  resumen:
    'Un currículo de tres años que enseña a usar la IA para entender, pedir y crear, y no para entregar trabajo ajeno. Cada año tiene 30 clases, tres unidades y un proyecto final que el alumno presenta en vivo. Cada trimestre, cada alumno además le da una mini-clase a sus compañeros. Al terminar 10.º, sale con un portafolio de tres piezas que puede mostrar, explicar y enseñar.',
  carga: [
    { k: 'Dónde vive', v: 'Dentro de la clase de Tecnología o Informática de 8.º, 9.º y 10.º. No es una materia nueva. A confirmar con la coordinación.' },
    { k: 'Cuánto tiempo', v: 'Un período semanal de 45 minutos. Tres trimestres de 10 semanas: 30 sesiones por año, 90 en los tres años.' },
    { k: 'Herramientas', v: 'Excel o Google Sheets, Word o Docs, PowerPoint o Slides, y la IA en dos niveles: desde el primer día, el profesor la maneja proyectada; cuando el colegio apruebe una herramienta apta para la edad, cada alumno la usa con cuenta del colegio.' },
    { k: 'Quién la dicta', v: 'El docente de Tecnología, con la guía de cada unidad, el banco de prompts y tres talleres de formación antes de arrancar.' },
    { k: 'Cómo se evalúa', v: 'Una ficha corta en cada sesión, prácticas guiadas, una mini-clase dada por el alumno y un proyecto por trimestre. El proyecto final de cada año se presenta en vivo y se evalúa con rúbrica de cuatro niveles.' },
  ],
  principios: [
    { k: 'La IA guía, el alumno decide', v: 'En los tres años la IA pregunta, propone o revisa. El alumno responde, decide y explica. Nada se entrega sin que el alumno lo pueda explicar en voz alta.' },
    { k: 'Archivos reales', v: 'Se trabaja con hojas, documentos y presentaciones del tipo que usa el colegio: horarios, inventarios, torneos, asistencia. Siempre con datos ficticios o anonimizados.' },
    { k: 'Se enseña lo que se aprende', v: 'Cada trimestre, cada alumno da una mini-clase a sus compañeros, y cada proyecto final se presenta y se defiende en vivo. Explicarlo frente a otros es la mejor prueba de que es tuyo.' },
    { k: 'Progresión', v: 'Leer en 8.º, pedir en 9.º, crear en 10.º. Es la misma progresión del marco de competencias en IA de la UNESCO (2024): comprender, aplicar, crear.' },
  ],
  bitacora: ['Qué le pedí a la IA (el prompt exacto).', 'Qué respondió, en una línea.', 'Qué verifiqué y cómo (en la hoja, con un dato, con un compañero).', 'Qué cambié o qué decidí yo.'],
  calificacion: [
    { k: 'Fichas “Cómo lo hice”', v: '15 %' },
    { k: 'Prácticas guiadas de cada unidad', v: '25 %' },
    { k: 'Mini-clase a los compañeros', v: '15 %' },
    { k: 'Proyecto del trimestre, presentado en vivo (con rúbrica)', v: '45 %' },
  ],
}

export const GRADES: Grade[] = [
  {
    id: '8', grado: '8.º', verbo: 'Leer', lema: 'La IA pregunta, el alumno responde',
    objetivo: 'Que cada alumno pueda abrir un archivo real que no hizo y explicar cómo está construido: qué datos tiene, qué calcula cada fórmula y cómo se conectan las partes.',
    competencias: [
      'Identifica celdas, rangos, hojas y tipos de datos en una hoja de cálculo.',
      'Explica con sus palabras qué calcula una fórmula y por qué da ese resultado.',
      'Sigue cómo se conectan hojas, tablas y gráficos dentro de un archivo.',
      'Reconoce la estructura de un documento y de una presentación: estilos, secciones y patrones.',
      'Verifica en el archivo lo que la IA le pregunta, antes de responder.',
    ],
    unidades: [
      {
        trimestre: 'Trimestre 1', nombre: 'Leer una hoja de cálculo', meta: 'Moverse con soltura en una hoja y explicar sus partes.',
        sesiones: [
          { n: 1, tema: 'El método al revés', hace: 'Conoce la dinámica: la IA le hace preguntas sobre una hoja y él las responde mirando el archivo.' },
          { n: 2, tema: 'Celdas, filas y columnas', hace: 'Responde preguntas como “¿qué hay en B3?” y “¿en qué fila está el total?”.' },
          { n: 3, tema: 'Tipos de datos', hace: 'Distingue texto, número, fecha y porcentaje; explica por qué una fecha se ve como número.' },
          { n: 4, tema: 'Rangos y nombres', hace: 'Señala rangos (A2:A20) y lee rangos con nombre en una hoja de asistencia.' },
          { n: 5, tema: 'Primeras fórmulas', hace: 'Explica qué hacen SUMA, PROMEDIO, MAX y MIN en un registro de notas ficticio.' },
          { n: 6, tema: 'Referencias relativas y absolutas', hace: 'Predice qué pasa al copiar una fórmula y comprueba su predicción en la hoja.' },
          { n: 7, tema: 'Ordenar y filtrar', hace: 'Responde preguntas que solo se contestan filtrando: “¿cuántos préstamos hubo en mayo?”.' },
          { n: 8, tema: 'Leer una hoja ajena', hace: 'Recibe el horario de un grado y explica su estructura a un compañero.' },
          { n: 9, tema: 'La clase la dan ustedes', hace: 'Cada pareja da una mini-clase de 8 minutos sobre un tema de la unidad y deja 3 preguntas para comprobar que el grupo entendió.' },
          { n: 10, tema: 'Presentación de la unidad', hace: 'Explica una hoja de inventario de la biblioteca en 5 minutos y entrega su hoja anotada.' },
        ],
        evidencia: 'Hoja de inventario anotada con comentarios en cada sección y explicación oral de 5 minutos.',
      },
      {
        trimestre: 'Trimestre 2', nombre: 'Fórmulas que deciden', meta: 'Entender fórmulas que comparan, cuentan y buscan.',
        sesiones: [
          { n: 11, tema: 'SI: la hoja toma decisiones', hace: 'Explica una fórmula SI que marca “aprobado” o “en refuerzo” en un registro ficticio.' },
          { n: 12, tema: 'Y, O y condiciones combinadas', hace: 'Lee condiciones dobles y dice en qué casos se cumplen.' },
          { n: 13, tema: 'CONTAR.SI y SUMAR.SI', hace: 'Responde “¿cuántos equipos ganaron más de tres partidos?” leyendo la fórmula que lo calcula.' },
          { n: 14, tema: 'Buscar datos: BUSCARV y BUSCARX', hace: 'Sigue una búsqueda paso a paso: qué valor busca, en qué tabla y qué columna devuelve.' },
          { n: 15, tema: 'Mensajes de error', hace: 'Explica qué significan #N/A, #DIV/0! y #REF! y qué parte de la hoja los produce.' },
          { n: 16, tema: 'Tablas con formato', hace: 'Reconoce encabezados, filas de total y referencias estructuradas.' },
          { n: 17, tema: 'Validación de datos', hace: 'Descubre por qué una celda solo acepta ciertos valores y dónde está la lista que la controla.' },
          { n: 18, tema: 'Formato condicional', hace: 'Explica la regla detrás de cada color en una tabla de posiciones.' },
          { n: 19, tema: 'La clase la dan ustedes', hace: 'Cada pareja enseña una fórmula al grupo con un ejemplo propio; el grupo la usa en una hoja nueva.' },
          { n: 20, tema: 'Presentación de la unidad', hace: 'Explica la tabla de posiciones de un torneo intercolegial: cada fórmula, cada regla y cada error resuelto.' },
        ],
        evidencia: 'Mapa de fórmulas de la tabla del torneo (qué calcula cada una) y explicación oral.',
      },
      {
        trimestre: 'Trimestre 3', nombre: 'Cómo se conecta todo', meta: 'Ver un archivo como un sistema y leer también documentos y presentaciones.',
        sesiones: [
          { n: 21, tema: 'Hojas vinculadas', hace: 'Sigue un dato desde la hoja de registro hasta la hoja de resumen.' },
          { n: 22, tema: 'Gráficos', hace: 'Explica qué datos alimentan un gráfico y qué cambia si se edita una celda.' },
          { n: 23, tema: 'Tablas dinámicas, solo lectura', hace: 'Lee una tabla dinámica y dice qué pregunta responde.' },
          { n: 24, tema: 'Leer un documento con estilos', hace: 'Identifica títulos, subtítulos, estilos y la tabla de contenido automática en Word o Docs.' },
          { n: 25, tema: 'Leer una presentación', hace: 'Reconoce el patrón de diapositivas, los diseños y la jerarquía de cada lámina.' },
          { n: 26, tema: 'Del archivo al sistema', hace: 'Dibuja en papel el mapa de un archivo de tres hojas: entradas, cálculos y salidas.' },
          { n: 27, tema: 'Preparar el proyecto final', hace: 'Recibe el Excel real (anonimizado) que va a explicar y arma su guion.' },
          { n: 28, tema: 'Ensayo con la IA', hace: 'La IA le hace las preguntas del panel; él responde y anota lo que debe reforzar.' },
          { n: 29, tema: 'La clase la dan ustedes', hace: 'Cada pareja enseña al grupo el truco más útil que descubrió en el año; un compañero lo evalúa con la rúbrica.' },
          { n: 30, tema: 'Proyecto final', hace: 'Lee y explica un Excel real frente al docente y entrega el mapa del archivo.' },
        ],
        evidencia: 'Proyecto final: lectura y explicación de un Excel real.',
      },
    ],
    claseTipo: [
      { min: '0–5', momento: 'Apertura', detalle: 'El docente proyecta el archivo del día y entrega el prompt de interrogación.' },
      { min: '5–30', momento: 'La IA pregunta', detalle: 'La IA hace preguntas una por una sobre el archivo y el alumno revisa en la hoja antes de responder. En el nivel 1, el profesor maneja la IA proyectada y el grupo responde por turnos; en el nivel 2, cada alumno trabaja con su propia cuenta del colegio.' },
      { min: '30–40', momento: 'Puesta en común', detalle: 'Tres alumnos explican al grupo una parte del archivo. El docente corrige y profundiza.' },
      { min: '40–45', momento: 'Cómo lo hice', detalle: 'Cada alumno completa su ficha “Cómo lo hice”: cuatro líneas.' },
    ],
    entregable: {
      nombre: 'Leer y explicar un Excel real',
      descripcion: 'El alumno recibe un archivo real del colegio, anonimizado, de al menos tres hojas (por ejemplo, el registro de un torneo). Tiene una semana para estudiarlo con la IA como entrevistadora y lo explica frente al docente en 7 minutos.',
      formato: ['Mapa del archivo en una página: entradas, cálculos y salidas.', 'Explicación oral de 7 minutos con el archivo proyectado.', 'Tres preguntas del docente sobre fórmulas elegidas al azar.', 'Su ficha “Cómo lo hice” de la semana de preparación.'],
    },
    rubrica: [
      { criterio: 'Estructura', peso: '25 %', niveles: ['Nombra algunas partes del archivo con ayuda.', 'Identifica hojas y rangos, con imprecisiones en tipos de datos.', 'Identifica hojas, rangos y tipos de datos sin ayuda.', 'Además explica por qué el archivo está organizado así.'] },
      { criterio: 'Fórmulas', peso: '30 %', niveles: ['Lee el resultado, pero no explica la fórmula.', 'Explica fórmulas simples; duda en las condicionales.', 'Explica qué calcula cada fórmula y por qué da ese resultado.', 'Además propone cómo se podría simplificar o mejorar.'] },
      { criterio: 'Conexiones', peso: '25 %', niveles: ['Ve cada hoja por separado.', 'Sigue un dato entre dos hojas con ayuda.', 'Sigue un dato desde la entrada hasta el resumen.', 'Explica qué pasaría en todo el archivo si cambia un dato.'] },
      { criterio: 'Explicación', peso: '20 %', niveles: ['Lee lo que dice la pantalla.', 'Explica con sus palabras, con pausas largas.', 'Explica con claridad y responde las tres preguntas.', 'Explica con ejemplos propios y anticipa preguntas.'] },
    ],
    prompt: 'Eres un entrevistador. Tengo abierta una hoja de cálculo. Hazme preguntas, una por una, para que yo descubra qué hace cada parte. No me des las respuestas: si me equivoco, dame una pista y vuelve a preguntar. Empieza por la estructura y termina por las fórmulas.',
  },
  {
    id: '9', grado: '9.º', verbo: 'Pedir', lema: 'La forma del prompt cambia el producto',
    objetivo: 'Que cada alumno sepa escribir un pedido claro, por pasos y con criterios de revisión, y construir con la IA un archivo que funciona y que puede defender.',
    competencias: [
      'Redacta prompts con contexto, objetivo, pasos, formato y criterios de revisión.',
      'Construye por pasos con la IA y da su visto bueno en cada uno.',
      'Prueba lo que la IA produce con datos de prueba antes de darlo por bueno.',
      'Documenta su prompt y sus iteraciones para que otro pueda repetirlo.',
      'Aplica la misma estructura a documentos y presentaciones.',
    ],
    unidades: [
      {
        trimestre: 'Trimestre 1', nombre: 'Anatomía de un buen pedido', meta: 'Escribir prompts que dan el resultado esperado a la primera o a la segunda.',
        sesiones: [
          { n: 1, tema: 'El mismo pedido, dos resultados', hace: 'Compara lo que sale de un pedido vago y de uno estructurado para la misma tarea.' },
          { n: 2, tema: 'Las cinco partes de un prompt', hace: 'Aprende contexto, objetivo, pasos, formato y criterios; las marca en ejemplos.' },
          { n: 3, tema: 'Contexto', hace: 'Reescribe un pedido agregando para quién es y para qué sirve.' },
          { n: 4, tema: 'Pasos', hace: 'Divide una tarea grande en pasos con visto bueno en cada uno.' },
          { n: 5, tema: 'Formato de salida', hace: 'Pide tablas, listas o columnas exactas y compara resultados.' },
          { n: 6, tema: 'Criterios de revisión', hace: 'Agrega al prompt cómo va a saber que el resultado está bien.' },
          { n: 7, tema: 'Verificar', hace: 'Revisa respuestas de la IA contra datos conocidos y corrige lo que no cuadra.' },
          { n: 8, tema: 'Iterar', hace: 'Mejora un prompt en tres versiones y anota qué cambió en cada una.' },
          { n: 9, tema: 'La clase la dan ustedes', hace: 'Cada pareja enseña una de las cinco partes del prompt con un antes y un después.' },
          { n: 10, tema: 'Presentación de la unidad', hace: 'Entrega un prompt que otro grupo ejecuta sin preguntas y obtiene el resultado pedido.' },
        ],
        evidencia: 'Prompt de cinco partes ejecutado por otro grupo, con la historia de sus versiones.',
      },
      {
        trimestre: 'Trimestre 2', nombre: 'Construir un Excel desde un prompt', meta: 'Pasar de pedir textos a construir archivos que funcionan.',
        sesiones: [
          { n: 11, tema: 'Especificar antes de construir', hace: 'Escribe la ficha de un Excel: columnas, datos, cálculos y quién lo usa.' },
          { n: 12, tema: 'Columnas y validación', hace: 'Construye con la IA la estructura de una hoja de asistencia con listas desplegables.' },
          { n: 13, tema: 'Fórmulas pedidas', hace: 'Pide fórmulas explicando la regla en palabras y verifica cada una.' },
          { n: 14, tema: 'Datos de prueba', hace: 'Pide 30 filas de datos ficticios y prueba los casos raros.' },
          { n: 15, tema: 'Corregir con la IA', hace: 'Describe un resultado incorrecto y guía a la IA hasta corregirlo.' },
          { n: 16, tema: 'Resumen y gráficos', hace: 'Agrega una hoja de resumen con dos gráficos que respondan preguntas concretas.' },
          { n: 17, tema: 'Pestaña “Léeme”', hace: 'Documenta cómo se usa el archivo para que otro lo pueda usar sin explicación.' },
          { n: 18, tema: 'Segundo archivo', hace: 'Construye solo un registro de préstamos de la biblioteca con lo aprendido.' },
          { n: 19, tema: 'La clase la dan ustedes', hace: 'Cada pareja enseña cómo construyó una parte de su Excel; el grupo la repite en el suyo.' },
          { n: 20, tema: 'Presentación de la unidad', hace: 'Entrega un Excel funcional con su prompt, sus datos de prueba y su pestaña “Léeme”.' },
        ],
        evidencia: 'Registro de préstamos de la biblioteca: archivo, prompt y datos de prueba.',
      },
      {
        trimestre: 'Trimestre 3', nombre: 'El producto del año', meta: 'Construir un Excel completo y presentarlo, con documento y presentación hechos con la misma estructura.',
        sesiones: [
          { n: 21, tema: 'Elegir el encargo', hace: 'Elige un encargo del banco del colegio: tabla de un torneo, control de un club o inventario de un laboratorio.' },
          { n: 22, tema: 'Ficha del producto', hace: 'Escribe la ficha: para quién, qué resuelve, qué columnas y qué cálculos.' },
          { n: 23, tema: 'Prompt maestro', hace: 'Redacta el prompt maestro por pasos y lo revisa con la rúbrica.' },
          { n: 24, tema: 'Construcción, parte 1', hace: 'Construye estructura y validaciones; anota cada visto bueno en su ficha.' },
          { n: 25, tema: 'Construcción, parte 2', hace: 'Construye cálculos, resumen y formato; prueba con datos de prueba.' },
          { n: 26, tema: 'Informe en Word o Docs', hace: 'Pide un informe con estilos y tabla de contenido, y lo corrige a mano.' },
          { n: 27, tema: 'Presentación de cinco láminas', hace: 'Pide una presentación desde un esquema propio y ajusta cada lámina.' },
          { n: 28, tema: 'Prueba con un usuario', hace: 'Un compañero usa el archivo con la pestaña “Léeme” y anota dudas.' },
          { n: 29, tema: 'Ajustes finales', hace: 'Corrige lo que salió en la prueba y actualiza su ficha.' },
          { n: 30, tema: 'Proyecto final', hace: 'Presenta su Excel construido desde un prompt bien estructurado.' },
        ],
        evidencia: 'Proyecto final: Excel construido desde un prompt bien estructurado.',
      },
    ],
    claseTipo: [
      { min: '0–5', momento: 'Encargo', detalle: 'El docente presenta la tarea del día y el criterio de “bien hecho”.' },
      { min: '5–15', momento: 'Escribir el prompt', detalle: 'Cada alumno redacta su prompt con las cinco partes antes de usar la IA.' },
      { min: '15–35', momento: 'Construir por pasos', detalle: 'Ejecuta el prompt paso a paso, da visto bueno y prueba con datos.' },
      { min: '35–42', momento: 'Comparar', detalle: 'Dos alumnos muestran prompts distintos para la misma tarea y el grupo compara resultados.' },
      { min: '42–45', momento: 'Cómo lo hice', detalle: 'Ficha “Cómo lo hice” con la versión final del prompt.' },
    ],
    entregable: {
      nombre: 'Un Excel construido desde un prompt bien estructurado',
      descripcion: 'El alumno construye un archivo para un encargo real del colegio, con datos ficticios, guiando a la IA por pasos. Lo entrega con su prompt maestro y lo demuestra funcionando.',
      formato: ['El archivo con hoja de datos, hoja de resumen y pestaña “Léeme”.', 'El prompt maestro y sus versiones.', 'Su ficha “Cómo lo hice” con cada visto bueno y cada corrección.', 'Demostración de 5 minutos con datos de prueba.'],
    },
    rubrica: [
      { criterio: 'Calidad del prompt', peso: '25 %', niveles: ['Pedido de una línea, sin pasos.', 'Tiene objetivo y algunos pasos.', 'Tiene las cinco partes y otro grupo lo puede ejecutar.', 'Además anticipa casos raros y define cómo revisarlos.'] },
      { criterio: 'El archivo funciona', peso: '30 %', niveles: ['Estructura incompleta o fórmulas con errores.', 'Funciona con datos normales, todavía no con casos raros.', 'Funciona con todos los datos de prueba.', 'Además valida entradas y avisa cuando algo no cuadra.'] },
      { criterio: 'Iteración y verificación', peso: '25 %', niveles: ['Sin ficha o con una sola versión.', 'Muestra correcciones sin explicar por qué.', 'Cada corrección tiene su razón y su prueba.', 'Además compara alternativas y justifica la elegida.'] },
      { criterio: 'Documentación y demostración', peso: '20 %', niveles: ['Sin pestaña “Léeme”.', 'Instrucciones incompletas.', 'Otro alumno lo usa solo con la pestaña “Léeme”.', 'Demostración clara que responde todas las preguntas.'] },
    ],
    prompt: 'Construye conmigo una hoja de asistencia para un club en tres pasos. Paso 1: propón las columnas y espera mi visto bueno. Paso 2: agrega las fórmulas de porcentaje de asistencia y explícame cada una. Paso 3: agrega formato condicional para quien baje del 80 %. No avances de paso sin mi visto bueno.',
  },
  {
    id: '10', grado: '10.º', verbo: 'Crear', lema: 'Crean productos que sirven',
    objetivo: 'Que cada alumno, solo o en pareja, encuentre una necesidad real del colegio, diseñe y construya un producto con IA, lo ponga en uso y muestre evidencia de que sirve.',
    competencias: [
      'Entrevista a un usuario y define una necesidad concreta.',
      'Diseña un producto en una ficha de una página antes de construir.',
      'Construye con IA un producto que funciona: hoja con formulario, sistema de registro o herramienta simple.',
      'Pone el producto en uso real y mide si sirve.',
      'Presenta su proceso y lo deja en su portafolio.',
    ],
    unidades: [
      {
        trimestre: 'Trimestre 1', nombre: 'De la necesidad al diseño', meta: 'Elegir para quién construir y diseñar antes de tocar la herramienta.',
        sesiones: [
          { n: 1, tema: 'Productos que sirven', hace: 'Analiza ejemplos de herramientas simples que resuelven algo concreto.' },
          { n: 2, tema: 'Buscar necesidades', hace: 'Hace una lista de tareas repetitivas que ve en clubes, departamentos y eventos.' },
          { n: 3, tema: 'Entrevista al usuario', hace: 'Prepara cinco preguntas y entrevista a un usuario real (un profesor, un club, un departamento).' },
          { n: 4, tema: 'Definir la necesidad', hace: 'Escribe en una oración quién necesita qué y por qué.' },
          { n: 5, tema: 'Ficha del producto', hace: 'Completa la ficha: usuario, necesidad, qué hace el producto, qué no hace y cómo sabrá que sirve.' },
          { n: 6, tema: 'Prototipo en papel', hace: 'Dibuja pantallas o columnas y lo muestra al usuario.' },
          { n: 7, tema: 'Elegir la herramienta', hace: 'Decide con el docente: hoja de cálculo con formulario, documento automatizado o herramienta simple.' },
          { n: 8, tema: 'Plan de construcción', hace: 'Divide el producto en pasos y escribe el prompt maestro.' },
          { n: 9, tema: 'Revisión con el usuario', hace: 'Valida el prototipo y ajusta la ficha.' },
          { n: 10, tema: 'Presentación de la unidad', hace: 'Presenta ficha y prototipo validados en 4 minutos.' },
        ],
        evidencia: 'Ficha del producto validada por su usuario y prototipo.',
      },
      {
        trimestre: 'Trimestre 2', nombre: 'Construir y probar', meta: 'Construir una primera versión que funcione y probarla con usuarios.',
        sesiones: [
          { n: 11, tema: 'Versión 1, estructura', hace: 'Construye con IA la base del producto siguiendo su plan.' },
          { n: 12, tema: 'Versión 1, lógica', hace: 'Agrega cálculos, reglas o automatizaciones y las prueba.' },
          { n: 13, tema: 'Versión 1, presentación', hace: 'Diseña lo que ve el usuario: formulario, resumen o tablero.' },
          { n: 14, tema: 'Prueba interna', hace: 'Prueba con datos ficticios y casos raros; registra lo que encuentra.' },
          { n: 15, tema: 'Primera prueba con usuarios', hace: 'Tres usuarios lo prueban mientras él observa sin ayudar.' },
          { n: 16, tema: 'Ordenar lo aprendido', hace: 'Clasifica lo observado en “arreglar ya” y “para después”.' },
          { n: 17, tema: 'Versión 2', hace: 'Construye las mejoras con la IA y vuelve a probar.' },
          { n: 18, tema: 'Manual de uso', hace: 'Escribe un manual de una página con capturas.' },
          { n: 19, tema: 'Segunda prueba con usuarios', hace: 'Confirma que las mejoras funcionan y prepara la clase que dará a 8.º.' },
          { n: 20, tema: 'Presentación de la unidad', hace: 'Demuestra la versión 2 y entrega el registro de pruebas.' },
        ],
        evidencia: 'Versión 2 del producto, registro de pruebas y manual de uso.',
      },
      {
        trimestre: 'Trimestre 3', nombre: 'Lanzar y presentar', meta: 'Poner el producto en uso real, medirlo y presentarlo.',
        sesiones: [
          { n: 21, tema: 'Preparar el lanzamiento', hace: 'Acuerda con su usuario cómo y cuándo empieza a usarlo.' },
          { n: 22, tema: 'Lanzamiento', hace: 'Entrega el producto con su manual y acompaña el primer uso.' },
          { n: 23, tema: 'Medir el uso', hace: 'Define qué va a contar: cuántas personas lo usan, cuántos registros, cuánto tiempo ahorra.' },
          { n: 24, tema: 'Seguimiento, semana 1', hace: 'Recoge datos de uso y comentarios del usuario.' },
          { n: 25, tema: 'Seguimiento, semana 2', hace: 'Ajusta lo necesario y documenta cada cambio.' },
          { n: 26, tema: 'Portafolio', hace: 'Arma su portafolio: ficha, producto, manual, evidencia de uso y reflexión.' },
          { n: 27, tema: 'Guion de la presentación', hace: 'Prepara 7 minutos: necesidad, producto, evidencia, aprendizajes.' },
          { n: 28, tema: 'Ensayo con la IA', hace: 'La IA hace de panel con preguntas difíciles; él ajusta sus respuestas.' },
          { n: 29, tema: '10.º enseña a 8.º', hace: 'Visita un grupo de 8.º y les enseña en 10 minutos una técnica que usó en su producto.' },
          { n: 30, tema: 'Proyecto final', hace: 'Presenta su producto terminado ante un panel de docentes y su usuario.' },
        ],
        evidencia: 'Proyecto final: un producto terminado, en uso y en su portafolio.',
      },
    ],
    claseTipo: [
      { min: '0–5', momento: 'Meta del día', detalle: 'Cada alumno o pareja escribe qué parte de su producto termina hoy.' },
      { min: '5–35', momento: 'Taller', detalle: 'Construye con la IA siguiendo su plan. El profesor y los alumnos guía pasan por cada mesa.' },
      { min: '35–42', momento: 'Muestra rápida', detalle: 'Dos proyectos muestran avances de un minuto y reciben una sugerencia del grupo.' },
      { min: '42–45', momento: 'Cómo lo hice', detalle: 'Ficha “Cómo lo hice” y próximo paso.' },
    ],
    entregable: {
      nombre: 'Un producto terminado en su portafolio',
      descripcion: 'Un producto que un usuario real del colegio usó durante al menos dos semanas, con evidencia de uso, manual y presentación ante un panel de docentes.',
      formato: ['El producto funcionando, con su manual de una página.', 'Ficha del producto y registro de pruebas con usuarios.', 'Evidencia de uso: registros, conteos o comentarios del usuario.', 'Presentación de 7 minutos y portafolio completo.'],
    },
    rubrica: [
      { criterio: 'Necesidad y usuario', peso: '20 %', niveles: ['La necesidad es general o inventada.', 'Hay un usuario, pero la necesidad es vaga.', 'Necesidad concreta, validada con el usuario.', 'Además el usuario participó en cada versión.'] },
      { criterio: 'El producto funciona', peso: '30 %', niveles: ['Funciona en parte.', 'Funciona con ayuda del autor.', 'El usuario lo usa solo, con el manual.', 'Además es fácil de mantener por otra persona.'] },
      { criterio: 'Uso real', peso: '20 %', niveles: ['Sin evidencia de uso.', 'Se usó una vez.', 'Se usó dos semanas, con evidencia.', 'Además muestra una mejora medible para el usuario.'] },
      { criterio: 'Proceso con IA', peso: '15 %', niveles: ['Ficha incompleta.', 'Ficha con pocos detalles.', 'Ficha completa: qué pidió, qué revisó y qué decidió.', 'Además reflexiona qué haría distinto y por qué.'] },
      { criterio: 'Presentación', peso: '15 %', niveles: ['Lee las diapositivas.', 'Presenta, pero no responde preguntas.', 'Presenta con claridad y responde al panel.', 'Además convence al panel de seguir usándolo.'] },
    ],
    prompt: 'Quiero construir un sistema para inscribir miembros en un club del colegio. Antes de construir nada, hazme las preguntas que necesitas para entender quién lo va a usar, qué datos se registran y qué resumen necesita el coordinador. Después propón un plan en pasos y espera mi visto bueno.',
  },
]

export const PORTAFOLIO = [
  { grado: '8.º', pieza: 'Un Excel real, leído y explicado con sus palabras.', incluye: 'Mapa del archivo, grabación o notas de la explicación, fichas “Cómo lo hice”.' },
  { grado: '9.º', pieza: 'Un Excel construido desde su propio prompt.', incluye: 'Archivo, prompt maestro con versiones, pestaña “Léeme”, fichas “Cómo lo hice”.' },
  { grado: '10.º', pieza: 'Un producto terminado que alguien usa.', incluye: 'Ficha, producto, manual, evidencia de uso, reflexión.' },
]

export const FORMACION = [
  { k: 'Taller 1 · Antes de arrancar (2 horas)', v: 'El método de cada grado, la ficha “Cómo lo hice”, las mini-clases y la herramienta aprobada. Cada docente hace como alumno la sesión 1 de 8.º.' },
  { k: 'Taller 2 · Antes de arrancar (2 horas)', v: 'Banco de prompts, rúbricas y cómo acompañar a los alumnos guía. Cada docente corrige tres proyectos de ejemplo.' },
  { k: 'Taller 3 · Al cierre del trimestre 1 (1 hora)', v: 'Qué funcionó, qué ajustar y ejemplos reales de los grupos.' },
  { k: 'Guía de cada unidad', v: 'Objetivo, 10 sesiones con su prompt, archivos de práctica con datos ficticios y la rúbrica.' },
  { k: 'Acompañamiento', v: 'Miembros del Builders Club pueden apoyar como monitores en clase, si la coordinación lo aprueba.' },
]

export interface ClubSession {
  n: number
  nombre: string
  objetivo: string
  agenda: { min: string; que: string }[]
  sale: string
}

export const CLUB = {
  ficha: [
    { k: 'Quién', v: 'Estudiantes de 9.º, 10.º y 11.º, voluntario. Cupo inicial de 20 miembros (a confirmar).' },
    { k: 'Cuándo', v: 'Una sesión semanal de 60 minutos, en horario y salón que defina el colegio.' },
    { k: 'Quién acompaña', v: 'Un profesor responsable nombrado por el colegio. Las sesiones las preparan y las dan los miembros del club.' },
    { k: 'Qué se necesita', v: 'Un salón con proyector, computadoras o laptops y la herramienta de IA aprobada para la edad de los miembros.' },
    { k: 'La meta', v: 'Productos que el colegio use de verdad. Cada ciclo cierra con un Demo Day.' },
  ],
  sesiones: [
    {
      n: 1, nombre: 'Fundamentos y configuración', objetivo: 'Que cada miembro deje lista su herramienta y resuelva algo suyo ese mismo día.',
      agenda: [
        { min: '0–10', que: 'Qué es el club, qué no es y las reglas de uso, conversadas con todos.' },
        { min: '10–25', que: 'Configuración de la herramienta aprobada y primer pedido guiado.' },
        { min: '25–50', que: 'Cada miembro elige una tarea suya (organizar notas, un horario, un resumen) y la resuelve con IA.' },
        { min: '50–60', que: 'Tres miembros muestran lo que hicieron y cada uno anota cómo lo hizo.' },
      ],
      sale: 'Una tarea propia resuelta y la herramienta lista.',
    },
    {
      n: 2, nombre: 'Segundo cerebro', objetivo: 'Organizar notas e ideas para darle contexto a la IA.',
      agenda: [
        { min: '0–10', que: 'Por qué las notas ordenadas hacen mejor el trabajo con IA.' },
        { min: '10–30', que: 'Montar Obsidian: carpetas, notas enlazadas y una plantilla de proyecto.' },
        { min: '30–50', que: 'Cada miembro escribe la nota de su primera idea de producto.' },
        { min: '50–60', que: 'Usar esa nota como contexto en un pedido y comparar el resultado.' },
      ],
      sale: 'Un segundo cerebro con la nota de su primera idea.',
    },
    {
      n: 3, nombre: 'Elegir la herramienta correcta', objetivo: 'Saber cuándo usar la terminal, la app de escritorio y cada modelo.',
      agenda: [
        { min: '0–15', que: 'Demostración: la misma tarea en la terminal y en la app de escritorio.' },
        { min: '15–40', que: 'En parejas, cada uno resuelve la tarea en una superficie y comparan.' },
        { min: '40–55', que: 'Tabla del grupo: qué conviene para qué tipo de tarea.' },
        { min: '55–60', que: 'Cada uno anota qué aprendió y qué hará la próxima semana.' },
      ],
      sale: 'Una tabla propia de cuándo usar cada herramienta.',
    },
    {
      n: 4, nombre: 'Conectar herramientas', objetivo: 'Conectar la IA con herramientas que ya usamos.',
      agenda: [
        { min: '0–10', que: 'Qué es un conector y qué permite hacer.' },
        { min: '10–35', que: 'Conectar la IA a Excel o Drive y pedirle que lea y ordene un archivo de prueba.' },
        { min: '35–55', que: 'Cada miembro conecta la herramienta que necesita su idea de producto.' },
        { min: '55–60', que: 'Cada uno anota qué aprendió y qué hará la próxima semana.' },
      ],
      sale: 'La IA trabajando sobre un archivo real de prueba.',
    },
    {
      n: 5, nombre: 'Pedir bien para construir', objetivo: 'Construir una mini-herramienta pidiendo por pasos.',
      agenda: [
        { min: '0–10', que: 'Pedir por pasos, revisar y corregir: el método del club.' },
        { min: '10–50', que: 'Cada miembro o equipo construye una mini-herramienta para su idea.' },
        { min: '50–60', que: 'Prueba cruzada: otro miembro la usa y anota dudas.' },
      ],
      sale: 'Una mini-herramienta funcionando.',
    },
    {
      n: 6, nombre: 'Demo Day', objetivo: 'Mostrar productos que beneficien al colegio.',
      agenda: [
        { min: '0–5', que: 'Bienvenida a invitados: docentes y miembros de la coordinación.' },
        { min: '5–50', que: 'Cada miembro o equipo presenta en 4 minutos: para quién, qué hace y una demostración en vivo.' },
        { min: '50–60', que: 'Los invitados eligen qué productos siguen al piloto con un usuario del colegio.' },
      ],
      sale: 'Productos presentados y los primeros elegidos para un piloto.',
    },
  ] as ClubSession[],
  despues: [
    { k: 'Ciclos de 6 semanas', v: 'Después del primer Demo Day, el club trabaja en ciclos: una semana de ideas, cuatro de construcción y una de Demo Day.' },
    { k: 'El temario lo definen los miembros', v: 'Cada ciclo suma un tema que pidan los miembros, preparado por quien ya lo domina.' },
    { k: 'Roles', v: 'Presidente, coordinador de proyectos y encargado del Demo Day, elegidos por los miembros.' },
    { k: 'A futuro, como posibilidad', v: 'Charlistas invitados y una versión del club para profesores.' },
  ],
  camino: [
    { k: '1 · Ficha', v: 'El equipo escribe la ficha del producto: usuario, necesidad y qué hace.' },
    { k: '2 · Revisión', v: 'El profesor responsable revisa que no use datos personales y que respete las reglas del colegio.' },
    { k: '3 · Piloto', v: 'Un usuario del colegio lo usa dos semanas, con el equipo acompañando.' },
    { k: '4 · Presentación', v: 'El equipo presenta resultados a la coordinación, que decide si se adopta.' },
  ],
  reglas: [
    'Construimos productos propios; las tareas de las materias se hacen con las reglas de cada materia.',
    'Cada producto se presenta y se explica en vivo por quien lo hizo.',
    'En los prompts no van datos personales de nadie.',
    'Todo producto para el colegio pasa por la revisión del profesor responsable antes del piloto.',
    'Lo que aprendemos se comparte: cada miembro enseña algo al grupo durante el año.',
  ],
  demoRubrica: [
    { k: 'Sirve a alguien', v: 'Tiene un usuario real del colegio y una necesidad clara.' },
    { k: 'Funciona en vivo', v: 'La demostración corre sin trucos.' },
    { k: 'Se explica', v: 'El equipo explica cómo lo construyó y qué decidió.' },
    { k: 'Se puede usar mañana', v: 'Está listo para un piloto con su usuario.' },
  ],
}

export const IMPLEMENTACION = [
  { cuando: 'Semanas 1 y 2', que: 'Profesor responsable nombrado, herramienta apta elegida, horario y salón del club, aviso y consentimiento de acudientes.', quien: 'Coordinación y profesor responsable' },
  { cuando: 'Semanas 3 a 8', que: 'Las seis clases del club. Semana 8: primer Demo Day con invitados de la directiva.', quien: 'Builders Club' },
  { cuando: 'Semana 9', que: 'Informe corto del club a la directiva: productos, asistencia y elegidos para piloto.', quien: 'Builders Club' },
  { cuando: 'Antes del piloto del currículo', que: 'Talleres 1 y 2 de formación docente y guías de la unidad 1 de 8.º listas.', quien: 'Docente de Tecnología y club' },
  { cuando: 'Arranque a confirmar', que: 'Piloto del currículo con un grupo de 8.º durante un trimestre (unidad 1).', quien: 'Docente de Tecnología' },
  { cuando: 'Cierre del piloto', que: 'Informe con resultados de la rúbrica y propuesta de ampliación a todo 8.º y luego a 9.º y 10.º.', quien: 'Docente y coordinación' },
]

export const METRICAS = [
  { k: 'Builders Club', v: 'Demo Day con al menos 5 productos presentados, y 2 que pasan a piloto con un usuario del colegio.' },
  { k: 'Piloto en 8.º', v: 'El 80 % del grupo en Logrado o Destacado en el proyecto de la unidad 1, y cada pareja da su mini-clase.' },
  { k: 'Profesores', v: 'Los profesores del piloto formados antes de arrancar, y su valoración de la guía al cierre del trimestre.' },
  { k: 'Colegio', v: 'Productos del club en uso real por un departamento al cierre del año.' },
]

/** Acceso a la IA en dos niveles: arranca sin cuentas para alumnos. */
export const ACCESO = {
  idea: 'La propuesta arranca el primer día sin esperar cuentas para los alumnos: el profesor maneja la IA proyectada. Cuando el colegio apruebe una herramienta apta para la edad, cada alumno pasa a usar su propia cuenta del colegio.',
  niveles: [
    {
      nombre: 'Nivel 1 · Desde el primer día',
      items: ['El profesor maneja la IA proyectada, con su cuenta de adulto.', 'La IA le pregunta al grupo y cada alumno responde en su hoja.', 'Sirve igual para las primeras clases del club.'],
    },
    {
      nombre: 'Nivel 2 · Cuando el colegio lo apruebe',
      items: ['Cada alumno usa una herramienta educativa apta para su edad.', 'Cuentas del colegio, con supervisión del profesor.', 'Se elige en las dos semanas de preparación.'],
    },
  ],
}

/** Preguntas que la directiva probablemente hará, con su respuesta corta. */
export const PREGUNTAS = [
  { q: '¿La IA reemplaza al profesor?', a: 'No. El profesor decide, guía y evalúa. La IA es una herramienta de la clase, como Excel.' },
  { q: '¿Y si todavía no hay herramienta para los alumnos?', a: 'Se arranca en el nivel 1: el profesor maneja la IA proyectada y el grupo responde. No hay que esperar.' },
  { q: '¿Cuánto tiempo les pide a los profesores?', a: 'Tres talleres cortos y una guía lista por unidad. Ninguna hora de clase extra: vive dentro de Tecnología.' },
  { q: '¿Cómo sabemos que el aprendizaje es del alumno?', a: 'Porque lo explica y lo enseña: responde las preguntas de la IA, da mini-clases y presenta en vivo cada proyecto.' },
  { q: '¿Y las tareas de otras materias?', a: 'Cada materia mantiene sus reglas, igual que trabajos como AP Research. Aquí se aprende a usar la IA para entender y construir.' },
  { q: '¿Qué hace falta para empezar?', a: 'Un profesor responsable, un horario, un salón y la decisión de hoy.' },
]

/** Aprender enseñando: lo que distingue esta propuesta. Los alumnos no solo usan la IA; explican, enseñan y presentan. */
export const ENSENAR = {
  idea: 'La IA puede hacer un trabajo por un alumno, pero no puede pararse frente a la clase por él. Por eso, en esta propuesta todo lo que se aprende se enseña y todo lo que se hace se presenta.',
  mecanismos: [
    {
      nombre: 'La clase la dan ustedes',
      cuando: 'Semanas 9, 19 y 29 de cada año',
      como: 'Cada pareja prepara y da una mini-clase de 8 minutos a sus compañeros sobre un tema de la unidad. Deja 3 preguntas al final; si el grupo las responde bien, la clase funcionó.',
    },
    {
      nombre: 'Alumnos guía',
      cuando: 'Todo el año, rotando cada trimestre',
      como: 'En cada grupo, tres alumnos guía acompañan al profesor: preparan la sesión con él, ayudan en las mesas y abren la clase con un ejemplo. Al rotar cada trimestre, hasta nueve alumnos por grupo tienen el rol en el año.',
    },
    {
      nombre: 'Todo se presenta en vivo',
      cuando: 'Al cierre de cada unidad',
      como: 'Ningún proyecto se entrega sin presentarlo y responder tres preguntas del profesor o del grupo. Explicarlo frente a otros es la prueba de que es tuyo.',
    },
    {
      nombre: '10.º enseña a 8.º',
      cuando: 'Semana 29',
      como: 'Cada proyecto de 10.º visita un grupo de 8.º y enseña en 10 minutos una técnica que usó. Los de 8.º ven hacia dónde van; los de 10.º afianzan lo que saben.',
    },
    {
      nombre: 'El club apoya a los profesores',
      cuando: 'En la formación docente, si la coordinación lo aprueba',
      como: 'Miembros del Builders Club preparan ejemplos y acompañan los talleres de formación docente, siempre guiados por el profesor responsable.',
    },
    {
      nombre: 'Muestra IAE de fin de año',
      cuando: 'Cierre del año escolar',
      como: 'Los productos de 10.º y del club se muestran a familias, docentes y directiva. Cada equipo presenta su producto y cuenta cómo lo hizo.',
    },
  ],
  guias: [
    { k: 'Quién puede ser', v: 'Cualquier alumno del grupo. Cuenta más querer enseñar que las notas.' },
    { k: 'Cómo se elige', v: 'Postulación abierta, una mini-clase de prueba de 3 minutos y la recomendación del profesor.' },
    { k: 'Qué hace', v: 'Prepara la sesión con el profesor, abre la clase con un ejemplo y ayuda en las mesas. Rota cada trimestre.' },
    { k: 'Cómo se prepara', v: 'Recibe la guía de la unidad una semana antes; puede practicar en el club.' },
    { k: 'Reconocimiento', v: 'Constancia de alumno guía y mención en el acto de fin de año (a confirmar con la dirección).' },
  ],
  miniclaseRubrica: [
    { k: 'Claridad', v: 'Explica el tema en orden y con palabras que el grupo entiende.' },
    { k: 'Ejemplo propio', v: 'Usa un ejemplo hecho por ellos, no copiado del material.' },
    { k: 'Comprobación', v: 'El grupo responde bien al menos 2 de las 3 preguntas.' },
    { k: 'Tiempo', v: 'Cabe en 8 minutos.' },
  ],
  fichaPreguntas: ['¿Qué le pedí a la IA? (la instrucción exacta)', '¿Qué me respondió? (en una línea)', '¿Qué revisé y cómo? (en la hoja, con un dato, con un compañero)', '¿Qué cambié o decidí yo?'],
}

/** Banco de encargos: el colegio pide, los alumnos construyen. */
export const ENCARGOS = {
  idea: 'Los departamentos del colegio dejan pedidos reales en un banco de encargos. Los alumnos de 9.º y 10.º y el Builders Club eligen de ahí sus proyectos. El colegio recibe herramientas hechas por sus propios alumnos.',
  ejemplos: [
    { k: 'Biblioteca', v: 'Registro de préstamos y devoluciones con aviso de vencimiento.' },
    { k: 'Deportes', v: 'Tabla de posiciones de un torneo que se actualiza sola con cada resultado.' },
    { k: 'Eventos', v: 'Inscripciones a una actividad con cupos y lista de asistencia.' },
    { k: 'Laboratorios', v: 'Inventario de materiales con alerta cuando algo se está acabando.' },
    { k: 'Clubes', v: 'Control de miembros, asistencia y tareas de cada club.' },
  ],
  como: 'Cada encargo se deja en una ficha de una página: qué se necesita, quién lo usaría y cómo sabrían que sirve. Ningún encargo usa datos personales reales durante la construcción.',
}
