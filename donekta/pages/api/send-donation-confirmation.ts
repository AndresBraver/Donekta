import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { donorEmail, donorName, amount, communityName, dedicateTo } = req.body
  try {
    await resend.emails.send({
      from: 'Donekta <onboarding@resend.dev>',
      to: donorEmail,
      subject: '💚 Confirmación de donación — Donekta',
      html: `<p>Hola ${donorName},</p><p>Tu donación de <strong>$${amount} MXN</strong> a <strong>${communityName}</strong> fue procesada exitosamente.${dedicateTo ? ` Dedicada a ${dedicateTo}.` : ''}</p><p>Gracias por donar con propósito.</p>`,
    })
    res.status(200).json({ ok: true })
  } catch (e) {
    res.status(200).json({ ok: true })
  }
}
