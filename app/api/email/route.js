import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { tipo, email, nombre, titulo, ubicacion, motivo } = await request.json();

    if (!email || !tipo) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    let subject = '';
    let html = '';

    if (tipo === 'aprobada') {
      subject = `✅ Tu propiedad "${titulo}" fue aprobada — Alquilala`;
      html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:#faf6f1;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf6f1;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:600px;width:100%;">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#1e3a5f,#0f2942);padding:40px 40px 32px;text-align:center;">
                      <div style="margin-bottom:16px;">
                        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="40" height="40" rx="8" fill="white"/>
                          <rect x="10" y="20" width="20" height="16" fill="#1e3a5f"/>
                          <path d="M20 8 L32 20 L8 20 Z" fill="#1e3a5f"/>
                          <rect x="16" y="24" width="8" height="8" fill="white"/>
                        </svg>
                      </div>
                      <h1 style="color:white;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">alquilala</h1>
                      <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:14px;">Gestión profesional de alquileres temporales</p>
                    </td>
                  </tr>

                  <!-- Icono éxito -->
                  <tr>
                    <td style="padding:40px 40px 0;text-align:center;">
                      <div style="width:72px;height:72px;background:#d1fae5;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px;">
                        <span style="font-size:36px;">✅</span>
                      </div>
                      <h2 style="color:#1e3a5f;margin:0 0 12px;font-size:28px;font-weight:800;">¡Tu propiedad fue aprobada!</h2>
                      <p style="color:#666;margin:0;font-size:16px;line-height:1.6;">
                        Hola <strong>${nombre}</strong>, excelentes noticias. Tu propiedad ya está activa en nuestra plataforma.
                      </p>
                    </td>
                  </tr>

                  <!-- Card propiedad -->
                  <tr>
                    <td style="padding:32px 40px;">
                      <div style="background:#f8f9fa;border-radius:12px;padding:24px;border-left:4px solid #2e7d32;">
                        <p style="margin:0 0 8px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Propiedad aprobada</p>
                        <h3 style="margin:0 0 6px;color:#1e3a5f;font-size:20px;font-weight:700;">${titulo}</h3>
                        <p style="margin:0;color:#666;font-size:15px;">📍 ${ubicacion}</p>
                      </div>
                    </td>
                  </tr>

                  <!-- Qué sigue -->
                  <tr>
                    <td style="padding:0 40px 32px;">
                      <h3 style="color:#1e3a5f;font-size:18px;font-weight:700;margin:0 0 16px;">¿Qué pasa ahora?</h3>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                            <span style="font-size:20px;margin-right:12px;">🚀</span>
                            <span style="color:#333;font-size:15px;">Publicamos tu propiedad en <strong>Airbnb, Booking y MercadoLibre</strong></span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                            <span style="font-size:20px;margin-right:12px;">📅</span>
                            <span style="color:#333;font-size:15px;">Comenzamos a <strong>gestionar reservas</strong> de inmediato</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                            <span style="font-size:20px;margin-right:12px;">🧹</span>
                            <span style="color:#333;font-size:15px;">Coordinamos <strong>limpieza y mantenimiento</strong> entre huéspedes</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:12px 0;">
                            <span style="font-size:20px;margin-right:12px;">💰</span>
                            <span style="color:#333;font-size:15px;">Recibís <strong>reportes de ingresos</strong> transparentes</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- CTA -->
                  <tr>
                    <td style="padding:0 40px 40px;text-align:center;">
                      <a href="https://alquilala.vercel.app/mis-propiedades"
                        style="display:inline-block;background:#c9956b;color:white;text-decoration:none;padding:16px 40px;border-radius:8px;font-weight:700;font-size:16px;">
                        Ver mis propiedades →
                      </a>
                      <p style="margin:20px 0 0;color:#999;font-size:13px;">
                        ¿Tenés alguna pregunta? Escribinos a 
                        <a href="mailto:gosanti2000@gmail.com" style="color:#1e3a5f;">gosanti2000@gmail.com</a>
                        o por <a href="https://wa.me/59895532294" style="color:#25D366;">WhatsApp</a>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f8f9fa;padding:24px 40px;text-align:center;border-top:1px solid #f0f0f0;">
                      <p style="margin:0;color:#999;font-size:13px;">© 2025 Alquilala — Montevideo, Uruguay</p>
                      <p style="margin:8px 0 0;color:#bbb;font-size:12px;">Recibís este email porque publicaste una propiedad en alquilala.vercel.app</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    }

    if (tipo === 'rechazada') {
      subject = `❌ Tu propiedad "${titulo}" necesita ajustes — Alquilala`;
      html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:#faf6f1;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf6f1;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:600px;width:100%;">

                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#1e3a5f,#0f2942);padding:40px 40px 32px;text-align:center;">
                      <div style="margin-bottom:16px;">
                        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="40" height="40" rx="8" fill="white"/>
                          <rect x="10" y="20" width="20" height="16" fill="#1e3a5f"/>
                          <path d="M20 8 L32 20 L8 20 Z" fill="#1e3a5f"/>
                          <rect x="16" y="24" width="8" height="8" fill="white"/>
                        </svg>
                      </div>
                      <h1 style="color:white;margin:0;font-size:24px;font-weight:800;">alquilala</h1>
                      <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:14px;">Gestión profesional de alquileres temporales</p>
                    </td>
                  </tr>

                  <!-- Contenido -->
                  <tr>
                    <td style="padding:40px 40px 0;text-align:center;">
                      <div style="width:72px;height:72px;background:#fff3e0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:24px;">
                        <span style="font-size:36px;">⚠️</span>
                      </div>
                      <h2 style="color:#1e3a5f;margin:0 0 12px;font-size:26px;font-weight:800;">Tu propiedad necesita ajustes</h2>
                      <p style="color:#666;margin:0;font-size:16px;line-height:1.6;">
                        Hola <strong>${nombre}</strong>, revisamos tu propiedad y encontramos algunos puntos a mejorar antes de publicarla.
                      </p>
                    </td>
                  </tr>

                  <!-- Card propiedad -->
                  <tr>
                    <td style="padding:32px 40px;">
                      <div style="background:#f8f9fa;border-radius:12px;padding:24px;border-left:4px solid #f59e0b;">
                        <p style="margin:0 0 8px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Propiedad en revisión</p>
                        <h3 style="margin:0 0 6px;color:#1e3a5f;font-size:20px;font-weight:700;">${titulo}</h3>
                        <p style="margin:0;color:#666;font-size:15px;">📍 ${ubicacion}</p>
                      </div>
                    </td>
                  </tr>

                  ${motivo ? `
                  <!-- Motivo -->
                  <tr>
                    <td style="padding:0 40px 32px;">
                      <div style="background:#fff3e0;border-radius:12px;padding:24px;">
                        <h3 style="color:#92400e;margin:0 0 12px;font-size:16px;font-weight:700;">📋 Motivo:</h3>
                        <p style="color:#78350f;margin:0;font-size:15px;line-height:1.7;">${motivo}</p>
                      </div>
                    </td>
                  </tr>
                  ` : ''}

                  <!-- Qué hacer -->
                  <tr>
                    <td style="padding:0 40px 32px;">
                      <h3 style="color:#1e3a5f;font-size:18px;font-weight:700;margin:0 0 16px;">¿Qué podés hacer?</h3>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                            <span style="font-size:20px;margin-right:12px;">📷</span>
                            <span style="color:#333;font-size:15px;">Agregar fotos de mejor calidad o más ángulos</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
                            <span style="font-size:20px;margin-right:12px;">📝</span>
                            <span style="color:#333;font-size:15px;">Completar todos los datos de la propiedad</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:12px 0;">
                            <span style="font-size:20px;margin-right:12px;">💬</span>
                            <span style="color:#333;font-size:15px;">Contactarnos si tenés dudas sobre los requisitos</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- CTA -->
                  <tr>
                    <td style="padding:0 40px 40px;text-align:center;">
                      <a href="https://alquilala.vercel.app/publicar"
                        style="display:inline-block;background:#1e3a5f;color:white;text-decoration:none;padding:16px 40px;border-radius:8px;font-weight:700;font-size:16px;">
                        Volver a publicar →
                      </a>
                      <p style="margin:20px 0 0;color:#999;font-size:13px;">
                        ¿Necesitás ayuda? Escribinos a 
                        <a href="mailto:gosanti2000@gmail.com" style="color:#1e3a5f;">gosanti2000@gmail.com</a>
                        o por <a href="https://wa.me/59895532294" style="color:#25D366;">WhatsApp</a>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f8f9fa;padding:24px 40px;text-align:center;border-top:1px solid #f0f0f0;">
                      <p style="margin:0;color:#999;font-size:13px;">© 2025 Alquilala — Montevideo, Uruguay</p>
                      <p style="margin:8px 0 0;color:#bbb;font-size:12px;">Recibís este email porque publicaste una propiedad en alquilala.vercel.app</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;
    }

    const data = await resend.emails.send({
      from: 'Alquilala <onboarding@resend.dev>',
      to: [email],
      subject,
      html,
    });

    return NextResponse.json({ success: true, id: data.id });

  } catch (error) {
    console.error('Error enviando email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}