import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextResponse } from 'next/server';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Solo procesamos pagos aprobados
    if (type !== 'payment') {
      return NextResponse.json({ received: true });
    }

    const payment = new Payment(client);
    const pagoInfo = await payment.get({ id: data.id });

    if (pagoInfo.status !== 'approved') {
      return NextResponse.json({ received: true });
    }

    // Extraer datos de la reserva
    const ref = JSON.parse(pagoInfo.external_reference || '{}');
    const {
      propiedadId,
      fechaInicio,
      fechaFin,
      noches,
      total,
      userEmail,
    } = ref;

    // Guardar reserva en Firestore via REST
    const PROJECT_ID = 'alquilala-77';
    const DATABASE = 'alquilala';
    const API_KEY = 'AIzaSyCfQxGT9EhJpv4vXZoMTHyy6Gl7Vih-f6w';

    const reservaData = {
      propiedadId: { stringValue: propiedadId || '' },
      fechaCheckIn: { stringValue: fechaInicio || '' },
      fechaCheckOut: { stringValue: fechaFin || '' },
      noches: { stringValue: String(noches || '') },
      precioTotal: { stringValue: String(total || '') },
      userEmail: { stringValue: userEmail || '' },
      estado: { stringValue: 'confirmada' },
      metodoPago: { stringValue: 'mercadopago' },
      pagoId: { stringValue: String(data.id) },
      fechaReserva: { stringValue: new Date().toISOString() },
    };

    await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE}/documents/reservas?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: reservaData }),
      }
    );

    return NextResponse.json({ received: true, status: 'reserva_creada' });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// MercadoPago también manda GET para verificar el endpoint
export async function GET() {
  return NextResponse.json({ status: 'webhook activo' });
}