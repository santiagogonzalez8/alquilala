'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { firestoreGetPublicById } from '@/lib/firebase';
import styles from './propiedad.module.css';

const AMENITY_ICONS = {
  'Piscina': '🏊', 'Piscina climatizada': '🏊', 'Jacuzzi': '🛁',
  'Vista al mar': '🌊', 'Vista a la playa': '🏖️', 'Frente al mar': '🌊',
  'Acceso a la playa': '🏖️', 'Vista panorámica': '🌅',
  'WiFi': '📶', 'WiFi de alta velocidad': '📶', 'Smart TV': '📺',
  'TV cable': '📺', 'Netflix': '🎬', 'Proyector': '🎥',
  'Consola de videojuegos': '🎮', 'Parlante Bluetooth': '🎵',
  'USB / carga inalámbrica': '🔌',
  'Aire acondicionado': '❄️', 'Calefacción central': '🔥',
  'Calefacción a leña': '🔥', 'Chimenea': '🔥',
  'Ventilador de techo': '🌀', 'Estufa eléctrica': '🔥',
  'Cocina equipada': '🍳', 'Cocina completa': '🍳',
  'Microondas': '📡', 'Lavavajillas': '🫧', 'Cafetera': '☕',
  'Nespresso': '☕', 'Heladera': '🧊', 'Freezer': '🧊',
  'Horno': '🫕', 'Tostadora': '🍞', 'Utensilios de cocina': '🥘',
  'Especias básicas': '🧂',
  'Jardín': '🌿', 'Terraza': '🏡', 'Balcón': '🏡', 'Patio': '🌳',
  'Deck': '🪵', 'Pérgola': '🌿', 'Parrillero': '🔥', 'BBQ': '🔥',
  'Fogón': '🔥', 'Ducha exterior': '🚿', 'Hamaca': '🌴',
  'Mesa de ping pong': '🏓', 'Reposeras': '🪑', 'Sombrilla': '⛱️',
  'Estacionamiento': '🚗', 'Estacionamiento privado': '🚗',
  'Garage': '🏠', 'Portero eléctrico': '🔔',
  'Check-in autónomo': '🔑', 'Acceso 24hs': '⏰',
  'Ropa de cama incluida': '🛏️', 'Toallas incluidas': '🛁',
  'Almohadas extra': '😴', 'Placard': '👔', 'Percheros': '🪝',
  'Caja fuerte': '🔒', 'Black-out (cortinas oscuras)': '🌑',
  'Lavarropas': '🫧', 'Secadora': '🌬️', 'Plancha': '👔',
  'Tendedero': '🧺', 'Lavandería compartida': '🫧',
  'Apto mascotas': '🐾', 'Cuna': '🛏️', 'Silla alta bebé': '👶',
  'Juguetes': '🧸', 'Piscina para niños': '🏊', 'Cercas de seguridad': '🔒',
  'Alarma': '🚨', 'Cámaras exteriores': '📷',
  'Detector de humo': '🚒', 'Extintor': '🧯',
  'Botiquín de primeros auxilios': '🏥', 'Detector de CO': '⚠️',
  'Escritorio': '💻', 'Lugar de trabajo': '💼', 'Gimnasio': '💪',
  'Sauna': '🧖', 'Bicicletas': '🚲', 'Tablas de surf': '🏄',
  'Accesible silla de ruedas': '♿', 'Baño adaptado': '♿',
  'Rampa de acceso': '♿', 'Sin escaleras': '♿',
  'default': '✓',
};

function getAmenityIcon(name) {
  return AMENITY_ICONS[name] || AMENITY_ICONS['default'];
}

// ── Componente Calendario público ──────────────────────────
function CalendarioDisponibilidad({ fechasOcupadas = [] }) {
  const hoy = new Date();
  const [mesActual, setMesActual] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1));

  const year = mesActual.getFullYear();
  const month = mesActual.getMonth();
  const diasEnMes = new Date(year, month + 1, 0).getDate();
  const primerDia = new Date(year, month, 1).getDay();

  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const diasSemana = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

  const esFechaOcupada = (dia) => {
    const fecha = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return fechasOcupadas.includes(fecha);
  };

  const esPasado = (dia) => {
    const fecha = new Date(year, month, dia);
    const hoyStart = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    return fecha < hoyStart;
  };

  const esHoy = (dia) =>
    hoy.getFullYear() === year && hoy.getMonth() === month && hoy.getDate() === dia;

  // No permitir navegar a meses anteriores al actual
  const puedeRetroceder = year > hoy.getFullYear() || month > hoy.getMonth();

  const mesAnterior = () => {
    if (!puedeRetroceder) return;
    setMesActual(new Date(year, month - 1, 1));
  };
  const mesSiguiente = () => setMesActual(new Date(year, month + 1, 1));

  const celdas = [];
  for (let i = 0; i < primerDia; i++) {
    celdas.push(<div key={`e-${i}`} className={styles.calCelda} />);
  }
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const ocupado = esFechaOcupada(dia);
    const pasado = esPasado(dia);
    const hoyDia = esHoy(dia);

    let clase = styles.calCelda;
    if (pasado) clase += ` ${styles.calPasado}`;
    else if (ocupado) clase += ` ${styles.calOcupado}`;
    else clase += ` ${styles.calDisponible}`;
    if (hoyDia) clase += ` ${styles.calHoy}`;

    celdas.push(
      <div key={dia} className={clase}>
        {dia}
        {!pasado && (
          <span className={styles.calDot}>
            {ocupado ? '●' : ''}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={styles.calendario}>
      {/* Navegación */}
      <div className={styles.calNav}>
        <button
          onClick={mesAnterior}
          className={styles.calNavBtn}
          disabled={!puedeRetroceder}
        >
          ‹
        </button>
        <h3 className={styles.calMes}>{meses[month]} {year}</h3>
        <button onClick={mesSiguiente} className={styles.calNavBtn}>›</button>
      </div>

      {/* Días de la semana */}
      <div className={styles.calGrid}>
        {diasSemana.map(d => (
          <div key={d} className={styles.calDiaSemana}>{d}</div>
        ))}
        {celdas}
      </div>

      {/* Leyenda */}
      <div className={styles.calLeyenda}>
        <div className={styles.calLeyendaItem}>
          <div className={`${styles.calLeyendaDot} ${styles.dotDisponible}`} />
          <span>Disponible</span>
        </div>
        <div className={styles.calLeyendaItem}>
          <div className={`${styles.calLeyendaDot} ${styles.dotOcupado}`} />
          <span>Ocupado</span>
        </div>
        <div className={styles.calLeyendaItem}>
          <div className={`${styles.calLeyendaDot} ${styles.dotPasado}`} />
          <span>Pasado</span>
        </div>
      </div>
    </div>
  );
}

// ── Página principal ────────────────────────────────────────
export default function PropiedadDetalle() {
  const { id } = useParams();
  const router = useRouter();
  const [propiedad, setPropiedad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fotoActiva, setFotoActiva] = useState(0);
  const [galeriaAbierta, setGaleriaAbierta] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await firestoreGetPublicById('propiedades', id);
        if (!data || data.estado === 'rechazada' || data.estado === 'pausada') {
          setError(true);
        } else {
          setPropiedad(data);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  useEffect(() => {
    if (!galeriaAbierta) return;
    const fotos = propiedad?.imagenes || [];
    const handleKey = (e) => {
      if (e.key === 'Escape') setGaleriaAbierta(false);
      if (e.key === 'ArrowRight') setFotoActiva(p => (p + 1) % fotos.length);
      if (e.key === 'ArrowLeft') setFotoActiva(p => (p - 1 + fotos.length) % fotos.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [galeriaAbierta, propiedad]);

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className="loading-spinner" />
        <p>Cargando propiedad...</p>
      </div>
    );
  }

  if (error || !propiedad) {
    return (
      <div className={styles.errorPage}>
        <div className={styles.errorIcon}>🏚️</div>
        <h1>Propiedad no disponible</h1>
        <p>Esta propiedad no existe o no está disponible en este momento.</p>
        <Link href="/#propiedades" className={styles.btnBack}>← Volver al inicio</Link>
      </div>
    );
  }

  const fotos = propiedad.imagenes?.length > 0
    ? propiedad.imagenes
    : propiedad.fotoPrincipal
    ? [propiedad.fotoPrincipal]
    : [];

  const tieneFotos = fotos.length > 0;
  const fechasOcupadas = propiedad.fechasOcupadas || [];

  return (
    <div className={styles.page}>

      {/* Lightbox */}
      {galeriaAbierta && tieneFotos && (
        <div className={styles.lightbox} onClick={() => setGaleriaAbierta(false)}>
          <button className={styles.lightboxClose} onClick={() => setGaleriaAbierta(false)}>✕</button>
          <button
            className={`${styles.lightboxArrow} ${styles.lightboxLeft}`}
            onClick={(e) => { e.stopPropagation(); setFotoActiva(p => (p - 1 + fotos.length) % fotos.length); }}
          >‹</button>
          <img
            src={fotos[fotoActiva]}
            alt={`Foto ${fotoActiva + 1}`}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className={`${styles.lightboxArrow} ${styles.lightboxRight}`}
            onClick={(e) => { e.stopPropagation(); setFotoActiva(p => (p + 1) % fotos.length); }}
          >›</button>
          <div className={styles.lightboxCounter}>{fotoActiva + 1} / {fotos.length}</div>
        </div>
      )}

      {/* Galería principal */}
      {tieneFotos ? (
        <div className={styles.galeria}>
          <div className={styles.galeriaMain} onClick={() => { setFotoActiva(0); setGaleriaAbierta(true); }}>
            <img src={fotos[0]} alt={propiedad.titulo} />
            {fotos.length > 1 && (
              <button
                className={styles.btnVerFotos}
                onClick={(e) => { e.stopPropagation(); setGaleriaAbierta(true); }}
              >
                📷 Ver {fotos.length} fotos
              </button>
            )}
          </div>
          {fotos.length > 1 && (
            <div className={styles.galeriaThumbs}>
              {fotos.slice(1, 5).map((url, i) => (
                <div
                  key={i}
                  className={`${styles.galeriaThumb} ${i === 3 && fotos.length > 5 ? styles.galeriaThumbMore : ''}`}
                  onClick={() => { setFotoActiva(i + 1); setGaleriaAbierta(true); }}
                >
                  <img src={url} alt={`Foto ${i + 2}`} />
                  {i === 3 && fotos.length > 5 && (
                    <div className={styles.moreOverlay}>+{fotos.length - 5}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.galeriaPlaceholder}>
          <span>🏠</span>
          <p>Sin fotos disponibles</p>
        </div>
      )}

      {/* Contenido */}
      <div className={styles.contenido}>
        <div className={styles.columnaIzq}>

          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/">Inicio</Link>
            <span>›</span>
            <Link href="/#propiedades">Propiedades</Link>
            <span>›</span>
            <span>{propiedad.titulo}</span>
          </nav>

          {/* Encabezado */}
          <div className={styles.encabezado}>
            <div className={styles.badges}>
              {propiedad.tipoPropiedad && (
                <span className={styles.tipoBadge}>{propiedad.tipoPropiedad}</span>
              )}
              <span className={styles.estadoBadge}>✅ Disponible</span>
            </div>
            <h1 className={styles.titulo}>{propiedad.titulo}</h1>
            <p className={styles.ubicacion}>📍 {propiedad.ubicacion}</p>
          </div>

          {/* Capacidad */}
          <div className={styles.capacidadGrid}>
            {[
              { icon: '👥', label: 'Huéspedes', value: propiedad.huespedes },
              { icon: '🛏️', label: 'Dormitorios', value: propiedad.dormitorios },
              { icon: '🛌', label: 'Camas', value: propiedad.camas },
              { icon: '🚿', label: 'Baños', value: propiedad.banos },
            ].filter(i => i.value).map(item => (
              <div key={item.label} className={styles.capacidadItem}>
                <span className={styles.capacidadIcon}>{item.icon}</span>
                <div>
                  <p className={styles.capacidadValue}>{item.value}</p>
                  <p className={styles.capacidadLabel}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className={styles.divider} />

          {/* Descripción */}
          {propiedad.descripcion && (
            <div className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>Sobre esta propiedad</h2>
              <p className={styles.descripcion}>{propiedad.descripcion}</p>
            </div>
          )}

          {/* Amenities */}
          {propiedad.amenities?.length > 0 && (
            <div className={styles.seccion}>
              <h2 className={styles.seccionTitulo}>Qué ofrece este lugar</h2>
              <div className={styles.amenitiesGrid}>
                {propiedad.amenities.map((amenity, i) => (
                  <div key={i} className={styles.amenityItem}>
                    <span className={styles.amenityIcon}>{getAmenityIcon(amenity)}</span>
                    <span className={styles.amenityNombre}>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <hr className={styles.divider} />

          {/* Calendario de disponibilidad */}
          <div className={styles.seccion}>
            <h2 className={styles.seccionTitulo}>Disponibilidad</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Los días en rojo ya están reservados. Para consultar fechas específicas contactanos por WhatsApp.
            </p>
            <CalendarioDisponibilidad fechasOcupadas={fechasOcupadas} />
          </div>

          <hr className={styles.divider} />

          {/* Info adicional */}
          <div className={styles.seccion}>
            <h2 className={styles.seccionTitulo}>Información adicional</h2>
            <div className={styles.infoGrid}>
              {propiedad.tipoPropiedad && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tipo de propiedad</span>
                  <span className={styles.infoValue}>{propiedad.tipoPropiedad}</span>
                </div>
              )}
              {propiedad.temporada && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Temporada</span>
                  <span className={styles.infoValue} style={{ textTransform: 'capitalize' }}>
                    {propiedad.temporada}
                  </span>
                </div>
              )}
              {propiedad.fechaPublicacion && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Publicada</span>
                  <span className={styles.infoValue}>
                    {new Date(propiedad.fechaPublicacion).toLocaleDateString('es-UY', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Columna derecha — tarjeta fija */}
        <div className={styles.columnaDer}>
          <div className={styles.reservaCard}>
            <div className={styles.reservaPrecio}>
              <span className={styles.reservaPrecioValor}>${propiedad.precioPorNoche}</span>
              <span className={styles.reservaPrecioLabel}> USD / noche</span>
            </div>

            <div className={styles.reservaCapacidad}>
              <div className={styles.reservaCapItem}>
                <span>👥</span>
                <span>Hasta {propiedad.huespedes} huéspedes</span>
              </div>
              <div className={styles.reservaCapItem}>
                <span>🛏️</span>
                <span>{propiedad.dormitorios} dormitorio{propiedad.dormitorios != 1 ? 's' : ''}</span>
              </div>
              <div className={styles.reservaCapItem}>
                <span>🚿</span>
                <span>{propiedad.banos} baño{propiedad.banos != 1 ? 's' : ''}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/59895532294?text=Hola!%20Me%20interesa%20la%20propiedad%20"${encodeURIComponent(propiedad.titulo)}"%20en%20${encodeURIComponent(propiedad.ubicacion)}.%20Quisiera%20consultar%20disponibilidad.`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnReserva}
            >
              💬 Consultar disponibilidad
            </a>

            <p className={styles.reservaHint}>
              Respondemos por WhatsApp en menos de 1 hora
            </p>

            <div className={styles.reservaGestionado}>
              <span>🏆</span>
              <div>
                <strong>Gestionado por Alquilala</strong>
                <p>Atención profesional, check-in y limpieza incluidos</p>
              </div>
            </div>
          </div>

          <Link href="/#propiedades" className={styles.btnVolver}>
            ← Ver más propiedades
          </Link>
        </div>
      </div>
    </div>
  );
}