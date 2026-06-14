import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, code } = req.body
  if (!email || !code) return res.status(400).json({ error: 'Datos incompletos' })

  const { data, error } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('email', email)
    .eq('code', code)
    .single()

  if (error || !data) return res.status(400).json({ error: 'Código incorrecto' })
  if (new Date(data.expires_at) < new Date()) {
    await supabase.from('otp_codes').delete().eq('email', email)
    return res.status(400).json({ error: 'El código expiró. Solicita uno nuevo.' })
  }

  await supabase.from('otp_codes').delete().eq('email', email)
  res.status(200).json({ ok: true, verified: true })
}
