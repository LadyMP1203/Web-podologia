# Podología Clínica

Sitio de presentación y solicitud de horas construido con React. El servidor Express envía cada solicitud al correo administrativo usando una plantilla React Email y Resend.

Se requiere Node.js 20.19 o superior.

## Configuración del correo

1. Copia `.env.example` a `.env`.
2. En [Resend](https://resend.com), verifica el dominio que usarás como remitente y crea una API key.
3. Configura `RESEND_API_KEY` y `FROM_EMAIL` en `.env`. `ADMIN_EMAIL` ya apunta al correo administrativo indicado.
4. si tienes problemas creando un dns puedes usar los default que entrega la pagina "FROM_EMAIL="<onboarding@resend.dev>"
ADMIN_EMAIL=delivered@resend.dev"

Sin una API key y un remitente verificado, el formulario mostrará que el servicio no está disponible; no simulará un envío correcto.

## Desarrollo

En una terminal inicia la API:

```sh
npm run server
```

En otra inicia React:

```sh
npm start
```

El servidor React reenvía `/api` al servidor local en el puerto 5000.

## Producción

Construye el frontend con `npm run build` y ejecuta `npm run server` en un entorno con Node.js. El servidor entrega la carpeta `build` y procesa las solicitudes de agenda.

Las fechas anteriores al día actual en la zona horaria de Chile se rechazan tanto en el formulario como en el servidor. Las solicitudes recibidas requieren confirmación manual del equipo; el formulario no bloquea horarios ni confirma automáticamente una cita.

## GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` construye el frontend y lo publica automáticamente al hacer push a `main`. En GitHub, abre **Settings → Pages** y selecciona **GitHub Actions** como fuente de despliegue. La URL del proyecto será `https://ladymp1203.github.io/Web-podologia/`.

GitHub Pages solo aloja archivos estáticos. La página se publicará, pero el formulario de agenda necesita que la API Express se aloje por separado para poder enviar solicitudes.
