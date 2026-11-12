# Podología Clínica

Sitio de presentación y solicitud de horas construido con React. El servidor Express envía cada solicitud al correo administrativo usando una plantilla React Email y Resend.

Se requiere Node.js 20.19 o superior.

## Configuración del correo

1. Copia `.env.example` a `.env`.
2. En [Resend](https://resend.com), verifica el dominio que usarás como remitente y crea una API key.
3. Configura `RESEND_API_KEY` y `FROM_EMAIL` en `.env`. `ADMIN_EMAIL` ya apunta al correo administrativo indicado.
4. No publiques ni compartas el archivo `.env`.

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
