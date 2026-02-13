'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth, googleProvider } from '@/lib/firebase'
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import styles from './login.module.css'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [error, setError] = useState('')

  // Si ya está logueado, redirigir al home
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        router.push('/')
      } else {
        setCheckingAuth(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      router.push('/')
    } catch (error) {
      console.error('Error:', error)
      if (error.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este email')
      } else if (error.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta')
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Este email ya está registrado')
      } else if (error.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres')
      } else if (error.code === 'auth/invalid-credential') {
        setError('Email o contraseña incorrectos')
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    
    try {
      await signInWithPopup(auth, googleProvider)
      router.push('/')
    } catch (error) {
      console.error('Error:', error)
      if (error.code !== 'auth/popup-closed-by-user') {
        setError('Error al iniciar sesión con Google')
      }
    } finally {
      setLoading(false)
    }
  }

  // Mientras verifica si hay sesión activa
  if (checkingAuth) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        Cargando...
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Lado izquierdo — Imagen / Branding */}
      <div className={styles.brandSide}>
        <div className={styles.brandOverlay} />
        <div className={styles.brandContent}>
          <Link href="/" className={styles.brandLogo}>
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="20" width="20" height="16" fill="white"/>
              <path d="M20 8 L32 20 L8 20 Z" fill="white"/>
              <rect x="16" y="24" width="8" height="8" fill="#1e3a5f"/>
              <line x1="16" y1="28" x2="24" y2="28" stroke="white" strokeWidth="0.8"/>
              <line x1="20" y1="24" x2="20" y2="32" stroke="white" strokeWidth="0.8"/>
            </svg>
            <span>alquilala</span>
          </Link>
          <h2 className={styles.brandTitle}>
            Gestión profesional de alquileres temporales
          </h2>
          <p className={styles.brandText}>
            Publicamos tu propiedad en Airbnb, Booking y MercadoLibre. 
            Nos encargamos de todo para que vos solo cobres.
          </p>
          <div className={styles.brandFeatures}>
            <div className={styles.brandFeature}>
              <span>📢</span> Publicación multi-plataforma
            </div>
            <div className={styles.brandFeature}>
              <span>🧹</span> Limpieza y mantenimiento
            </div>
            <div className={styles.brandFeature}>
              <span>💬</span> Atención al huésped 24/7
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho — Formulario */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h1>{isRegistering ? 'Creá tu cuenta' : 'Bienvenido de vuelta'}</h1>
            <p>{isRegistering ? 'Registrate para publicar tu propiedad' : 'Iniciá sesión en tu cuenta'}</p>
          </div>

          {error && (
            <div className={styles.error}>
              ⚠️ {error}
            </div>
          )}

          {/* Botón Google — primero, es lo más fácil */}
          <button onClick={handleGoogleLogin} className={styles.btnGoogle} disabled={loading}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div className={styles.divider}>
            <span>o con email</span>
          </div>

          <form onSubmit={handleEmailLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Cargando...' : isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </form>

          <p className={styles.toggle}>
            {isRegistering ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering)
                setError('')
              }}
              disabled={loading}
            >
              {isRegistering ? 'Iniciá sesión' : 'Registrate'}
            </button>
          </p>

          <Link href="/" className={styles.backHome}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}