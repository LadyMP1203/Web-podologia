const path = require('path');
require('dotenv').config();
const express = require('express');
const React = require('react');
const { Resend } = require('resend');
const { render } = require('@react-email/render');
const AppointmentRequestEmail = require('./emails/AppointmentRequestEmail');

const app = express();
const port = Number(process.env.PORT) || 5000;
const adminEmail = process.env.ADMIN_EMAIL || 'pedritolarva123@gmail.com';
const validServices = new Set([
  'Evaluación podológica',
  'Tratamiento de uñas encarnadas',
  'Tratamiento de durezas y callosidades',
  'Cuidado del pie diabético',
]);
const validTimes = new Set(['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00']);
const rateLimitWindowMs = 10 * 60 * 1000;
const requestsByIp = new Map();

app.use(express.json({ limit: '10kb' }));

function getTodayInChile() {
  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const parts = Object.fromEntries(dateParts.map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function getValidationError(appointment) {
  const { name, email, phone, service, date, time, notes = '' } = appointment;
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    return 'Ingresa un nombre válido.';
  }
  if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Ingresa un correo electrónico válido.';
  }
  if (typeof phone !== 'string' || phone.length > 20 || !/^\+?[0-9\s().-]+$/.test(phone) || phone.replace(/\D/g, '').length < 8 || phone.replace(/\D/g, '').length > 15) {
    return 'Ingresa un número de teléfono válido.';
  }
  if (typeof service !== 'string' || !validServices.has(service)) {
    return 'Selecciona un motivo de consulta válido.';
  }
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return 'Selecciona una fecha válida.';
  }
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
    return 'Selecciona una fecha válida.';
  }
  if (date < getTodayInChile()) {
    return 'No es posible solicitar una hora en una fecha pasada.';
  }
  if (typeof time !== 'string' || !validTimes.has(time)) {
    return 'Selecciona una hora disponible.';
  }
  if (typeof notes !== 'string' || notes.length > 1000) {
    return 'El mensaje no puede superar los 1000 caracteres.';
  }
  return '';
}

function isRateLimited(ip) {
  const now = Date.now();
  const requestTimes = (requestsByIp.get(ip) || []).filter((time) => now - time < rateLimitWindowMs);
  if (requestTimes.length >= 5) {
    requestsByIp.set(ip, requestTimes);
    return true;
  }
  requestTimes.push(now);
  requestsByIp.set(ip, requestTimes);
  return false;
}

app.post('/api/appointments', async (req, res) => {
  if (isRateLimited(req.ip)) {
    return res.status(429).json({ error: 'Se recibieron varias solicitudes. Espera unos minutos e intenta nuevamente.' });
  }

  const appointment = req.body;
  if (!appointment || typeof appointment !== 'object' || Array.isArray(appointment)) {
    return res.status(400).json({ error: 'La solicitud no tiene un formato válido.' });
  }

  const validationError = getValidationError(appointment);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const senderEmail = process.env.FROM_EMAIL;
  if (!apiKey || !senderEmail) {
    console.error('Appointment email is not configured. Set RESEND_API_KEY and FROM_EMAIL.');
    return res.status(503).json({ error: 'El servicio de agenda no está disponible por el momento. Intenta más tarde.' });
  }

  try {
    const emailHtml = await render(
      React.createElement(AppointmentRequestEmail, {
        name: appointment.name.trim(),
        email: appointment.email.trim(),
        phone: appointment.phone.trim(),
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        notes: (appointment.notes || '').trim(),
      }),
    );
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: senderEmail,
      to: [adminEmail],
      replyTo: appointment.email.trim(),
      subject: `Solicitud de hora - ${appointment.name.trim()}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend could not deliver appointment request:', error);
      return res.status(502).json({ error: 'No pudimos enviar tu solicitud. Intenta nuevamente más tarde.' });
    }

    return res.status(200).json({ message: 'Solicitud enviada correctamente.' });
  } catch (error) {
    console.error('Appointment email delivery failed:', error);
    return res.status(502).json({ error: 'No pudimos enviar tu solicitud. Intenta nuevamente más tarde.' });
  }
});

const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'No se encontró el recurso solicitado.' });
  }
  return res.sendFile(path.join(buildPath, 'index.html'), (error) => {
    if (error) next();
  });
});

app.listen(port, () => {
  console.log(`Podología Clínica server listening on port ${port}`);
});
