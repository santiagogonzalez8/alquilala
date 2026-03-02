'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ReservaConfirmada() {
  const searchParams = useSearchParams();
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalRef = searchParams.get('external_reference');

    if (externalRef) {
      try {
        const ref = JSON.parse(decodeURIComponent(externalRef));
        setDatos({ ...ref, paymentId, status });
      } catch {
        setDatos({ paymentId, status });
      }
    }

    // Trackear conversión en Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: paymentId,
        value: datos?.total || 0,
        currency: 'USD',
      });
    }
  }, [searchParams]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-warm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      paddingTop: 'calc(var(--navbar-height) + 2rem)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '3rem 2.5rem',
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ color: 'var(--color-primary)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          ¡Reserva confirmada!
        </h1>
        <p style={{ color: 'var(--color-text-light)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Tu pago fue procesado exitosamente. Te enviamos los detalles por email.
        </p>

        {datos && (
          <div style={{
            background: 'var(--color-bg-warm)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left',
          }}>
            {datos.paymentId && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>N° de pago</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>#{datos.paymentId}</span>
              </div>
            )}
            {datos.fechaInicio && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Check-in</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{datos.fechaInicio}</span>
              </div>
            )}
            {datos.fechaFin && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Check-out</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{datos.fechaFin}</span>
              </div>
            )}
            {datos.noches && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Noches</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{datos.noches}</span>
              </div>
            )}
            {datos.total && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-light)' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Total pagado</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '1.1rem' }}>${datos.total} USD</span>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href="/mis-reservas" style={{
            display: 'block',
            background: 'var(--color-primary)',
            color: 'white',
            padding: '0.875rem',
            borderRadius: '8px',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '0.95rem',
          }}>
            Ver mis reservas →
          </Link>
          <Link href="/" style={{
            display: 'block',
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
            fontSize: '0.9rem',
          }}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}