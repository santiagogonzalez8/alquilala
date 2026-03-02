'use client';

import Link from 'next/link';

export default function ReservaPendiente() {
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
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
        <h1 style={{ color: 'var(--color-primary)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Pago en proceso
        </h1>
        <p style={{ color: 'var(--color-text-light)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          Tu pago está siendo procesado. Te notificaremos por email cuando se confirme. Esto puede tardar hasta 24hs dependiendo del método de pago.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href="/mis-reservas" style={{
            display: 'block',
            background: 'var(--color-primary)',
            color: 'white',
            padding: '0.875rem',
            borderRadius: '8px',
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Ver mis reservas
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