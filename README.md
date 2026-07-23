# Utebo en Fiestas · Fase 2

Aplicación web progresiva, accesible y sin descarga obligatoria para consultar las Fiestas de Santa Ana 2026 de Utebo.

## Qué incluye

- Programa con 80 actividades transcritas del folleto aportado, incluyendo la indicación explícita cuando el horario no aparece publicado.
- Vistas **Ahora**, **Hoy**, **En familia** y **Esta noche**.
- Filtros por día, público y categoría.
- Favoritos y exportación de **Mi plan** al calendario (`.ics`).
- Ficha de actividad con ruta, compartir y lectura por voz.
- Mapa interactivo con OpenStreetMap y búsqueda de lugares bajo demanda.
- Modo de texto grande, alto contraste y reducción de movimiento.
- Código QR dinámico para compartir la web.
- Avisos destacados y cambios en tiempo real cuando se conecta Supabase.
- Panel de gestión para actividades, cancelaciones y avisos.
- Analítica mínima y anónima de uso.
- PWA instalable y funcionamiento parcial sin conexión.
- Despliegue automático mediante GitHub Pages.

## Abrir la demo local

Por seguridad del navegador, es mejor servir la carpeta mediante un servidor local:

```bash
python -m http.server 8080
```

Después abre `http://localhost:8080`.

La aplicación funciona sin base de datos utilizando `data/events.js` y `data/announcements.js`. El panel `admin.html` entra automáticamente en **modo demostración local**; sus cambios solo afectan al navegador donde se realizan.

## Publicación rápida en GitHub Pages

1. Sube todo el contenido del proyecto a la rama `main`.
2. En GitHub abre **Settings → Pages**.
3. En **Build and deployment**, selecciona **GitHub Actions**.
4. El flujo `.github/workflows/deploy-pages.yml` publicará la aplicación.
5. La URL prevista es `https://pascuense.github.io/utebo-en-fiestas/`.

## Activar el panel real y los avisos en tiempo real

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase-schema.sql` en el SQL Editor.
3. En Supabase Authentication crea únicamente las cuentas administradoras.
4. Copia la **Project URL** y la **anon public key** en `config.js`.
5. Entra en `admin.html`, inicia sesión y pulsa **Cargar programa base**.

La clave `anon` es pública por diseño. La protección se realiza con las políticas RLS incluidas en el SQL. No uses ni publiques nunca la clave `service_role`.

## Seguridad y validación antes de publicar

- Verificar cada actividad, hora, ubicación y precio con el Ayuntamiento.
- Confirmar qué avisos se consideran oficiales y quién puede publicarlos.
- Mantener únicamente cuentas administradoras autorizadas en Supabase Auth.
- Revisar accesibilidad con teclado, lector de pantalla y contraste.
- Añadir una página municipal de privacidad antes de recoger estadísticas en producción.
- No presentar esta demo como canal oficial hasta obtener autorización expresa.

## Autoría

Prototipo y arquitectura de producto: **ACNB IA**.
