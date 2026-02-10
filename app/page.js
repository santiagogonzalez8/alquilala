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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login')
      } else {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#1e3a5f' }}>Cargando...</div>
  }

  return (
    <div className={styles.home}>
      <div className={styles.heroSection}>
        <div className={styles.heroImage}></div>
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