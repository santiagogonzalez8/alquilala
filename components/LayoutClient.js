'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Navbar from '@/components/Navbar'
import ScrollToTop from '@/components/ScrollToTop'
import GoogleAnalytics from '@/components/GoogleAnalytics'

// Función para trackear page views en navegación SPA
function trackPageView(url) {
  if (typeof window === 'undefined') return
  if (!window.gtag) return
  window.gtag('config', 'G-LTFTEXY9NM', {
    page_path: url,
  })
}

// Función global para trackear eventos custom
// Uso: window.trackEvent('ver_propiedad', { titulo: 'Casa en Punta Negra' })
if (typeof window !== 'undefined') {
  window.trackEvent = function (eventName, params = {}) {
    if (!window.gtag) return
    window.gtag('event', eventName, params)
  }
}

export default function LayoutClient({ children }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Trackear cada cambio de página (navegación SPA)
  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    trackPageView(url)
  }, [pathname, searchParams])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      // Trackear login
      if (currentUser) {
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'login', {
            method: currentUser.providerData?.[0]?.providerId || 'email',
          })
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const isLoginPage = pathname === '/login'
  const isAdminPage = pathname?.startsWith('/admin')

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <span>Cargando...</span>
      </div>
    )
  }

  return (
    <>
      {/* Google Analytics — se carga en todas las páginas */}
      <GoogleAnalytics />

      {!isLoginPage && !isAdminPage && <Navbar user={user} />}

      <main>{children}</main>

      {!isLoginPage && !isAdminPage && (
        <>
          <ScrollToTop />
          <footer className="footer">
            <div className="footer-links">
              <a href="/ayuda">Ayuda</a>
              <a href="/soporte">Contacto</a>
              <a href="https://wa.me/59895532294" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
            <div className="footer-bottom">
              <p>© 2025 Alquilala — Gestión profesional de alquileres temporales en Uruguay</p>
            </div>
          </footer>
        </>
      )}
    </>
  )
}