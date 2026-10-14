# CLAUDE.md · /directiva/

Presentación **lineal** de 14 láminas + 7 de apéndice para la directiva del IAE. Vive en `/directiva/` (segunda entrada de Vite: `directiva/index.html`). No comparte código con el tablero de `/`; solo las fuentes, la paleta y `public/brand/`.

## Archivos

- `content.ts`: todo el texto (titulares, cuerpo, notas del orador, tiempos, fuentes). Es el único archivo que se toca para cambiar contenido.
- `Slides.tsx`: un diseño por `layout` (`cover`, `stat`, `floorCeiling`, `steps`, `table`, `portfolio`, `statement`, `timeline`, `locked`, `evidence`, `pledges`, `twoCols`, `ask`, `list`, `sources`).
- `App.tsx`: el motor (teclado, toques, hash, beats, índice, notas, temporizador, apéndice, impresión).
- `directiva.css`: concepto "Plano de obra". Los contrastes medidos están en el comentario de arriba.

## Reglas

- Las reglas de contenido de `CLAUDE.md` (raíz) y las de la misión aplican: nada negativo en pantalla, sin dinero, sin nombres externos, sin contacto, SAT bloqueado, español de Panamá con "tú" o "ustedes".
- Todo dato externo lleva `sources` y una entrada en `FUENTES-DIRECTIVA.md`.
- Beats: máximo 3 por lámina y en máximo 4 láminas. En celular (modo flujo) la lámina se ve completa.
- Lienzo de 1600×900: titular 80, cuerpo 44, secundario 36, mínimo 34, pie 26 (unidades del lienzo).
- No escribir el nombre de la curva de salida de CSS ("ease" + guion + "out") en `src/` ni en este archivo: Tailwind lo toma como clase y cambia el CSS de `/`. Usar `cubic-bezier(0, 0, 0.2, 1)`.

## Comandos

```bash
node scripts/content-check-directiva.mjs                              # contenido: tiene que dar PASS
node scripts/content-check-directiva.mjs scripts/fixtures/content-roto.ts  # calibración: tiene que dar FAIL
npm run build && npx vite preview --port 4173                          # en otra terminal
node scripts/shoot-directiva.mjs                                       # capturas de cada lámina y beat → tests/screenshots/directiva
node scripts/launch-check-directiva.mjs http://localhost:4173 launch.md  # checklist de lanzamiento
CALIBRAR=1 node scripts/launch-check-directiva.mjs                     # calibración: 3.1 y 3.7 tienen que dar FAIL
npx playwright test tests/directiva.spec.ts
node scripts/make-og-directiva.mjs                                     # regenera public/og-directiva.png
```

Si el Chromium de Playwright no está descargado (pasa en la nube), los scripts aceptan `PW_CHROMIUM=/ruta/a/chrome`.
