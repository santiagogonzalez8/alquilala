'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';

export default function MisPropiedades() {
  const router = useRouter();
  const [propiedades, setPropiedades] = useState([]);
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarMisPropiedades();
  }, []);

  useEffect(() => {
    // Filtrar propiedades cuando cambia la búsqueda
    if (busqueda.trim() === '') {
      setPropiedadesFiltradas(propiedades);
    } else {
      const filtradas = propiedades.filter(prop =>
        prop.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        prop.ubicacion?.toLowerCase().includes(busqueda.toLowerCase()) ||
        prop.tipoPropiedad?.toLowerCase().includes(busqueda.toLowerCase())
      );
      setPropiedadesFiltradas(filtradas);
    }
  }, [busqueda, propiedades]);

  const cargarMisPropiedades = async () => {
    if (!auth.currentUser) {
      alert('Debes iniciar sesión');
      router.push('/login');
      return;
    }

    try {
      const q = query(
        collection(db, 'propiedades'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const propiedadesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPropiedades(propiedadesData);
      setPropiedadesFiltradas(propiedadesData);
    } catch (error) {
      console.error('Error al cargar propiedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarPropiedad = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return;

    try {
      await deleteDoc(doc(db, 'propiedades', id));
      alert('Propiedad eliminada exitosamente');
      cargarMisPropiedades();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar la propiedad');
    }
  };

  return (
    <div className={styles.home}>
      <div className={styles.heroSection}>
        <div className={styles.heroImage}></div>
        <div className={styles.heroContent}>
          <div className={styles.searchContainer}>
            <h1 style={{fontSize: '2.5rem', color: 'white', marginBottom: '1rem'}}>🏠 Mis Propiedades</h1>
            <p className={styles.subtitle}>Propiedades que has publicado en la plataforma</p>
          </div>
        </div>
      </div>

      <div className={styles.content} style={{maxWidth: '1400px', margin: '0 auto', padding: '2rem'}}>
        {/* Barra de búsqueda */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{position: 'relative'}}>
            <input
              type="text"
              placeholder="🔍 Buscar en mis propiedades por título, ubicación o tipo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                fontSize: '1.125rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <span style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.5rem'
            }}>
              🔍
            </span>
          </div>
          
          {busqueda && (
            <p style={{marginTop: '0.75rem', color: '#6b7280', fontSize: '0.875rem'}}>
              {propiedadesFiltradas.length} {propiedadesFiltradas.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          )}
        </div>

        {loading ? (
          <p style={{textAlign: 'center', fontSize: '1.25rem', color: '#6b7280', padding: '3rem'}}>
            Cargando tus propiedades...
          </p>
        ) : propiedades.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🏖️</div>
            <h2 style={{fontSize: '1.5rem', color: '#1e3a5f', marginBottom: '1rem', fontWeight: 'bold'}}>
              No tienes propiedades publicadas aún
            </h2>
            <p style={{fontSize: '1.125rem', color: '#6b7280', marginBottom: '2rem'}}>
              ¡Comienza a ganar dinero alquilando tu casa de verano!
            </p>
            <button
              onClick={() => router.push('/publicar')}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1.125rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              ➕ Publicar mi primera propiedad
            </button>
          </div>
        ) : propiedadesFiltradas.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <p style={{fontSize: '1.25rem', color: '#6b7280'}}>
              No se encontraron propiedades con "{busqueda}"
            </p>
            <button
              onClick={() => setBusqueda('')}
              style={{
                marginTop: '1rem',
                color: '#3b82f6',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                textDecoration: 'underline'
              }}
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <>
            {/* Encabezado con contador */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              background: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{fontSize: '1.25rem', color: '#1e3a5f', fontWeight: 'bold'}}>
                {propiedadesFiltradas.length} {propiedadesFiltradas.length === 1 ? 'Propiedad' : 'Propiedades'}
              </h2>
              <button
                onClick={() => router.push('/publicar')}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                ➕ Nueva Propiedad
              </button>
            </div>

            {/* Grid de propiedades - 3 por fila */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem'
            }}>
              {propiedadesFiltradas.map(prop => (
                <div key={prop.id} style={{
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}>
                  {/* Imagen */}
                  <div style={{
                    width: '100%',
                    height: '220px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                    position: 'relative'
                  }}>
                    🏖️
                    <div style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      background: prop.estado === 'disponible' ? '#10b981' : '#ef4444',
                      color: 'white',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {prop.estado || 'Disponible'}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div style={{padding: '1.25rem'}}>
                    <div style={{marginBottom: '0.75rem'}}>
                      <span style={{
                        background: '#dbeafe',
                        color: '#1e40af',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {prop.tipoPropiedad || 'Casa'}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      color: '#1e3a5f',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {prop.titulo}
                    </h3>
                    
                    <p style={{
                      color: '#6b7280',
                      marginBottom: '0.75rem',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem'
                    }}>
                      <span>📍</span> {prop.ubicacion}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      marginBottom: '1rem',
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                        👥 {prop.huespedes}
                      </span>
                      <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                        🛏️ {prop.dormitorios}
                      </span>
                      <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                        🚿 {prop.banos}
                      </span>
                    </div>

                    {prop.amenities && prop.amenities.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.375rem',
                        marginBottom: '1rem'
                      }}>
                        {prop.amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.75rem',
                            background: '#f3f4f6',
                            color: '#374151',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            {amenity}
                          </span>
                        ))}
                        {prop.amenities.length > 3 && (
                          <span style={{
                            fontSize: '0.75rem',
                            background: '#f3f4f6',
                            color: '#374151',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px'
                          }}>
                            +{prop.amenities.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <p style={{
                        color: '#3b82f6',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                      }}>
                        ${prop.precioPorNoche}<span style={{fontSize: '0.875rem', fontWeight: 'normal'}}>/noche</span>
                      </p>
                      
                      <button
                        onClick={() => eliminarPropiedad(prop.id)}
                        style={{
                          background: '#fee2e2',
                          color: '#dc2626',
                          padding: '0.5rem 0.875rem',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                        onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}