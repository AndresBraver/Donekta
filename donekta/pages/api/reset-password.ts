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
  const { action, email, code, newPassword } = req.body

  if (action === 'send') {
    if (!email) return res.status(400).json({ error: 'Email requerido' })
    const otp = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    
    await supabase.from('otp_codes').upsert([{ 
      email, code: otp, expires_at: expires, type: 'reset' 
    }], { onConflict: 'email,type' })

    try {
      await resend.emails.send({
        from: 'Donekta <hola@donekta.com>',
        to: email,
        subject: 'Recupera tu contraseña — Donekta',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;">
            <h1 style="color:#121826;font-size:24px;font-weight:900;text-align:center;">Donekta</h1>
            <div style="background:#EDFBF4;border-radius:16px;padding:32px;text-align:center;margin:24px 0;">
              <p style="color:#6F737D;font-size:14px;margin-bottom:16px;">Tu código para recuperar tu contraseña:</p>
              <div style="font-size:48px;font-weight:900;color:#55B584;letter-spacing:12px;font-family:monospace;">${otp}</div>
              <p style="color:#9CA3AF;font-size:12px;margin-top:16px;">Expira en 10 minutos</p>
            </div>
          </div>
        `
      })
      return res.status(200).json({ ok: true })
    } catch (e: any) {
      return res.status(500).json({ error: 'Error al enviar correo' })
    }
  }

  if (action === 'verify') {
    if (!email || !code || !newPassword) return res.status(400).json({ error: 'Datos incompletos' })
    
    const { data, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('type', 'reset')
      .single()

    if (error || !data) return res.status(400).json({ error: 'Código incorrecto' })
    if (new Date(data.expires_at) < new Date()) {
      await supabase.from('otp_codes').delete().eq('email', email).eq('type', 'reset')
      return res.status(400).json({ error: 'El código expiró. Solicita uno nuevo.' })
    }
    await supabase.from('otp_codes').delete().eq('email', email).eq('type', 'reset')

    try {
      const { data: users } = await supabase.auth.admin.listUsers()
      const user = users?.users?.find((u: any) => u.email === email)
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, { password: newPassword })
      if (updateError) throw updateError
      return res.status(200).json({ ok: true })
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Error al actualizar contraseña' })
    }
  }

  return res.status(400).json({ error: 'Acción inválida' })
}
