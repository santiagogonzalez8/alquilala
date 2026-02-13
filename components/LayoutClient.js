'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Navbar from '@/components/Navbar'

export default function LayoutClient({ children }) {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const isLoginPage = pathname === '/login'
  const isAdminPage = pathname?.startsWith('/admin')

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        Cargando...
      </div>
    )
  }

  return (
    <>
      {/* Navbar se muestra siempre EXCEPTO en login y admin */}
      {!isLoginPage && !isAdminPage && <Navbar user={user} />}
      
      <main>{children}</main>
      
      {/* Footer se muestra siempre EXCEPTO en login y admin */}
      {!isLoginPage && !isAdminPage && (
        <footer className="footer">
          <div className="footer-links">
            <a href="/ayuda">Ayuda</a>
            <a href="/soporte">Contacto</a>
            <a href="https://wa.me/59895532294" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Alquilala — Gestión profesional de alquileres temporales en Uruguay</p>
          </div>
        </footer>
      )}
    </>
  )
}