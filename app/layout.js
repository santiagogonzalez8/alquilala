'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Inter } from 'next/font/google'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Navbar from '@/components/Navbar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
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

  const showNavbar = user && pathname !== '/login'

  if (loading) {
    return (
      <html lang="es">
        <body className={inter.className}>
          <div className="loading-screen">Cargando...</div>
        </body>
      </html>
    )
  }

  return (
    <html lang="es">
      <body className={inter.className}>
        {showNavbar && <Navbar />}
        {children}
        {showNavbar && (
          <footer className="footer">
            <p>© 2025 Alquilala - Gestión profesional de alquileres temporales</p>
          </footer>
        )}
      </body>
    </html>
  )
}