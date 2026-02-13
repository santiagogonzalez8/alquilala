'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/adminConfig';
import styles from './admin.module.css';

export default function AdminPanel() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [propiedades, setPropiedades] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [vistaActual, setVistaActual] = useState('propiedades');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      if (!isAdmin(currentUser.email)) {
        alert('No tienes permisos de administrador');
        router.push('/');
        return;
      }
      setUser(currentUser);
      cargarDatos();
    });
    return () => unsubscribe();
  }, [router]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const propSnapshot = await getDocs(collection(db, 'propiedades'));
      setPropiedades(propSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      const resSnapshot = await getDocs(collection(db, 'reservas'));
      setReservas(resSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

      const ticketSnapshot = await getDocs(collection(db, 'tickets-soporte'));
      setTickets(ticketSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarPropiedad = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return;
    try {
      await deleteDoc(doc(db, 'propiedades', id));
      cargarDatos();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const cambiarEstadoPropiedad = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, 'propiedades', id), { estado: nuevoEstado });
      cargarDatos();
    } catch (error) {
      alert('Error al actualizar');
    }
  };

  const eliminarReserva = async (id) => {
    if (!confirm('¿Eliminar esta reserva?')) return;
    try {
      await deleteDoc(doc(db, 'reservas', id));
      cargarDatos();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const cambiarEstadoTicket = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, 'tickets-soporte', id), { estado: nuevoEstado });
      cargarDatos();
    } catch (error) {
      alert('Error al actualizar');
    }
  };

  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'disponible':
      case 'confirmada':
      case 'resuelto':
        return styles.badgeGreen;
      case 'pendiente':
        return styles.badgeYellow;
      case 'rechazada':
      case 'cancelada':
        return styles.badgeRed;
      case 'en-proceso':
      case 'pausada':
        return styles.badgeBlue;
      default:
        return styles.badgeYellow;
    }
  };

  if (loading) {
    return (
      <div className={styles.adminLoading}>
        <div className="loading-spinner"></div>
        Cargando panel de admin...
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      {/* Top bar */}
      <div className={styles.adminTopBar}>
        <div className={styles.adminTopLeft}>
          <button
            onClick={() => router.push('/')}
            className={styles.adminBackBtn}
            aria-label="Volver al inicio"
          >
            ←
          </button>
          <div className={styles.adminTopTitle}>
            <h1>👑 Panel de Administración</h1>
            <p>Gestiona toda la plataforma desde aquí</p>
          </div>
        </div>
        <button onClick={cargarDatos} className={styles.adminRefreshBtn}>
          🔄 Actualizar
        </button>
      </div>

      <div className={styles.adminContainer}>
        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏠</div>
            <div>
              <p className={styles.statLabel}>Propiedades</p>
              <p className={styles.statValue}>{propiedades.length}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📅</div>
            <div>
              <p className={styles.statLabel}>Reservas</p>
              <p className={styles.statValue}>{reservas.length}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💬</div>
            <div>
              <p className={styles.statLabel}>Tickets Soporte</p>
              <p className={styles.statValue}>{tickets.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsHeader}>
            <button
              onClick={() => setVistaActual('propiedades')}
              className={`${styles.tab} ${vistaActual === 'propiedades' ? styles.tabActive : ''}`}
            >
              🏠 Propiedades ({propiedades.length})
            </button>
            <button
              onClick={() => setVistaActual('reservas')}
              className={`${styles.tab} ${vistaActual === 'reservas' ? styles.tabActive : ''}`}
            >
              📅 Reservas ({reservas.length})
            </button>
            <button
              onClick={() => setVistaActual('tickets')}
              className={`${styles.tab} ${vistaActual === 'tickets' ? styles.tabActive : ''}`}
            >
              💬 Soporte ({tickets.length})
            </button>
          </div>

          <div className={styles.tabContent}>
            {/* ---- PROPIEDADES ---- */}
            {vistaActual === 'propiedades' && (
              <>
                {propiedades.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>🏠 No hay propiedades publicadas aún</p>
                  </div>
                ) : (
                  propiedades.map(prop => (
                    <div key={prop.id} className={styles.itemCard}>
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemTitle}>{prop.titulo}</h3>
                        <p className={styles.itemDetail}>📍 {prop.ubicacion}</p>
                        <p className={styles.itemDetail}>💰 ${prop.precioPorNoche}/noche</p>
                        <p className={styles.itemDetail}>👥 {prop.huespedes} huéspedes • 🛏️ {prop.dormitorios} dorm.</p>
                        <p className={styles.itemDetail}>👤 {prop.userEmail}</p>
                        <span className={`${styles.badge} ${getBadgeClass(prop.estado)}`}>
                          {prop.estado || 'disponible'}
                        </span>
                      </div>
                      <div className={styles.itemActions}>
                        <select
                          value={prop.estado || 'disponible'}
                          onChange={(e) => cambiarEstadoPropiedad(prop.id, e.target.value)}
                          className={styles.selectEstado}
                        >
                          <option value="disponible">Disponible</option>
                          <option value="pendiente">Pendiente</option>
                          <option value="rechazada">Rechazada</option>
                          <option value="pausada">Pausada</option>
                        </select>
                        <button onClick={() => eliminarPropiedad(prop.id)} className={styles.btnDelete}>
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* ---- RESERVAS ---- */}
            {vistaActual === 'reservas' && (
              <>
                {reservas.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>📅 No hay reservas aún</p>
                  </div>
                ) : (
                  reservas.map(reserva => (
                    <div key={reserva.id} className={styles.itemCard}>
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemTitle}>{reserva.propiedad}</h3>
                        <p className={styles.itemDetail}>👤 {reserva.nombreHuesped || reserva.userEmail}</p>
                        <p className={styles.itemDetail}>📧 {reserva.userEmail}</p>
                        <p className={styles.itemDetail}>📅 Check-in: {reserva.fechaCheckIn}</p>
                        <p className={styles.itemDetail}>📅 Check-out: {reserva.fechaCheckOut}</p>
                        <p className={styles.itemDetail}>💰 Total: ${reserva.precioTotal}</p>
                        <span className={`${styles.badge} ${getBadgeClass(reserva.estado)}`}>
                          {reserva.estado}
                        </span>
                      </div>
                      <div className={styles.itemActions}>
                        <button onClick={() => eliminarReserva(reserva.id)} className={styles.btnDelete}>
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* ---- TICKETS ---- */}
            {vistaActual === 'tickets' && (
              <>
                {tickets.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>💬 No hay tickets de soporte</p>
                  </div>
                ) : (
                  tickets.map(ticket => (
                    <div key={ticket.id} className={styles.itemCard}>
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemTitle}>{ticket.nombre}</h3>
                        <p className={styles.itemDetail}>📧 {ticket.email}</p>
                        <p className={styles.itemDetail}>📋 Asunto: {ticket.asunto}</p>
                        <div className={styles.ticketMessage}>{ticket.mensaje}</div>
                        <p className={styles.itemDetail}>📅 {ticket.fecha}</p>
                        <span className={`${styles.badge} ${getBadgeClass(ticket.estado)}`}>
                          {ticket.estado}
                        </span>
                      </div>
                      <div className={styles.itemActions}>
                        <select
                          value={ticket.estado}
                          onChange={(e) => cambiarEstadoTicket(ticket.id, e.target.value)}
                          className={styles.selectEstado}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en-proceso">En proceso</option>
                          <option value="resuelto">Resuelto</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}