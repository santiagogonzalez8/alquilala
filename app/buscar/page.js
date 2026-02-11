'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';

export default function BuscarPropiedades() {
  const router = useRouter();
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarMisPropiedades = async () => {
      if (!auth.currentUser) {
        alert('Debes iniciar sesión');
        router.push('/login');
        return;
      }

      try {
        const q = query(
          collection(db, 'propiedades'),
          where('userId', '==', auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const propiedadesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPropiedades(propiedadesData);
      } catch (error) {
        console.error('Error al cargar propiedades:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarMisPropiedades();
  }, [router]);

  return (
    <div className={styles.home}>
      <div className={styles.heroSection}>
        <div className={styles.heroImage}></div>
        <div className={styles.heroContent}>
          <div className={styles.searchContainer}>
            <h1 style={{fontSize: '2.5rem', color: 'white', marginBottom: '1rem'}}>🏠 Mis Propiedades</h1>
            <p className={styles.subtitle}>Propiedades que has publicado en la plataforma</p>
          </div>
        </div>
      </div>

      <div className={styles.content} style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem'}}>
        {loading ? (
          <p style={{textAlign: 'center', fontSize: '1.25rem', color: '#6b7280'}}>Cargando tus propiedades...</p>
        ) : propiedades.length === 0 ? (
          <div style={{textAlign: 'center', padding: '3rem'}}>
            <p style={{fontSize: '1.25rem', color: '#6b7280', marginBottom: '1rem'}}>
              No tienes propiedades publicadas aún
            </p>
            <button
              onClick={() => router.push('/publicar')}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Publicar mi primera propiedad
            </button>
          </div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem'}}>
            {propiedades.map(prop => (
              <div key={prop.id} style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}>
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem'
                }}>
                  🏖️
                </div>
                <div style={{padding: '1.5rem'}}>
                  <h3 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>
                    {prop.titulo}
                  </h3>
                  <p style={{color: '#6b7280', marginBottom: '0.75rem'}}>📍 {prop.ubicacion}</p>
                  
                  <div style={{display: 'flex', gap: '1rem', marginBottom: '0.75rem', fontSize: '0.875rem', color: '#6b7280'}}>
                    <span>👥 {prop.huespedes} huéspedes</span>
                    <span>🛏️ {prop.dormitorios} dorm.</span>
                    <span>🚿 {prop.banos} baños</span>
                  </div>

                  <p style={{color: '#3b82f6', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem'}}>
                    ${prop.precioPorNoche}/noche
                  </p>

                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    background: prop.estado === 'disponible' ? '#d1fae5' : '#fee2e2',
                    color: prop.estado === 'disponible' ? '#065f46' : '#991b1b'
                  }}>
                    {prop.estado || 'disponible'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}