import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Heart } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  const handleReset = async () => {
    setError('')
    if (!password || !confirm) { setError('Llena todos los campos.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      setTimeout(() => router.push('/'), 2000)
    } catch (e: any) {
      setError(e.message || 'Error al actualizar contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Recuperar contraseña — Donekta</title></Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Donekta</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {done ? (
              <div className="text-center">
                <div className="text-4xl mb-4">✅</div>
                <h2 className="text-xl font-black text-gray-900 mb-2">¡Contraseña actualizada!</h2>
                <p className="text-sm text-gray-500">Redirigiendo al inicio...</p>
              </div>
            ) : !ready ? (
              <div className="text-center">
                <div className="text-4xl mb-4">🔗</div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Enlace inválido</h2>
                <p className="text-sm text-gray-500 mb-4">Este enlace ya expiró o es inválido.</p>
                <a href="/" className="text-emerald-600 text-sm font-medium hover:text-emerald-700">← Volver al inicio</a>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black text-gray-900 mb-6">Nueva contraseña</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nueva contraseña</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                      placeholder="Repite tu contraseña"
                      onKeyDown={e => e.key === 'Enter' && handleReset()}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
                  </div>
                  {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
                  <button onClick={handleReset} disabled={loading || !password || !confirm}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm">
                    {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
