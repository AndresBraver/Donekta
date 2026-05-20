import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Heart, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  'Alimentación','Educación','Salud','Vivienda',
  'Medio ambiente','Arte y cultura','Derechos humanos','Otro'
]

export default function CommunityRegister() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    name: '', rfc: '', address: '', city: '', state: '',
    contact_name: '', contact_email: '', contact_phone: '',
    category: '', mission: '', description: '', beneficiaries: '',
    website: '', facebook: '', instagram: '', goal_amount: ''
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.from('communities').insert([{
        name: form.name, rfc: form.rfc, address: form.address,
        city: form.city, state: form.state,
        contact_name: form.contact_name, contact_email: form.contact_email,
        contact_phone: form.contact_phone, category: form.category,
        mission: form.mission, description: form.description,
        beneficiaries: form.beneficiaries, website: form.website,
        facebook: form.facebook, instagram: form.instagram,
        goal_amount: Number(form.goal_amount) || 0,
        status: 'pending', raised_amount: 0
      }])
      if (error) throw error
      setDone(true)
    } catch (e: any) {
      alert('Error: ' + (e.message || 'Intenta de nuevo'))
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(s => s + 1)
    else handleSubmit()
  }

  if (done) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">¡Registro enviado!</h1>
        <p className="text-gray-500 text-sm leading-relaxed">Tu perfil de comunidad ha sido guardado. Lo revisaremos y activaremos tu cuenta en 1-3 días hábiles.</p>
      </div>
    </div>
  )

  return (
    <>
      <Head><title>Registro de comunidad — Donekta</title></Head>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Donekta</span>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-0 mb-8">
            {[1,2,3].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                {i < 2 && <div className={`w-16 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">Datos de la organización</h2>
                <p className="text-gray-400 text-sm mb-6">Información básica de tu comunidad</p>
                <div className="space-y-4">
                  <Field label="Nombre de la organización *" value={form.name} onChange={v => set('name', v)} placeholder="Ej. Fundación Esperanza AC" />
                  <Field label="RFC" value={form.rfc} onChange={v => set('rfc', v)} placeholder="XAXX010101000" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Ciudad *" value={form.city} onChange={v => set('city', v)} placeholder="Ciudad de México" />
                    <Field label="Estado *" value={form.state} onChange={v => set('state', v)} placeholder="CDMX" />
                  </div>
                  <Field label="Dirección" value={form.address} onChange={v => set('address', v)} placeholder="Calle, número, colonia" />
                  <Field label="Meta de recaudación (MXN)" value={form.goal_amount} onChange={v => set('goal_amount', v)} placeholder="Ej. 50000" type="number" />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">Misión y categoría</h2>
                <p className="text-gray-400 text-sm mb-6">Cuéntanos qué hace tu comunidad</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map(c => (
                        <button key={c} onClick={() => set('category', c)}
                          className={`text-sm py-2.5 px-4 rounded-xl border-2 text-left transition-all ${form.category === c ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                        >{c}</button>
                      ))}
                    </div>
                  </div>
                  <TextArea label="Misión *" value={form.mission} onChange={v => set('mission', v)} placeholder="¿Cuál es el objetivo principal de tu organización?" />
                  <TextArea label="Descripción" value={form.description} onChange={v => set('description', v)} placeholder="Describe los proyectos y actividades que realiza tu comunidad..." />
                  <Field label="Beneficiarios aproximados" value={form.beneficiaries} onChange={v => set('beneficiaries', v)} placeholder="Ej. 500 familias" />
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-1">Contacto y redes</h2>
                <p className="text-gray-400 text-sm mb-6">¿Cómo podemos contactarte?</p>
                <div className="space-y-4">
                  <Field label="Nombre del responsable *" value={form.contact_name} onChange={v => set('contact_name', v)} placeholder="Nombre completo" />
                  <Field label="Correo de contacto *" value={form.contact_email} onChange={v => set('contact_email', v)} placeholder="contacto@organización.org" type="email" />
                  <Field label="Teléfono" value={form.contact_phone} onChange={v => set('contact_phone', v)} placeholder="+52 55 1234 5678" />
                  <Field label="Sitio web" value={form.website} onChange={v => set('website', v)} placeholder="https://tuorganizacion.org" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Facebook" value={form.facebook} onChange={v => set('facebook', v)} placeholder="@tupagina" />
                    <Field label="Instagram" value={form.instagram} onChange={v => set('instagram', v)} placeholder="@tuinstagram" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                  Atrás
                </button>
              )}
              <button onClick={nextStep} disabled={loading}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">
                {loading ? 'Guardando...' : step === 3 ? 'Enviar registro' : 'Continuar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition-colors" />
    </div>
  )
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 transition-colors resize-none" />
    </div>
  )
}
