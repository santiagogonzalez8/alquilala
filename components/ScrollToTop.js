'use client'

import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top ${visible ? 'visible' : ''}`}
      aria-label="Volver arriba"
    >
      ↑
    </button>
  )
}