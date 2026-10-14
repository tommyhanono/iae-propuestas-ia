# Decisiones · presentación para la directiva (`/directiva/`)

Registro de cada decisión tomada sin poder preguntar. Lo que necesita tu visto bueno está en `REPORTE-FINAL.md`, sección "A confirmar por Tommy".

## Frase de diseño (escrita antes de la primera línea de CSS)

Kit 1 + Kit 2 (editorial navy + dorado + papel) con el concepto **"Plano de obra"**: cada lámina es una hoja de un plano (cuadrícula de líneas finas, cotas, rótulo de plano en el pie) porque lo que se propone es un taller donde se construye. Evito a propósito: crema + serif display + terracota (el acento es dorado escaso y el texto va en tinta navy), las tres tarjetas redondeadas en fila (todo va en filas apiladas, tablas chicas o diagramas), el blanco y negro planos (todo neutro va teñido de navy), la sombra única, el radio de 12 px por inercia (aquí el radio es 2 px), los emojis como íconos y el 3D.

## Esqueleto de la presentación

14 láminas + 7 de apéndice, lineales, en `src/directiva/content.ts`.

| # | Titular (conclusión) | Tiempo |
|---|---|---|
| 1 | Construir con IA, no copiar con IA | 0:30 |
| 2 | Los estudiantes ya usan IA para estudiar. El IAE puede darle dirección | 0:45 |
| 3 | El currículo pone el piso. El club quita el techo | 0:45 |
| 4 | En tres años, cada alumno pasa de leer a pedir a crear | 1:00 |
| 5 | Cada año cierra con un entregable que se puede revisar | 1:15 |
| 6 | Al terminar 10.º, cada alumno sale con un portafolio propio | 0:30 |
| 7 | En el Builders Club, la IA es la herramienta y lo que importa es el producto | 0:45 |
| 8 | En seis clases, cada miembro llega al Demo Day con un producto | 1:15 |
| 9 | La meta son productos que el colegio use de verdad | 0:45 |
| 10 | La evidencia coincide: la IA enseña cuando está pensada para enseñar | 1:15 |
| 11 | Así cuidamos la integridad, la supervisión y los datos | 1:15 |
| 12 | Cada fase deja algo que se puede ver | 1:15 |
| 13 | El colegio pone el marco; el club pone el trabajo | 1:00 |
| 14 | Hoy les pido tres decisiones y un primer paso | 1:15 |

Suma: 13:30. Margen de 1:30 para preguntas dentro de los 15 minutos.

Apéndice (tecla A o índice): A1 las seis clases en detalle · A2 ejemplos de prompts por año · A3 acceso supervisado y términos del proveedor · A4 datos personales y Ley 81 · A5 preguntas frecuentes · A6 cronograma detallado · A7 fuentes.

## Decisiones

1. **Rama.** Trabajo en `directiva-2026`, como pide la misión. La sesión cloud traía asignada otra rama (`claude/friendly-pascal-9k23er`); la instrucción expresa de Tommy manda. Si el push a `directiva-2026` falla por permisos, se usa la rama asignada y se dice en el reporte.
2. **Motor propio y sin 3D.** La presentación es lineal (no reutiliza el tablero de `/`). Reutilizo el stack (React, Framer Motion, Tailwind solo para el reset), las fuentes (Fraunces + Space Grotesk) y los colores de `src/index.css`. No se agregan dependencias.
3. **Lienzo de 1600×900 escalado** en pantallas anchas (≥ 900 px de ancho, ≥ 560 de alto y apaisadas): así la lámina se ve igual en el proyector y en la laptop. Tamaños en unidades del lienzo: titular 64, cuerpo 32, nota al pie 22. A 1366×768 el cuerpo queda en 27 px (≈ 20 pt) y a 1920×1080 en 38 px (≈ 29 pt).
4. **Modo flujo en celular y tablet vertical:** por debajo de ese umbral, la lámina se reacomoda en una columna con scroll interno; cuerpo de 18 px, titular de 28 a 34 px. Nada por debajo de 16 px.
5. **Beats:** máximo 3 por lámina y solo en 4 láminas (3, 5, 8 y 12). → revela el siguiente beat antes de pasar de lámina. Con `prefers-reduced-motion` los beats aparecen sin animación. En impresión se ven todos.
6. **Hash profundo `#/7`** (número de lámina, base 1) y `#/A3` para el apéndice. Un hash inválido abre la lámina 1.
7. **Texto del lema.** "No copiar con IA" es el lema y se permite (lista blanca en `content-check`). En el resto del texto se evitan las palabras de la lista negativa.
8. **`noindex`.** `/directiva/` lleva `<meta name="robots" content="noindex, nofollow">` y queda fuera de `sitemap.xml` y `llms.txt` (no se tocan). Es material para una reunión, no para buscadores. `canonical` sigue siendo absoluto.
9. **Logos.** Se usan los tres de `public/brand/` tal cual (sin recolorear, recortar ni deformar), con `width`/`height` proporcionales. El horizontal blanco en portada y cierre; el escudo blanco como sello en los separadores navy; el de color con sello IB en el pie de las láminas de papel, a 150 px de ancho de lienzo. El favicon sigue siendo el propio del repo.
10. **Dorado sobre papel.** El dorado `#C8A24B` no pasa AA como texto sobre papel; sobre papel el texto de acento va en bronce oscuro (`--bronze`) y el dorado claro queda solo para líneas y bloques grandes decorativos. Ratios medidos en `REPORTE-FINAL.md`.
11. **Fuentes externas.** Igual que `/`, las fuentes salen de Google Fonts con `display=swap`. Si no cargan, caen a Georgia y Helvetica sin romper el diseño.
12. **Datos externos solo con fuente.** La red de esta sesión bloquea la mayoría de los sitios (nature.com, oecd.org, pewresearch.org, unesco.org, hm.ee). Las páginas de Anthropic sí se pudieron abrir. Para el resto, el texto se leyó a través del buscador limitado al dominio del publicador original. El nivel de verificación de cada dato está escrito en `FUENTES-DIRECTIVA.md`, y lo que no se pudo abrir directamente queda para que Tommy abra el enlace antes de presentar.
13. **"Thomas Hanono" en pantalla.** Solo en portada, lámina 7 y cierre (el nombre lo pide la misión). Sin grado, sin contacto, sin proyectos personales.
14. **Pruebas.** Las nuevas pruebas viven en `tests/directiva.spec.ts` y corren con el `npm test` existente. En esta nube el Chromium de Playwright 1.62 no está descargado; corrí todo con el Chromium preinstalado vía `PW_CHROMIUM=/opt/pw-browsers/chromium` (los scripts nuevos lo leen; el `playwright.config.ts` existente no se tocó).

## Choques entre la Parte 2 (reglas generales) y la Parte 3 (esta presentación)

Gana la Parte 3. Quedan anotados:

- **Indexación vs. `noindex`.** La checklist de lanzamiento (§2.8) asume un sitio indexable (sitemap, robots, títulos para buscadores). La Parte 4 pide `noindex` y fuera del sitemap. Se aplica `noindex`; los puntos de sitemap/robots/llms se reportan como N/A con esa razón.
- **"Nada por debajo de 20 pt" vs. 320 px.** En celular, el cuerpo queda en 18 px (≈ 13.5 pt) y las notas al pie en 16 px: es el mínimo del piso de calidad para móvil (≥ 16 px). En proyector se cumple ≥ 20 pt.
- **Logo clickeable al home (§2.8, punto 17).** En una presentación lineal el logo no es un enlace; volver al inicio es `Inicio` o el índice. Se reporta N/A.
- **Nombre de Tommy.** La Parte 3 pide "nada personal" pero también que la portada y el cierre lleven su nombre. Se usa solo el nombre y "candidato a presidente del Builders Club".
- **Fondo de papel + serif display (regla cero, firma 1).** La Parte 3 pide papel tintado y Fraunces. Se evita la firma completa: no hay terracota, el acento es navy + bronce, y el papel lleva una cuadrícula de plano que le da identidad.
- **Cuenta de Claude por estudiante.** La presentación `/` pide "una cuenta de Claude por estudiante". Los términos vigentes de Anthropic piden 18 años para cuentas personales. `/` no se toca (regla de la misión). En `/directiva/` el pedido se formula como "acceso supervisado a herramientas de IA aptas para su edad". Ver "Alerta para Tommy".

## Segunda vuelta: currículo completo (14-oct-2026)

Tommy pidió más detalle concreto: "un currículum completado", no un resumen. Decisiones:

15. **Documento aparte para el detalle.** Una lámina no puede cargar 90 sesiones sin romper la legibilidad en el proyector, así que el detalle vive en `/directiva/curriculo/` (tercera entrada de Vite). Es un documento para leer, imprimir y entregar. La presentación lo enlaza desde los controles ("Currículo completo") y desde la lámina de cierre.
16. **Una lámina por grado.** La tabla general de los tres años se reemplazó por tres láminas (8.º, 9.º y 10.º), cada una con sus tres unidades y su entregable. La presentación pasa de 14 a 16 láminas; el tiempo objetivo suma 14:30.
17. **Apéndice ampliado:** rúbricas de 8.º, 9.º y 10.º (nivel Logrado de cada criterio), formación docente y el camino de un producto del club hasta el colegio. Las rúbricas del apéndice usan una letra de 30 unidades (≈ 18 pt): es material de consulta, no se proyecta en la exposición.
18. **Supuestos del currículo, todos marcados "a confirmar":** un período semanal de 45 minutos dentro de Tecnología o Informática; tres trimestres de 10 semanas; ponderación de 20 % bitácoras, 30 % prácticas y 50 % entregable; tres talleres de formación docente.
19. **Supuestos del club:** sesiones de 60 minutos; cupo inicial de 20 miembros; ciclos de seis semanas después del primer Demo Day; roles elegidos por los miembros.
20. **Herramienta neutral.** El currículo habla de "la herramienta de IA que apruebe el colegio" y no nombra un producto, por los requisitos de edad de los proveedores (ver la alerta en `REPORTE-FINAL.md`).
21. **Comillas tipográficas** (“ ”) en todo el texto: las comillas rectas se veían como ” ” con Space Grotesk.
