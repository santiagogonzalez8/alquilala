'use client'

import { useState, useEffect, useRef } from 'react'
import { useApp, IDIOMAS, MONEDAS } from '@/context/AppContext'
import styles from './IdiomaMonedaModal.module.css'

export default function IdiomaMonedaModal({ onClose }) {
  const { idioma, moneda, cambiarIdioma, cambiarMoneda } = useApp()
  const [tab, setTab] = useState('idioma')
  const [idiomaTemp, setIdiomaTemp] = useState(idioma)
  const [monedaTemp, setMonedaTemp] = useState(moneda)
  const ref = useRef(null)

  // Cerrar con Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  // Cerrar al hacer click afuera
  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    setTimeout(() => document.addEventListener('mousedown', fn), 100)
    return () => document.removeEventListener('mousedown', fn)
  }, [onClose])

  const handleGuardar = () => {
    cambiarIdioma(idiomaTemp)
    cambiarMoneda(monedaTemp)
    onClose()
  }

  return (
    <div className={styles.overlay}>
      <div ref={ref} className={styles.modal}>

        {/* Header */}
        <div className={styles.header}>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
          <h2 className={styles.titulo}>Idioma y moneda</h2>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'idioma' ? styles.tabActivo : ''}`}
            onClick={() => setTab('idioma')}
          >
            🌐 Idioma y región
          </button>
          <button
            className={`${styles.tab} ${tab === 'moneda' ? styles.tabActivo : ''}`}
            onClick={() => setTab('moneda')}
          >
            💱 Moneda
          </button>
        </div>

        {/* Contenido */}
        <div className={styles.body}>

          {/* Tab Idioma */}
          {tab === 'idioma' && (
            <div>
              <p className={styles.seccionDesc}>
                Elegí el idioma en que se muestra la plataforma
              </p>
              <div className={styles.opcionesGrid}>
                {Object.values(IDIOMAS).map(id => (
                  <button
                    key={id.code}
                    className={`${styles.opcion} ${idiomaTemp === id.code ? styles.opcionActiva : ''}`}
                    onClick={() => setIdiomaTemp(id.code)}
                  >
                    <span className={styles.opcionFlag}>{id.flag}</span>
                    <span className={styles.opcionLabel}>{id.label}</span>
                    {idiomaTemp === id.code && (
                      <span className={styles.opcionCheck}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab Moneda */}
          {tab === 'moneda' && (
            <div>
              <p className={styles.seccionDesc}>
                Elegí en qué moneda se muestran los precios
              </p>
              <div className={styles.monedasList}>
                {MONEDAS.map(m => (
                  <button
                    key={m.code}
                    className={`${styles.monedaOpcion} ${monedaTemp === m.code ? styles.monedaActiva : ''}`}
                    onClick={() => setMonedaTemp(m.code)}
                  >
                    <span className={styles.monedaFlag}>{m.flag}</span>
                    <div className={styles.monedaInfo}>
                      <span className={styles.monedaCodigo}>{m.code}</span>
                      <span className={styles.monedaLabel}>{m.label}</span>
                    </div>
                    <span className={styles.monedaSimbolo}>{m.symbol}</span>
                    {monedaTemp === m.code && (
                      <span className={styles.opcionCheck}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.btnCancelar} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.btnGuardar} onClick={handleGuardar}>
            Guardar
          </button>
        </div>

      </div>
    </div>
  )
}