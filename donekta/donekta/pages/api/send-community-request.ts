import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email } = req.body

  try {
    await resend.emails.send({
      from: 'Donekta <noreply@donekta.com>',
      to: ['andresbraver@gmail.com'],
      subject: '🏘️ Nueva solicitud de comunidad — Donekta',
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 32px;">
            <div style="width: 36px; height: 36px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 18px;">♥</span>
            </div>
            <span style="font-size: 20px; font-weight: 700; color: #111827;">Donekta</span>
          </div>

          <h1 style="font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 8px;">
            Nueva solicitud de comunidad
          </h1>
          <p style="font-size: 15px; color: #6b7280; margin: 0 0 24px; line-height: 1.6;">
            Un usuario se ha registrado como representante de una comunidad y está esperando aprobación.
          </p>

          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px;">Correo del solicitante</p>
            <p style="font-size: 15px; font-weight: 600; color: #111827; margin: 0;">${email}</p>
          </div>

          <p style="font-size: 14px; color: #6b7280; margin: 0 0 20px;">
            Para aprobar o rechazar esta solicitud, ingresa al panel de administración:
          </p>

          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin"
            style="display: inline-block; background: #10b981; color: white; font-weight: 600; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px;">
            Ver panel de administración →
          </a>

          <p style="font-size: 12px; color: #9ca3af; margin-top: 32px;">
            Si apruebas la solicitud, el usuario recibirá un correo con instrucciones para completar su perfil de comunidad.
          </p>
        </div>
      `
    })

    res.status(200).json({ ok: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to send email' })
  }
}
