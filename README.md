# IA en el IAE · Dos propuestas

Presentación web interactiva para la **coordinación académica del Instituto Alberto Einstein**. No es un deck con scroll: es un **tablero espacial** con una cámara que vuela entre nodos. Adentro hay dos propuestas:

1. **Builders Club** (9no a 11vo) — un club donde se construyen productos reales con IA para el colegio. Presenta Thomas Hanono, candidato a presidente.
2. **Currículo 8–10** — tres años para pasar de leer la estructura, a pedir bien, a crear libre.

## 🔗 Deploy

**https://iae-propuestas-ia.vercel.app**

- Repo: https://github.com/tommyhanono/iae-propuestas-ia
- Se despliega por CLI desde esta carpeta: `vercel --prod`.
- `vercel.json` fija `framework: vite` y el rewrite SPA, así que refrescar con cualquier `#hash` abre ese nodo.

## Cómo se navega

Son **tres capas**:

1. **Lobby** — dos portales flotando. Aprietas uno y la cámara vuela adentro de esa propuesta (empuje hacia el portal, velo del color del mundo, vista de la constelación, aterrizaje en el primer nodo).
2. **Cada propuesta** es una constelación de nodos. Entre vecinos, la transición cambia cada vez: pan, zoom-through, diagonal con leve rotación, vista de la constelación, rebote con overshoot, deslizamiento con blur, zoom fuerte. En el último nodo, **Volver al lobby** te regresa volando para entrar a la otra.
3. **Mapa** (tecla `O`) — zoom out total: las dos constelaciones conectadas al lobby central. Clic en cualquier nodo para entrar.

| Tecla | Acción |
|---|---|
| → · Espacio · ↓ | Avanzar. En el lobby entra a la propuesta que falta ver; al final de una propuesta, vuelve al lobby |
| ← · ↑ | Retroceder (desde el primer nodo, al lobby) |
| L · Inicio | Volver al lobby |
| O | Mapa de las dos propuestas |
| Esc | Salir del mapa o de la ayuda |
| N | Notas del orador (guion corto por nodo) |
| F | Pantalla completa |
| ? | Ayuda |
| Swipe | En el celular, desliza a los lados para avanzar o retroceder |

Abajo hay **puntos de navegación** agrupados por propuesta. El nodo actual queda en la URL (`#lobby`, `#bc-3`, `#cu-2`).

## Reglas de contenido

- **Sin nombres** de charlistas ni de personas externas. Los charlistas solo aparecen como posibilidad a futuro.
- El **proyecto SAT** es una tarjeta bloqueada (candado + blur): se ve que existe y su impacto, nunca el cómo. El esqueleto borroso es decorativo y no contiene texto real en el DOM.
- Cada nodo se entiende solo (titular + 3–4 puntos visibles). El guion para narrar vive en las notas (`N`).

## Cómo está hecho

- **Stack:** Vite + React + TypeScript, Tailwind v4, Framer Motion. Sin backend. Diagramas en SVG animado.
- **Diseño:** `tokens-glass` de TOMMY-DESIGN, concepto **Observatorio**. Base casi-negra teñida de navy (`#10151F`), lobby neutro en papel/plata, **Builders Club en dorado** (`#C8A24B`) y **Currículo en cian** (`#6FB8E8`). Fraunces para títulos, Space Grotesk para el cuerpo. Glows suaves que cambian de color según el mundo en el que estás.
- **Contenido:** `src/data.ts` (titulares, notas del orador y posición de cada nodo en el tablero) y `src/views/` (un diseño distinto por nodo).
- **Cámara** (`src/Board.tsx`): foco `(fx, fy)`, escala `s` y rotación; `translate(centro) rotate(r) scale(s) translate(-fx, -fy)`. Al llegar, la escala siempre es el *fit* del nodo, así que queda centrado y completo. Si aprietas otra tecla a mitad de vuelo, la cámara se redirige desde donde está.
- **Nada amontonado** (`src/lib/geometry.ts`): `assertNoOverlap()` exige separación mínima entre nodos; corre en dev.
- **Móvil** (≤768 px de ancho o ≤500 px de alto): un nodo a la vez, swipe, una columna y mapa como hoja inferior.
- **`prefers-reduced-motion`:** vuelos por cross-fade, glows y portales quietos, números finales sin conteo.

## Scripts

```bash
npm install
npm run dev          # desarrollo
npm run build        # compila a dist/
npm test             # Playwright: 14 nodos × 9 viewports + interacción, reduced-motion y móvil
node scripts/shoot.mjs   # screenshots de cada nodo (con `npx vite preview --port 4173` corriendo)
```
