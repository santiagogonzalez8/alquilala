'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import styles from './page.module.css'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [esAdmin, setEsAdmin] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      name: 'Punta del Este',
      image: 'https://images.unsplash.com/photo-1580837119756-563d608dd119?w=1200&h=600&fit=crop'
    },
    {
      name: 'Cabo Polonio',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop'
    },
    {
      name: 'Punta del Diablo',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop'
    },
    {
      name: 'La Paloma',
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&h=600&fit=crop'
    },
    {
      name: 'Colonia del Sacramento',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop'
    }
  ]

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login')
      } else {
        setUser(currentUser)
        setEsAdmin(currentUser.email === 'gosanti2000@gmail.com')
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#1e3a5f' }}>Cargando...</div>
  }

  return (
    <div className={styles.home}>
      {esAdmin && (
        <button 
          onClick={() => router.push('/admin')}
          style={{
            position: 'fixed',
            top: '20px',
            right: '80px',
            background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2942 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            boxShadow: '0 4px 6px rgba(30, 58, 95, 0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(30, 58, 95, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px rgba(30, 58, 95, 0.3)';
          }}
        >
          <span style={{fontSize: '18px'}}>🌊</span> Panel Admin
        </button>
      )}

      <div className={styles.heroSection}>
        {/* Carrusel de imágenes */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}>
          {slides.map((slide, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 0.5s ease',
                zIndex: currentSlide === index ? 1 : 0
              }}
            >
              {/* Nombre del lugar */}
              <div style={{
                position: 'absolute',
                top: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(30, 58, 95, 0.9)',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '8px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                zIndex: 10
              }}>
                {slide.name}
              </div>
            </div>
          ))}

          {/* Botón anterior */}
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: '#1e3a5f',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 10,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-50%) scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(-50%) scale(1)'}
          >
            ←
          </button>

          {/* Botón siguiente */}
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: '#1e3a5f',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 10,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-50%) scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(-50%) scale(1)'}
          >
            →
          </button>

          {/* Indicadores */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 10
          }}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: currentSlide === index ? '#1e3a5f' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.searchContainer}>
            <p className={styles.subtitle}>Gestión profesional de alquileres temporales</p>
            <div className={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Busca propiedades asociadas en la plataforma"
                className={styles.searchInput}
              />
              <Link href="/propiedades" className={styles.searchBtn}>
                Buscar
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.noResults}>No se encontraron propiedades</p>
      </div>
    </div>
  )
}