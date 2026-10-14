# Launch check · /directiva/

Corrida contra `http://localhost:4173/directiva/` el 2026-10-14.

**PASS 29 · WARN 3 · FAIL 0 · N/A 10 · NO SE PUDO 2 · MANUAL 1**

| Punto | Qué | Resultado | Detalle |
|---|---|---|---|
| 1.1 | Cero scroll horizontal a 320, 375 y 414 px (21 láminas) | PASS |  |
| 1.2a | Links internos (0) y href vacíos | PASS |  |
| 1.2b | Links externos (7) | NO SE PUDO | www.pewresearch.org: ENOTFOUND / www.unesco.org: ENOTFOUND / www.nature.com: ENOTFOUND / www.oecd.org: ENOTFOUND / www.hm.ee: ENOTFOUND / s3-legispan.asamblea.gob.pa: ENOTFOUND |
| 1.7 | Links del pie sin href vacío, "#" ni javascript:void | PASS | el pie de cada lámina no tiene links; las fuentes sí, y todas son https |
| 1.3 | Índice: abre y cierra (botón y Escape) y navega | PASS | pasos ok,ok,ok,ok,ok; 21 entradas |
| 1.15 | Cero items de navegación que no llevan a nada (21 entradas del índice) | PASS |  |
| 1.4 | Favicon propio | PASS | /favicon.svg · 200 image/svg+xml |
| 1.5 | Título específico de 50 a 60 caracteres, marca al final | PASS | "Construir con IA, no copiar con IA · Directiva del IAE" (54) |
| 1.6 | Meta description de 120 a 155 caracteres | PASS | 146 caracteres |
| 1.8 | 404 propia con HTTP 404 y salida al home | NO SE PUDO | vite preview responde 200 en /no-existe y 200 en /directiva/no-existe; en Vercel, public/404.html se sirve con 404 real (se comprueba en el Preview) |
| 1.9 | Año de copyright calculado | N/A | la presentación no muestra copyright |
| 1.10 | Imágenes comprimidas | WARN | /brand/iae-logo-horizontal-blanco.png 108 KB image/png / /brand/iae-escudo-blanco.png 164 KB image/png · los logos oficiales del IAE se usan sin alterar (regla de marca); og-directiva.png solo la baja quien comparte el link |
| 1.11 | Cero botones sin handler (5 botones de control) | PASS |  |
| 1.12 | Estados de carga, éxito y error en acciones que escriben | N/A | la presentación no escribe nada: sin formularios ni backend |
| 1.13 | Errores con mensaje útil | N/A | no hay acciones que puedan fallar; sin JavaScript, <noscript> lo dice |
| 1.14 | Cero texto placeholder (DOM de 21 láminas y fuente) | PASS |  |
| 1.16 | Cero elementos fuera del viewport en móvil (375 px) | PASS |  |
| 1.20 | Móvil de verdad: viewport sin bloquear zoom, toques ≥ 44×44, sin inputs | PASS | viewport "width=device-width, initial-scale=1.0, viewport-fit=cover" · los links de fuente dentro de las láminas son texto en línea (excepción de WCAG 2.5.8) |
| 1.17 | Logo clickeable que vuelve al home | N/A | presentación lineal: se vuelve a la portada con Inicio o el índice (ver DECISIONES-DIRECTIVA.md) |
| 1.18 | Teléfono con tel: | N/A | no se publica teléfono (regla de Tommy) |
| 1.19 | Email con mailto: | N/A | no se publica correo (regla de Tommy) |
| 2.1 | Sin "Vite + React" en el tab | PASS | "Construir con IA, no copiar con IA · Directiva del IAE" |
| 2.2 | Sin source maps en producción | PASS | build.sourcemap=false; 0 .map, 0 referencias |
| 2.3 | Cero errores de consola (21 láminas) y sin console.log en el fuente | PASS |  |
| 2.4 | Bundles razonables (≤ 300 KB por archivo, ≤ 500 KB por página) | WARN | directiva-Hk59RqX2.js 49 KB, proxy-Btm_6s_E.js 340 KB, directiva-Cl3LhbHf.css 11 KB · total 400 KB · el archivo grande es el chunk compartido con / (React + Framer Motion), sin minificar en gzip pesa ~110 KB |
| 2.5 | Títulos únicos por página | PASS | / "IA en el IAE · Dos propuestas" · /directiva/ "Construir con IA, no copiar con IA · Directiva del IAE" |
| 2.6 | Un solo h1 por página | PASS | 1: Construir con IA, no copiar con IA · Propuestas para la directiva del IAE |
| 2.7 | Meta descriptions únicas | PASS |  |
| 2.8 | Canonical absoluto | PASS | https://iae-propuestas-ia.vercel.app/directiva/ |
| 2.9 | robots.txt, sitemap.xml y llms.txt válidos (content-type real) y /directiva/ fuera | PASS | /robots.txt text/plain · /sitemap.xml text/xml · /llms.txt text/plain · meta robots "noindex, nofollow" |
| 2.10 | Alt text en todas las imágenes | PASS |  |
| 2.11 | Links internos y breadcrumbs | N/A | una sola página, sin rutas profundas; la navegación interna es el índice y el hash #/n |
| 2.12 | JSON-LD válido | N/A | no se incluye: la página es noindex |
| 2.13 | LocalBusiness | N/A | no es un negocio local |
| 2.14 | Dominio propio | WARN | se sirve en vercel.app (esperado y documentado) |
| 2.15 | OG + Twitter con og:image real de 1200×630 PNG ≤ 1 MB | PASS | https://iae-propuestas-ia.vercel.app/og-directiva.png · PNG 1200×630 · 90 KB · twitter:card summary_large_image |
| 2.16 | lang="es" en <html> | PASS | es |
| 3.1 | Contraste AA medido (464 textos en 21 láminas y controles) | PASS |  |
| 3.2 | Foco de teclado visible (6 tabs reales) | PASS | Pew Research Center, → Índice de láminas (O) → Notas del orador (N) → Ayuda y atajos de teclado (?) → Anterior → Siguiente |
| 3.3 | prefers-reduced-motion presente | PASS |  |
| 3.4 | Campos con etiqueta real | N/A | no hay campos |
| 3.5 | Teléfono girado 812×375 sin romper (21 láminas) | PASS |  |
| 3.6 | Core Web Vitals locales (LCP ≤ 4 s, CLS ≤ 0.25) | PASS | LCP 496 ms · CLS 0.001 · medido contra vite preview en esta máquina; en producción con 4G será peor |
| 3.7 | Regla cero: las firmas medibles (terracota, verde ácido, violeta, emoji, blanco/negro planos, sombra única, tres tarjetas, fuente por inercia, radio 12 px) | PASS |  |
| 3.8 | Regla cero: titular intercambiable (firma 10) | MANUAL | juicio de diseño: ver M-08 en el reporte |
