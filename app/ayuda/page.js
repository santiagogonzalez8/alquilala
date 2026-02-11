'use client';
import BackButton from '@/components/BackButton';

export default function Ayuda() {
  const faqs = [
    {
      pregunta: '¿Cómo publico una propiedad?',
      respuesta: 'Ve a la sección "Publicar Propiedad" del menú principal, completa el formulario con los datos de tu propiedad y haz clic en "Publicar".'
    },
    {
      pregunta: '¿Cómo busco propiedades?',
      respuesta: 'En la sección "Buscar Propiedades" puedes filtrar por ubicación, precio y características. Usa el buscador para encontrar lo que necesitas.'
    },
    {
      pregunta: '¿Cómo hago una reserva?',
      respuesta: 'Selecciona la propiedad que te interesa, revisa los detalles y haz clic en "Reservar". Recibirás una confirmación por email.'
    },
    {
      pregunta: '¿Puedo cancelar una reserva?',
      respuesta: 'Sí, ve a "Mis Reservas" y selecciona la reserva que deseas cancelar. Ten en cuenta las políticas de cancelación de cada propiedad.'
    },
    {
      pregunta: '¿Es seguro el pago?',
      respuesta: 'Todas las transacciones están protegidas y encriptadas. Trabajamos con plataformas de pago seguras para garantizar tu protección.'
    },
    {
      pregunta: '¿Cómo contacto al propietario?',
      respuesta: 'Una vez realizada la reserva, recibirás los datos de contacto del propietario en tu correo electrónico.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      <BackButton />
      
      <div className="max-w-4xl mx-auto pt-20">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">❓</span>
            <h1 className="text-3xl font-bold text-gray-800">Centro de Ayuda</h1>
          </div>

          <p className="text-gray-600 mb-8">
            Encuentra respuestas a las preguntas más frecuentes sobre Alquilala
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition">
                <summary className="font-semibold text-lg text-gray-800 cursor-pointer">
                  {faq.pregunta}
                </summary>
                <p className="mt-3 text-gray-600 pl-4">
                  {faq.respuesta}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-lg mb-2 text-blue-900">¿No encontraste lo que buscabas?</h3>
            <p className="text-blue-700 mb-4">Nuestro equipo de soporte está aquí para ayudarte</p>
            <button
              onClick={() => window.location.href = '/soporte'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}