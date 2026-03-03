'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { firestoreGetPublic } from '@/lib/firebase'
import SearchBar from '@/components/SearchBar'
import styles from './buscar.module.css'

function calcularNoches(desde, hasta) {
  if (!desde || !hasta) return 0
  const d1 = new Date(desde)
  const d2 = new Date(hasta)
  const diff = (d2 - d1) / (1000 * 60 * 60 * 24)
  return diff > 0 ? diff : 0
}

function BuscarContenido() {
  const searchParams = useSearchParams()
  const donde = searchParams.get('donde') || ''
  const entrada = searchParams.get('entrada') || ''
  const salida = searchParams.get('salida') || ''
  const huespedes = parseInt(searchParams.get('huespedes') || '1')

  const [resultados, setResultados] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const buscar = async () => {
      setLoading(true)
      try {
        // Traer todas las propiedades disponibles
        const todas = await firestoreGetPublic(
          'propiedades',
          [{ field: 'estado', op: 'EQUAL', value: 'disponible' }],
          100
        )

        // Filtrar en cliente
        let filtradas = todas

        // Filtrar por ubicación/texto
        if (donde.trim()) {
          const q = donde.toLowerCase()
          filtradas = filtradas.filter(p =>
            p.ubicacion?.toLowerCase().includes(q) ||
            p.titulo?.toLowerCase().includes(q) ||
            p.descripcion?.toLowerCase().includes(q)
          )
        }

        // Filtrar por capacidad
        if (huespedes > 1) {
          filtradas = filtradas.filter(p =>
            Number(p.huespedes || 0) >= huespedes
          )
        }

        // Filtrar por fechas disponibles
        if (entrada && salida) {
          filtradas = filtradas.filter(p => {
            const ocupadas = p.fechasOcupadas || []
            if (!ocupadas.length) return true
            // Generar fechas del rango buscado
            const fechasRango = []
            const d = new Date(entrada)
            const fin = new Date(salida)
            while (d < fin) {
              fechasRango.push(d.toISOString().split('T')[0])
              d.setDate(d.getDate() + 1)
            }
            // Verificar que ninguna fecha del rango esté ocupada
            return !fechasRango.some(f => ocupadas.includes(f))
          })
        }

        setResultados(filtradas)
      } catch (error) {
        console.error('Error buscando:', error)
      } finally {
        setLoading(false)
      }
    }

    buscar()
  }, [donde, entrada, salida, huespedes])

  const noches = calcularNoches(entrada, salida)

  return (
    <div className={styles.page}>
      {/* Barra de búsqueda arriba */}
      <div className={styles.searchTop}>
        <SearchBar />
      </div>

      {/* Resultados */}
      <div className={styles.content}>
        <div className={styles.resultadosHeader}>
          <h1 className={styles.titulo}>
            {loading ? 'Buscando...' : (
              donde
                ? `${resultados.length} ${resultados.length === 1 ? 'propiedad' : 'propiedades'} en "${donde}"`
                : `${resultados.length} ${resultados.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}`
            )}
          </h1>
          {(donde || entrada || huespedes > 1) && (
            <div className={styles.filtrosActivos}>
              {donde && <span className={styles.filtroTag}>📍 {donde}</span>}
              {entrada && salida && (
                <span className={styles.filtroTag}>
                  📅 {entrada} → {salida}
                  {noches > 0 && ` (${noches} noches)`}
                </span>
              )}
              {huespedes > 1 && (
                <span className={styles.filtroTag}>👥 {huespedes} huéspedes</span>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className="loading-spinner" />
            <p>Buscando propiedades...</p>
          </div>
        ) : resultados.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🏖️</div>
            <h2>No encontramos propiedades</h2>
            <p>
              {donde
                ? `No hay propiedades disponibles en "${donde}" con esos criterios.`
                : 'No hay propiedades disponibles con esos criterios.'
              }
            </p>
            <div className={styles.emptyAcciones}>
              <Link href="/buscar" className={styles.btnLimpiar}>
                Ver todas las propiedades
              </Link>
              <a
                href="https://wa.me/59895532294?text=Hola!%20Estoy%20buscando%20una%20propiedad%20y%20no%20encuentro%20lo%20que%20necesito"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnWA}
              >
                💬 Consultanos por WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className={styles.grid}>
            {resultados.map(prop => (
              <Link
                key={prop.id}
                href={`/propiedades/${prop.id}`}
                className={styles.card}
                onClick={() => {
                  if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'select_item', {
                      item_id: prop.id,
                      item_name: prop.titulo,
                      item_location: prop.ubicacion,
                      search_term: donde,
                    })
                  }
                }}
              >
                <div
                  className={styles.cardImg}
                  style={{
                    backgroundImage: prop.imagenes?.[0]
                      ? `url(${prop.imagenes[0]})`
                      : prop.fotoPrincipal
                      ? `url(${prop.fotoPrincipal})`
                      : 'linear-gradient(135deg, #1e3a5f, #2d4a6f)'
                  }}
                >
                  <span className={styles.badge}>Disponible</span>
                  {noches > 0 && (
                    <span className={styles.totalBadge}>
                      ${Number(prop.precioPorNoche) * noches} USD total
                    </span>
                  )}
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitulo}>{prop.titulo}</h3>
                  <p className={styles.cardUbicacion}>📍 {prop.ubicacion}</p>
                  <div className={styles.cardDetalles}>
                    <span>👥 {prop.huespedes} huésp.</span>
                    <span>🛏️ {prop.dormitorios} dorm.</span>
                    <span>🚿 {prop.banos} baños</span>
                  </div>
                  <div className={styles.cardPrecio}>
                    <span className={styles.precioValor}>${prop.precioPorNoche}</span>
                    <span className={styles.precioLabel}> USD / noche</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function BuscarPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
      </div>
    }>
      <BuscarContenido />
    </Suspense>
  )
}