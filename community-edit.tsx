import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Heart, CheckCircle, Upload } from 'lucide-react'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  'Alimentación','Educación','Salud','Vivienda',
  'Medio ambiente','Arte y cultura','Derechos humanos','Otro'
]

export default function CommunityEdit() {
  const router = useRouter()
  const { id } = router.query
  const [step, setStep] = useState<'key' | 'edit' | 'done'>('key')
  const [editKey, setEditKey] = useState('')
  const [community, setCommunity] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', category: '', mission: '', description: '',
    beneficiaries: '', city: '', state: '', goal_amount: '',
    website: '', facebook: '', instagram: '', contact_phone: ''
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const verifyKey = async () => {
    if (!editKey.trim()) return
    setLoading(true)
    setError('')
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .eq('edit_key', editKey.trim())
        .single()
      if (error || !data) throw new Error('Clave incorrecta')
      setCommunity(data)
      setForm({
        name: data.name || '',
        category: data.category || '',
        mission: data.mission || '',
        description: data.description || '',
        beneficiaries: data.beneficiaries || '',
        city: data.city || '',
        state: data.state || '',
        goal_amount: data.goal_amount?.toString() || '',
        website: data.website || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        contact_phone: data.contact_phone || ''
      })
      if (data.image_url) setImagePreview(data.image_url)
      setStep('edit')
    } catch (e: any) {
      setError(e.message || 'Clave incorrecta')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      let imageUrl = community.image_url || null

      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const path = `${id}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('community-images')
          .upload(path, imageFile, { upsert: true })
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage
          .from('community-images')
          .getPublicUrl(path)
        imageUrl = urlData.publicUrl
      }

      const { error: updateError } = await supabase
        .from('communities')
        .update({
          name: form.name,
          category: form.category,
          mission: form.mission,
          description: form.description,
          beneficiaries: form.beneficiaries,
          city: form.city,
          state: form.state,
          goal_amount: Number(form.goal_amount) || 0,
          website: form.website,
          facebook: form.facebook,
          instagram: form.instagram,
          contact_phone: form.contact_phone,
          image_url: imageUrl,
        })
        .eq('id', id)
      if (updateError) throw updateError
      setStep('done')
    } catch (e: any) {
      setError(e.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">¡Perfil actualizado!</h1>
        <p className="text-gray-500 text-sm">Tu comunidad ya aparece con la información nueva en la plataforma.</p>
      </div>
    </div>
  )

  if (step === 'key') return (
    <>
      <Head><title>Editar perfil — Donekta</title></Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Donekta</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">Editar perfil de comunidad</h1>
            <p className="text-gray-500 text-sm mb-6">Ingresa tu clave secreta para editar tu perfil</p>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Clave secreta</label>
            <input type="password" value={editKey} onChange={e => setEditKey(e.target.value)}
              placeholder="Tu clave secreta"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 mb-4" />
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
            <button onClick={verifyKey} disabled={loading || !editKey}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors text-sm">
              {loading ? 'Verificando...' : 'Continuar'}
            </button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Head><title>Editar perfil — Donekta</title></Head>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Donekta</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6">Editar perfil de comunidad</h2>

            {/* Image upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de la comunidad</label>
              <div className="relative">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl mb-2" />
                    <label className="absolute bottom-4 right-4 bg-white text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg shadow cursor-pointer hover:bg-gray-50 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" /> Cambiar imagen
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-300 mb-2" />
                    <span className="text-sm text-gray-400">Subir imagen</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre *</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nombre de la comunidad"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" /></div>

              <div><label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => set('category', c)}
                      className={`text-sm py-2 px-3 rounded-xl border-2 text-left transition-all ${form.category === c ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Misión</label>
                <textarea value={form.mission} onChange={e => set('mission', e.target.value)} rows={3} placeholder="¿Qué hace tu comunidad?"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 resize-none" /></div>

              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Describe tu comunidad..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 resize-none" /></div>

              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad</label>
                  <input type="text" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Ciudad"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
                  <input type="text" value={form.state} onChange={e => set('state', e.target.value)} placeholder="Estado"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" /></div>
              </div>

              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Beneficiarios</label>
                <input type="text" value={form.beneficiaries} onChange={e => set('beneficiaries', e.target.value)} placeholder="Ej. 500 familias"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" /></div>

              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Meta de recaudación (MXN)</label>
                <input type="number" value={form.goal_amount} onChange={e => set('goal_amount', e.target.value)} placeholder="Ej. 50000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" /></div>

              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook</label>
                  <input type="text" value={form.facebook} onChange={e => set('facebook', e.target.value)} placeholder="@tupagina"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram</label>
                  <input type="text" value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@tuinstagram"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400" /></div>
              </div>
            </div>

            {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

            <button onClick={handleSave} disabled={loading || !form.name}
              className="w-full mt-8 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors text-sm">
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
