'use client';

import { useState } from 'react';
import { firestoreUpdate, firestoreDelete } from '@/lib/firebase';
import styles from '../../app/admin/admin.module.css';

export default function AdminTickets({ tickets, onRefresh }) {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [expandido, setExpandido] = useState(null);
  const [respondiendo, setRespondiendo] = useState(null);
  const [mensajeRespuesta, setMensajeRespuesta] = useState('');

  const filtrados = tickets
    .filter(t => filtroEstado === 'todos' || t.estado === filtroEstado)
    .sort((a, b) => {
      const orden = { pendiente: 0, 'en-proceso': 1, resuelto: 2 };
      return (orden[a.estado] || 0) - (orden[b.estado] || 0);
    });

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await firestoreUpdate('tickets-soporte', id, { estado: nuevoEstado });
      onRefresh();
    } catch (error) {
      alert('Error al actualizar: ' + error.message);
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este ticket?')) return;
    try {
      await firestoreDelete('tickets-soporte', id);
      onRefresh();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  };

  // Responder por email — abre Gmail web con destinatario, asunto y cuerpo
  const responderEmail = (ticket, mensajeExtra = '') => {
    const destinatario = ticket.email;
    const asunto = encodeURIComponent(`Re: ${ticket.asunto || 'Tu consulta en Alquilala'}`);
    const cuerpo = encodeURIComponent(
      mensajeExtra
        ? mensajeExtra
        : `Hola ${ticket.nombre},\n\nGracias por contactarnos. En relación a tu consulta:\n\n"${ticket.mensaje}"\n\nTe respondemos:\n\n\n\nSaludos,\nEquipo Alquilala`
    );

    // Intenta abrir Gmail web directamente (funciona en cualquier dispositivo)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${destinatario}&su=${asunto}&body=${cuerpo}`;
    window.open(gmailUrl, '_blank');
  };

  // Responder por WhatsApp — solo funciona si el ticket tiene teléfono
  const responderWhatsApp = (ticket, mensajeExtra = '') => {
    const mensaje = mensajeExtra
      ? mensajeExtra
      : `Hola ${ticket.nombre}! Soy del equipo de Alquilala. Te escribimos en relación a tu consulta: "${ticket.asunto || 'consulta general'}". `;

    if (ticket.telefono) {
      // Si el ticket tiene teléfono, abrir conversación directa
      const numero = ticket.telefono.replace(/\D/g, ''); // Solo dígitos
      window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
    } else {
      // Sin teléfono — mostrar modal para ingresar número
      const numero = prompt(
        `El ticket no tiene número de teléfono.\n\nIngresá el número de ${ticket.nombre} (con código de país, ej: 59899123456):`
      );
      if (numero) {
        const numeroLimpio = numero.replace(/\D/g, '');
        window.open(`https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`, '_blank');
      }
    }
  };

  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'resuelto': return styles.badgeGreen;
      case 'en-proceso': return styles.badgeBlue;
      case 'pendiente': return styles.badgeYellow;
      default: return styles.badgeGray;
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>
          💬 Tickets de Soporte ({filtrados.length})
        </h2>
        <div className={styles.filterBar}>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="todos">Todos</option>
            <option value="pendiente">⏳ Pendiente</option>
            <option value="en-proceso">🔵 En proceso</option>
            <option value="resuelto">✅ Resuelto</option>
          </select>
        </div>
      </div>

      <div className={styles.panelBody}>
        {filtrados.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <h3>No hay tickets</h3>
            <p>No se encontraron tickets con este filtro.</p>
          </div>
        ) : (
          filtrados.map(ticket => (
            <div key={ticket.id}>
              <div
                className={styles.itemCard}
                style={{ cursor: 'pointer' }}
                onClick={() => setExpandido(expandido === ticket.id ? null : ticket.id)}
              >
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemTitle}>{ticket.nombre}</h3>
                  <p className={styles.itemDetail}>📧 {ticket.email}</p>
                  {ticket.telefono && (
                    <p className={styles.itemDetail}>📱 {ticket.telefono}</p>
                  )}
                  <p className={styles.itemDetail}>
                    📋 {ticket.asunto || 'Sin asunto'}
                  </p>
                  <p className={styles.itemDetail} style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '500px'
                  }}>
                    💬 {ticket.mensaje}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.4rem' }}>
                    <span className={`${styles.badge} ${getBadgeClass(ticket.estado)}`}>
                      {ticket.estado}
                    </span>
                    {ticket.fecha && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        📅 {new Date(ticket.fecha).toLocaleDateString('es-UY', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.itemActions} onClick={(e) => e.stopPropagation()}>
                  <select
                    value={ticket.estado}
                    onChange={(e) => cambiarEstado(ticket.id, e.target.value)}
                    className={styles.selectEstado}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en-proceso">En proceso</option>
                    <option value="resuelto">Resuelto</option>
                  </select>
                  <button
                    onClick={() => eliminar(ticket.id)}
                    className={styles.btnDanger}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Panel expandido */}
              {expandido === ticket.id && (
                <div style={{
                  background: '#f8f9fa',
                  padding: '1.25rem',
                  marginTop: '-0.75rem',
                  marginBottom: '0.75rem',
                  borderRadius: '0 0 8px 8px',
                  border: '1px solid var(--color-border-light)',
                  borderTop: 'none'
                }}>
                  {/* Mensaje completo */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <strong style={{ color: 'var(--color-primary)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                      Mensaje completo:
                    </strong>
                    <div className={styles.ticketMessage}>
                      {ticket.mensaje}
                    </div>
                  </div>

                  {/* Área de redacción de respuesta */}
                  {respondiendo === ticket.id ? (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: 'var(--color-primary)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                        ✍️ Escribí tu respuesta:
                      </strong>
                      <textarea
                        value={mensajeRespuesta}
                        onChange={(e) => setMensajeRespuesta(e.target.value)}
                        rows={5}
                        placeholder={`Hola ${ticket.nombre},\n\nTe respondemos...`}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid var(--color-border)',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          marginBottom: '0.75rem',
                          outline: 'none',
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                      />
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            responderEmail(ticket, mensajeRespuesta);
                            cambiarEstado(ticket.id, 'en-proceso');
                          }}
                          style={{
                            background: '#1a73e8',
                            color: 'white',
                            border: 'none',
                            padding: '0.6rem 1.25rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontFamily: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          📧 Enviar por Gmail
                        </button>
                        <button
                          onClick={() => {
                            responderWhatsApp(ticket, mensajeRespuesta);
                            cambiarEstado(ticket.id, 'en-proceso');
                          }}
                          style={{
                            background: '#25D366',
                            color: 'white',
                            border: 'none',
                            padding: '0.6rem 1.25rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontFamily: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          💬 Enviar por WhatsApp
                        </button>
                        <button
                          onClick={() => {
                            setRespondiendo(null);
                            setMensajeRespuesta('');
                          }}
                          style={{
                            background: 'white',
                            color: 'var(--color-text-light)',
                            border: '1px solid var(--color-border)',
                            padding: '0.6rem 1rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontFamily: 'inherit',
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Botones de acción rápida */
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          setRespondiendo(ticket.id);
                          setMensajeRespuesta(
                            `Hola ${ticket.nombre},\n\nGracias por contactarnos. En relación a tu consulta sobre "${ticket.asunto || 'tu consulta'}":\n\n\n\nSaludos,\nEquipo Alquilala`
                          );
                        }}
                        style={{
                          background: 'var(--color-primary)',
                          color: 'white',
                          border: 'none',
                          padding: '0.6rem 1.25rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        ✍️ Redactar respuesta
                      </button>

                      <button
                        onClick={() => {
                          responderEmail(ticket);
                          cambiarEstado(ticket.id, 'en-proceso');
                        }}
                        style={{
                          background: '#1a73e8',
                          color: 'white',
                          border: 'none',
                          padding: '0.6rem 1.25rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        📧 Gmail rápido
                      </button>

                      <button
                        onClick={() => {
                          responderWhatsApp(ticket);
                          cambiarEstado(ticket.id, 'en-proceso');
                        }}
                        style={{
                          background: '#25D366',
                          color: 'white',
                          border: 'none',
                          padding: '0.6rem 1.25rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        💬 WhatsApp rápido
                      </button>

                      <button
                        onClick={() => cambiarEstado(ticket.id, 'resuelto')}
                        style={{
                          background: '#e8f5e9',
                          color: '#2e7d32',
                          border: '1px solid #c8e6c9',
                          padding: '0.6rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                        }}
                      >
                        ✅ Marcar resuelto
                      </button>
                    </div>
                  )}

                  {/* Aviso si no tiene teléfono */}
                  {!ticket.telefono && (
                    <p style={{
                      marginTop: '0.75rem',
                      fontSize: '0.78rem',
                      color: 'var(--color-text-muted)',
                      fontStyle: 'italic'
                    }}>
                      ⚠️ Este ticket no tiene número de teléfono. Al usar WhatsApp te pedirá ingresarlo manualmente.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}