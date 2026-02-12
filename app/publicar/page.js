'use client';
import { useState } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const amenitiesDisponibles = [
    'Piscina', 'Vista a la playa', 'WiFi', 'Aire acondicionado', 
    'Parrillero', 'Estacionamiento', 'Cocina equipada', 'TV', 
    'Jardín', 'Terraza', 'Lavadora', 'Secadora'
  ];

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + fotos.length > 10) {
      alert('Máximo 10 fotos por propiedad');
      return;
    }

    setUploadingPhotos(true);

    const nuevasFotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36)
    }));

    setFotos(prev => [...prev, ...nuevasFotos]);
    setUploadingPhotos(false);
  };

  const eliminarFoto = (id) => {
    setFotos(prev => prev.filter(foto => foto.id !== id));
  };

  const moverFoto = (index, direction) => {
    const newFotos = [...fotos];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= fotos.length) return;
    
    [newFotos[index], newFotos[newIndex]] = [newFotos[newIndex], newFotos[index]];
    setFotos(newFotos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      alert('Debes iniciar sesión para publicar');
      router.push('/login');
      return;
    }

    if (fotos.length === 0) {
      alert('Debes agregar al menos una foto');
      return;
    }

    setLoading(true);

    try {
      // Subir fotos a Firebase Storage
      const fotosURLs = [];
      
      for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i];
        const fileName = `propiedades/${auth.currentUser.uid}/${Date.now()}_${i}.jpg`;
        const storageRef = ref(storage, fileName);
        
        await uploadBytes(storageRef, foto.file);
        const url = await getDownloadURL(storageRef);
        fotosURLs.push(url);
      }

      // Guardar propiedad con URLs de fotos
      const propiedadData = {
        ...formData,
        fotos: fotosURLs,
        fotoPrincipal: fotosURLs[0],
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

      <div className={styles.content} style={{maxWidth: '900px', margin: '0 auto', padding: '2rem'}}>
        <form onSubmit={handleSubmit} style={{background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}}>
          
          {/* Sección de fotos */}
          <div style={{marginBottom: '2rem'}}>
            <label style={{display: 'block', fontWeight: 'bold', marginBottom: '0.75rem', color: '#1e3a5f', fontSize: '1.125rem'}}>
              Fotos de la propiedad *
            </label>
            <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem'}}>
              Agrega hasta 10 fotos. La primera será la foto de portada.
            </p>

            {/* Grid de fotos */}
            {fotos.length > 0 && (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
                {fotos.map((foto, index) => (
                  <div key={foto.id} style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid #e5e7eb',
                    background: '#f3f4f6'
                  }}>
                    <img 
                      src={foto.preview} 
                      alt={`Foto ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    
                    {/* Badge de portada */}
                    {index === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: '#1e3a5f',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        PORTADA
                      </div>
                    )}

                    {/* Botón eliminar */}
                    <button
                      type="button"
                      onClick={() => eliminarFoto(foto.id)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(239, 68, 68, 0.95)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      ×
                    </button>

                    {/* Botones de orden */}
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      display: 'flex',
                      gap: '4px'
                    }}>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moverFoto(index, 'left')}
                          style={{
                            background: 'rgba(30, 58, 95, 0.95)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          ←
                        </button>
                      )}
                      {index < fotos.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moverFoto(index, 'right')}
                          style={{
                            background: 'rgba(30, 58, 95, 0.95)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botón agregar fotos */}
            <label style={{
              display: 'block',
              width: '100%',
              padding: '2rem',
              border: '2px dashed #3b82f6',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#f0f9ff',
              transition: 'all 0.2s',
              fontWeight: '600',
              color: '#1e3a5f'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#dbeafe';
              e.target.style.borderColor = '#1e3a5f';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#f0f9ff';
              e.target.style.borderColor = '#3b82f6';
            }}>
              {uploadingPhotos ? '📤 Subiendo fotos...' : fotos.length === 0 ? '📷 Haz clic para agregar fotos' : `📷 Agregar más fotos (${fotos.length}/10)`}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                style={{display: 'none'}}
                disabled={fotos.length >= 10}
              />
            </label>
          </div>

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
                    fontWeight: '500',
                    transition: 'all 0.2s'
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
            disabled={loading || uploadingPhotos}
            style={{
              width: '100%',
              background: (loading || uploadingPhotos) ? '#9ca3af' : '#1e3a5f',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              cursor: (loading || uploadingPhotos) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading && !uploadingPhotos) e.target.style.background = '#0f2942';
            }}
            onMouseLeave={(e) => {
              if (!loading && !uploadingPhotos) e.target.style.background = '#1e3a5f';
            }}
          >
            {loading ? 'Publicando...' : uploadingPhotos ? 'Procesando fotos...' : 'Publicar Propiedad'}
          </button>

          {fotos.length === 0 && (
            <p style={{textAlign: 'center', color: '#ef4444', marginTop: '0.5rem', fontSize: '0.875rem'}}>
              * Debes agregar al menos una foto para publicar
            </p>
          )}
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