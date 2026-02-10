'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import styles from './mis-propiedades.module.css'

export default function MisPropiedades() {
  const [propiedades, setPropiedades] = useState([])

  useEffect(() => {
    obtenerMisPropiedades()
  }, [])

  const obtenerMisPropiedades = async () => {
    if (!auth.currentUser) return

    try {
      const q = query(
        collection(db, 'properties'),
        where('userId', '==', auth.currentUser.uid)
      )
      const querySnapshot = await getDocs(q)
      const props = []
      querySnapshot.forEach((doc) => {
        props.push({ id: doc.id, ...doc.data() })
      })
      setPropiedades(props)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Mis Propiedades</h1>
        <Link href="/publicar" className={styles.btnAdd}>
          + Agregar
        </Link>
      </div>

      {propiedades.length === 0 ? (
        <div className={styles.empty}>
          <p>No tienes propiedades</p>
          <Link href="/publicar" className={styles.btnPrimary}>
            Publicar propiedad
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {propiedades.map((prop) => (
            <div key={prop.id} className={styles.card}>
              {prop.imagen && <img src={prop.imagen} alt={prop.titulo} />}
              <div className={styles.body}>
                <h3>{prop.titulo}</h3>
                <p>{prop.descripcion}</p>
                <p className={styles.location}>📍 {prop.ubicacion}</p>
                <p className={styles.price}>${prop.precio}/mes</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}