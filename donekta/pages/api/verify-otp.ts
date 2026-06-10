import type { NextApiRequest, NextApiResponse } from 'next'
import { otpStore } from './send-otp'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, code } = req.body
  if (!email || !code) return res.status(400).json({ error: 'Datos incompletos' })

  const stored = otpStore[email]

  if (!stored) return res.status(400).json({ error: 'Solicita un nuevo código' })
  if (Date.now() > stored.expires) {
    delete otpStore[email]
    return res.status(400).json({ error: 'El código expiró. Solicita uno nuevo.' })
  }
  if (stored.code !== code) return res.status(400).json({ error: 'Código incorrecto' })

  delete otpStore[email]
  res.status(200).json({ ok: true, verified: true })
}
