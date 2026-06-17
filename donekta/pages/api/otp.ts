
import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || ''
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''

async function redisSet(key: string, value: string, exSeconds: number) {
  await fetch(`${REDIS_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}/EX/${exSeconds}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
  })
}

async function redisGet(key: string): Promise<string | null> {
  const r = await fetch(`${REDIS_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
  })
  const d = await r.json()
  return d.result ?? null
}

async function redisDel(key: string) {
  await fetch(`${REDIS_URL}/del/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` }
  })
}

async function sendEmail(to: string, code: string, type: string) {
  const subject = type === 'reset' ? 'Recupera tu contraseña — Donekta' : 'Tu código de acceso — Donekta'
  const title = type === 'reset' ? 'Código para recuperar tu contraseña:' : 'Tu código de acceso:'
  await resend.emails.send({
    from: 'Donekta <hola@donekta.com>',
    to,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;">
        <h1 style="color:#121826;font-size:22px;font-weight:900;text-align:center;margin-bottom:4px;">Donekta</h1>
        <p style="color:#6F737D;font-size:13px;text-align:center;margin-bottom:32px;">Dona con propósito</p>
        <div style="background:#EDFBF4;border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
          <p style="color:#6F737D;font-size:14px;margin-bottom:20px;">${title}</p>
          <div style="font-size:52px;font-weight:900;color:#55B584;letter-spacing:14px;font-family:monospace;">${code}</div>
          <p style="color:#9CA3AF;font-size:12px;margin-top:16px;">Expira en 10 minutos.</p>
        </div>
        <p style="color:#9CA3AF;font-size:11px;text-align:center;">Si no solicitaste esto, ignora este correo.</p>
      </div>
    `
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { action, email, code, newPassword, type = 'login' } = req.body

  if (action === 'send') {
    if (!email) return res.status(400).json({ error: 'Email requerido' })
    const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
    const key = `otp:${type}:${email}`
    await redisSet(key, otp, 600) // 10 min
    try {
      await sendEmail(email, otp, type)
      return res.status(200).json({ ok: true })
    } catch (e: any) {
      return res.status(500).json({ error: 'Error al enviar correo' })
    }
  }

  if (action === 'verify') {
    if (!email || !code) return res.status(400).json({ error: 'Datos incompletos' })
    const key = `otp:${type}:${email}`
    const stored = await redisGet(key)
    if (!stored) return res.status(400).json({ error: 'Solicita un nuevo código' })
    if (stored !== code) return res.status(400).json({ error: 'Código incorrecto' })
    await redisDel(key)

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
