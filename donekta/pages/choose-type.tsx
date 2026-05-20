import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Heart, Users, CheckCircle, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ChooseType() {
  const router = useRouter()
  const [selected, setSelected] = useState<'donor' | 'community' | null>(null)
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/'); return }
      setUserEmail(data.session.user.email || '')
    })
  }, [])

  const handleContinue = async () => {
    if (!selected) return
    setLoading(true)

    if (selected === 'donor') {
      router.push('/donor')
      return
    }

    // Save community request to Supabase
    try {
      await supabase.from('communities').insert([{
        name: userEmail.split('@')[0],
        contact_email: userEmail,
        status: 'pending',
        category: 'Otro',
        goal_amount: 0,
        raised_amount: 0,
      }])
    } catch (_) {}

    // Send email notification
    try {
      await fetch('/api/send-community-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      })
    } catch (_) {}

    router.push('/community-pending')
  }

  return (
    <>
      <Head><title>¿Cómo deseas unirte? — Donekta</title></Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Donekta</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-black text-gray-900 text-center mb-2">¿Cómo deseas unirte?</h1>
            <p className="text-gray-500 text-sm text-center mb-8">Cuéntanos tu rol para personalizar tu experiencia</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button onClick={() => setSelected('donor')}
                className={`relative rounded-2xl border-2 p-6 text-left transition-all ${selected === 'donor' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                {selected === 'donor' && <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-emerald-500" />}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${selected === 'donor' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  <Heart className={`w-6 h-6 ${selected === 'donor' ? 'text-emerald-500 fill-emerald-200' : 'text-gray-400'}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Donador</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Quiero apoyar comunidades con mis donaciones</p>
              </button>

              <button onClick={() => setSelected('community')}
                className={`relative rounded-2xl border-2 p-6 text-left transition-all ${selected === 'community' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                {selected === 'community' && <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-emerald-500" />}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${selected === 'community' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  <Users className={`w-6 h-6 ${selected === 'community' ? 'text-emerald-500' : 'text-gray-400'}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Comunidad</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Represento una comunidad que necesita apoyo</p>
              </button>
            </div>

            {selected === 'community' && (
              <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                <Send className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Se enviará una solicitud a nuestro equipo. Tu registro debe ser aprobado antes de aparecer en la plataforma. Recibirás respuesta en 1–3 días hábiles.
                </p>
              </div>
            )}

            <button onClick={handleContinue} disabled={!selected || loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              {loading ? 'Enviando...' : selected === 'community' ? 'Solicitar registro como Comunidad' : 'Continuar como Donador'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
