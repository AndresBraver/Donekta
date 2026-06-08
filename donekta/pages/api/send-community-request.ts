import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email } = req.body
  try {
    await resend.emails.send({
      from: 'Donekta <onboarding@resend.dev>',
      to: 'andresbraver@gmail.com',
      subject: '🆕 Nueva solicitud de comunidad',
      html: `<p>Nueva solicitud de comunidad de: <strong>${email}</strong></p><p>Revisa en <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">el panel de admin</a>.</p>`,
    })
    res.status(200).json({ ok: true })
  } catch (e) {
    res.status(200).json({ ok: true })
  }
}
