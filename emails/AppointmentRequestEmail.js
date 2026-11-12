const React = require('react');
const e = React.createElement;

function AppointmentRequestEmail({ name, email, phone, service, date, time, notes }) {
  const formattedDate = new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00.000Z`));

  return e(
    'html',
    { lang: 'es' },
    e(
      'body',
      { style: { margin: 0, backgroundColor: '#f4f5f1', fontFamily: 'Arial, sans-serif', color: '#20302b' } },
      e(
        'div',
        { style: { maxWidth: '560px', margin: '32px auto', padding: '32px', backgroundColor: '#ffffff' } },
        e('p', { style: { margin: '0 0 8px', color: '#54735e', fontSize: '11px', fontWeight: 'bold', letterSpacing: '2px' } }, 'PODOLOGÍA CLÍNICA'),
        e('h1', { style: { margin: '0 0 24px', fontSize: '24px', fontWeight: '500' } }, 'Nueva solicitud de hora'),
        e('p', { style: { color: '#59645f', fontSize: '14px', lineHeight: '1.6' } }, 'Una persona solicita atención. Revisa los datos y responde para confirmar la disponibilidad.'),
        e(
          'table',
          { style: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' } },
          ...[
            ['Nombre', name],
            ['Correo', email],
            ['Teléfono', phone],
            ['Motivo', service],
            ['Fecha preferida', formattedDate],
            ['Hora preferida', time],
          ].map(([label, value]) => e(
            'tr',
            { key: label },
            e('td', { style: { padding: '12px 8px 12px 0', borderBottom: '1px solid #e4e9e4', color: '#758078', width: '38%' } }, label),
            e('td', { style: { padding: '12px 0', borderBottom: '1px solid #e4e9e4', color: '#20302b', fontWeight: '600' } }, value),
          )),
        ),
        notes && e(
          'div',
          { style: { marginTop: '22px', padding: '16px', backgroundColor: '#f4f6f2' } },
          e('p', { style: { margin: '0 0 8px', color: '#54735e', fontSize: '11px', fontWeight: 'bold' } }, 'MENSAJE'),
          e('p', { style: { margin: 0, color: '#59645f', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap' } }, notes),
        ),
        e('p', { style: { margin: '26px 0 0', color: '#758078', fontSize: '12px' } }, 'Responde directamente a este correo para contactar a la persona.'),
      ),
    ),
  );
}

module.exports = AppointmentRequestEmail;
