'use client';
import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import BackButton from '@/components/BackButton';

export default function Soporte() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'tickets-soporte'), {
        ...formData,
        userId: auth.currentUser?.uid || 'anonimo',
        fecha: new Date().toISOString(),
        estado: 'pendiente'
      });

      setEnviado(true);
      setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
      
      setTimeout(() => {
        setEnviado(false);
      }, 5000);
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Error al enviar el mensaje. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      <BackButton />
      
      <div className="max-w-2xl mx-auto pt-20">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">💬</span>
            <h1 className="text-3xl font-bold text-gray-800">Contactar Soporte</h1>
          </div>

          {enviado && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✅ Mensaje enviado exitosamente. Te responderemos pronto.
            </div>
          )}

          <p className="text-gray-600 mb-6">
            ¿Tienes algún problema o consulta? Completa el formulario y nuestro equipo te responderá a la brevedad.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nombre completo</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Asunto</label>
              <select
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un asunto</option>
                <option value="problema-reserva">Problema con reserva</option>
                <option value="problema-pago">Problema con pago</option>
                <option value="problema-propiedad">Problema con propiedad publicada</option>
                <option value="consulta-general">Consulta general</option>
                <option value="reporte-bug">Reportar un error</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Mensaje</label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                required
                rows="6"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe tu consulta o problema..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold mb-2">Otras formas de contacto:</h3>
            <p className="text-gray-600">📧 Email: soporte@alquilala.com</p>
            <p className="text-gray-600">📱 WhatsApp: +598 99 123 456</p>
            <p className="text-gray-600">⏰ Horario: Lunes a Viernes 9:00 - 18:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}