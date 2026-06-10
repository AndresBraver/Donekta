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
    return res.status(400).json({ error: 'El código expiró. Solicita uno nuevo.' })
  }

  // Delete used code
  await supabase.from('otp_codes').delete().eq('email', email)

  // Generate session for user
  const { data: userData } = await supabase.auth.admin.listUsers()
  const user = userData?.users?.find(u => u.email === email)
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

  const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })

  if (sessionError) return res.status(500).json({ error: 'Error al crear sesión' })

  res.status(200).json({ ok: true, link: sessionData.properties?.action_link })
}
