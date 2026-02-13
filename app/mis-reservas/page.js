'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './misreservas.module.css';

function MisReservasContenido() {
  const router = useRouter();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const q = query(
          collection(db, 'reservas'),
          where('userId', '==', auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        setReservas(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'confirmada': return styles.badgeGreen;
      case 'pendiente': return styles.badgeYellow;
      default: return styles.badgeRed;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className="section-label">Mi cuenta</span>
          <h1 className={styles.headerTitle}>Mis Reservas</h1>
          <p className={styles.headerSubtitle}>Seguimiento de tus reservas de alquiler</p>
        </div>
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.emptyState}>
            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>Cargando reservas...</p>
          </div>
        ) : reservas.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>
            <h3>No tenés reservas todavía</h3>
            <p>Cuando gestiones reservas aparecerán acá.</p>
            <button onClick={() => router.push('/')} className={styles.btnPrimary}>
              Ir al inicio
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {reservas.map(r => (
              <div key={r.id} className={styles.card}>
                <h3 className={styles.cardTitle}>{r.propiedad}</h3>
                <div className={styles.cardDetails}>
                  <p>📅 Check-in: <strong>{r.fechaCheckIn || r.fecha}</strong></p>
                  <p>📅 Check-out: <strong>{r.fechaCheckOut || '—'}</strong></p>
                  {r.noches && <p>🌙 {r.noches} noches</p>}
                  {r.precioTotal && <p>💰 Total: <strong>${r.precioTotal}</strong></p>}
                </div>
                <span className={`${styles.badge} ${getEstadoBadge(r.estado)}`}>
                  {r.estado === 'confirmada' ? '✅ Confirmada' :
                   r.estado === 'pendiente' ? '⏳ Pendiente' :
                   '❌ ' + r.estado}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MisReservas() {
  return (
    <ProtectedRoute>
      <MisReservasContenido />
    </ProtectedRoute>
  );
}