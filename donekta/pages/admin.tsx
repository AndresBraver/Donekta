import { useState, useEffect } from 'react'
import Head from 'next/head'
import { CheckCircle, XCircle, Clock, Heart, Copy, Check, Trash2 } from 'lucide-react'
import { supabase, Community } from '../lib/supabase'

export default function Admin() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [copied, setCopied] = useState<string | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [editKey, setEditKey] = useState('')
  const [keyError, setKeyError] = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    const { data } = await supabase.from('communities').select('*').order('created_at', { ascending: false })
    setCommunities(data || [])
    setLoading(false)
  }

  const startApprove = (id: string) => {
    setApprovingId(id)
    setEditKey('')
    setKeyError('')
  }

  const confirmApprove = async (email: string) => {
    if (!editKey.trim()) { setKeyError('Escribe una clave'); return }
    if (editKey.trim().length < 4) { setKeyError('Mínimo 4 caracteres'); return }

    await supabase.from('communities').update({ status: 'approved', edit_key: editKey.trim() }).eq('id', approvingId!)
    try {
      await fetch('/api/send-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, communityId: approvingId })
      })
    } catch (_) {}
    setApprovingId(null)
    setEditKey('')
    fetchAll()
  }

  const reject = async (id: string) => {
    await supabase.from('communities').update({ status: 'rejected' }).eq('id', id)
    fetchAll()
  }

  const deleteCommunity = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta comunidad?')) return
    await supabase.from('communities').delete().eq('id', id)
    fetchAll()
  }

  const copyLink = (id: string) => {
    const link = `${window.location.origin}/community-edit?id=${id}`
    navigator.clipboard.writeText(link)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = communities.filter(c => c.status === filter)
  const counts = {
    pending: communities.filter(c => c.status === 'pending').length,
    approved: communities.filter(c => c.status === 'approved').length,
    rejected: communities.filter(c => c.status === 'rejected').length,
  }

  return (
    <>
      <Head><title>Admin — Donekta</title></Head>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-bold text-gray-900">Donekta <span className="text-gray-400 font-normal text-sm">— Admin</span></span>
            <a href="/donor" className="ml-auto text-sm text-gray-400 hover:text-gray-600">Ver plataforma</a>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-black text-gray-900 mb-8">Solicitudes de comunidades</h1>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {([
              { key: 'pending', label: 'Pendientes', active: 'bg-amber-50 border-amber-200 text-amber-700', inactive: 'bg-white border-gray-200 text-gray-600' },
              { key: 'approved', label: 'Aprobadas', active: 'bg-emerald-50 border-emerald-200 text-emerald-700', inactive: 'bg-white border-gray-200 text-gray-600' },
              { key: 'rejected', label: 'Rechazadas', active: 'bg-red-50 border-red-200 text-red-700', inactive: 'bg-white border-gray-200 text-gray-600' },
            ] as const).map(s => (
              <button key={s.key} onClick={() => setFilter(s.key)}
                className={`rounded-xl border p-4 text-left transition-all ${filter === s.key ? s.active : s.inactive}`}>
                <p className="text-2xl font-black">{counts[s.key]}</p>
                <p className="text-sm font-medium">{s.label}</p>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Clock className="w-10 h-10 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">No hay solicitudes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{c.name || c.contact_email}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          c.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          c.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-red-100 text-red-700'}`}>
                          {c.status === 'pending' ? 'Pendiente' : c.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">📧 {c.contact_email}</p>
                      <p className="text-xs text-gray-400">Registrada: {new Date(c.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

                      {/* Approve with key modal */}
                      {approvingId === c.id && (
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <p className="text-sm font-semibold text-emerald-800 mb-2">Crea una clave secreta para esta comunidad</p>
                          <p className="text-xs text-emerald-700 mb-3">La comunidad usará esta clave para editar su perfil</p>
                          <input type="text" value={editKey} onChange={e => setEditKey(e.target.value)}
                            placeholder="Ej. MiClave2024"
                            className="w-full border border-emerald-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 mb-2 bg-white" />
                          {keyError && <p className="text-xs text-red-600 mb-2">{keyError}</p>}
                          <div className="flex gap-2">
                            <button onClick={() => confirmApprove(c.contact_email)}
                              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                              Confirmar aprobación
                            </button>
                            <button onClick={() => setApprovingId(null)}
                              className="border border-gray-200 text-gray-600 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}

                      {c.status === 'approved' && (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 truncate">
                            {typeof window !== 'undefined' ? `${window.location.origin}/community-edit?id=${c.id}` : `/community-edit?id=${c.id}`}
                          </div>
                          <button onClick={() => copyLink(c.id)}
                            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex-shrink-0">
                            {copied === c.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied === c.id ? 'Copiado' : 'Copiar link'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {c.status === 'pending' && approvingId !== c.id && (
                        <div className="flex gap-2">
                          <button onClick={() => startApprove(c.id)}
                            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                            <CheckCircle className="w-3.5 h-3.5" /> Aprobar
                          </button>
                          <button onClick={() => reject(c.id)}
                            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                            <XCircle className="w-3.5 h-3.5" /> Rechazar
                          </button>
                        </div>
                      )}
                      <button onClick={() => deleteCommunity(c.id)}
                        className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
