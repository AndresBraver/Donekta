
import { useState } from 'react'
import { useRouter } from 'next/router'
import { X, Heart, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Props { onClose: () => void }

export default function AuthModal({ onClose }: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [userType, setUserType] = useState<'donor' | 'community' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const sendOtp = async (emailTo: string) => {
    await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailTo })
    })
  }

  const handleLogin = async () => {
    setError('')
    if (!email || !password) { setError('Por favor llena todos los campos.'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      await supabase.auth.signOut()
      await sendOtp(email)
      setStep('otp')
    } catch (e: any) {
      setError(e.message || 'Correo o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyLoginOtp = async () => {
    setError('')
    if (!otp) { setError('Ingresa el código que recibiste.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Código incorrecto')
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      if (email === 'andresbraver@gmail.com') {
        router.push('/admin')
      } else {
        const { data: comm } = await supabase.from('communities').select('id').eq('contact_email', email).eq('status', 'approved').single()
        router.push(comm ? '/community-edit' : '/donor')
      }
      onClose()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setError('')
    if (!email || !password) { setError('Por favor llena todos los campos.'); return }
    if (!userType) { setError('Elige si eres donador o comunidad.'); return }
    if (!acceptedTerms) { setError('Debes aceptar los Términos y Condiciones para continuar.'); return }
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
        await sendOtp(email)
        setStep('otp')
      }
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyRegisterOtp = async () => {
    setError('')
    if (!otp) { setError('Ingresa el código que recibiste.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Código incorrecto')
      router.push('/donor')
      onClose()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setError('')
    if (!email) { setError('Escribe tu correo primero.'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setResetSent(true)
    } catch (e: any) {
      setError(e.message || 'Error al enviar correo')
    } finally {
      setLoading(false)
    }
  }

  const TermsModal = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-black text-gray-900">Términos y Condiciones</h3>
          <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="overflow-y-auto p-5 text-sm text-gray-600 space-y-4">
          <p><strong className="text-gray-900">1. Aceptación</strong><br />Al usar Donekta, aceptas estos términos.</p>
          <p><strong className="text-gray-900">2. Servicio</strong><br />Donekta conecta donadores con comunidades verificadas en México. Cobramos 2% por donación para mantener el servicio.</p>
          <p><strong className="text-gray-900">3. Donaciones</strong><br />Las donaciones son voluntarias y no reembolsables salvo error técnico comprobable.</p>
          <p><strong className="text-gray-900">4. Comunidades</strong><br />Las comunidades son verificadas por Donekta. Nos reservamos el derecho de suspender comunidades que incumplan las políticas.</p>
          <p><strong className="text-gray-900">5. Pagos</strong><br />Los pagos se procesan de forma segura a través de Stripe. No almacenamos datos de tarjetas.</p>
          <p><strong className="text-gray-900">6. Responsabilidad</strong><br />Donekta actúa como intermediario y no es responsable por el uso de los fondos una vez transferidos.</p>
          <p><strong className="text-gray-900">7. Contacto</strong><br />andresbraver@gmail.com</p>
        </div>
        <div className="p-5 border-t border-gray-100">
          <button onClick={() => { setShowTerms(false); setAcceptedTerms(true) }}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-sm">
            Aceptar y cerrar
          </button>
        </div>
      </div>
    </div>
  )

  const PrivacyModal = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-black text-gray-900">Política de Privacidad</h3>
          <button onClick={() => setShowPrivacy(false)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="overflow-y-auto p-5 text-sm text-gray-600 space-y-4">
          <p><strong className="text-gray-900">1. Datos que recopilamos</strong><br />Nombre, correo electrónico y datos de donaciones. No almacenamos datos de tarjetas.</p>
          <p><strong className="text-gray-900">2. Uso de datos</strong><br />Para procesar donaciones, enviarte confirmaciones y mejorar la plataforma. No vendemos tus datos.</p>
          <p><strong className="text-gray-900">3. Seguridad</strong><br />Protegemos tus datos con encriptación SSL. Los pagos los procesa Stripe (PCI DSS).</p>
          <p><strong className="text-gray-900">4. Cookies</strong><br />Usamos cookies solo para mantener tu sesión activa.</p>
          <p><strong className="text-gray-900">5. Tus derechos</strong><br />Puedes solicitar eliminación de tu cuenta en: andresbraver@gmail.com</p>
          <p><strong className="text-gray-900">6. Retención</strong><br />Conservamos registros de donaciones por 5 años para cumplir con obligaciones fiscales.</p>
        </div>
        <div className="p-5 border-t border-gray-100">
          <button onClick={() => { setShowPrivacy(false); setAcceptedTerms(true) }}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-sm">
            Aceptar y cerrar
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="font-bold text-gray-900">Donekta</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            {step === 'otp' ? (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📧</div>
                  <h2 className="text-xl font-black text-gray-900 mb-2">Revisa tu correo</h2>
                  <p className="text-sm text-gray-500">Enviamos un código a</p>
                  <p className="font-semibold text-gray-900">{email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Código de 6 dígitos</label>
                  <input type="text" value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000" maxLength={6}
                    onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleVerifyLoginOtp() : handleVerifyRegisterOtp())}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-3xl tracking-widest font-mono focus:outline-none focus:border-emerald-400" />
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
                <button onClick={mode === 'login' ? handleVerifyLoginOtp : handleVerifyRegisterOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm">
                  {loading ? 'Verificando...' : 'Entrar →'}
                </button>
                <button onClick={() => { setStep('form'); setOtp(''); setError('') }}
                  className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">← Volver</button>
              </div>
            ) : (
              <div>
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                  <button onClick={() => { setMode('login'); setError('') }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                    Iniciar sesión
                  </button>
                  <button onClick={() => { setMode('register'); setError('') }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                    Registrarse
                  </button>
                </div>
                <div className="space-y-4">
                  {mode === 'register' && (
                    <>
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
                            📧 Tu solicitud será revisada en 1-3 días hábiles.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
                  </div>
                  {mode === 'login' && (
                    <button type="button" onClick={handleResetPassword} disabled={loading}
                      className="text-xs text-emerald-600 hover:text-emerald-700 text-right w-full -mt-2">
                      {resetSent ? '✓ Correo enviado — revisa tu bandeja' : '¿Olvidaste tu contraseña?'}
                    </button>
                  )}
                  {mode === 'register' && (
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 accent-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-gray-600">
                        Acepto los{' '}
                        <button type="button" onClick={() => setShowTerms(true)} className="text-emerald-600 underline font-medium">
                          Términos y Condiciones
                        </button>
                        {' '}y la{' '}
                        <button type="button" onClick={() => setShowPrivacy(true)} className="text-emerald-600 underline font-medium">
                          Política de Privacidad
                        </button>
                      </span>
                    </label>
                  )}
                  {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
                  <button onClick={mode === 'login' ? handleLogin : handleRegister}
                    disabled={loading || !email || !password}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm">
                    {loading ? 'Cargando...' : mode === 'login' ? 'Continuar →' : 'Crear cuenta'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showTerms && <TermsModal />}
      {showPrivacy && <PrivacyModal />}
    </>
  )
}
