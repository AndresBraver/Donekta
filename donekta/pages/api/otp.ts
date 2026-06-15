import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Single in-memory store for all OTP types
const store: Record<string, { code: string; expires: number }> = {}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { action, email, code, newPassword, type = 'login' } = req.body

  if (action === 'send') {
    if (!email) return res.status(400).json({ error: 'Email requerido' })
    const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
    store[`${type}_${email}`] = { code: otp, expires: Date.now() + 10 * 60 * 1000 }

    const subject = type === 'reset' ? 'Recupera tu contraseña — Donekta' : 'Tu código de acceso — Donekta'
    const title = type === 'reset' ? 'Tu código para recuperar tu contraseña:' : 'Tu código de acceso:'

    try {
      await resend.emails.send({
        from: 'Donekta <hola@donekta.com>',
        to: email,
        subject,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;">
            <h1 style="color:#121826;font-size:24px;font-weight:900;text-align:center;">Donekta</h1>
            <div style="background:#EDFBF4;border-radius:16px;padding:32px;text-align:center;margin:24px 0;">
              <p style="color:#6F737D;font-size:14px;margin-bottom:16px;">${title}</p>
              <div style="font-size:48px;font-weight:900;color:#55B584;letter-spacing:12px;font-family:monospace;">${otp}</div>
              <p style="color:#9CA3AF;font-size:12px;margin-top:16px;">Expira en 10 minutos</p>
            </div>
            <p style="color:#9CA3AF;font-size:12px;text-align:center;">Si no solicitaste este código, ignora este correo.</p>
          </div>
        `
      })
      return res.status(200).json({ ok: true })
    } catch (e: any) {
      return res.status(500).json({ error: 'Error al enviar correo' })
    }
  }

  if (action === 'verify') {
    if (!email || !code) return res.status(400).json({ error: 'Datos incompletos' })
    const key = `${type}_${email}`
    const stored = store[key]
    if (!stored) return res.status(400).json({ error: 'Solicita un nuevo código' })
    if (Date.now() > stored.expires) {
      delete store[key]
      return res.status(400).json({ error: 'El código expiró. Solicita uno nuevo.' })
    }
    if (stored.code !== code) return res.status(400).json({ error: 'Código incorrecto' })
    delete store[key]

    // If reset, update password
    if (type === 'reset' && newPassword) {
      try {
        const { data: users } = await supabase.auth.admin.listUsers()
        const user = users?.users?.find((u: any) => u.email === email)
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
        const { error } = await supabase.auth.admin.updateUserById(user.id, { password: newPassword })
        if (error) throw error
      } catch (e: any) {
        return res.status(500).json({ error: e.message || 'Error al actualizar contraseña' })
      }
    }

    return res.status(200).json({ ok: true })
  }

  return res.status(400).json({ error: 'Acción inválida' })
}
