'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './SearchBar.module.css'

export default function SearchBar() {
  const router = useRouter()
  const [activo, setActivo] = useState(null) // 'donde' | 'fechas' | 'quien'
  const [donde, setDonde] = useState('')
  const [fechaEntrada, setFechaEntrada] = useState('')
  const [fechaSalida, setFechaSalida] = useState('')
  const [huespedes, setHuespedes] = useState(1)
  const ref = useRef(null)

  // Cerrar al hacer click afuera
  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setActivo(null)
      }
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const handleBuscar = () => {
    if (!donde.trim()) {
      setActivo('donde')
      return
    }
    const params = new URLSearchParams()
    if (donde) params.set('donde', donde)
    if (fechaEntrada) params.set('entrada', fechaEntrada)
    if (fechaSalida) params.set('salida', fechaSalida)
    if (huespedes > 1) params.set('huespedes', huespedes)
    router.push(`/buscar?${params.toString()}`)
    setActivo(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBuscar()
  }

  const tieneFiltros = donde || fechaEntrada || fechaSalida || huespedes > 1

  const formatFecha = (str) => {
    if (!str) return null
    const [y, m, d] = str.split('-')
    const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
    return `${parseInt(d)} ${meses[parseInt(m) - 1]}`
  }

  return (
    <div ref={ref} className={styles.wrapper}>
      <div className={`${styles.bar} ${activo ? styles.barActiva : ''}`}>

        {/* DÓNDE */}
        <div
          className={`${styles.campo} ${activo === 'donde' ? styles.campoActivo : ''}`}
          onClick={() => setActivo('donde')}
        >
          <label className={styles.label}>Dónde</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Buscá destinos"
            value={donde}
            onChange={(e) => setDonde(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setActivo('donde')}
          />
          {donde && (
            <button
              className={styles.clearBtn}
              onClick={(e) => { e.stopPropagation(); setDonde('') }}
            >×</button>
          )}
        </div>

        <div className={styles.separador} />

        {/* FECHAS */}
        <div
          className={`${styles.campo} ${activo === 'fechas' ? styles.campoActivo : ''}`}
          onClick={() => setActivo('fechas')}
        >
          <label className={styles.label}>Fechas</label>
          {fechaEntrada && fechaSalida ? (
            <span className={styles.inputValor}>
              {formatFecha(fechaEntrada)} → {formatFecha(fechaSalida)}
            </span>
          ) : (
            <span className={styles.inputPlaceholder}>Agregá fechas</span>
          )}

          {/* Dropdown fechas */}
          {activo === 'fechas' && (
            <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
              <div className={styles.fechasGrid}>
                <div className={styles.fechaBloque}>
                  <label className={styles.fechaLabel}>Check-in</label>
                  <input
                    type="date"
                    className={styles.fechaInput}
                    value={fechaEntrada}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setFechaEntrada(e.target.value)
                      if (e.target.value >= fechaSalida) setFechaSalida('')
                    }}
                  />
                </div>
                <div className={styles.fechaBloque}>
                  <label className={styles.fechaLabel}>Check-out</label>
                  <input
                    type="date"
                    className={styles.fechaInput}
                    value={fechaSalida}
                    min={fechaEntrada || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFechaSalida(e.target.value)}
                  />
                </div>
              </div>
              {fechaEntrada && fechaSalida && (
                <button
                  className={styles.dropdownConfirm}
                  onClick={() => setActivo('quien')}
                >
                  Confirmar fechas →
                </button>
              )}
            </div>
          )}
        </div>

        <div className={styles.separador} />

        {/* QUIÉN */}
        <div
          className={`${styles.campo} ${styles.campoQuien} ${activo === 'quien' ? styles.campoActivo : ''}`}
          onClick={() => setActivo('quien')}
        >
          <label className={styles.label}>Quién</label>
          {huespedes > 1 ? (
            <span className={styles.inputValor}>{huespedes} huéspedes</span>
          ) : (
            <span className={styles.inputPlaceholder}>¿Cuántos?</span>
          )}

          {/* Dropdown huéspedes */}
          {activo === 'quien' && (
            <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
              <div className={styles.huespedesRow}>
                <div>
                  <p className={styles.huespedesLabel}>Huéspedes</p>
                  <p className={styles.huespedesDesc}>Adultos y niños</p>
                </div>
                <div className={styles.contador}>
                  <button
                    className={styles.contadorBtn}
                    onClick={() => setHuespedes(Math.max(1, huespedes - 1))}
                    disabled={huespedes <= 1}
                  >−</button>
                  <span className={styles.contadorNum}>{huespedes}</span>
                  <button
                    className={styles.contadorBtn}
                    onClick={() => setHuespedes(Math.min(20, huespedes + 1))}
                  >+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTÓN BUSCAR */}
        <button
          className={`${styles.btnBuscar} ${tieneFiltros ? styles.btnBuscarActivo : ''}`}
          onClick={handleBuscar}
          aria-label="Buscar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <span className={styles.btnBuscarTexto}>Buscar</span>
        </button>
      </div>
    </div>
  )
}