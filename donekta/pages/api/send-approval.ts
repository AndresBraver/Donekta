import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, communityId } = req.body
  try {
    await resend.emails.send({
      from: 'Donekta <onboarding@resend.dev>',
      to: 'andresbraver@gmail.com',
      subject: '✅ Comunidad aprobada',
      html: `<p>La comunidad <strong>${email}</strong> ha sido aprobada.</p><p>Link de edición: ${process.env.NEXT_PUBLIC_SITE_URL}/community-edit?id=${communityId}</p>`,
    })
    res.status(200).json({ ok: true })
  } catch (e) {
    res.status(200).json({ ok: true })
  }
}
