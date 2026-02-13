'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './misreservas.module.css';

function MisReservasContenido() {
  const router = useRouter();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    const cargar = async () => {
      try {
        const q = query(collection(db, 'reservas'), where('userId', '==', auth.currentUser.uid));
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

  const filtradas = reservas.filter(r =>
    filtroEstado === 'todos' || r.estado === filtroEstado
  );

  const getEstadoInfo = (estado) => {
    switch (estado) {
      case 'confirmada': return { label: '✅ Confirmada', class: styles.badgeGreen };
      case 'pendiente': return { label: '⏳ Pendiente', class: styles.badgeYellow };
      case 'cancelada': return { label: '❌ Cancelada', class: styles.badgeRed };
      default: return { label: estado, class: styles.badgeGray };
    }
  };

  const totalIngresos = filtradas
    .filter(r => r.estado === 'confirmada')
    .reduce((sum, r) => sum + (Number(r.precioTotal) || 0), 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className="section-label">Mi cuenta</span>
          <h1 className={styles.headerTitle}>Mis Reservas</h1>
          <p className={styles.headerSubtitle}>
            {reservas.length} {reservas.length === 1 ? 'reserva' : 'reservas'} en total
            {totalIngresos > 0 && ` • $${totalIngresos} en ingresos confirmados`}
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Filtro */}
        {reservas.length > 0 && (
          <div className={styles.filterBar}>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="todos">Todas las reservas ({reservas.length})</option>
              <option value="confirmada">✅ Confirmadas ({reservas.filter(r => r.estado === 'confirmada').length})</option>
              <option value="pendiente">⏳ Pendientes ({reservas.filter(r => r.estado === 'pendiente').length})</option>
              <option value="cancelada">❌ Canceladas ({reservas.filter(r => r.estado === 'cancelada').length})</option>
            </select>
          </div>
        )}

        {loading ? (
          <div className={styles.emptyState}>
            <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>Cargando reservas...</p>
          </div>
        ) : reservas.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📅</div>
            <h3>No tenés reservas todavía</h3>
            <p>Las reservas de tus propiedades aparecerán acá cuando los huéspedes reserven.</p>
            <Link href="/" className={styles.ctaBtn}>Ir al inicio</Link>
          </div>
        ) : filtradas.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay reservas con ese filtro.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtradas.map(r => {
              const estadoInfo = getEstadoInfo(r.estado);
              return (
                <div key={r.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{r.propiedad || 'Propiedad'}</h3>
                    <span className={`${styles.badge} ${estadoInfo.class}`}>{estadoInfo.label}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.dateRow}>
                      <div className={styles.dateBlock}>
                        <span className={styles.dateLabel}>Check-in</span>
                        <span className={styles.dateValue}>{r.fechaCheckIn || r.fecha || '—'}</span>
                      </div>
                      <div className={styles.dateArrow}>→</div>
                      <div className={styles.dateBlock}>
                        <span className={styles.dateLabel}>Check-out</span>
                        <span className={styles.dateValue}>{r.fechaCheckOut || '—'}</span>
                      </div>
                    </div>
                    <div className={styles.detailsRow}>
                      {r.noches && <span className={styles.detail}>🌙 {r.noches} noches</span>}
                      {r.nombreHuesped && <span className={styles.detail}>👤 {r.nombreHuesped}</span>}
                    </div>
                    {r.precioTotal && (
                      <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>Total</span>
                        <span className={styles.totalValue}>${r.precioTotal}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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