# Reporte final · presentación para la directiva

## Segunda vuelta (14-oct-2026): el currículo completo

**Agregué el currículo completo y concreto, más un documento para entregar:**

- **Documento `/directiva/curriculo/`:**
  - 90 sesiones (30 por año, semana por semana, con lo que hace el alumno en cada una).
  - La clase tipo de 45 minutos de cada año, un prompt de ejemplo por año y el entregable del año con su formato.
  - Una rúbrica de cuatro niveles por año, el portafolio y la ponderación de la nota.
  - Formación docente: tres talleres y una guía por unidad.
  - El Builders Club clase por clase, con agenda minuto a minuto, cómo se evalúa el Demo Day, qué pasa después, cómo un producto llega a usarse en el colegio y las reglas de uso.
  - Garantías, implementación con responsables, métricas y fuentes.
- **Presentación:**
  - Pasa de 14 a 16 láminas: una lámina por grado con sus tres unidades y su entregable. El tiempo objetivo queda en 14:30.
  - El apéndice suma las tres rúbricas, la formación docente y el camino de un producto.
  - Los controles tienen un botón "Currículo completo", y la lámina de cierre lleva la dirección del documento.
- **Supuestos que tienes que confirmar:**
  - Currículo: un período semanal de 45 minutos dentro de Tecnología; tres trimestres de 10 semanas; ponderación 20/30/50.
  - Club: sesiones de 60 minutos y cupo inicial de 20.
  - Detalle en `DECISIONES-DIRECTIVA.md`, puntos 15 a 21.
- **Resultados:**
  - `content-check` en PASS: ahora revisa también los 563 textos del currículo.
  - Pruebas de `/directiva/`: 26 de 26 pasan, incluidas las nuevas del documento (5 tamaños y los enlaces entre presentación y documento).
  - Launch-check: PASS 37 · WARN 2 · FAIL 0 · N/A 10 · NO SE PUDO 2 · MANUAL 1. "No se pudo": los links externos (red) y el 404 real.
  - El CSS de `/` sigue idéntico byte a byte.

Lo que sigue más abajo es el reporte de la primera vuelta. Donde dice 14 láminas, hoy son 16; los números de apéndice A3/A4 ahora son A8/A9.

---

**La presentación está construida, probada y en un PR en borrador: [tommyhanono/iae-propuestas-ia#1](https://github.com/tommyhanono/iae-propuestas-ia/pull/1), rama `directiva-2026`.** Son 14 láminas + 7 de apéndice en `/directiva/`. No mergeé ni desplegué a producción.

Tres cosas quedan abiertas, cada una con su razón más abajo:
1. Hay una alerta sobre los términos de Anthropic para menores que tienes que leer antes de presentar.
2. Cinco fuentes quedaron en nivel B (las leí desde el buscador, no abriendo el documento) porque la red de esta sesión bloquea esos sitios. Ábrelas tú.
3. No pude abrir el Preview de Vercel desde aquí. Vercel lo marca "Ready" y la URL está abajo.

## Qué construí

- `/directiva/` es una segunda entrada de Vite (`directiva/index.html` → `src/directiva/`). La presentación de `/` no se tocó: su CSS compilado sale **idéntico byte a byte** al de `main`, y su código fuente no cambió.
- **Contenido** en `src/directiva/content.ts`: titulares, cuerpo, notas del orador con tiempo meta (suman 13:30) y fuentes.
- **Motor:**
  - → · Espacio · AvPág avanzan (primero los beats); ← · RePág retroceden; Inicio y Fin; deslizar en el celular; tocar el tercio derecho o izquierdo en pantalla ancha.
  - Hash profundo `#/7` y `#/A3`.
  - Barra de progreso con el nombre de la sección.
  - Índice (O), notas (N), temporizador con meta de 15:00 (T), pantalla completa (F), apéndice (A) y ayuda (?).
  - Anuncio del cambio de lámina para lectores de pantalla.
  - Hoja de impresión: una lámina por página, 21 páginas, todos los beats visibles.
- **Diseño "Plano de obra":** navy + dorado escaso + papel con cuadrícula de plano, y un rótulo de plano en el pie de cada lámina. Fraunces + Space Grotesk, que son las fuentes de `/`. Los logos oficiales van sin alterar.
- **Tamaños de pantalla:**
  - En pantallas anchas, un lienzo de 1600×900 escalado: el titular queda en ≈ 48 pt y el cuerpo en ≈ 26 pt de lámina.
  - En celular, tablet vertical y teléfono girado, una columna con scroll y la lámina completa, sin beats.
- **Documentos:** `DECISIONES-DIRECTIVA.md` (cada decisión), `FUENTES-DIRECTIVA.md` (cada dato con su cita), `src/directiva/CLAUDE.md` (cómo se mantiene) y `LAUNCH-CHECK-DIRECTIVA.md` (la corrida del checklist).
- **Scripts nuevos:** `scripts/content-check-directiva.mjs`, `scripts/launch-check-directiva.mjs`, `scripts/shoot-directiva.mjs` y `scripts/make-og-directiva.mjs`. Pruebas en `tests/directiva.spec.ts`.
- **Archivos existentes que toqué:**
  - `vite.config.ts`: la segunda entrada y `sourcemap: false`.
  - `README.md`: solo la línea 🔗 de `/directiva/`.
  - Nada más.

## Resultados reales

| Qué | Resultado |
|---|---|
| `npm run build` | OK, sin warnings nuevos. El JS de `/` ahora se divide en `main` + un chunk compartido (`proxy-*.js`, 348 KB, 110 KB con gzip), porque Vite comparte React y Framer Motion entre las dos páginas. El código de `/` es el mismo. |
| `npm run lint` | 0 errores. Todos los avisos son del código de `/` que ya existía (`src/components/primitives.tsx` y `src/App.tsx`). Cero en `src/directiva/`. |
| `npm test` **antes** de cambiar nada (línea base) | **11 pasan, 19 fallan.** `main` ya traía esos fallos (tests de vuelo, centrado y nodos del tablero; probablemente por el último commit "Avanza el tablero"). No los toqué: no es parte de esta misión. |
| `npm test` **después** | **31 pasan, 19 fallan.** Comparé la lista: son exactamente los mismos 19 fallos de la línea base. Las 20 pruebas nuevas de `/directiva/` pasan. |
| `content-check` | PASS (21 láminas, 13:30, 4 láminas con beats). **Calibración:** contra `scripts/fixtures/content-roto.ts` da FAIL con 18 problemas (dinero, palabras negativas, nombre de persona, correo, teléfono, voseo, frases prohibidas, signos, dato sin fuente). |
| Pruebas nuevas, calibración | Metí a propósito un texto demasiado largo. A 1920 px la prueba falló por "choques"; a 320 px no lo detectó al principio (una palabra larga se salía sin mover la caja). Corregí el detector, volvió a fallar con el caso roto y pasó con el real. |
| `launch-check` | **PASS 29 · WARN 3 · FAIL 0 · N/A 10 · NO SE PUDO 2 · MANUAL 1.** Detalle en `LAUNCH-CHECK-DIRECTIVA.md`. **Calibración:** con `CALIBRAR=1` (texto dorado sobre papel, sombra de una capa, radio de 12 px, blanco plano), contraste y regla cero dan FAIL; con el contenido real, PASS. La primera corrida tuvo un FAIL falso: "todo" en español contaba como el marcador `TODO`. Lo corregí. |
| Capturas | Las 21 láminas y cada beat a 1920×1080, 1366×768 y 390×844 (65 capturas). Las miré y corregí: las láminas 8, 10, 11 y 12 y el apéndice A3 se montaban sobre el pie; la tarjeta SAT partía su rótulo; la portada pegaba el nombre a la barra; y en celular los beats dejaban huecos. |
| Impresión | PDF de 21 páginas generado y revisado. Se exporta desde el navegador con Imprimir. |

### Contraste medido (WCAG AA)

| Combinación | Ratio |
|---|---|
| Tinta `#1b2432` sobre papel `#f6f3ec` | 14.1:1 |
| Atenuado `#4a5466` sobre papel | 6.9:1 |
| Bronce `#7a5a14` sobre papel | 5.7:1 |
| Texto `#ebeef2` sobre navy `#10151f` | 15.7:1 |
| Atenuado `#a3adba` sobre navy | 8.0:1 |
| Dorado `#c8a24b` sobre navy | 7.6:1 |
| Dorado sobre papel | 2.2:1, **no se usa para texto** |

El launch-check midió 464 textos reales en las 21 láminas: todos pasan.

### Lo que dio WARN o NO SE PUDO, y por qué

- **1.2b Links externos: NO SE PUDO.** La red de la sesión no resuelve pewresearch.org, unesco.org, nature.com, oecd.org, hm.ee ni asamblea.gob.pa. El de anthropic.com respondió bien.
- **1.8 404 real: NO SE PUDO.** `vite preview` devuelve 200 en rutas inexistentes. En Vercel, `public/404.html` sale con 404, pero no pude abrir el Preview para confirmarlo.
- **1.10 Imágenes: WARN.** El logo horizontal (108 KB) y el escudo (164 KB) son PNG de más de 100 KB. Son los logos oficiales y la regla es no alterarlos.
- **2.4 Bundle: WARN.** El chunk compartido pesa 348 KB (110 KB con gzip). La página carga 400 KB en total, por debajo del límite de 500.
- **2.14 Dominio: WARN** esperado (`vercel.app`).

## Deploy

- **Preview de Vercel:** https://iae-propuestas-ia-git-directiva-2026-tommyhanonos-projects.vercel.app/directiva/ (estado "Deployment has completed" en el commit `89a0e50`).
- **No lo pude abrir desde la sesión:** `vercel.app` está bloqueado por la red (403 del proxy). Ábrelo tú y comprueba tres cosas:
  1. `/directiva/` carga.
  2. `/` sigue igual.
  3. `/no-existe` da la 404 propia.
- Localmente, `npm run build` genera `dist/index.html` (sin cambios) y `dist/directiva/index.html`, y ambas rutas cargan en `vite preview`.
- **Después de mergear el PR,** producción sirve `https://iae-propuestas-ia.vercel.app/directiva/`. Si el deploy automático no corre, publica así:

```bash
git checkout main && git pull
npm ci
npm run build
vercel --prod
```

## Alerta para Tommy

**Los estudiantes menores de 18 años no pueden tener cuentas personales de Claude**, según los términos que abrí y leí en esta sesión:

1. **Términos de consumo** (vigentes desde el 8-oct-2025): "You must be at least 18 years old or the minimum age required to consent to use the Services in your location, whichever is higher." https://www.anthropic.com/legal/consumer-terms
2. **Política de uso:** define menor como "any individual under the age of 18 years old, regardless of jurisdiction". Además, "Products serving minors, including organizations providing minors with the ability to directly interact with products that incorporate our API(s), must comply with the additional guidelines". https://www.anthropic.com/legal/aup (la página dice "Effective November 12, 2026", una fecha posterior a hoy; puede ser una versión anunciada).
3. **Guía para organizaciones que atienden a menores** (16-mar-2026): una organización puede integrar la API para menores con salvaguardas (verificación de edad, moderación, monitoreo, recursos educativos), cumpliendo las leyes de menores y datos y avisando que es una IA. No menciona Claude.ai ni Claude for Education. https://support.claude.com/en/articles/9307344-responsible-use-of-anthropic-s-models-guidelines-for-organizations-serving-minors
4. **Claude for Teachers** (14-jul-2026): gratis para docentes K-12 verificados **de EE. UU.**, "for educators only, consistent with Claude's 18-and-over policy". La configuración para colegios dice "for educators, not students" y solo admite colegios de EE. UU. Hoy el IAE no califica. https://www.anthropic.com/news/claude-for-teachers · https://support.claude.com/en/articles/16559896-set-up-claude-for-teachers-for-your-school-or-district
5. **Claude for Education** (2-abr-2025) es para universidades. https://www.anthropic.com/news/introducing-claude-for-education

**Qué significa para la propuesta:**
- **El pedido:** en `/directiva/` dice "respaldar el acceso supervisado de los estudiantes a herramientas de IA aptas para su edad". Es literalmente cierto y no promete un producto. El mecanismo concreto se elige en las semanas 1 y 2.
- **Las opciones de mecanismo:**
  - una plataforma educativa que integre la API con las salvaguardas de Anthropic;
  - la oferta educativa de otro proveedor que acepte menores (**no lo verifiqué**);
  - que el docente use la herramienta en clase con los alumnos.
- **El currículo de 8.º y el club:** la clase de 8.º ("la IA conectada a Excel vía MCP") y las sesiones del club dependen de ese mecanismo.
- **La presentación de `/`:** su nodo bc-3 todavía pide "una cuenta de Claude por estudiante". Con estos términos, ese pedido no se puede cumplir para menores de 18. No lo cambié porque la misión prohíbe tocar `/`. Te recomiendo cambiarlo antes de que alguien de la coordinación lo vuelva a abrir.
- **Ley 81 de 2019:** verifiqué los principios (lealtad, finalidad, proporcionalidad, seguridad, transparencia, confidencialidad, licitud) y el consentimiento "previo, inequívoco, informado, trazable" a través de ANTAI, en nivel B. **No encontré el pasaje sobre menores como agravante**, así que no está en pantalla. Nada de esto es asesoría legal.

## A confirmar por Tommy

Son decisiones mías que no estaban en la misión:

1. **Fases y calendario:**
   - Semanas 1 y 2: preparación (docente enlace + herramienta).
   - Semanas 3 a 8: club, con el Demo Day en la semana 8.
   - Semana 9: informe.
   - Piloto del currículo con **un grupo de 8.º**, con arranque "a confirmar".
2. **Metas verificables:**
   - Cada equipo presenta un producto en el Demo Day.
   - El grupo piloto lee y explica un Excel real.
   - La directiva decide con cada informe.
3. **"Gratis para el colegio en horas docentes: el docente enlace acompaña y el club dicta las sesiones."** Confirma que el club dicta las sesiones y que el docente enlace solo acompaña.
4. **Primer paso:** "en las próximas dos semanas, nombrar un docente enlace y fijar el horario de la primera clase".
5. **Demo Day con invitados de la directiva** (apéndice A6).
6. **Pregunta frecuente sobre AP Research** (A5): "Siguen sus reglas tal cual". Sácala si prefieres no abrir ese tema.
7. **Prompts de ejemplo del apéndice A2:** los escribí yo como ilustración.
8. **"Hecho por un alumno del IAE"** en la tarjeta SAT: asumí que el alumno es del IAE.
9. **Dato de apertura:** es de EE. UU. (Pew). No encontré un dato verificado de Panamá.

## Cumplimiento de las reglas de Tommy (Parte 2, punto por punto)

| Regla | Cumplida | Evidencia |
|---|---|---|
| 2.1 Contexto: fechas de arranque "a confirmar", nada político ni religioso decorativo | Sí | Lámina 12 y apéndice A6 dicen "a confirmar". El único símbolo es el escudo oficial del IAE, sin alterar. |
| 2.2.1 Ningún correo ni teléfono | Sí | `content-check` revisa correos y teléfonos; launch-check 1.18 y 1.19 en N/A. |
| 2.2.2 No se borra nada | Sí | `git diff --stat origin/main`: solo agregados, más 2 modificaciones permitidas (`vite.config.ts` y `README.md`). |
| 2.2.3 Ningún mensaje a nadie | Sí | Solo creé el PR (lo pide la misión). Sin correos, comentarios ni mensajes. |
| 2.2.4 Secretos y estática | Sí | No leí ni busqué credenciales. La página no tiene backend ni llamadas a servicios; solo carga Google Fonts, como `/`. |
| 2.2.5 AP Research | Sí | No hay ayuda para trabajo evaluado. En A5, AP Research "sigue sus reglas tal cual". |
| 2.2.6 Español de Panamá, sin voseo | Sí | `content-check` busca voseo: 0. Tuteo y "ustedes" en las notas. |
| 2.2.7 Diseño navy + dorado + papel, concepto nombrado, sin violeta SaaS | Sí | "Plano de obra" (`DECISIONES-DIRECTIVA.md`, escrito antes del CSS); launch-check 3.7 en PASS. |
| 2.2.8 Checklist de lanzamiento completa | Sí, con 2 "no se pudo" explicados | `LAUNCH-CHECK-DIRECTIVA.md` y los 8 manuales abajo. |
| 2.2.9 README con 🔗 | Sí | Línea de `/directiva/` en la sección 🔗 Deploy. |
| 2.3 Entregable completo o dicho | Sí | Sin `TODO` (launch-check 1.14 en PASS). Lo abierto está en este reporte. |
| 2.3 Alcance exacto | Sí | Sin refactors. No arreglé los 19 tests de `/` que ya fallaban: no eran parte del pedido. |
| 2.3 Verificar antes de afirmar | Sí, con niveles | `FUENTES-DIRECTIVA.md` distingue nivel A (abierto) y B (buscador sobre el dominio original). |
| 2.3 Código como el de alrededor | Sí | Mismo stack, comentarios en español, misma densidad. |
| Lección 1: mirar el resultado | Sí | 65 capturas miradas; 6 problemas encontrados y corregidos. |
| Lección 3: calibrar los detectores | Sí | `content-check`, las pruebas de choques y el launch-check fallaron con casos rotos a propósito. |
| Lección 4: buscar antes de escribir una utilidad | Sí | Reutilicé `watchErrors` de `tests/helpers.ts` y el patrón de `scripts/shoot.mjs` y `make-og.mjs`. |
| Lección 5: honestidad | Sí | La línea base de tests, el Preview no verificado y las fuentes de nivel B están dichos tal cual. |
| Lección 6: trampas web | Sí | (a) robots, sitemap y llms se validan por content-type; (b) espero `networkidle` y las fuentes; (c) no hay `overflow-x: hidden` como parche; (d) el contraste promedia los degradados. |
| 2.4 Copy: frases cortas, sin `¡`, `!!`, "—", emojis ni frases prohibidas | Sí | `content-check` en PASS. Titulares como conclusiones. |
| 2.5 Regla cero (10 firmas) | Sí | 9 medidas en PASS (3.7); la décima es juicio (M-08 abajo). |
| 2.5 Piso de calidad: 320 px, toques de 44, foco visible, AA, reduced-motion | Sí | Pruebas en 8 tamaños; launch-check 1.1, 1.20, 3.1, 3.2 y 3.3. |
| 2.5 Presentaciones: una idea por lámina, ≤ 3 viñetas, tipografía grande, cierre sin "Gracias" | Sí | Cuerpo ≥ 34 unidades (≈ 20 pt); prueba "no dice Gracias". |
| 2.5 Kinéret: beats, mirar y no suponer, reduced-motion | Sí | 4 láminas con 3 beats; capturas de cada beat; prueba de reduced-motion. |
| 2.6 Propuesta: problema → solución → costo → paso | Sí | Láminas 2, 3–9, 13 (tiempo, enlace, horario, acceso; sin montos) y 14 (un paso chico con fecha relativa). |
| 2.7 Fuentes con URL, fecha y cita; sin nombres de modelos en pantalla | Sí | `FUENTES-DIRECTIVA.md`. En pantalla solo aparece "Anthropic" (proveedor) en A3, sin modelo ni versión. |
| 2.9 Ley 81 solo para garantías positivas | Sí | Láminas 11 y A4, sin multas ni sanciones, y "no es una opinión legal". |

## Los 8 manuales

- **M-01 Ejecutar cada acción y mirar el feedback.** Lo hice en local: cada botón y cada tecla (launch-check 1.11 y las pruebas). **Falta:** repetirlo en el Preview.
- **M-02 Provocar el error.** Probé hashes inválidos (abren la portada) y rutas inexistentes en local. **Falta:** la 404 real en Vercel.
- **M-03 El teléfono en la mano.** Lo probé en emulación (390×844, 375×812, 320×640, 812×375, con toques). **Falta:** abrir el link en tu teléfono real y deslizar.
- **M-04 Rich Results Test.** N/A: no hay JSON-LD.
- **M-05 Negocio local.** N/A.
- **M-06 www/no-www con 301.** N/A en `vercel.app`.
- **M-07 La tarjeta al compartir por WhatsApp.** La imagen OG es un PNG de 1200×630 que miré. **Falta:** pegar el link de producción en WhatsApp después del merge. Antes del merge la imagen todavía no existe en producción.
- **M-08 Juicio de diseño.** Lo miré en las 65 capturas:
  - Sin crema + serif + terracota: el acento es navy y bronce, y hay una cuadrícula de plano.
  - Sin fondo negro con un solo acento ácido.
  - Sin tres tarjetas en fila: la escalera de la lámina 4 tiene alturas distintas y el resto son filas apiladas.
  - Los titulares solo los podría decir esta propuesta ("El currículo pone el piso. El club quita el techo.").
  - **Falta:** tu ojo.

## Pasos manuales pendientes

1. **Probar en el proyector real.** Margen seguro del 6 %, legibilidad del pie y que la cuadrícula no se vea como ruido. Si el proyector recorta, F (pantalla completa) ayuda.
2. Abrir el Preview (URL arriba) y comprobar `/directiva/`, `/` y `/no-existe`.
3. Abrir los 5 enlaces de nivel B de `FUENTES-DIRECTIVA.md` y confirmar las citas.
4. Leer la "Alerta para Tommy" y decidir si se cambia el nodo bc-3 de `/`.
5. M-03 y M-07 con tu teléfono.
6. Revisar la lista "A confirmar por Tommy" y mergear el PR.

## Cómo correr todo de nuevo

```bash
npm ci
node scripts/content-check-directiva.mjs
npm run build && npx vite preview --port 4173      # en otra terminal
node scripts/launch-check-directiva.mjs http://localhost:4173 LAUNCH-CHECK-DIRECTIVA.md
npx playwright test tests/directiva.spec.ts
npm test                                           # suite completa (los 19 fallos de / ya venían de main)
```

En esta nube el Chromium de Playwright 1.62 no estaba descargado. Corrí todo con `PW_CHROMIUM=/opt/pw-browsers/chromium` en los scripts y con una config local (sin commitear) que pasa ese `executablePath` a las pruebas. En tu máquina, con `npx playwright install chromium`, corre tal cual.
