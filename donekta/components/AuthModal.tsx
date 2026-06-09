import { useState } from 'react'
import { useRouter } from 'next/router'
import { X, Heart, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Props { onClose: () => void }

export default function AuthModal({ onClose }: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [userType, setUserType] = useState<'donor' | 'community' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async () => {
    setError('')
    if (!email || !password) { setError('Por favor llena todos los campos.'); return }
    if (!userType) { setError('Elige si eres donador o comunidad.'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name, user_type: userType } }
      })
      if (error) throw error
      if (userType === 'community') {
        await supabase.from('communities').insert([{
          name: name || email.split('@')[0],
          contact_email: email,
          status: 'pending',
          category: 'Otro',
          goal_amount: 0,
          raised_amount: 0,
        }])
        await fetch('/api/send-community-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        }).catch(() => {})
        onClose()
        router.push('/community-pending')
      } else {
        router.push('/donor')
        onClose()
      }
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async () => {
    setError('')
    if (!email) { setError('Escribe tu correo electrónico.'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }
      })
      if (error) throw error
      setStep('otp')
    } catch (e: any) {
      setError(e.message || 'Error al enviar el código')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setError('')
    if (!otp) { setError('Ingresa el código que recibiste.'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      })
      if (error) throw error

      if (email === 'andresbraver@gmail.com') {
        router.push('/admin')
      } else {
        const { data: comm } = await supabase
          .from('communities')
          .select('id')
          .eq('contact_email', email)
          .eq('status', 'approved')
          .single()
        if (comm) {
          router.push('/community-edit')
        } else {
          router.push('/donor')
        }
      }
      onClose()
    } catch (e: any) {
      setError(e.message || 'Código incorrecto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-bold text-gray-900">Donekta</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button onClick={() => { setMode('login'); setStep('email'); setError('') }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              Iniciar sesión
            </button>
            <button onClick={() => { setMode('register'); setStep('email'); setError('') }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              Registrarse
            </button>
          </div>

          {/* LOGIN FLOW */}
          {mode === 'login' && (
            <div className="space-y-4">
              {step === 'email' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="tu@email.com" onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
                  </div>
                  {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
                  <button onClick={handleSendOtp} disabled={loading || !email}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm">
                    {loading ? 'Enviando...' : 'Enviar código →'}
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">Enviamos un código de 6 dígitos a</p>
                    <p className="font-semibold text-gray-900">{email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Código de verificación</label>
                    <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456" maxLength={6} onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 text-center text-2xl tracking-widest font-mono" />
                  </div>
                  {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
                  <button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm">
                    {loading ? 'Verificando...' : 'Entrar'}
                  </button>
                  <button onClick={() => { setStep('email'); setOtp(''); setError('') }}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">
                    ← Cambiar correo
                  </button>
                </>
              )}
            </div>
          )}

          {/* REGISTER FLOW */}
          {mode === 'register' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Cómo deseas unirte?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setUserType('donor')}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${userType === 'donor' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Heart className={`w-5 h-5 mb-2 ${userType === 'donor' ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <p className="font-semibold text-gray-900 text-sm">Donador</p>
                    <p className="text-xs text-gray-500 mt-0.5">Quiero apoyar comunidades</p>
                  </button>
                  <button onClick={() => setUserType('community')}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${userType === 'community' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Users className={`w-5 h-5 mb-2 ${userType === 'community' ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <p className="font-semibold text-gray-900 text-sm">Comunidad</p>
                    <p className="text-xs text-gray-500 mt-0.5">Represento una comunidad</p>
                  </button>
                </div>
                {userType === 'community' && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                    📧 Tu solicitud será revisada. Recibirás respuesta en 1-3 días hábiles.
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
              </div>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
              <button onClick={handleRegister} disabled={loading || !email || !password}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm">
                {loading ? 'Cargando...' : 'Crear cuenta'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
