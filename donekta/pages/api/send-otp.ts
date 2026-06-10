import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// In-memory store (works for single instance, fine for now)
const otpStore: Record<string, { code: string; expires: number }> = {}

export { otpStore }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email requerido' })

  const code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
  const expires = Date.now() + 10 * 60 * 1000 // 10 min

  otpStore[email] = { code, expires }

  try {
    await resend.emails.send({
      from: 'Donekta <hola@donekta.com>',
      to: email,
      subject: 'Tu código de acceso — Donekta',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #121826; font-size: 24px; font-weight: 900; margin: 0;">Donekta</h1>
            <p style="color: #6F737D; font-size: 14px; margin-top: 8px;">Dona con propósito</p>
          </div>
          <div style="background: #EDFBF4; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <p style="color: #6F737D; font-size: 14px; margin-bottom: 16px;">Tu código de acceso es:</p>
            <div style="font-size: 48px; font-weight: 900; color: #55B584; letter-spacing: 12px; font-family: monospace;">${code}</div>
            <p style="color: #9CA3AF; font-size: 12px; margin-top: 16px;">Expira en 10 minutos</p>
          </div>
          <p style="color: #9CA3AF; font-size: 12px; text-align: center;">Si no solicitaste este código, ignora este correo.</p>
        </div>
      `
    })
    res.status(200).json({ ok: true })
  } catch (e: any) {
    res.status(500).json({ error: 'Error al enviar correo' })
  }
}
