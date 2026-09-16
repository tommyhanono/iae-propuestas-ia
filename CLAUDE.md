# CLAUDE.md — iae-propuestas-ia

Presentación web 3D (tablero espacial) con dos propuestas para la coordinación académica del IAE:
**Builders Club** y **Currículo 8–10**. Deploy: https://iae-propuestas-ia.vercel.app

## Diseño

Antes de escribir UI, leer `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Claude/90_Sistema/TOMMY-DESIGN.md`.
Variante **`tokens-glass`**, concepto "Observatorio": lobby neutro, Builders Club en dorado, Currículo en cian.
Prohibido el look default de IA. Piso: 375 px, toques de 44 px, foco visible, contraste AA, `prefers-reduced-motion`.

## Reglas de contenido (no negociables)

- Nunca nombres de charlistas ni de personas externas. Charlistas = "posibilidad a futuro".
- El proyecto SAT es una **tarjeta bloqueada**: se ve que existe y su impacto, nunca el cómo. El esqueleto borroso es decorativo, sin texto real.
- Español de Panamá, de "tú".

## Lanzamiento

Sitio público: antes de publicar pasa `90_Sistema/TOMMY-WEB-LAUNCH.md` con
`~/.claude/scripts/web-launch-audit/run.sh . --out /tmp/launch.md`, y `npm test` (Playwright) en verde.
