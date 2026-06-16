import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const SECRET = process.env.OTP_SECRET || 'donekta-secret-2025'

function sign(data: string) {
  return crypto.createHmac('sha256', SECRET).update(data).digest('hex')
}

function createToken(email: string, code: string, type: string) {
  const expires = Date.now() + 10 * 60 * 1000
  const payload = `${email}|${code}|${type}|${expires}`
  const sig = sign(payload)
  return Buffer.from(`${payload}|${sig}`).toString('base64')
}

function verifyToken(token: string, email: string, code: string, type: string) {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8')
    const parts = decoded.split('|')
    if (parts.length !== 5) return { valid: false, error: 'Token inválido' }
    const [tEmail, tCode, tType, tExpires, tSig] = parts
    const payload = `${tEmail}|${tCode}|${tType}|${tExpires}`
    if (sign(payload) !== tSig) return { valid: false, error: 'Token inválido' }
    if (Date.now() > parseInt(tExpires)) return { valid: false, error: 'El código expiró. Solicita uno nuevo.' }
    if (tEmail !== email) return { valid: false, error: 'Token inválido' }
    if (tType !== type) return { valid: false, error: 'Token inválido' }
    if (tCode !== code) return { valid: false, error: 'Código incorrecto' }
    return { valid: true }
  } catch {
    return { valid: false, error: 'Token inválido' }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { action, email, code, token, password, newPassword, type = 'login' } = req.body

  if (action === 'send') {
    if (!email) return res.status(400).json({ error: 'Email requerido' })

    if (type === 'login') {
      if (!password) return res.status(400).json({ error: 'Contraseña requerida' })
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return res.status(400).json({ error: 'Correo o contraseña incorrectos' })
      await supabase.auth.signOut()
    }

    const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
    const tok = createToken(email, otp, type)

    const subject = type === 'reset' ? 'Recupera tu contraseña — Donekta' : 'Tu código de acceso — Donekta'
    const title = type === 'reset' ? 'Tu código para recuperar tu contraseña:' : 'Tu código de acceso:'

    try {
      await resend.emails.send({
        from: 'Donekta <hola@donekta.com>',
        to: email,
        subject,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;">
            <h1 style="color:#121826;font-size:24px;font-weight:900;text-align:center;margin-bottom:8px;">Donekta</h1>
            <p style="color:#6F737D;font-size:14px;text-align:center;margin-bottom:32px;">Dona con propósito</p>
            <div style="background:#EDFBF4;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
              <p style="color:#6F737D;font-size:14px;margin-bottom:16px;">${title}</p>
              <div style="font-size:48px;font-weight:900;color:#55B584;letter-spacing:12px;font-family:monospace;">${otp}</div>
              <p style="color:#9CA3AF;font-size:12px;margin-top:16px;">Expira en 10 minutos</p>
            </div>
            <p style="color:#9CA3AF;font-size:12px;text-align:center;">Si no solicitaste este código, ignora este correo.</p>
          </div>
        `
      })
      return res.status(200).json({ ok: true, token: tok })
    } catch (e: any) {
      return res.status(500).json({ error: 'Error al enviar correo' })
    }
  }

  if (action === 'verify') {
    if (!email || !code || !token) return res.status(400).json({ error: 'Datos incompletos' })
    const result = verifyToken(token, email, code, type)
    if (!result.valid) return res.status(400).json({ error: result.error })

    if (type === 'reset') {
      if (!newPassword) return res.status(400).json({ error: 'Nueva contraseña requerida' })
      try {
        const { data: { users } } = await supabase.auth.admin.listUsers()
        const user = users?.find((u: any) => u.email === email)
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
