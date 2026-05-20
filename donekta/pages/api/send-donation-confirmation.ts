import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { donorEmail, donorName, amount, communityName } = req.body

  try {
    await resend.emails.send({
      from: 'Donekta <noreply@donekta.com>',
      to: [donorEmail],
      subject: `💚 Confirmación de donación — ${communityName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 32px;">
            <div style="width: 36px; height: 36px; background: #10b981; border-radius: 50%;">
              <span style="color: white; font-size: 18px; line-height: 36px; display: block; text-align: center;">♥</span>
            </div>
            <span style="font-size: 20px; font-weight: 700; color: #111827;">Donekta</span>
          </div>

          <h1 style="font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 8px;">
            ¡Gracias por tu donación, ${donorName}!
          </h1>
          <p style="font-size: 15px; color: #6b7280; margin: 0 0 24px; line-height: 1.6;">
            Tu generosidad hace posible el trabajo de comunidades reales. Aquí está el resumen de tu aportación:
          </p>

          <div style="background: #f0fdf4; border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
            <p style="font-size: 13px; color: #065f46; margin: 0 0 8px;">Donación a</p>
            <p style="font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 16px;">${communityName}</p>
            <p style="font-size: 36px; font-weight: 900; color: #10b981; margin: 0;">$${Number(amount).toLocaleString()} MXN</p>
          </div>

          <p style="font-size: 14px; color: #6b7280; line-height: 1.7; margin-bottom: 24px;">
            Tu donación ha sido registrada y contribuye directamente al bienestar de la comunidad que elegiste apoyar.
            Gracias por ser parte de la red Donekta.
          </p>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 8px;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              Este es un comprobante de tu donación a través de Donekta. Guárdalo como referencia.
            </p>
          </div>
        </div>
      `
    })

    res.status(200).json({ ok: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to send email' })
  }
}
