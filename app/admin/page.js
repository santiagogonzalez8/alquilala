'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/adminConfig';
import BackButton from '@/components/BackButton';

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
      // Cargar propiedades
      const propSnapshot = await getDocs(collection(db, 'propiedades'));
      const propData = propSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPropiedades(propData);

      // Cargar reservas
      const resSnapshot = await getDocs(collection(db, 'reservas'));
      const resData = resSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservas(resData);

      // Cargar tickets
      const ticketSnapshot = await getDocs(collection(db, 'tickets-soporte'));
      const ticketData = ticketSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(ticketData);
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
      alert('Propiedad eliminada');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar');
    }
  };

  const cambiarEstadoPropiedad = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, 'propiedades', id), {
        estado: nuevoEstado
      });
      alert('Estado actualizado');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar');
    }
  };

  const eliminarReserva = async (id) => {
    if (!confirm('¿Eliminar esta reserva?')) return;

    try {
      await deleteDoc(doc(db, 'reservas', id));
      alert('Reserva eliminada');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar');
    }
  };

  const cambiarEstadoTicket = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, 'tickets-soporte', id), {
        estado: nuevoEstado
      });
      alert('Ticket actualizado');
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
        <div className="text-white text-2xl">Cargando panel de admin...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 p-6">
      <BackButton />
      
      <div className="max-w-7xl mx-auto pt-20">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-5xl">👑</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
                <p className="text-gray-600">Gestiona toda la plataforma desde aquí</p>
              </div>
            </div>
            <button
              onClick={cargarDatos}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🏠</span>
              <div>
                <p className="text-gray-600">Propiedades</p>
                <p className="text-3xl font-bold text-gray-800">{propiedades.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📅</span>
              <div>
                <p className="text-gray-600">Reservas</p>
                <p className="text-3xl font-bold text-gray-800">{reservas.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl">💬</span>
              <div>
                <p className="text-gray-600">Tickets Soporte</p>
                <p className="text-3xl font-bold text-gray-800">{tickets.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setVistaActual('propiedades')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                vistaActual === 'propiedades'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏠 Propiedades ({propiedades.length})
            </button>
            <button
              onClick={() => setVistaActual('reservas')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                vistaActual === 'reservas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📅 Reservas ({reservas.length})
            </button>
            <button
              onClick={() => setVistaActual('tickets')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                vistaActual === 'tickets'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              💬 Soporte ({tickets.length})
            </button>
          </div>

          <div className="p-6">
            {/* Vista de Propiedades */}
            {vistaActual === 'propiedades' && (
              <div className="space-y-4">
                {propiedades.length === 0 ? (
                  <p className="text-center text-gray-600 py-12">No hay propiedades publicadas aún</p>
                ) : (
                  propiedades.map(prop => (
                    <div key={prop.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-2">{prop.titulo}</h3>
                          <p className="text-gray-600 mb-1">📍 {prop.ubicacion}</p>
                          <p className="text-gray-600 mb-1">💰 ${prop.precioPorNoche}/noche</p>
                          <p className="text-gray-600 mb-1">👥 {prop.huespedes} huéspedes • 🛏️ {prop.dormitorios} dorm.</p>
                          <p className="text-sm text-gray-500 mb-2">👤 Publicado por: {prop.userEmail}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            prop.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                            prop.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {prop.estado || 'disponible'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <select
                            value={prop.estado || 'disponible'}
                            onChange={(e) => cambiarEstadoPropiedad(prop.id, e.target.value)}
                            className="border rounded px-3 py-1 text-sm"
                          >
                            <option value="disponible">Disponible</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="rechazada">Rechazada</option>
                            <option value="pausada">Pausada</option>
                          </select>
                          <button
                            onClick={() => eliminarPropiedad(prop.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Vista de Reservas */}
            {vistaActual === 'reservas' && (
              <div className="space-y-4">
                {reservas.length === 0 ? (
                  <p className="text-center text-gray-600 py-12">No hay reservas aún</p>
                ) : (
                  reservas.map(reserva => (
                    <div key={reserva.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg mb-2">{reserva.propiedad}</h3>
                          <p className="text-gray-600">👤 Huésped: {reserva.nombreHuesped || reserva.userEmail}</p>
                          <p className="text-gray-600">📧 {reserva.userEmail}</p>
                          <p className="text-gray-600">📅 Check-in: {reserva.fechaCheckIn}</p>
                          <p className="text-gray-600">📅 Check-out: {reserva.fechaCheckOut}</p>
                          <p className="text-gray-600">💰 Total: ${reserva.precioTotal}</p>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                            reserva.estado === 'confirmada' ? 'bg-green-100 text-green-800' :
                            reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {reserva.estado}
                          </span>
                        </div>
                        <button
                          onClick={() => eliminarReserva(reserva.id)}
                          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Vista de Tickets */}
            {vistaActual === 'tickets' && (
              <div className="space-y-4">
                {tickets.length === 0 ? (
                  <p className="text-center text-gray-600 py-12">No hay tickets de soporte</p>
                ) : (
                  tickets.map(ticket => (
                    <div key={ticket.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{ticket.nombre}</h3>
                          <p className="text-gray-600">📧 {ticket.email}</p>
                          <p className="text-gray-600">📋 Asunto: {ticket.asunto}</p>
                          <p className="text-gray-700 mt-2 bg-gray-50 p-3 rounded">{ticket.mensaje}</p>
                          <p className="text-sm text-gray-500 mt-2">📅 {ticket.fecha}</p>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                            ticket.estado === 'resuelto' ? 'bg-green-100 text-green-800' :
                            ticket.estado === 'en-proceso' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ticket.estado}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <select
                            value={ticket.estado}
                            onChange={(e) => cambiarEstadoTicket(ticket.id, e.target.value)}
                            className="border rounded px-3 py-1 text-sm"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="en-proceso">En proceso</option>
                            <option value="resuelto">Resuelto</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}