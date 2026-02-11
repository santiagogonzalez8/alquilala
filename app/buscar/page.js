'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import BackButton from '@/components/BackButton';

export default function BuscarPropiedades() {
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarPropiedades = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'propiedades'));
        const propiedadesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPropiedades(propiedadesData);
      } catch (error) {
        console.error('Error al cargar propiedades:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarPropiedades();
  }, []);

  const propiedadesFiltradas = propiedades.filter(prop =>
    prop.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    prop.ubicacion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      <BackButton />
      
      <div className="max-w-6xl mx-auto pt-20">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🔍</span>
            <h1 className="text-3xl font-bold text-gray-800">Buscar Propiedades</h1>
          </div>

          <input
            type="text"
            placeholder="Buscar por ubicación o título..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {loading ? (
            <p className="text-center text-gray-600">Cargando propiedades...</p>
          ) : propiedadesFiltradas.length === 0 ? (
            <p className="text-center text-gray-600 py-12">No se encontraron propiedades</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propiedadesFiltradas.map(prop => (
                <div key={prop.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                  <img 
                    src={prop.imagen || '/placeholder.jpg'} 
                    alt={prop.titulo}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{prop.titulo}</h3>
                    <p className="text-gray-600 mb-2">📍 {prop.ubicacion}</p>
                    <p className="text-blue-600 font-bold">${prop.precio}/mes</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}