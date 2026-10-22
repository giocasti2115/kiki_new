# kikilatam.com — Next.js + WordPress headless (prueba de concepto)

Sitio público 100% estático en Next.js. WordPress queda **privado**, solo como editor del blog:
se consulta durante el build y nunca desde el sitio publicado. Sin PHP del lado público.

## Qué incluye

| Ruta | Origen del contenido |
| --- | --- |
| `/` y `/en/` | Home: `home-es.html` importado de WordPress; `home-en.html` generado con `scripts/translate-home.mjs` (textos oficiales del docx de Marketing + `content/i18n/home-en.json`) |
| `/<solución>/` y `/en/<solución>/` (14) | `content/soluciones.json` → `components/soluciones/` |
| `/<servicio>/` y `/en/<servicio>/` (14) | `content/servicios.json` → `components/servicios/` |
| `/blog/` y `/blog/<entrada>/` | API REST pública del WordPress de producción (`WP_API_URL`), leída en el build; imágenes servidas desde kikilatam.com salvo `BLOG_LOCAL_MEDIA=1` |

Header (mega menús ES/EN), formulario y pantalla de carga son parciales importados de WordPress;
el footer es un componente React. Estilos y scripts son los mismos del tema (`public/assets/`),
cargados en el mismo orden que `inc/enqueue.php`, para que el diseño sea idéntico.

## Traer cambios del tema de WordPress

```bash
php scripts/export_json.php <ruta-del-tema> content   # Soluciones y Servicios -> JSON
node scripts/import-wp.mjs http://localhost/wordpress   # header, home, formulario -> parciales
node scripts/translate-home.mjs --report                # home-en.html; --report lista textos sin traducir
```
Si cambian estilos, imágenes o scripts del tema, copiar `assets/` del tema a `public/assets/`
(conservando `public/assets/js/popup.js`, que ya no lleva el token del CRM).

## Páginas activas y enlaces sin clic

Solo Home, Soluciones, Servicios y Blog tienen enlace. Cualquier enlace de los parciales
(header, home, formulario, footer) a otra ruta se muestra sin clic y atenuado
(`isActiveHref` en `lib/pages.js` + `components/Partial.jsx`). Para activar una
página nueva: crearla y agregar su ruta en `lib/pages.js`.

## Despliegue en Vercel (sitio de revisión)

- Framework: Next.js (detección automática). Build: `npm run build`. Sin variables obligatorias.
- No necesita WordPress: header, home, formulario y footer están en `content/partials/`.
- El sitio sale con `noindex` (fuera de Google). En producción: `SITE_ENV=production`.
- Sin `NEXT_PUBLIC_CRM_URL` el formulario solo simula el envío (no crea leads).

## Uso

```bash
npm install
cp .env.example .env.local   # WP_API_URL apunta al WordPress (local o privado)
npm run dev                  # desarrollo en http://localhost:3000
npm run build                # genera /out (y antes copia las imágenes del blog a public/media)
npm run preview              # sirve /out en http://127.0.0.1:3001
```

`npm run build` necesita WordPress encendido; el sitio generado en `/out` no.

## Cómo publica Marketing

1. Escribe o edita la entrada en WordPress (privado) y la publica.
2. Un webhook de WordPress dispara un nuevo build en el hosting (Vercel/Netlify/Cloudflare Pages).
3. En 1–2 minutos el CDN sirve el HTML nuevo.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `WP_API_URL` | API REST del WordPress privado (solo build) |
| `NEXT_PUBLIC_CRM_URL`, `NEXT_PUBLIC_CRM_TOKEN` | Envío del formulario al CRM. Sin ellas, o en localhost, el formulario solo simula el envío. Pendiente: mover el envío a una función del servidor para no exponer el token. |

## Pendiente para la migración completa

- Páginas aún inexistentes también en WordPress: Cobertura, Casos, Recursos.
- Redirecciones 301 de `/<slug>-en/` (URLs actuales) a `/en/<slug>/`.
- Vista previa de borradores del blog (Draft Mode de Next.js).
- Webhook de publicación y despliegue en el hosting elegido.
