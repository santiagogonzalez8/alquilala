'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from '../page.module.css';

export default function Contactanos() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'tickets-soporte'), {
        ...formData,
        fecha: new Date().toISOString(),
        estado: 'pendiente'
      });

      setEnviado(true);
      setFormData({ nombre: '', email: '', mensaje: '' });
      
      setTimeout(() => {
        setEnviado(false);
      }, 5000);
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Error al enviar el mensaje. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.home}>
      <div className={styles.heroSection}>
        <div className={styles.heroImage}></div>
        <div className={styles.heroContent}>
          <div className={styles.searchContainer}>
            <h1 style={{fontSize: '2.5rem', color: 'white', marginBottom: '1rem'}}>💬 Contáctanos</h1>
            <p className={styles.subtitle}>Estamos aquí para ayudarte</p>
          </div>
        </div>
      </div>

      <div className={styles.content} style={{maxWidth: '700px', margin: '0 auto', padding: '2rem'}}>
        {enviado && (
          <div style={{
            background: '#d1fae5',
            color: '#065f46',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            ✅ Mensaje enviado exitosamente. Te responderemos pronto.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
          
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
              style={{width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem'}}
            />
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              style={{width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem'}}
            />
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Motivo de contacto</label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Cuéntanos en qué podemos ayudarte..."
              style={{width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit'}}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              marginBottom: '1.5rem'
            }}
          >
            {loading ? 'Enviando...' : 'Enviar Mensaje'}
          </button>

          <div style={{
            borderTop: '2px solid #e5e7eb',
            paddingTop: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{color: '#6b7280', marginBottom: '1rem'}}>O si prefieres, escríbeme por WhatsApp:</p>
            <a
              href="https://wa.me/59895532294"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: '#25D366',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Escribir por WhatsApp
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}