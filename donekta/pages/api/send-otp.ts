import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email requerido' })

  // Check user exists
  const { data: users } = await supabase.auth.admin.listUsers()
  const userExists = users?.users?.find(u => u.email === email)
  if (!userExists) return res.status(404).json({ error: 'No encontramos una cuenta con ese correo' })

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

  // Save code in a temp table or user metadata
  await supabase.from('otp_codes').upsert([{ email, code, expires_at: expires }])

  // Send email
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
