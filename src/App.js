import { useState } from 'react';
import './App.css';

const services = [
  'Evaluación podológica',
  'Tratamiento de uñas encarnadas',
  'Tratamiento de durezas y callosidades',
  'Cuidado del pie diabético',
];

const appointmentTimes = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'];

function getPublicAssetPath(path) {
  const publicUrl = process.env.PUBLIC_URL || '';
  return `${publicUrl.replace(/\/$/, '')}/${path}`;
}

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function App() {
  const [cookieConsent, setCookieConsent] = useState(() => {
    const savedConsent = window.localStorage.getItem('podologia-cookie-consent');
    return savedConsent === 'accepted' || savedConsent === 'rejected' ? savedConsent : '';
  });
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const today = getLocalDateString();

  function chooseCookieConsent(consent) {
    window.localStorage.setItem('podologia-cookie-consent', consent);
    setCookieConsent(consent);
  }

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setStatus({ type: '', message: '' });
  }

  async function submitAppointment(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'No pudimos enviar tu solicitud. Intenta nuevamente.');
      }

      setStatus({
        type: 'success',
        message: '¡Solicitud enviada! El equipo revisará la disponibilidad y te contactará para confirmar tu hora.',
      });
      setForm({ name: '', email: '', phone: '', service: '', date: '', time: '', notes: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'No pudimos enviar tu solicitud. Intenta nuevamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Podología, volver al inicio">
          <img className="brand-logo" src={getPublicAssetPath('logohead.png')} alt="Logo de Podología Clínica" aria-hidden="true" />
          <span className="brand-name">podología<span>clínica</span></span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#servicios">Servicios</a>
          <a href="#experiencia">Sobre mí</a>
          <a href="#casos">Casos frecuentes</a>
        </nav>
        <a className="header-cta" href="#agenda">Agendar una hora <span aria-hidden="true">↗</span></a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-content">
            <p className="eyebrow"><span className="eyebrow-dot" /> CUIDADO PODOLÓGICO PERSONALIZADO</p>
            <h1>Bienestar que<br />empieza <em>por tus pies.</em></h1>
            <p className="hero-copy">
              Atención profesional y cercana para que vuelvas a caminar con comodidad y confianza.
            </p>
            <div className="hero-actions">
              <a className="button button-dark" href="#agenda">Reserva tu evaluación <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="#servicios">Conoce los servicios <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-note">
              <span className="note-icon" aria-hidden="true">✳</span>
              <span>Dedicacion total a tu salud podal.</span>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-image"
              src={getPublicAssetPath('img_1.jpg')}
              alt="fotografia podologa atendiendo a paciente en consulta"
            />
            <div className="image-caption">
              <span className="caption-line" />
              <span>Atención con dedicación, en cada paso.</span>
            </div>
            <div className="floating-stamp" aria-label="Cuidado experto y personalizado">
              <span>cuidado</span>
              <strong>experto</strong>
              <span>y cercano</span>
            </div>
          </div>
          <span className="hero-index" aria-hidden="true">01 / 04</span>
        </section>

        <section className="trust-strip" aria-label="Nuestro enfoque">
          <div><span className="strip-number">01</span><span>Evaluación<br />personalizada</span></div>
          <div><span className="strip-number">02</span><span>Higiene y cuidado<br />en cada atención</span></div>
          <div><span className="strip-number">03</span><span>Orientación para<br />el cuidado en casa</span></div>
          <a href="#agenda">Da el primer paso <span aria-hidden="true">↗</span></a>
        </section>

        <section className="services-section section-wrap" id="servicios">
          <div className="section-heading">
            <p className="eyebrow">CUIDADO PARA CADA NECESIDAD</p>
            <h2>Atención pensada<br />para <em>ti.</em></h2>
          </div>
          <div className="service-grid">
            <article className="service-card">
              <span className="service-number">01</span>
              <span className="service-symbol" aria-hidden="true">◌</span>
              <h3>Evaluación podológica</h3>
              <p>Reviso la salud de tus pies y conversamos sobre tus necesidades antes de recomendar un cuidado.</p>
              <a href="#agenda" aria-label="Agendar evaluación podológica">↗</a>
            </article>
            <article className="service-card">
              <span className="service-number">02</span>
              <span className="service-symbol" aria-hidden="true">⌁</span>
              <h3>Uñas encarnadas</h3>
              <p>Orientación y tratamiento cuidadoso para aliviar molestias asociadas a uñas encarnadas.</p>
              <a href="#agenda" aria-label="Agendar tratamiento de uñas encarnadas">↗</a>
            </article>
            <article className="service-card">
              <span className="service-number">03</span>
              <span className="service-symbol" aria-hidden="true">✳</span>
              <h3>Durezas y callosidades</h3>
              <p>Cuidado podológico para las zonas de presión y recomendaciones para prevenir su reaparición.</p>
              <a href="#agenda" aria-label="Agendar tratamiento de durezas y callosidades">↗</a>
            </article>
            <article className="service-card">
              <span className="service-number">04</span>
              <span className="service-symbol" aria-hidden="true">⌂</span>
              <h3>Cuidado del pie diabético</h3>
              <p>Hábitos sencillos y seguimiento para mantener tus pies saludables en el día a día.</p>
              <a href="#agenda" aria-label="Agendar cuidado del pie diabético">↗</a>
            </article>
          </div>
        </section>

        <section className="about-section" id="experiencia">
          <div className="about-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=85"
              alt="Profesional de salud preparando una atención en consulta"
              loading="lazy"
            />
            <span className="image-tag">ATENCIÓN CON CALMA</span>
          </div>
          <div className="about-content">
            <p className="eyebrow">CERCANÍA EN CADA CONSULTA</p>
            <h2>Tu salud merece<br />una atención <em>sin apuro.</em></h2>
            <p>
              Cada persona y cada pisada son diferentes. Por eso, la atención comienza escuchándote
              y realizando una evaluación para entender qué necesitas.
            </p>
            <p>
              Mi compromiso es ofrecerte un espacio acogedor, un trato respetuoso y orientación
              clara para que participes activamente en el cuidado de tus pies.
            </p>
            <a className="button button-outline" href="#agenda">Conversemos sobre tu caso <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="cases-section section-wrap" id="casos">
          <div className="cases-heading">
            <div>
              <p className="eyebrow">¿EN QUÉ TE PUEDO AYUDAR?</p>
              <h2>Motivos frecuentes<br />de <em>consulta.</em></h2>
            </div>
            <p>Estos son algunos motivos habituales. La evaluación permite recomendar el cuidado apropiado para cada persona.</p>
          </div>
          <div className="case-list">
            <a href="#agenda"><span>01</span><strong>Molestias en las uñas</strong><small>Uñas encarnadas y cuidado ungueal</small><span className="case-arrow">↗</span></a>
            <a href="#agenda"><span>02</span><strong>Durezas en los pies</strong><small>Callosidades y zonas de presión</small><span className="case-arrow">↗</span></a>
            <a href="#agenda"><span>03</span><strong>Prevención y cuidado</strong><small>Orientación para tu rutina diaria</small><span className="case-arrow">↗</span></a>
          </div>
          <p className="cases-disclaimer">La información es general y no reemplaza una evaluación profesional.</p>
        </section>

        <section className="booking-section" id="agenda">
          <div className="booking-intro">
            <p className="eyebrow"><span className="eyebrow-dot" /> AGENDA TU ATENCIÓN</p>
            <h2>Tu próximo paso<br />empieza <em>aquí.</em></h2>
            <p>Elige una fecha desde hoy y cuéntame qué necesitas. Recibiré tu solicitud y te contactaré para confirmar la disponibilidad.</p>
            <div className="booking-info"><span aria-hidden="true">◷</span><span>La hora queda reservada una vez que recibas la confirmación del equipo.</span></div>
          </div>
          <form className="booking-form" onSubmit={submitAppointment}>
            <div className="form-heading">
              <span>Solicitud de hora</span>
              <span className="required-note">* Campos obligatorios</span>
            </div>
            <label>
              Nombre completo <span>*</span>
              <input name="name" value={form.name} onChange={updateForm} placeholder="Tu nombre" autoComplete="name" required maxLength={100} />
            </label>
            <label>
              Correo electrónico <span>*</span>
              <input name="email" type="email" value={form.email} onChange={updateForm} placeholder="nombre@correo.com" autoComplete="email" required maxLength={254} />
            </label>
            <label>
              Teléfono <span>*</span>
              <input name="phone" type="tel" value={form.phone} onChange={updateForm} placeholder="+56 9 1234 5678" autoComplete="tel" required maxLength={20} />
            </label>
            <label>
              Motivo de consulta <span>*</span>
              <select name="service" value={form.service} onChange={updateForm} required>
                <option value="" disabled>Selecciona un servicio</option>
                {services.map((service) => <option key={service} value={service}>{service}</option>)}
              </select>
            </label>
            <div className="form-row">
              <label>
                Fecha preferida <span>*</span>
                <input name="date" type="date" value={form.date} onChange={updateForm} min={today} required />
              </label>
              <label>
                Hora preferida <span>*</span>
                <select name="time" value={form.time} onChange={updateForm} required>
                  <option value="" disabled>Selecciona</option>
                  {appointmentTimes.map((time) => <option key={time} value={time}>{time}</option>)}
                </select>
              </label>
            </div>
            <label>
              ¿Algo más que quieras contarme? <small>(opcional)</small>
              <textarea name="notes" value={form.notes} onChange={updateForm} placeholder="Déjame un mensaje breve" rows="3" maxLength={1000} />
            </label>
            <button className="button button-dark submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando solicitud…' : 'Enviar solicitud'} <span aria-hidden="true">↗</span>
            </button>
            {status.message && <p className={`form-status ${status.type}`} role="status">{status.message}</p>}
            <p className="privacy-note">Usaremos tus datos únicamente para gestionar y responder tu solicitud de atención.</p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio">
          <img className="brand-logo" src={getPublicAssetPath('logohead.png')} alt="Logo de Podología Clínica" aria-hidden="true" />
          <span className="brand-name">podología<span>clínica</span></span>
        </a>
        <p>Cuidar tus pies es cuidar tu bienestar.</p>
        <small>© {new Date().getFullYear()} Podología Clínica</small>
      </footer>
    </div>
    {!cookieConsent && (
      <aside className="cookie-banner" aria-label="Aviso de cookies" role="region">
        <div className="cookie-copy">
          <strong>Tu privacidad importa</strong>
          <p>Actualmente no activamos cookies de analítica ni publicidad. Puedes aceptar o rechazar las cookies opcionales; guardaremos tu elección en este navegador.</p>
        </div>
        <div className="cookie-actions">
          <button type="button" className="cookie-reject" onClick={() => chooseCookieConsent('rejected')}>Rechazar opcionales</button>
          <button type="button" className="cookie-accept" onClick={() => chooseCookieConsent('accepted')}>Aceptar opcionales</button>
        </div>
      </aside>
    )}
    <a className="back-to-top" href="#inicio" aria-label="Volver arriba">
      <span aria-hidden="true">↑</span>
      <span>Volver arriba</span>
    </a>
    </>
  );
}

export default App;
