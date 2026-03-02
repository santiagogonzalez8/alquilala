'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ReservaError() {
  const searchParams = useSearchParams();
  const propiedadId = searchParams.get('propiedadId');

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
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😕</div>
        <h1 style={{ color: 'var(--color-primary)', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          El pago no se completó
        </h1>
        <p style={{ color: 'var(--color-text-light)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
          No se realizó ningún cobro. Podés intentarlo de nuevo o contactarnos si necesitás ayuda.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {propiedadId && (
            <Link href={`/propiedades/${propiedadId}`} style={{
              display: 'block',
              background: 'var(--color-primary)',
              color: 'white',
              padding: '0.875rem',
              borderRadius: '8px',
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              Intentar de nuevo →
            </Link>
          )}
          <a
            href="https://wa.me/59895532294?text=Hola!%20Tuve%20un%20problema%20al%20pagar%20una%20reserva"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              background: '#25D366',
              color: 'white',
              padding: '0.875rem',
              borderRadius: '8px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            💬 Contactar soporte
          </a>
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