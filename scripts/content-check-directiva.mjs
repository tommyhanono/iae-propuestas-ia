// Revisa el contenido de la presentación para la directiva antes de publicarla.
// Uso: node scripts/content-check-directiva.mjs [ruta/al/content.ts]
// Sale con código 1 si encuentra algo prohibido. Calibración: node scripts/content-check-directiva.mjs scripts/fixtures/content-roto.ts (tiene que fallar).
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const file = resolve(process.argv[2] ?? 'src/directiva/content.ts')
const { SLIDES, SOURCES } = await import(pathToFileURL(file).href)
const raw = readFileSync(file, 'utf8')

// Lema permitido: se quita antes de buscar palabras negativas.
const WHITELIST = [/no copiar con IA/gi]
// §3.2.1: nada negativo en pantalla ni en las notas.
const NEGATIVE = ['riesgo', 'riesgos', 'problema', 'problemas', 'peligro', 'peligros', 'peligroso', 'miedo', 'miedos', 'preocupación', 'preocupaciones', 'preocupa', 'prohibido', 'prohibida', 'prohibir', 'plagio', 'plagiar', 'falla', 'fallas', 'fallar', 'fracaso', 'amenaza']
// §2.4: frases y signos prohibidos.
const PHRASES = ['espero que estés bien', 'espero que estén bien', 'quedo atento', 'quedo atenta', 'no dudes', 'no duden', 'saludos cordiales', 'cordialmente', 'estimado', 'estimada', 'estimados', 'chévere']
const SIGNS = [{ re: /!!/, what: '"!!"' }, { re: /¡/, what: '"¡"' }, { re: /—/, what: 'guion largo "—"' }, { re: /\p{Extended_Pictographic}/u, what: 'emoji' }]
// §3.2.4: sin cifras de dinero.
const MONEY = /\$|US\$|B\/\.|\bUSD\b|\bdólar(es)?\b|\bbalboas?\b|\bprecio(s)?\b|\bpresupuesto\b|\bmensualidad\b/i
// §3.2.9: sin correos ni teléfonos.
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/
const PHONE = /(\+?507[\s-]?)?\b\d{3,4}[\s-]\d{4}\b/
// Voseo (§2.2.6).
const VOSEO = /\b(vos|sos|tenés|podés|querés|sabés|mirá|hacé|vení|decime|acordate|pedí|fijate|contame|dale)\b/i
// §3.2.2 y §3.2.3: personas. Única persona permitida: el presentador.
const PEOPLE_OK = ['Thomas Hanono']
// Pares de palabras con mayúscula que no son personas.
const CAPS_OK = ['Nivel Logrado', 'Builders Club', 'Demo Day', 'Pew Research', 'Research Center', 'Scientific Reports', 'Digital Education', 'Education Outlook', 'Exploring Effective', 'Effective Uses', 'Generative AI', 'AI Leap', 'Leap Programme', 'Programme to', 'AI Tools', 'All Schools', 'How Teens', 'Teens Use', 'View AI', 'Asamblea Nacional', 'Ejecutivo 285', 'Decreto Ejecutivo', 'Consumer Terms', 'Terms of', 'AP Research', 'Proyecto SAT', 'Lo que', 'En reserva', 'Hecho por', 'Ministerio de', 'Una sesión', 'Un docente', 'Un horario', 'Un informe', 'Un producto', 'Un Excel', 'Un grupo', 'La IA', 'La OCDE', 'La misma', 'La meta', 'La forma', 'Las reglas', 'Las seis', 'Las fechas', 'Los acudientes', 'Los ejemplos', 'El plan', 'El currículo', 'El club', 'El colegio', 'Ya hay', 'Cada miembro', 'Cada alumno', 'Cada año', 'Cada quien', 'Sus notas', 'Una mini']
const STOP = /^(En|El|La|Los|Las|Un|Una|Y|Cada|Si|Lo|Ya|Sus|Su|Tres|Dos|Hoy|Así|Para|Por|Con|De|Del|Al|Es|No|Qué|Quién|Cómo|Cuándo|Fase|Semana|Semanas|Aprobar|Respaldar|Nombrar|Obsidian|Excel|Drive|Word|PowerPoint|Anthropic|UNESCO|OCDE|Harvard|Estonia|Panamá|IAE|SAT|IA|MCP|Ley|Términos|Consentimiento|Seguridad|Finalidad|Integridad|Supervisión|Datos|Preparación|Ampliación|Piloto|Builders|Club|Currículo|Demo|Day|Fundamentos|Segundo|Modelos|Conectar|Prompting|Hazme|Construye|Quiero|Porque|Siguen|Primer|Presenta|Propuestas|Dos|Lo|Le|Les|Sé|Empiezo|Cierro|Este|Esta|Esto|Son|Tres|Fíjense|Todas|Thomas)$/

// Datos externos: si un texto visible cita una institución o trae un porcentaje o cifra grande, la lámina tiene que declarar la fuente.
const DATA_MARKERS = [
  { re: /\d+\s*%|\b\d{1,3}\.\d{3}\b|\b\d{3,}\s+estudiantes\b/, what: 'cifra' },
  { re: /\b(UNESCO|OCDE|Harvard|Estonia|Pew|Ley 81|Anthropic|Scientific Reports)\b/, what: 'institución citada' },
]
const MARKER_SOURCE = { UNESCO: 'unesco', OCDE: 'oecd', Harvard: 'kestin', Estonia: 'estonia', Pew: 'pew', 'Ley 81': 'ley81', Anthropic: 'anthropic', 'Scientific Reports': 'kestin' }

const problems = []
const add = (where, msg) => problems.push(`${where}: ${msg}`)

function texts(slide) {
  // Todo string del slide, menos campos técnicos.
  const out = []
  const walk = (v, key) => {
    if (typeof v === 'string') { if (!['id', 'layout', 'tone', 'section', 'time', 'source'].includes(key)) out.push({ key, text: v }) }
    else if (Array.isArray(v)) v.forEach((x) => walk(x, key))
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (k !== 'sources' && k !== 'beats') walk(x, k)
  }
  walk(slide, '')
  return out
}

function lineOf(needle) {
  const i = raw.indexOf(needle)
  return i < 0 ? '?' : raw.slice(0, i).split('\n').length
}

for (const [i, slide] of SLIDES.entries()) {
  const where = `lámina ${slide.section === 'Apéndice' ? slide.id : i + 1} (${slide.id})`
  const all = texts(slide)
  for (const { key, text } of all) {
    const at = `${where} · ${key || 'texto'} · ${file.split('/').slice(-2).join('/')}:${lineOf(text.slice(0, 30))}`
    let clean = text
    for (const w of WHITELIST) clean = clean.replace(w, '')
    const lower = clean.toLowerCase()
    for (const w of NEGATIVE) if (new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, 'iu').test(lower)) add(at, `palabra negativa "${w}"`)
    for (const p of PHRASES) if (lower.includes(p)) add(at, `frase prohibida "${p}"`)
    for (const s of SIGNS) if (s.re.test(text)) add(at, `signo prohibido ${s.what}`)
    if (MONEY.test(text)) add(at, `cifra de dinero "${text.match(MONEY)[0]}"`)
    if (EMAIL.test(text)) add(at, `correo "${text.match(EMAIL)[0]}"`)
    if (PHONE.test(text)) add(at, `teléfono "${text.match(PHONE)[0]}"`)
    if (VOSEO.test(text)) add(at, `voseo "${text.match(VOSEO)[0]}"`)
    // Nombres de persona: dos palabras seguidas con mayúscula inicial que no son una frase conocida.
    for (const m of text.matchAll(/\b(\p{Lu}[\p{Ll}áéíóúñ]+)\s+(\p{Lu}[\p{Ll}áéíóúñ]+)\b/gu)) {
      const pair = `${m[1]} ${m[2]}`
      if (PEOPLE_OK.includes(pair) || CAPS_OK.includes(pair) || STOP.test(m[1]) || STOP.test(m[2])) continue
      add(at, `posible nombre de persona "${pair}"`)
    }
    if (key !== 'notes') {
      for (const d of DATA_MARKERS) {
        if (slide.ownFigures && d.what === 'cifra') continue
        const m = text.match(d.re)
        if (!m) continue
        const needed = MARKER_SOURCE[m[0]]
        const declared = slide.sources ?? []
        if (slide.layout === 'evidence') continue // cada ítem trae su propia fuente; se valida abajo
        if (declared.length === 0) add(at, `${d.what} "${m[0]}" sin fuente declarada`)
        else if (needed && !declared.includes(needed)) add(at, `${d.what} "${m[0]}" sin la fuente "${needed}"`)
      }
    }
  }
  if (slide.layout === 'evidence') for (const it of slide.items) if (!SOURCES[it.source]) add(where, `dato "${it.claim}" con fuente inexistente "${it.source}"`)
  for (const s of slide.sources ?? []) if (!SOURCES[s]) add(where, `fuente inexistente "${s}"`)
  if (!slide.notes || slide.notes.length < 40) add(where, 'sin notas del orador')
  if (slide.section !== 'Apéndice' && !/^\d+:\d{2}$/.test(slide.time)) add(where, `tiempo objetivo inválido "${slide.time}"`)
}

for (const s of Object.values(SOURCES)) if (!/^https:\/\//.test(s.url)) add(`fuente ${s.id}`, 'sin URL https')

// El currículo completo (curriculo.ts) se revisa con las mismas reglas de texto, sin la regla de fuentes.
const curFile = resolve(file, '..', 'curriculo.ts')
let curriculoTexts = 0
try {
  const cur = await import(pathToFileURL(curFile).href)
  const curRaw = readFileSync(curFile, 'utf8')
  const strings = []
  const walk = (v, path) => { if (typeof v === 'string') strings.push({ path, text: v }); else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`) }
  for (const [k, v] of Object.entries(cur)) walk(v, k)
  curriculoTexts = strings.length
  for (const { path, text } of strings) {
    const n = curRaw.slice(0, Math.max(0, curRaw.indexOf(text.slice(0, 30)))).split('\n').length
    const at = `curriculo.ts:${n} · ${path}`
    const lower = text.toLowerCase()
    for (const w of NEGATIVE) if (new RegExp(`(^|[^\\p{L}])${w}([^\\p{L}]|$)`, 'iu').test(lower)) add(at, `palabra negativa "${w}"`)
    for (const p of PHRASES) if (lower.includes(p)) add(at, `frase prohibida "${p}"`)
    for (const sg of SIGNS) if (sg.re.test(text)) add(at, `signo prohibido ${sg.what}`)
    if (MONEY.test(text)) add(at, `cifra de dinero "${text.match(MONEY)[0]}"`)
    if (EMAIL.test(text)) add(at, `correo "${text.match(EMAIL)[0]}"`)
    if (PHONE.test(text)) add(at, `teléfono "${text.match(PHONE)[0]}"`)
    if (VOSEO.test(text)) add(at, `voseo "${text.match(VOSEO)[0]}"`)
  }
} catch (e) { if (e.code !== 'ERR_MODULE_NOT_FOUND') throw e }

const main = SLIDES.filter((s) => s.section !== 'Apéndice')
const total = main.reduce((a, s) => { const [m, sec] = s.time.split(':').map(Number); return a + m * 60 + sec }, 0)
const beatSlides = SLIDES.filter((s) => (s.beats?.length ?? (s.layout === 'floorCeiling' ? 3 : 1)) > 1)

console.log(`content-check · ${file}`)
console.log(`  ${SLIDES.length} láminas (${main.length} principales), ${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')} de tiempo objetivo, ${beatSlides.length} láminas con beats, ${curriculoTexts} textos del currículo completo`)
if (main.length < 14 || main.length > 16) add('estructura', `se esperaban entre 14 y 16 láminas principales y hay ${main.length}`)
if (total > 15 * 60) add('estructura', `el tiempo objetivo suma más de 15:00`)
if (beatSlides.length > 4) add('estructura', `hay beats en ${beatSlides.length} láminas (máximo 4)`)
for (const s of SLIDES) if ((s.beats?.length ?? 1) > 3) add(s.id, 'más de 3 beats')

if (problems.length) {
  console.log(`  FAIL · ${problems.length} problema(s):`)
  for (const p of problems) console.log(`   - ${p}`)
  process.exit(1)
}
console.log('  PASS · sin dinero, sin palabras negativas, sin nombres externos, sin contacto, sin frases prohibidas y con fuente en cada dato')
