'use client';

import { useState } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './publicar.module.css';

function PublicarContenido() {
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
  const [draggedIndex, setDraggedIndex] = useState(null);

  const amenitiesDisponibles = [
    'Piscina', 'Vista a la playa', 'WiFi', 'Aire acondicionado',
    'Parrillero', 'Estacionamiento', 'Cocina equipada', 'TV',
    'Jardín', 'Terraza', 'Lavadora', 'Secadora'
  ];

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
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

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const newFotos = [...fotos];
    const draggedItem = newFotos[draggedIndex];
    newFotos.splice(draggedIndex, 1);
    newFotos.splice(dropIndex, 0, draggedItem);
    setFotos(newFotos);
    setDraggedIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      router.push('/login');
      return;
    }
    if (fotos.length === 0) {
      alert('Debés agregar al menos una foto');
      return;
    }
    setLoading(true);
    try {
      const fotosURLs = [];
      for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i];
        const fileName = `propiedades/${auth.currentUser.uid}/${Date.now()}_${i}.jpg`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, foto.file);
        const url = await getDownloadURL(storageRef);
        fotosURLs.push(url);
      }

      await addDoc(collection(db, 'propiedades'), {
        ...formData,
        imagenes: fotosURLs,
        fotoPrincipal: fotosURLs[0],
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        fechaPublicacion: new Date().toISOString(),
        estado: 'pendiente',
        temporada: 'verano'
      });

      setShowSuccess(true);
      setTimeout(() => router.push('/mis-propiedades'), 2000);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al publicar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className={styles.page}>
      {showSuccess && (
        <div className={styles.toast}>
          ✅ Tu propiedad fue enviada para revisión. ¡Te avisaremos cuando esté publicada!
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className="section-label">Nuevo</span>
          <h1 className={styles.headerTitle}>Publicá tu propiedad</h1>
          <p className={styles.headerSubtitle}>
            Completá los datos y nosotros nos encargamos de publicarla en Airbnb, Booking y MercadoLibre.
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.formCard}>

          {/* Fotos */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📷 Fotos de la propiedad</h2>
            <p className={styles.sectionHint}>
              La primera foto será la portada. Arrastrá para reordenar.
            </p>

            {fotos.length > 0 && (
              <div className={styles.photosGrid}>
                {fotos.map((foto, index) => (
                  <div
                    key={foto.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={styles.photoItem}
                    style={{ opacity: draggedIndex === index ? 0.5 : 1 }}
                  >
                    <img src={foto.preview} alt={`Foto ${index + 1}`} />
                    {index === 0 && <div className={styles.photoBadge}>PORTADA</div>}
                    <div className={styles.photoNumber}>{index + 1}</div>
                    <button
                      type="button"
                      onClick={() => eliminarFoto(foto.id)}
                      className={styles.photoDelete}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className={styles.uploadArea}>
              {uploadingPhotos
                ? '📤 Procesando...'
                : fotos.length === 0
                  ? '📷 Hacé clic para agregar fotos'
                  : `📷 Agregar más fotos (${fotos.length} agregadas)`
              }
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Datos básicos */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🏠 Datos de la propiedad</h2>

            <div className={styles.formGroup}>
              <label>Título del anuncio *</label>
              <input
                type="text" name="titulo" value={formData.titulo}
                onChange={handleChange} required
                placeholder="Ej: Casa en Punta Negra con piscina y vista al mar"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Ubicación *</label>
              <input
                type="text" name="ubicacion" value={formData.ubicacion}
                onChange={handleChange} required
                placeholder="Ej: Punta Negra, Maldonado"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tipo de propiedad *</label>
              <select name="tipoPropiedad" value={formData.tipoPropiedad} onChange={handleChange}>
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Cabaña">Cabaña</option>
                <option value="Chalet">Chalet</option>
              </select>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Precio/noche (USD) *</label>
                <input type="number" name="precioPorNoche" value={formData.precioPorNoche} onChange={handleChange} required min="1" placeholder="250" />
              </div>
              <div className={styles.formGroup}>
                <label>Huéspedes *</label>
                <input type="number" name="huespedes" value={formData.huespedes} onChange={handleChange} required min="1" placeholder="6" />
              </div>
            </div>

            <div className={styles.formRow3}>
              <div className={styles.formGroup}>
                <label>Dormitorios *</label>
                <input type="number" name="dormitorios" value={formData.dormitorios} onChange={handleChange} required min="1" placeholder="3" />
              </div>
              <div className={styles.formGroup}>
                <label>Camas *</label>
                <input type="number" name="camas" value={formData.camas} onChange={handleChange} required min="1" placeholder="4" />
              </div>
              <div className={styles.formGroup}>
                <label>Baños *</label>
                <input type="number" name="banos" value={formData.banos} onChange={handleChange} required min="1" placeholder="2" />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>✨ Amenidades</h2>
            <div className={styles.amenitiesGrid}>
              {amenitiesDisponibles.map(amenity => (
                <button
                  key={amenity} type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`${styles.amenityBtn} ${formData.amenities.includes(amenity) ? styles.amenityActive : ''}`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📝 Descripción</h2>
            <div className={styles.formGroup}>
              <textarea
                name="descripcion" value={formData.descripcion}
                onChange={handleChange} required rows="5"
                placeholder="Describí tu propiedad: ubicación exacta, características especiales, qué incluye, reglas de la casa..."
              />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading || uploadingPhotos} className={styles.btnSubmit}>
            {loading ? 'Publicando...' : uploadingPhotos ? 'Procesando fotos...' : 'Enviar para revisión'}
          </button>

          {fotos.length === 0 && (
            <p className={styles.photoWarning}>* Debés agregar al menos una foto para publicar</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function PublicarPropiedad() {
  return (
    <ProtectedRoute>
      <PublicarContenido />
    </ProtectedRoute>
  );
}