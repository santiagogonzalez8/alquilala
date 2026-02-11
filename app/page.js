'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/adminConfig';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEsAdmin(isAdmin(currentUser.email));
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    if (confirm('¿Estás seguro que quieres cerrar sesión?')) {
      try {
        await signOut(auth);
        router.push('/login');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
      }
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px'
      }}>
        Cargando...
      </div>
    );
  }

  const menuItems = [
    {
      icon: '📅',
      title: 'Mis Reservas',
      description: 'Ver tus reservas activas',
      link: '/mis-reservas',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '🔍',
      title: 'Buscar Propiedades',
      description: 'Encuentra tu próximo hogar',
      link: '/buscar',
      color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
      icon: '➕',
      title: 'Publicar Propiedad',
      description: 'Publica tu casa de verano',
      link: '/publicar',
      color: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'
    },
    {
      icon: '❓',
      title: 'Ayuda',
      description: 'Preguntas frecuentes',
      link: '/ayuda',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '💬',
      title: 'Contactar Soporte',
      description: 'Habla con nuestro equipo',
      link: '/soporte',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px'
    }}>
      {/* Logo fijo */}
      <div style={{
        position: 'fixed',
        top: '24px',
        left: '24px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <span style={{ fontSize: '30px' }}>🏠</span>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>Alquilala</span>
      </div>

      <div style={{ maxWidth: '1024px', margin: '0 auto', paddingTop: '96px' }}>
        {/* Bienvenida */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                ¡Bienvenido, {user?.displayName || user?.email?.split('@')[0]}! 👋
              </h1>
              <p style={{ color: '#6b7280' }}>
                ¿Qué te gustaría hacer hoy?
              </p>
            </div>
            {esAdmin && (
              <div style={{
                background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                👑 ADMINISTRADOR
              </div>
            )}
          </div>
        </div>

        {/* Botón Admin */}
        {esAdmin && (
          <button
            onClick={() => router.push('/admin')}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
              color: 'white',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '24px',
              marginBottom: '32px',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <span style={{ fontSize: '48px' }}>👑</span>
              <div style={{ textAlign: 'left' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Panel de Administración</h2>
                <p style={{ opacity: 0.9, fontSize: '18px' }}>Gestionar propiedades, reservas y usuarios</p>
              </div>
            </div>
          </button>
        )}

        {/* Grid de menú */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.link)}
              style={{
                background: item.color,
                color: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '24px',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <span style={{ fontSize: '48px' }}>{item.icon}</span>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{item.title}</h2>
                  <p style={{ opacity: 0.9 }}>{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Cerrar sesión */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: '#ef4444',
              color: 'white',
              fontWeight: '600',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
          >
            <span style={{ fontSize: '24px' }}>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}