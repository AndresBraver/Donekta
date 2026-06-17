import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const SECRET = process.env.OTP_SECRET || 'donekta-otp-secret-2025-xyz'

function makeToken(email: string, code: string, type: string): string {
  const expires = Date.now() + 10 * 60 * 1000
  const data = `${email}::${code}::${type}::${expires}`
  const sig = crypto.createHmac('sha256', SECRET).update(data).digest('hex')
  return Buffer.from(JSON.stringify({ data, sig })).toString('base64url')
}

function checkToken(token: string, email: string, code: string, type: string): { ok: boolean; error?: string } {
  try {
    const { data, sig } = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'))
    const expectedSig = crypto.createHmac('sha256', SECRET).update(data).digest('hex')
    if (sig !== expectedSig) return { ok: false, error: 'Token inválido' }
    const [tEmail, tCode, tType, tExpires] = data.split('::')
    if (tEmail !== email) return { ok: false, error: 'Token inválido' }
    if (tType !== type) return { ok: false, error: 'Token inválido' }
    if (Date.now() > parseInt(tExpires)) return { ok: false, error: 'El código expiró. Solicita uno nuevo.' }
    if (tCode !== code) return { ok: false, error: 'Código incorrecto' }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Token inválido' }
  }
}

async function sendEmail(to: string, code: string, type: string) {
  const subject = type === 'reset' ? 'Recupera tu contraseña — Donekta' : 'Tu código de acceso — Donekta'
  const title = type === 'reset' ? 'Código para recuperar tu contraseña:' : 'Tu código de acceso:'
  await resend.emails.send({
    from: 'Donekta <hola@donekta.com>',
    to,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#fff;">
        <h1 style="color:#121826;font-size:22px;font-weight:900;text-align:center;margin-bottom:4px;">Donekta</h1>
        <p style="color:#6F737D;font-size:13px;text-align:center;margin-bottom:32px;">Dona con propósito</p>
        <div style="background:#EDFBF4;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
          <p style="color:#6F737D;font-size:14px;margin-bottom:20px;">${title}</p>
          <div style="font-size:52px;font-weight:900;color:#55B584;letter-spacing:14px;font-family:monospace;">${code}</div>
          <p style="color:#9CA3AF;font-size:12px;margin-top:16px;">Expira en 10 minutos. No compartas este código.</p>
        </div>
        <p style="color:#9CA3AF;font-size:11px;text-align:center;">Si no solicitaste esto, ignora este correo.</p>
      </div>
    `
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { action, email, code, token, newPassword, type = 'login' } = req.body

  // SEND OTP
  if (action === 'send') {
    if (!email) return res.status(400).json({ error: 'Email requerido' })
    const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
    const tok = makeToken(email, otp, type)
    try {
      await sendEmail(email, otp, type)
      return res.status(200).json({ ok: true, token: tok })
    } catch (e: any) {
      return res.status(500).json({ error: 'Error al enviar correo: ' + e.message })
    }
  }

  // VERIFY OTP
  if (action === 'verify') {
    if (!email || !code || !token) return res.status(400).json({ error: 'Datos incompletos' })
    const result = checkToken(token, email, code, type)
    if (!result.ok) return res.status(400).json({ error: result.error })

    // If reset: update password
    if (type === 'reset') {
      if (!newPassword) return res.status(400).json({ error: 'Nueva contraseña requerida' })
      try {
        const { data: { users } } = await supabase.auth.admin.listUsers()
        const user = users?.find((u: any) => u.email === email)
        if (!user) return res.status(404).json({ error: 'No encontramos una cuenta con ese correo' })
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
