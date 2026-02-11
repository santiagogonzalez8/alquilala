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
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: '📅',
      title: 'Mis Reservas',
      description: 'Ver tus reservas activas',
      link: '/mis-reservas',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '🔍',
      title: 'Buscar Propiedades',
      description: 'Encuentra tu próximo hogar',
      link: '/buscar',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '➕',
      title: 'Publicar Propiedad',
      description: 'Publica tu casa de verano',
      link: '/publicar',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: '❓',
      title: 'Ayuda',
      description: 'Preguntas frecuentes',
      link: '/ayuda',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: '💬',
      title: 'Contactar Soporte',
      description: 'Habla con nuestro equipo',
      link: '/soporte',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      {/* Logo fijo arriba */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg">
        <span className="text-3xl">🏠</span>
        <span className="text-2xl font-bold text-gray-800">Alquilala</span>
      </div>

      <div className="max-w-4xl mx-auto pt-24">
        {/* Bienvenida */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                ¡Bienvenido, {user?.displayName || user?.email}! 👋
              </h1>
              <p className="text-gray-600">
                ¿Qué te gustaría hacer hoy?
              </p>
            </div>
            {esAdmin && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                👑 ADMINISTRADOR
              </div>
            )}
          </div>
        </div>

        {/* Botón de Panel de Admin (solo si es admin) */}
        {esAdmin && (
          <button
            onClick={() => router.push('/admin')}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-xl p-6 hover:scale-105 transition-transform duration-200 mb-8"
          >
            <div className="flex items-center justify-center gap-4">
              <span className="text-5xl">👑</span>
              <div className="text-left">
                <h2 className="text-3xl font-bold mb-2">Panel de Administración</h2>
                <p className="text-white/90 text-lg">Gestionar propiedades, reservas y usuarios</p>
              </div>
            </div>
          </button>
        )}

        {/* Grid de opciones del menú */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.link)}
              className={`bg-gradient-to-r ${item.color} text-white rounded-lg shadow-lg p-6 hover:scale-105 transition-transform duration-200 text-left`}
            >
              <div className="flex items-start gap-4">
                <span className="text-5xl">{item.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                  <p className="text-white/90">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Botón de cerrar sesión */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
          >
            <span className="text-2xl">🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}