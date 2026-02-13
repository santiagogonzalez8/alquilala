'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './mispropiedades.module.css';

function MisPropiedadesContenido() {
  const router = useRouter();
  const [propiedades, setPropiedades] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarMisPropiedades();
  }, []);

  useEffect(() => {
    if (busqueda.trim() === '') {
      setFiltradas(propiedades);
    } else {
      setFiltradas(propiedades.filter(p =>
        p.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.ubicacion?.toLowerCase().includes(busqueda.toLowerCase())
      ));
    }
  }, [busqueda, propiedades]);

  const cargarMisPropiedades = async () => {
    try {
      const q = query(
        collection(db, 'propiedades'),
        where('userId', '==', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPropiedades(data);
      setFiltradas(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarPropiedad = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return;
    try {
      await deleteDoc(doc(db, 'propiedades', id));
      cargarMisPropiedades();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'disponible': return styles.badgeGreen;
      case 'pendiente': return styles.badgeYellow;
      case 'pausada': return styles.badgeBlue;
      default: return styles.badgeRed;
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className="section-label">Mi cuenta</span>
          <h1 className={styles.headerTitle}>Mis Propiedades</h1>
          <p className={styles.headerSubtitle}>Propiedades que publicaste en la plataforma</p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Barra de búsqueda */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="🔍 Buscar por título o ubicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={styles.searchInput}
          />
          <button onClick={() => router.push('/publicar')} className={styles.btnNew}>
            ➕ Nueva propiedad
          </button>
        </div>

        {loading ? (
          <div className={styles.emptyState}>
            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>Cargando tus propiedades...</p>
          </div>
        ) : propiedades.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏖️</div>
            <h3>No tenés propiedades publicadas</h3>
            <p>¡Empezá a generar ingresos con tu casa!</p>
            <button onClick={() => router.push('/publicar')} className={styles.btnPrimary}>
              Publicar mi primera propiedad
            </button>
          </div>
        ) : filtradas.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No se encontraron resultados para "{busqueda}"</p>
            <button onClick={() => setBusqueda('')} className={styles.btnLink}>
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtradas.map(prop => (
              <div key={prop.id} className={styles.card}>
                <div
                  className={styles.cardImage}
                  style={{
                    backgroundImage: prop.imagenes?.[0] || prop.fotoPrincipal
                      ? `url(${prop.imagenes?.[0] || prop.fotoPrincipal})`
                      : 'linear-gradient(135deg, #1e3a5f, #2d4a6f)'
                  }}
                >
                  <span className={`${styles.badge} ${getEstadoBadge(prop.estado)}`}>
                    {prop.estado || 'disponible'}
                  </span>
                  {prop.tipoPropiedad && (
                    <span className={styles.typeBadge}>{prop.tipoPropiedad}</span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{prop.titulo}</h3>
                  <p className={styles.cardLocation}>📍 {prop.ubicacion}</p>
                  <div className={styles.cardDetails}>
                    <span>👥 {prop.huespedes}</span>
                    <span>🛏️ {prop.dormitorios}</span>
                    <span>🚿 {prop.banos}</span>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardPrice}>
                      <span className={styles.priceValue}>${prop.precioPorNoche}</span>
                      <span className={styles.priceLabel}>/noche</span>
                    </div>
                    <button onClick={() => eliminarPropiedad(prop.id)} className={styles.btnDelete}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MisPropiedades() {
  return (
    <ProtectedRoute>
      <MisPropiedadesContenido />
    </ProtectedRoute>
  );
}