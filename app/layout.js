import { Inter } from 'next/font/google'
import './globals.css'
import LayoutClient from '@/components/LayoutClient'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Alquilala — Gestión Profesional de Alquileres Temporales en Uruguay',
    template: '%s | Alquilala',
  },
  description: 'Publicamos y gestionamos tu propiedad en Airbnb, Booking y MercadoLibre. Limpieza, mantenimiento, atención al huésped y más. Vos descansás, nosotros nos encargamos.',
  keywords: ['alquiler temporal', 'gestión de propiedades', 'Airbnb Uruguay', 'Booking Uruguay', 'alquiler verano', 'Punta del Este', 'Cabo Polonio', 'Punta del Diablo', 'alquilar casa playa Uruguay'],
  authors: [{ name: 'Alquilala' }],
  creator: 'Alquilala',
  metadataBase: new URL('https://alquilala.vercel.app'),
  openGraph: {
    title: 'Alquilala — Gestión Profesional de Alquileres Temporales',
    description: 'Dejá tu propiedad en nuestras manos. Nos encargamos de todo: publicación, reservas, limpieza y atención al huésped.',
    type: 'website',
    locale: 'es_UY',
    url: 'https://alquilala.vercel.app',
    siteName: 'Alquilala',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Alquilala — Gestión de Alquileres Temporales',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alquilala — Gestión Profesional de Alquileres Temporales',
    description: 'Dejá tu propiedad en nuestras manos.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
  icon: '/icon.svg',
  shortcut: '/icon.svg',
  apple: '/icon.svg',
},
}

export const viewport = {
  themeColor: '#1e3a5f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="canonical" href="https://alquilala.vercel.app" />
      </head>
      <body className={inter.className}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}