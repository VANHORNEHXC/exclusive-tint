# Exclusive Tint

Sitio web y portal interno construidos con Next.js 16.

## Inicio local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configura las variables de `.env.local` antes de usar las integraciones. La página pública está en `/` y el portal interno en `/admin`.

## Base de datos y portal

`DATABASE_URL` o `DATABASE_URL_POOLED` conecta PostgreSQL. Ejecuta `npm run db:migrate` para crear las tablas de órdenes y reseñas. La migración no agrega clientes ni reseñas ficticias.

Una versión anterior de la migración insertó dos órdenes ficticias (`ET-1001`, `ET-1002`) y tres reseñas de muestra en algunas bases existentes. El portal oculta las dos órdenes solo cuando coinciden sus nombres y teléfonos de ejemplo; revisa esos registros en la base antes de eliminarlos. La web pública consulta reseñas aprobadas y filtra las tres muestras conocidas.

El portal requiere `ADMIN_USERNAME` y `ADMIN_PASSWORD` (mínimo 16 caracteres), y debe servirse sobre HTTPS. Muestra órdenes reales y guarda los cambios de estado en PostgreSQL. Si faltan estas variables, devuelve 503; sin credenciales válidas, devuelve 401. El portal no incluye todavía gestión de reseñas, leads ni carga de fotos.

## WhatsApp

Los enlaces de cotización usan el número proporcionado por el negocio (`+1 323 815 6876`). Puedes cambiarlo mediante `NEXT_PUBLIC_WHATSAPP_NUMBER`, con código de país y solo dígitos.

El webhook `/api/webhook/whatsapp` necesita `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` y `WHATSAPP_GRAPH_API_VERSION`. Valida la firma de Meta y responde a mensajes de texto fuera del horario de 09:00 a 19:00, hora de Panamá. No guarda leads en la base de datos ni calcula cotizaciones automáticas.

## Comprobaciones

```bash
npm run lint
npx tsc --noEmit
npm run build
```
