'use client';
import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import BackButton from '@/components/BackButton';

export default function PublicarPropiedad() {
  const [formData, setFormData] = useState({
    titulo: '',
    ubicacion: '',
    precio: '',
    descripcion: '',
    habitaciones: '',
    banos: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      alert('Debes iniciar sesión para publicar');
      window.location.href = '/login';
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'propiedades'), {
        ...formData,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        fechaPublicacion: new Date().toISOString(),
        estado: 'activa'
      });

      alert('¡Propiedad publicada exitosamente!');
      setFormData({
        titulo: '',
        ubicacion: '',
        precio: '',
        descripcion: '',
        habitaciones: '',
        banos: ''
      });
    } catch (error) {
      console.error('Error al publicar:', error);
      alert('Error al publicar la propiedad');
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
            <span className="text-4xl">➕</span>
            <h1 className="text-3xl font-bold text-gray-800">Publicar Propiedad</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Título</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Apartamento céntrico 2 dormitorios"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Ubicación</label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Montevideo, Centro"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Precio (USD/mes)</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Habitaciones</label>
                <input
                  type="number"
                  name="habitaciones"
                  value={formData.habitaciones}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Baños</label>
              <input
                type="number"
                name="banos"
                value={formData.banos}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe tu propiedad..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Publicando...' : 'Publicar Propiedad'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}