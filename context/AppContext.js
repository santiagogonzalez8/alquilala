'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext({})

export const IDIOMAS = {
  es: { label: 'Español', flag: '🇺🇾', code: 'es' },
  en: { label: 'English', flag: '🇺🇸', code: 'en' },
  pt: { label: 'Português', flag: '🇧🇷', code: 'pt' },
}

export const MONEDAS = [
  { code: 'USD', symbol: '$', label: 'Dólar estadounidense', flag: '🇺🇸' },
  { code: 'UYU', symbol: '$U', label: 'Peso uruguayo', flag: '🇺🇾' },
  { code: 'ARS', symbol: '$', label: 'Peso argentino', flag: '🇦🇷' },
  { code: 'BRL', symbol: 'R$', label: 'Real brasileño', flag: '🇧🇷' },
  { code: 'EUR', symbol: '€', label: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', label: 'Libra esterlina', flag: '🇬🇧' },
  { code: 'CLP', symbol: '$', label: 'Peso chileno', flag: '🇨🇱' },
  { code: 'MXN', symbol: '$', label: 'Peso mexicano', flag: '🇲🇽' },
]

export const TRADUCCIONES = {
  es: {
    // Navbar
    'como_funciona': 'Cómo funciona',
    'servicios': 'Servicios',
    'propiedades': 'Propiedades',
    'contacto': 'Contacto',
    'iniciar_sesion': 'Iniciar sesión',
    'publica_tu_casa': 'Publicá tu casa',
    // Home
    'hero_titulo': 'Dejá tu propiedad en nuestras manos',
    'hero_subtitulo': 'Gestionamos tu alquiler temporal de forma integral.',
    'hero_btn': 'Publicá tu casa',
    'propiedades_titulo': 'Propiedades que gestionamos',
    'propiedades_subtitulo': 'Estas son algunas de las propiedades que ya confían en nosotros.',
    'proximamente': 'Próximamente',
    'proximamente_desc': 'Estamos incorporando propiedades. ¡Sé el primero en publicar la tuya!',
    'publicar_propiedad': 'Publicá tu propiedad',
    // Búsqueda
    'donde': 'Dónde',
    'busca_destinos': 'Buscá destinos',
    'fechas': 'Fechas',
    'agrega_fechas': 'Agregá fechas',
    'quien': 'Quién',
    'cuantos': '¿Cuántos?',
    'buscar': 'Buscar',
    'checkin': 'Check-in',
    'checkout': 'Check-out',
    'huespedes': 'Huéspedes',
    'adultos_ninos': 'Adultos y niños',
    'confirmar_fechas': 'Confirmar fechas →',
    // Menú
    'mi_panel': 'Mi Panel',
    'mi_perfil': 'Mi Perfil',
    'mis_propiedades': 'Mis Propiedades',
    'mis_reservas': 'Mis Reservas',
    'publicar_nueva': 'Publicar Propiedad',
    'buscar_propiedades': 'Buscar Propiedades',
    'ayuda': 'Ayuda',
    'contactanos': 'Contáctanos',
    'panel_admin': 'Panel de Administración',
    'cerrar_sesion': 'Cerrar Sesión',
    // Propiedad
    'disponible': 'Disponible',
    'por_noche': '/ noche',
    'ver_mas': 'Ver más propiedades',
    'sobre_propiedad': 'Sobre esta propiedad',
    'que_ofrece': 'Qué ofrece este lugar',
    'info_adicional': 'Información adicional',
    'disponibilidad': 'Disponibilidad',
    'reservar_whatsapp': 'Reservar por WhatsApp',
    'consultar_whatsapp': 'Consultar por WhatsApp',
    'selecciona_fechas': 'Seleccioná fechas para reservar',
    'gestionado_por': 'Gestionado por Alquilala',
    'atencion_profesional': 'Atención profesional, check-in y limpieza incluidos',
  },
  en: {
    'como_funciona': 'How it works',
    'servicios': 'Services',
    'propiedades': 'Properties',
    'contacto': 'Contact',
    'iniciar_sesion': 'Sign in',
    'publica_tu_casa': 'List your home',
    'hero_titulo': 'Leave your property in our hands',
    'hero_subtitulo': 'We manage your short-term rental comprehensively.',
    'hero_btn': 'List your home',
    'propiedades_titulo': 'Properties we manage',
    'propiedades_subtitulo': 'Some of the properties that already trust us.',
    'proximamente': 'Coming soon',
    'proximamente_desc': 'We are adding properties. Be the first to publish yours!',
    'publicar_propiedad': 'Publish your property',
    'donde': 'Where',
    'busca_destinos': 'Explore destinations',
    'fechas': 'Dates',
    'agrega_fechas': 'Add dates',
    'quien': 'Who',
    'cuantos': 'How many?',
    'buscar': 'Search',
    'checkin': 'Check-in',
    'checkout': 'Check-out',
    'huespedes': 'Guests',
    'adultos_ninos': 'Adults and children',
    'confirmar_fechas': 'Confirm dates →',
    'mi_panel': 'My Dashboard',
    'mi_perfil': 'My Profile',
    'mis_propiedades': 'My Properties',
    'mis_reservas': 'My Reservations',
    'publicar_nueva': 'Publish Property',
    'buscar_propiedades': 'Search Properties',
    'ayuda': 'Help',
    'contactanos': 'Contact us',
    'panel_admin': 'Admin Panel',
    'cerrar_sesion': 'Sign out',
    'disponible': 'Available',
    'por_noche': '/ night',
    'ver_mas': 'See more properties',
    'sobre_propiedad': 'About this property',
    'que_ofrece': 'What this place offers',
    'info_adicional': 'Additional information',
    'disponibilidad': 'Availability',
    'reservar_whatsapp': 'Book via WhatsApp',
    'consultar_whatsapp': 'Ask via WhatsApp',
    'selecciona_fechas': 'Select dates to book',
    'gestionado_por': 'Managed by Alquilala',
    'atencion_profesional': 'Professional service, check-in and cleaning included',
  },
  pt: {
    'como_funciona': 'Como funciona',
    'servicios': 'Serviços',
    'propiedades': 'Propriedades',
    'contacto': 'Contato',
    'iniciar_sesion': 'Entrar',
    'publica_tu_casa': 'Publique sua casa',
    'hero_titulo': 'Deixe sua propriedade em nossas mãos',
    'hero_subtitulo': 'Gerenciamos seu aluguel temporário de forma integral.',
    'hero_btn': 'Publique sua casa',
    'propiedades_titulo': 'Propriedades que gerenciamos',
    'propiedades_subtitulo': 'Algumas das propriedades que já confiam em nós.',
    'proximamente': 'Em breve',
    'proximamente_desc': 'Estamos adicionando propriedades. Seja o primeiro a publicar!',
    'publicar_propiedad': 'Publicar propriedade',
    'donde': 'Onde',
    'busca_destinos': 'Explorar destinos',
    'fechas': 'Datas',
    'agrega_fechas': 'Adicionar datas',
    'quien': 'Quem',
    'cuantos': 'Quantos?',
    'buscar': 'Buscar',
    'checkin': 'Check-in',
    'checkout': 'Check-out',
    'huespedes': 'Hóspedes',
    'adultos_ninos': 'Adultos e crianças',
    'confirmar_fechas': 'Confirmar datas →',
    'mi_panel': 'Meu Painel',
    'mi_perfil': 'Meu Perfil',
    'mis_propiedades': 'Minhas Propriedades',
    'mis_reservas': 'Minhas Reservas',
    'publicar_nueva': 'Publicar Propriedade',
    'buscar_propiedades': 'Buscar Propriedades',
    'ayuda': 'Ajuda',
    'contactanos': 'Fale conosco',
    'panel_admin': 'Painel Admin',
    'cerrar_sesion': 'Sair',
    'disponible': 'Disponível',
    'por_noche': '/ noite',
    'ver_mas': 'Ver mais propriedades',
    'sobre_propiedad': 'Sobre esta propriedade',
    'que_ofrece': 'O que este lugar oferece',
    'info_adicional': 'Informações adicionais',
    'disponibilidad': 'Disponibilidade',
    'reservar_whatsapp': 'Reservar pelo WhatsApp',
    'consultar_whatsapp': 'Consultar pelo WhatsApp',
    'selecciona_fechas': 'Selecione datas para reservar',
    'gestionado_por': 'Gerenciado por Alquilala',
    'atencion_profesional': 'Atendimento profissional, check-in e limpeza incluídos',
  },
}

export function AppProvider({ children }) {
  const [idioma, setIdioma] = useState('es')
  const [moneda, setMoneda] = useState('USD')
  const [tasas, setTasas] = useState({
    USD: 1,
    UYU: 39.5,
    ARS: 900,
    BRL: 5.1,
    EUR: 0.92,
    GBP: 0.79,
    CLP: 950,
    MXN: 17.2,
  })

  // Cargar preferencias guardadas
  useEffect(() => {
    const savedIdioma = localStorage.getItem('alquilala_idioma')
    const savedMoneda = localStorage.getItem('alquilala_moneda')
    if (savedIdioma && IDIOMAS[savedIdioma]) setIdioma(savedIdioma)
    if (savedMoneda) setMoneda(savedMoneda)
  }, [])

  // Cargar tasas de cambio reales
  useEffect(() => {
    const fetchTasas = async () => {
      try {
        const res = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        )
        const data = await res.json()
        if (data.rates) {
          setTasas({
            USD: 1,
            UYU: data.rates.UYU || 39.5,
            ARS: data.rates.ARS || 900,
            BRL: data.rates.BRL || 5.1,
            EUR: data.rates.EUR || 0.92,
            GBP: data.rates.GBP || 0.79,
            CLP: data.rates.CLP || 950,
            MXN: data.rates.MXN || 17.2,
          })
        }
      } catch {
        // Si falla la API usa tasas hardcodeadas
      }
    }
    fetchTasas()
  }, [])

  const cambiarIdioma = (code) => {
    setIdioma(code)
    localStorage.setItem('alquilala_idioma', code)
  }

  const cambiarMoneda = (code) => {
    setMoneda(code)
    localStorage.setItem('alquilala_moneda', code)
  }

  // Traducir un texto
  const t = (key) => {
    return TRADUCCIONES[idioma]?.[key] || TRADUCCIONES['es'][key] || key
  }

  // Convertir precio de USD a moneda seleccionada
  const convertirPrecio = (precioUSD) => {
    const num = Number(precioUSD) || 0
    const tasa = tasas[moneda] || 1
    const convertido = num * tasa
    const monedaInfo = MONEDAS.find(m => m.code === moneda)
    const simbolo = monedaInfo?.symbol || '$'

    if (moneda === 'USD') {
      return `${simbolo}${convertido.toLocaleString('es-UY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    }

    return `${simbolo}${Math.round(convertido).toLocaleString('es-UY')}`
  }

  return (
    <AppContext.Provider value={{
      idioma,
      moneda,
      tasas,
      cambiarIdioma,
      cambiarMoneda,
      t,
      convertirPrecio,
      monedaActual: MONEDAS.find(m => m.code === moneda),
      idiomaActual: IDIOMAS[idioma],
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}