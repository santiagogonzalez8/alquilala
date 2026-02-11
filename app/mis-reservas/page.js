'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import BackButton from '@/components/BackButton';

export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarReservas = async () => {
      if (!auth.currentUser) {
        alert('Debes iniciar sesión');
        window.location.href = '/login';
        return;
      }

      try {
        const q = query(
          collection(db, 'reservas'),
          where('userId', '==', auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const reservasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setReservas(reservasData);
      } catch (error) {
        console.error('Error al cargar reservas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarReservas();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      <BackButton />
      
      <div className="max-w-4xl mx-auto pt-20">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">📅</span>
            <h1 className="text-3xl font-bold text-gray-800">Mis Reservas</h1>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Cargando reservas...</p>
          ) : reservas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No tienes reservas aún</p>
              <button
                onClick={() => window.location.href = '/buscar'}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Buscar propiedades
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reservas.map(reserva => (
                <div key={reserva.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-bold text-lg">{reserva.propiedad}</h3>
                  <p className="text-gray-600">Fecha: {reserva.fecha}</p>
                  <p className="text-gray-600">Estado: {reserva.estado}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}