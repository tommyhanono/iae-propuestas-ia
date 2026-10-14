// Contenido roto a propósito para calibrar scripts/content-check-directiva.mjs: cada lámina trae un error que el chequeo debe marcar.
import { SLIDES as OK, SOURCES } from '../../src/directiva/content.ts'

export { SOURCES }

const base = { section: 'Apertura', tone: 'paper', time: '0:30', notes: 'Nota del orador suficientemente larga para pasar el mínimo de largo.' } as const

export const SLIDES = [
  ...OK,
  { ...base, id: 'roto-dinero', layout: 'statement', title: 'El club cuesta $500 al año', lead: 'Unos 20 dólares por alumno.', quote: 'x', attribution: 'x' },
  { ...base, id: 'roto-negativo', layout: 'statement', title: 'El riesgo de copiar', lead: 'Un problema de plagio.', quote: 'x', attribution: 'x' },
  { ...base, id: 'roto-persona', layout: 'statement', title: 'Charla con María González', lead: 'Escríbele a tommy@ejemplo.com o al 6123-4567.', quote: 'x', attribution: 'x' },
  { ...base, id: 'roto-frases', layout: 'statement', title: '¡Estimado director, vos podés!', lead: 'Quedo atento — saludos cordiales 🚀', quote: 'x', attribution: 'x' },
  { ...base, id: 'roto-fuente', layout: 'statement', title: 'El 80 % de los alumnos ya usa IA', lead: 'Según la UNESCO.', quote: 'x', attribution: 'x', sources: ['pew'] },
]
