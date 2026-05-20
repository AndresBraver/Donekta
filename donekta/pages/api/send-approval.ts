import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email } = req.body
  try {
    await resend.emails.send({
      from: 'Donekta <noreply@donekta.com>',
      to: [email],
      subject: '✅ Tu comunidad fue aprobada — Donekta',
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 32px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px">
            <div style="width:36px;height:36px;background:#10b981;border-radius:50%;text-align:center;line-height:36px;font-size:18px;color:white;">♥</div>
            <span style="font-size:20px;font-weight:700;color:#111827">Donekta</span>
          </div>
          <h1 style="font-size:22px;font-weight:800;color:#111827;margin:0 0 8px">¡Tu comunidad fue aprobada! 🎉</h1>
          <p style="font-size:15px;color:#6b7280;margin:0 0 24px;line-height:1.6">
            Nos complace informarte que tu solicitud de registro como comunidad ha sido aprobada. Ya puedes completar tu perfil y aparecer en la plataforma.
          </p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/community-register"
            style="display:inline-block;background:#10b981;color:white;font-weight:600;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px;">
            Completar mi perfil de comunidad →
          </a>
          <p style="font-size:12px;color:#9ca3af;margin-top:32px">¿Tienes preguntas? Escríbenos a andresbraver@gmail.com</p>
        </div>
      `
    })
    res.status(200).json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Failed' })
  }
}
