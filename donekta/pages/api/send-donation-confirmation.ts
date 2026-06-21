import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { donorName, donorEmail, amount, communityName, frequency } = req.body

  if (!donorEmail) return res.status(400).json({ error: 'Email requerido' })

  const name = donorName || 'Donador'
  const freqText = frequency && frequency !== 'única' ? ` (donación ${frequency})` : ''

  try {
    await resend.emails.send({
      from: 'Donekta <hola@donekta.com>',
      to: donorEmail,
      subject: '¡Gracias por tu donación! — Donekta',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;">
          <h1 style="color:#121826;font-size:22px;font-weight:900;text-align:center;margin-bottom:4px;">Donekta</h1>
          <p style="color:#6F737D;font-size:13px;text-align:center;margin-bottom:32px;">Dona con propósito</p>
          
          <div style="background:#EDFBF4;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
            <div style="font-size:40px;margin-bottom:12px;">💚</div>
            <p style="color:#121826;font-size:18px;font-weight:700;margin-bottom:8px;">${name}, ¡muchas gracias por donar en Donekta!</p>
            <p style="color:#6F737D;font-size:14px;line-height:1.6;">Tu donación de <strong style="color:#55B584;">$${Number(amount).toLocaleString()} MXN</strong>${freqText}${communityName ? ` a <strong>${communityName}</strong>` : ''} ya está en camino para generar un impacto real.</p>
          </div>

          <p style="color:#9CA3AF;font-size:12px;text-align:center;">Gracias por ser parte del cambio. — El equipo de Donekta</p>
        </div>
      `
    })
    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: e.message || 'Error al enviar correo' })
  }
}
