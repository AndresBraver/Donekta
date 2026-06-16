import { useState } from 'react'
import { useRouter } from 'next/router'
import { X, Heart, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Props { onClose: () => void }
type Mode = 'login' | 'register' | 'reset'
type Step = 'form' | 'otp' | 'new-password'

export default function AuthModal({ onClose }: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [step, setStep] = useState<Step>('form')
  const [userType, setUserType] = useState<'donor' | 'community' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const resetState = (newMode: Mode) => {
    setMode(newMode); setStep('form'); setOtp(''); setError('')
    setNewPassword(''); setConfirmPassword('')
  }

  // LOGIN: verify password → send OTP
  const handleLoginSend = async () => {
    setError('')
    if (!email || !password) { setError('Por favor llena todos los campos.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email, password, type: 'login' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep('otp')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // LOGIN: verify OTP → sign in
  const handleLoginVerify = async () => {
    setError('')
    if (otp.length !== 6) { setError('Ingresa el código de 6 dígitos.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code: otp, type: 'login' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      // Sign in with original password
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

  // REGISTER
  const handleRegister = async () => {
    setError('')
    if (!email || !password) { setError('Por favor llena todos los campos.'); return }
    if (!userType) { setError('Elige si eres donador o comunidad.'); return }
    if (!acceptedTerms) { setError('Debes aceptar los Términos y Condiciones.'); return }
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
          contact_email: email, status: 'pending', category: 'Otro', goal_amount: 0, raised_amount: 0,
        }])
        await fetch('/api/send-community-request', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        }).catch(() => {})
        onClose(); router.push('/community-pending')
      } else {
        onClose(); router.push('/donor')
      }
    } catch (e: any) {
      setError(e.message || 'Ocurrió un error')
    } finally {
      setLoading(false)
    }
  }

  // RESET: send OTP
  const handleResetSend = async () => {
    setError('')
    if (!email) { setError('Escribe tu correo.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email, type: 'reset' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep('otp')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // RESET: verify OTP
  const handleResetVerify = async () => {
    setError('')
    if (otp.length !== 6) { setError('Ingresa el código de 6 dígitos.'); return }
    setStep('new-password')
  }

  // RESET: set new password
  const handleNewPassword = async () => {
    setError('')
    if (!newPassword || !confirmPassword) { setError('Llena todos los campos.'); return }
    if (newPassword.length < 6) { setError('Mínimo 6 caracteres.'); return }
    if (newPassword !== confirmPassword) { setError('Las contraseñas no coinciden.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, code: otp, newPassword, type: 'reset' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      resetState('login')
      setError('')
      alert('✅ Contraseña actualizada. Ya puedes iniciar sesión.')
    } catch (e: any) {
      setError(e.message)
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
          <p><strong className="text-gray-900">2. Servicio</strong><br />Donekta conecta donadores con comunidades verificadas en México. Cobramos 2% por donación.</p>
          <p><strong className="text-gray-900">3. Donaciones</strong><br />Las donaciones son voluntarias y no reembolsables salvo error técnico comprobable.</p>
          <p><strong className="text-gray-900">4. Pagos</strong><br />Los pagos se procesan de forma segura a través de Stripe. No almacenamos datos de tarjetas.</p>
          <p><strong className="text-gray-900">5. Contacto</strong><br />andresbraver@gmail.com</p>
        </div>
        <div className="p-5 border-t border-gray-100">
          <button onClick={() => { setShowTerms(false); setAcceptedTerms(true) }}
            className="w-full bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-sm">Aceptar y cerrar</button>
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
          <p><strong className="text-gray-900">1. Datos</strong><br />Recopilamos nombre, correo y datos de donaciones. No almacenamos datos de tarjetas.</p>
          <p><strong className="text-gray-900">2. Uso</strong><br />Para procesar donaciones y mejorar la plataforma. No vendemos tus datos.</p>
          <p><strong className="text-gray-900">3. Seguridad</strong><br />SSL + Stripe PCI DSS.</p>
          <p><strong className="text-gray-900">4. Contacto</strong><br />andresbraver@gmail.com</p>
        </div>
        <div className="p-5 border-t border-gray-100">
          <button onClick={() => { setShowPrivacy(false); setAcceptedTerms(true) }}
            className="w-full bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-sm">Aceptar y cerrar</button>
        </div>
      </div>
    </div>
  )

  const renderOtp = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="text-3xl mb-3">📧</div>
        <h2 className="text-xl font-black text-gray-900 mb-1">Revisa tu correo</h2>
        <p className="text-sm text-gray-500">Enviamos un código a <strong>{email}</strong></p>
      </div>
      <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="000000" maxLength={6}
        onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLoginVerify() : handleResetVerify())}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-3xl tracking-widest font-mono focus:outline-none focus:border-emerald-400" />
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      <button onClick={mode === 'login' ? handleLoginVerify : handleResetVerify}
        disabled={loading || otp.length !== 6}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm">
        {loading ? 'Verificando...' : 'Continuar →'}
      </button>
      <button onClick={() => { setStep('form'); setOtp(''); setError('') }}
        className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">← Volver</button>
    </div>
  )

  const renderNewPassword = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-black text-gray-900 mb-1">Nueva contraseña</h2>
        <p className="text-sm text-gray-500">Elige una nueva contraseña para tu cuenta</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nueva contraseña</label>
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Repite tu contraseña" onKeyDown={e => e.key === 'Enter' && handleNewPassword()}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      <button onClick={handleNewPassword} disabled={loading || !newPassword || !confirmPassword}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm">
        {loading ? 'Guardando...' : 'Guardar contraseña'}
      </button>
    </div>
  )

  const renderReset = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="text-3xl mb-3">🔒</div>
        <h2 className="text-xl font-black text-gray-900 mb-1">Recuperar contraseña</h2>
        <p className="text-sm text-gray-500">Te enviaremos un código a tu correo</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
          onKeyDown={e => e.key === 'Enter' && handleResetSend()}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      <button onClick={handleResetSend} disabled={loading || !email}
        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm">
        {loading ? 'Enviando...' : 'Enviar código →'}
      </button>
      <button onClick={() => resetState('login')} className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">← Volver al login</button>
    </div>
  )

  const renderForm = () => (
    <>
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button onClick={() => resetState('login')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
          Iniciar sesión
        </button>
        <button onClick={() => resetState('register')}
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
            onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLoginSend() : handleRegister())}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" />
        </div>
        {mode === 'login' && (
          <button type="button" onClick={() => resetState('reset')}
            className="text-xs text-emerald-600 hover:text-emerald-700 text-right w-full -mt-2">
            ¿Olvidaste tu contraseña?
          </button>
        )}
        {mode === 'register' && (
          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-emerald-500 flex-shrink-0" />
            <span className="text-xs text-gray-600">
              Acepto los{' '}
              <button type="button" onClick={() => setShowTerms(true)} className="text-emerald-600 underline font-medium">Términos y Condiciones</button>
              {' '}y la{' '}
              <button type="button" onClick={() => setShowPrivacy(true)} className="text-emerald-600 underline font-medium">Política de Privacidad</button>
            </span>
          </label>
        )}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
        <button onClick={mode === 'login' ? handleLoginSend : handleRegister}
          disabled={loading || !email || !password}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm">
          {loading ? 'Cargando...' : mode === 'login' ? 'Continuar →' : 'Crear cuenta'}
        </button>
      </div>
    </>
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
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">
            {mode === 'reset' && step === 'form' && renderReset()}
            {mode === 'reset' && step === 'otp' && renderOtp()}
            {mode === 'reset' && step === 'new-password' && renderNewPassword()}
            {mode !== 'reset' && step === 'form' && renderForm()}
            {mode !== 'reset' && step === 'otp' && renderOtp()}
          </div>
        </div>
      </div>
      {showTerms && <TermsModal />}
      {showPrivacy && <PrivacyModal />}
    </>
  )
}
