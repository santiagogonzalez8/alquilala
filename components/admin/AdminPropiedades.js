'use client';

import { useState } from 'react';
import { firestoreUpdate, firestoreDelete } from '@/lib/firebase';
import styles from '../../app/admin/admin.module.css';

async function enviarEmailNotificacion({ tipo, email, nombre, titulo, ubicacion, motivo = '' }) {
  try {
    const res = await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo, email, nombre, titulo, ubicacion, motivo }),
    });
    if (!res.ok) throw new Error('Error al enviar email');
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

export default function AdminPropiedades({ propiedades, onRefresh }) {
  const [filtro, setFiltro] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [expandido, setExpandido] = useState(null);
  const [enviandoEmail, setEnviandoEmail] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [modalRechazo, setModalRechazo] = useState(null);

  const filtradas = propiedades.filter(p => {
    const matchTexto = !filtro ||
      p.titulo?.toLowerCase().includes(filtro.toLowerCase()) ||
      p.ubicacion?.toLowerCase().includes(filtro.toLowerCase()) ||
      p.userEmail?.toLowerCase().includes(filtro.toLowerCase());
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado;
    return matchTexto && matchEstado;
  });

  const cambiarEstado = async (prop, nuevoEstado) => {
    // Si es rechazo, mostrar modal para ingresar motivo
    if (nuevoEstado === 'rechazada') {
      setModalRechazo(prop);
      return;
    }

    try {
      await firestoreUpdate('propiedades', prop.id, { estado: nuevoEstado });

      // Enviar email si es aprobación
      if (nuevoEstado === 'disponible' && prop.userEmail) {
        setEnviandoEmail(prop.id);
        const enviado = await enviarEmailNotificacion({
          tipo: 'aprobada',
          email: prop.userEmail,
          nombre: prop.userEmail.split('@')[0],
          titulo: prop.titulo,
          ubicacion: prop.ubicacion,
        });
        setEnviandoEmail(null);
        if (enviado) {
          showToast('✅ Propiedad aprobada y email enviado al dueño');
        }
      }

      onRefresh();
    } catch (error) {
      alert('Error al actualizar: ' + error.message);
    }
  };

  const confirmarRechazo = async () => {
    if (!modalRechazo) return;
    try {
      await firestoreUpdate('propiedades', modalRechazo.id, { estado: 'rechazada' });

      if (modalRechazo.userEmail) {
        setEnviandoEmail(modalRechazo.id);
        await enviarEmailNotificacion({
          tipo: 'rechazada',
          email: modalRechazo.userEmail,
          nombre: modalRechazo.userEmail.split('@')[0],
          titulo: modalRechazo.titulo,
          ubicacion: modalRechazo.ubicacion,
          motivo: motivoRechazo,
        });
        setEnviandoEmail(null);
      }

      setModalRechazo(null);
      setMotivoRechazo('');
      onRefresh();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta propiedad permanentemente?')) return;
    try {
      await firestoreDelete('propiedades', id);
      onRefresh();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  const [toast, setToast] = useState('');
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'disponible': return styles.badgeGreen;
      case 'pendiente':  return styles.badgeYellow;
      case 'pausada':    return styles.badgeBlue;
      case 'rechazada':  return styles.badgeRed;
      default:           return styles.badgeGray;
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem',
          background: 'var(--color-success)', color: 'white',
          padding: '1rem 1.5rem', borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 9999, fontWeight: 600, fontSize: '0.9rem',
          animation: 'fadeInDown 0.3s ease',
        }}>
          {toast}
        </div>
      )}

      {/* Modal rechazo */}
      {modalRechazo && (
        <div className={styles.modalOverlay} onClick={() => setModalRechazo(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>❌ Rechazar propiedad</h2>
              <button className={styles.modalClose} onClick={() => setModalRechazo(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                Se le enviará un email a <strong>{modalRechazo.userEmail}</strong> explicando el motivo.
              </p>
              <div className={styles.formGroup}>
                <label>Motivo del rechazo (opcional)</label>
                <textarea
                  rows={4}
                  value={motivoRechazo}
                  onChange={e => setMotivoRechazo(e.target.value)}
                  placeholder="Ej: Las fotos no son de buena calidad, falta información de la propiedad..."
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setModalRechazo(null)} className={styles.btnOutline}>
                Cancelar
              </button>
              <button onClick={confirmarRechazo} className={styles.btnDanger} style={{ padding: '0.55rem 1.25rem' }}>
                {enviandoEmail ? '⏳ Enviando...' : '❌ Rechazar y notificar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>🏠 Gestión de Propiedades ({filtradas.length})</h2>
          <div className={styles.filterBar}>
            <input
              type="text"
              placeholder="🔍 Buscar título, ubicación, email..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className={styles.filterInput}
            />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="todos">Todos los estados</option>
              <option value="disponible">✅ Disponible</option>
              <option value="pendiente">⏳ Pendiente</option>
              <option value="pausada">⏸️ Pausada</option>
              <option value="rechazada">❌ Rechazada</option>
            </select>
          </div>
        </div>

        <div className={styles.panelBody}>
          {filtradas.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏠</div>
              <h3>No se encontraron propiedades</h3>
              <p>Ajustá los filtros o esperá a que los dueños publiquen.</p>
            </div>
          ) : (
            filtradas.map(prop => (
              <div key={prop.id}>
                <div
                  className={styles.itemCard}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setExpandido(expandido === prop.id ? null : prop.id)}
                >
                  <div className={styles.itemInfo} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    {(prop.imagenes?.[0] || prop.fotoPrincipal) && (
                      <img src={prop.imagenes?.[0] || prop.fotoPrincipal} alt="" className={styles.photoThumb} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className={styles.itemTitle}>{prop.titulo}</h3>
                      <p className={styles.itemDetail}>📍 {prop.ubicacion} • 💰 ${prop.precioPorNoche}/noche</p>
                      <p className={styles.itemDetail}>
                        👥 {prop.huespedes} huésp. • 🛏️ {prop.dormitorios} dorm. • 🚿 {prop.banos} baños
                      </p>
                      <p className={styles.itemDetail}>👤 {prop.userEmail}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        <span className={`${styles.badge} ${getBadgeClass(prop.estado)}`}>
                          {prop.estado || 'sin estado'}
                        </span>
                        {enviandoEmail === prop.id && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            📧 Enviando email...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.itemActions} onClick={(e) => e.stopPropagation()}>
                    <select
                      value={prop.estado || 'pendiente'}
                      onChange={(e) => cambiarEstado(prop, e.target.value)}
                      className={styles.selectEstado}
                      disabled={enviandoEmail === prop.id}
                    >
                      <option value="disponible">✅ Disponible</option>
                      <option value="pendiente">⏳ Pendiente</option>
                      <option value="pausada">⏸️ Pausada</option>
                      <option value="rechazada">❌ Rechazada</option>
                    </select>
                    <button onClick={() => eliminar(prop.id)} className={styles.btnDanger}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>

                {/* Expandido */}
                {expandido === prop.id && (
                  <div style={{
                    background: '#f8f9fa', padding: '1.25rem',
                    marginTop: '-0.75rem', marginBottom: '0.75rem',
                    borderRadius: '0 0 8px 8px',
                    border: '1px solid var(--color-border-light)', borderTop: 'none'
                  }}>
                    {prop.descripcion && (
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}>Descripción:</strong>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginTop: '0.3rem', lineHeight: '1.6' }}>
                          {prop.descripcion}
                        </p>
                      </div>
                    )}
                    {prop.amenities?.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <strong style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}>Amenidades:</strong>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                          {prop.amenities.map((a, i) => (
                            <span key={i} style={{
                              background: 'white', border: '1px solid var(--color-border)',
                              padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem'
                            }}>{a}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {prop.imagenes?.length > 0 && (
                      <div>
                        <strong style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}>
                          Fotos ({prop.imagenes.length}):
                        </strong>
                        <div className={styles.photosRow} style={{ marginTop: '0.4rem' }}>
                          {prop.imagenes.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                              <img src={url} alt={`Foto ${i + 1}`} className={styles.photoThumb} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Botones de aprobación rápida */}
                    {prop.estado === 'pendiente' && (
                      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--color-border-light)' }}>
                        <button
                          onClick={() => cambiarEstado(prop, 'disponible')}
                          disabled={enviandoEmail === prop.id}
                          style={{
                            background: '#2e7d32', color: 'white', border: 'none',
                            padding: '0.6rem 1.25rem', borderRadius: '8px',
                            fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
                            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem'
                          }}
                        >
                          {enviandoEmail === prop.id ? '⏳ Procesando...' : '✅ Aprobar y notificar'}
                        </button>
                        <button
                          onClick={() => cambiarEstado(prop, 'rechazada')}
                          disabled={enviandoEmail === prop.id}
                          style={{
                            background: '#c62828', color: 'white', border: 'none',
                            padding: '0.6rem 1.25rem', borderRadius: '8px',
                            fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
                            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem'
                          }}
                        >
                          ❌ Rechazar y notificar
                        </button>
                      </div>
                    )}

                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      📅 Publicada: {prop.fechaPublicacion
                        ? new Date(prop.fechaPublicacion).toLocaleDateString('es-UY')
                        : 'N/A'}
                      {' • '} Tipo: {prop.tipoPropiedad || 'N/A'}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}