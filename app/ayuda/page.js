'use client';

import Link from 'next/link';
import styles from './ayuda.module.css';

export default function Ayuda() {
  const faqs = [
    {
      pregunta: '¿Qué es Alquilala?',
      respuesta: 'Alquilala es un servicio de gestión profesional de alquileres temporales. Nos encargamos de publicar y administrar tu propiedad en Airbnb, Booking y MercadoLibre, incluyendo limpieza, mantenimiento y atención al huésped.'
    },
    {
      pregunta: '¿Cómo publico mi propiedad?',
      respuesta: 'Registrate en la plataforma, completá el formulario con los datos de tu casa (fotos, ubicación, capacidad, amenities) y nosotros nos encargamos de todo lo demás.'
    },
    {
      pregunta: '¿Cuánto cuesta el servicio?',
      respuesta: 'Publicar tu propiedad es gratuito. Cobramos una comisión sobre cada reserva concretada. Contactanos para conocer los planes disponibles.'
    },
    {
      pregunta: '¿En qué plataformas se publica mi propiedad?',
      respuesta: 'Publicamos tu propiedad simultáneamente en Airbnb, Booking y MercadoLibre, maximizando tu visibilidad y ocupación.'
    },
    {
      pregunta: '¿Quién se encarga de la limpieza?',
      respuesta: 'Nosotros coordinamos la limpieza entre huéspedes, cortapasto, mantenimiento y todo lo que tu propiedad necesite.'
    },
    {
      pregunta: '¿Puedo ver el estado de mis reservas?',
      respuesta: 'Sí, desde tu panel de usuario podés ver tus propiedades, reservas activas y el estado de cada una en tiempo real.'
    },
    {
      pregunta: '¿Qué pasa si un huésped tiene un problema?',
      respuesta: 'Nuestro equipo está disponible para atender consultas y resolver cualquier inconveniente con los huéspedes, las 24 horas.'
    }
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className="section-label">Soporte</span>
          <h1 className={styles.headerTitle}>Centro de Ayuda</h1>
          <p className={styles.headerSubtitle}>
            Encontrá respuestas a las preguntas más frecuentes
          </p>
        </div>
      </div>

      {/* FAQs */}
      <div className={styles.content}>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <details key={index} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                {faq.pregunta}
              </summary>
              <p className={styles.faqAnswer}>
                {faq.respuesta}
              </p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.ctaBox}>
          <div className={styles.ctaIcon}>💬</div>
          <h3>¿No encontraste lo que buscabas?</h3>
          <p>Nuestro equipo está listo para ayudarte con cualquier consulta.</p>
          <div className={styles.ctaButtons}>
            <Link href="/soporte" className={styles.ctaBtn}>
              Contactanos
            </Link>
            <a
              href="https://wa.me/59895532294?text=Hola!%20Tengo%20una%20consulta"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtnWhatsapp}
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}