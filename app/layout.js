import { Inter } from 'next/font/google'
import './globals.css'
import LayoutClient from '@/components/LayoutClient'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Alquilala — Gestión Profesional de Alquileres Temporales en Uruguay',
  description: 'Publicamos y gestionamos tu propiedad en Airbnb, Booking y MercadoLibre. Limpieza, mantenimiento, atención al huésped y más. Vos descansás, nosotros nos encargamos.',
  keywords: 'alquiler temporal, gestión de propiedades, Airbnb Uruguay, Booking Uruguay, alquiler verano, Punta del Este, Cabo Polonio, Punta del Diablo',
  openGraph: {
    title: 'Alquilala — Gestión Profesional de Alquileres Temporales',
    description: 'Dejá tu propiedad en nuestras manos. Nos encargamos de todo: publicación, reservas, limpieza y atención al huésped.',
    type: 'website',
    locale: 'es_UY',
    url: 'https://alquilala.vercel.app',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}