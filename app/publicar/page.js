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
  const [progreso, setProgreso] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const amenitiesDisponibles = [
    'Piscina', 'Vista a la playa', 'WiFi', 'Aire acondicionado',
    'Parrillero', 'Estacionamiento', 'Cocina equipada', 'TV',
    'Jardín', 'Terraza', 'Lavadora', 'Secadora'
  ];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const nuevasFotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36)
    }));
    setFotos(prev => [...prev, ...nuevasFotos]);
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
    setErrorMsg('');

    if (!auth.currentUser) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      let fotosURLs = [];

      // Si hay fotos, subirlas
      if (fotos.length > 0) {
        setProgreso('Subiendo fotos...');
        for (let i = 0; i < fotos.length; i++) {
          setProgreso(`Subiendo foto ${i + 1} de ${fotos.length}...`);
          try {
            const foto = fotos[i];
            const fileName = `propiedades/${auth.currentUser.uid}/${Date.now()}_${i}_${foto.file.name}`;
            const storageRef = ref(storage, fileName);
            await uploadBytes(storageRef, foto.file);
            const url = await getDownloadURL(storageRef);
            fotosURLs.push(url);
          } catch (uploadError) {
            console.error(`Error subiendo foto ${i + 1}:`, uploadError);
            // Si falla una foto, seguir con las demás
          }
        }
      }

      setProgreso('Guardando propiedad...');

      const propiedadData = {
        titulo: formData.titulo,
        ubicacion: formData.ubicacion,
        precioPorNoche: formData.precioPorNoche,
        descripcion: formData.descripcion,
        huespedes: formData.huespedes,
        dormitorios: formData.dormitorios,
        camas: formData.camas,
        banos: formData.banos,
        tipoPropiedad: formData.tipoPropiedad,
        amenities: formData.amenities,
        imagenes: fotosURLs,
        fotoPrincipal: fotosURLs[0] || '',
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        fechaPublicacion: new Date().toISOString(),
        estado: 'pendiente',
        temporada: 'verano'
      };

      await addDoc(collection(db, 'propiedades'), propiedadData);

      setProgreso('');
      setShowSuccess(true);

      setTimeout(() => {
        router.push('/mis-propiedades');
      }, 2500);

    } catch (error) {
      console.error('Error completo:', error);
      setErrorMsg(`Error al publicar: ${error.message}. Intentá de nuevo.`);
      setProgreso('');
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
          ✅ ¡Propiedad enviada para revisión! Te avisaremos cuando esté publicada.
        </div>
      )}

      {errorMsg && (
        <div className={styles.toast} style={{ background: 'var(--color-danger)' }}>
          ⚠️ {errorMsg}
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
              Opcional pero recomendado. La primera foto será la portada. Arrastrá para reordenar.
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
                    <button type="button" onClick={() => eliminarFoto(foto.id)} className={styles.photoDelete}>×</button>
                  </div>
                ))}
              </div>
            )}

            <label className={styles.uploadArea}>
              {fotos.length === 0 ? '📷 Hacé clic para agregar fotos' : `📷 Agregar más fotos (${fotos.length} agregadas)`}
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
                placeholder="Ej: Casa en Punta Negra para 6 personas con piscina y vista al mar"
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

          {/* Progreso */}
          {progreso && (
            <div style={{
              background: 'var(--color-bg-warm)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.95rem',
              color: 'var(--color-primary)',
              fontWeight: 600
            }}>
              <div className="loading-spinner" style={{ width: 24, height: 24, borderWidth: 2 }}></div>
              {progreso}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} className={styles.btnSubmit}>
            {loading ? progreso || 'Procesando...' : 'Enviar para revisión'}
          </button>
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