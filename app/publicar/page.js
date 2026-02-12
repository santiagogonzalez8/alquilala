'use client';
import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';

export default function PublicarPropiedad() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: '',
    ubicacion: '',
    precioPorNoche: '',
    descripcion: '',
    huespedes: '',
    dormitorios: '',
    camas: '',
    banos: '',
    tipoPropiedad: 'Casa',
    amenities: []
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const amenitiesDisponibles = [
    'Piscina', 'Vista a la playa', 'WiFi', 'Aire acondicionado', 
    'Parrillero', 'Estacionamiento', 'Cocina equipada', 'TV', 
    'Jardín', 'Terraza', 'Lavadora', 'Secadora'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      alert('Debes iniciar sesión para publicar');
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const propiedadData = {
        ...formData,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        fechaPublicacion: new Date().toISOString(),
        estado: 'disponible',
        temporada: 'verano'
      };

      await addDoc(collection(db, 'propiedades'), propiedadData);
      
      setShowSuccess(true);
      
      setTimeout(() => {
        router.push('/mis-propiedades');
      }, 2000);
      
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error al publicar: ${error.message}`);
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

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className={styles.home}>
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000,
          fontWeight: 'bold',
          animation: 'slideIn 0.3s ease'
        }}>
          ✅ Tu propiedad se ha publicado correctamente
        </div>
      )}

      <div className={styles.heroSection}>
        <div className={styles.heroImage}></div>
        <div className={styles.heroContent}>
          <div className={styles.searchContainer}>
            <h1 style={{fontSize: '2.5rem', color: 'white', marginBottom: '1rem'}}>Publicar Propiedad</h1>
            <p className={styles.subtitle}>Alquila tu casa para las vacaciones</p>
          </div>
        </div>
      </div>

      <div className={styles.content} style={{maxWidth: '800px', margin: '0 auto', padding: '2rem'}}>
        <form onSubmit={handleSubmit} style={{background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
          
          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Título del anuncio *</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ej: Casa en Punta Negra con piscina y vista al mar"
              style={{width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem'}}
            />
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Ubicación *</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              required
              placeholder="Ej: Punta Negra, Maldonado"
              style={{width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem'}}
            />
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Tipo de propiedad *</label>
            <select
              name="tipoPropiedad"
              value={formData.tipoPropiedad}
              onChange={handleChange}
              required
              style={{width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem'}}
            >
              <option value="Casa">Casa</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Cabaña">Cabaña</option>
              <option value="Chalet">Chalet</option>
            </select>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
            <div>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Precio por noche (USD) *</label>
              <input
                type="number"
                name="precioPorNoche"
                value={formData.precioPorNoche}
                onChange={handleChange}
                required
                min="1"
                placeholder="250"
                style={{width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem'}}
              />
            </div>

            <div>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Huéspedes *</label>
              <input
                type="number"
                name="huespedes"
                value={formData.huespedes}
                onChange={handleChange}
                required
                min="1"
                placeholder="6"
                style={{width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem'}}
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem'}}>
            <div>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Dormitorios *</label>
              <input
                type="number"
                name="dormitorios"
                value={formData.dormitorios}
                onChange={handleChange}
                required
                min="1"
                placeholder="3"
                style={{width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem'}}
              />
            </div>

            <div>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Camas *</label>
              <input
                type="number"
                name="camas"
                value={formData.camas}
                onChange={handleChange}
                required
                min="1"
                placeholder="4"
                style={{width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem'}}
              />
            </div>

            <div>
              <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Baños *</label>
              <input
                type="number"
                name="banos"
                value={formData.banos}
                onChange={handleChange}
                required
                min="1"
                placeholder="2"
                style={{width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem'}}
              />
            </div>
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Amenidades</label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem'}}>
              {amenitiesDisponibles.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: formData.amenities.includes(amenity) ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    background: formData.amenities.includes(amenity) ? '#3b82f6' : 'white',
                    color: formData.amenities.includes(amenity) ? 'white' : '#1e3a5f',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          <div style={{marginBottom: '1.5rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1e3a5f'}}>Descripción *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Describe tu propiedad: ubicación exacta, características especiales, que incluye, reglas de la casa..."
              style={{width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit'}}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#9ca3af' : '#1e3a5f',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#0f2942';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = '#1e3a5f';
            }}
          >
            {loading ? 'Publicando...' : 'Publicar Propiedad'}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}