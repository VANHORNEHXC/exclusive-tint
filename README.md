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

Configura `DATABASE_URL` (o `DATABASE_URL_POOLED`) y ejecuta `npm run db:migrate`. La migración crea las tablas de órdenes, contenido, eventos, usuarios, sesiones y configuración del bot sin agregar datos ficticios. Algunas bases antiguas contienen órdenes de ejemplo ET-1001/ET-1002; el portal las oculta solo si coinciden con sus nombres y teléfonos originales.

Abre `/admin` y entra con `ADMIN_USERNAME` y `ADMIN_PASSWORD` de `.env.local`. En el primer acceso se crea una cuenta en PostgreSQL; luego puedes cambiar usuario y contraseña en **Credentials**. El portal usa una cookie HTTP-only y debe servirse por HTTPS en producción. Conserva `ADMIN_ENCRYPTION_KEY` (32 bytes codificados en base64) de forma estable: se usa para cifrar las credenciales de Meta guardadas en el portal. Si cambias la clave, tendrás que volver a introducir esas credenciales.

Las cinco pestañas son:

- **Orders:** consultar, buscar, crear y editar órdenes.
- **Analytics:** visitas y clics de WhatsApp durante 30 días, además de órdenes y valor entregado. Los eventos son anónimos.
- **Web Editor:** publicar textos en español e inglés y reemplazar las fotos de ejemplo de los espacios del sitio. Requiere el bucket S3 configurado en `.env.local` para las imágenes propias. Las fuentes y licencias de las fotos de ejemplo están en [IMAGE_CREDITS.md](IMAGE_CREDITS.md).
- **Credentials:** cambiar el acceso del portal y guardar los cinco valores de Meta cifrados. Las variables `WHATSAPP_*` del servidor siguen siendo alternativas si no se guardan valores aquí.
- **Bot Settings:** activar el bot, definir horario, zona horaria y respuesta. Usa `{name}` para insertar el nombre del contacto.

## WhatsApp

Los enlaces de cotización usan `NEXT_PUBLIC_WHATSAPP_NUMBER` (por defecto, el número proporcionado: `+1 323 815 6876`). La URL de verificación y mensajes de Meta es `/api/webhook/whatsapp`. Configura los cinco valores de Meta en **Credentials** o en las variables `WHATSAPP_*`, y activa el bot en **Bot Settings**. El webhook valida la firma de Meta y responde a mensajes de texto recibidos durante el horario configurado. No crea órdenes ni calcula cotizaciones automáticamente.

## Comprobaciones

```bash
npm run lint
npx tsc --noEmit
npm run build
```
