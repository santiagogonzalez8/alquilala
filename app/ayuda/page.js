'use client';
import styles from '../page.module.css';

export default function Ayuda() {
  const faqs = [
    {
      pregunta: '¿Cómo publico una propiedad?',
      respuesta: 'Ve a la sección "Publicar Propiedad" del menú, completa el formulario con los datos de tu casa y haz clic en "Publicar". Tu propiedad estará disponible inmediatamente.'
    },
    {
      pregunta: '¿Cómo veo mis propiedades publicadas?',
      respuesta: 'En la sección "Buscar Propiedades" (o "Mis Propiedades") puedes ver todas las casas que has publicado en la plataforma.'
    },
    {
      pregunta: '¿Cuánto cuesta publicar?',
      respuesta: 'Publicar tu propiedad en Alquilala es completamente gratuito. Solo cobramos una comisión cuando se concrete una reserva.'
    },
    {
      pregunta: '¿Puedo modificar mi publicación?',
      respuesta: 'Sí, desde el panel de administración puedes editar los datos de tu propiedad en cualquier momento.'
    },
    {
      pregunta: '¿Cómo me contactan los interesados?',
      respuesta: 'Cuando alguien esté interesado en tu propiedad, recibirás una notificación por email con los datos de contacto.'
    },
    {
      pregunta: '¿Qué información necesito para publicar?',
      respuesta: 'Necesitas: título descriptivo, ubicación, precio por noche, número de huéspedes, dormitorios, baños, amenidades y una descripción detallada.'
    }
  ];

  return (
    <div className={styles.home}>
      <div className={styles.heroSection}>
        <div className={styles.heroImage}></div>
        <div className={styles.heroContent}>
          <div className={styles.searchContainer}>
            <h1 style={{fontSize: '2.5rem', color: 'white', marginBottom: '1rem'}}>❓ Centro de Ayuda</h1>
            <p className={styles.subtitle}>Encuentra respuestas a tus preguntas</p>
          </div>
        </div>
      </div>

      <div className={styles.content} style={{maxWidth: '900px', margin: '0 auto', padding: '2rem'}}>
        <div style={{background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#1e3a5f'}}>
            Preguntas Frecuentes
          </h2>

          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {faqs.map((faq, index) => (
              <details key={index} style={{
                background: '#f9fafb',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <summary style={{
                  fontWeight: 'bold',
                  fontSize: '1.125rem',
                  color: '#1e3a5f',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}>
                  {faq.pregunta}
                </summary>
                <p style={{
                  marginTop: '0.75rem',
                  paddingLeft: '1rem',
                  color: '#6b7280',
                  lineHeight: '1.6'
                }}>
                  {faq.respuesta}
                </p>
              </details>
            ))}
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            borderRadius: '8px',
            border: '2px solid #3b82f6'
          }}>
            <h3 style={{fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#1e40af'}}>
              ¿No encontraste lo que buscabas?
            </h3>
            <p style={{color: '#1e40af', marginBottom: '1rem'}}>
              Nuestro equipo está aquí para ayudarte
            </p>
            <a
              href="/soporte"
              style={{
                display: 'inline-block',
                background: '#3b82f6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}