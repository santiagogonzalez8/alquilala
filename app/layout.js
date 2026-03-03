import { Suspense } from 'react'
import LayoutClient from '@/components/LayoutClient'
import './globals.css'

export const metadata = {
  title: 'Alquilala — Gestión profesional de alquileres temporales',
  description: 'Publicá tu propiedad y nosotros nos encargamos de todo. Airbnb, Booking, MercadoLibre y más.',
  keywords: 'alquiler temporal, uruguay, punta del este, airbnb, booking, gestión propiedades',
  authors: [{ name: 'Alquilala' }],
  manifest: '/manifest.json',
  themeColor: '#1e3a5f',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Alquilala',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.png',
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    title: 'Alquilala — Gestión profesional de alquileres temporales',
    description: 'Publicá tu propiedad y nosotros nos encargamos de todo.',
    url: 'https://alquilala.vercel.app',
    siteName: 'Alquilala',
    locale: 'es_UY',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Alquilala" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <Suspense fallback={
          <div className="loading-screen">
            <div className="loading-spinner"></div>
          </div>
        }>
          <LayoutClient>{children}</LayoutClient>
        </Suspense>
      </body>
    </html>
  )
}