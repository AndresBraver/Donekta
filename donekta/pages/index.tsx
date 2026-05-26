import { useState } from 'react'
import Head from 'next/head'
import { Heart, Users, ArrowRight } from 'lucide-react'
import AuthModal from '../components/AuthModal'

export default function Home() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <Head>
        <title>Donekta — Dona con propósito</title>
        <meta name="description" content="Conectamos donadores con comunidades reales." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Donekta</span>
          </div>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
          >
            Iniciar sesión
          </button>
        </nav>

        {/* Hero */}
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-4 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Conectando comunidades con donadores
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
            Dona con <span className="text-emerald-500">propósito</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Conectamos donadores con comunidades reales. Cada aportación llega directo a quienes más lo necesitan.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowAuth(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              Comenzar ahora <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '1', title: 'Regístrate', desc: 'Crea tu cuenta como donador o representa a tu comunidad en minutos.', color: 'bg-emerald-100 text-emerald-700' },
              { icon: '2', title: 'Conecta', desc: 'Los donadores eligen comunidades verificadas y aprueban sus donaciones.', color: 'bg-blue-100 text-blue-700' },
              { icon: '3', title: 'Impacta', desc: 'El dinero llega directo. Seguimiento en tiempo real del impacto generado.', color: 'bg-purple-100 text-purple-700' },
            ].map((s) => (
              <div key={s.icon} className="text-center">
                <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center text-lg font-black mx-auto mb-4`}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-emerald-500 py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-black text-white mb-4">¿Listo para hacer la diferencia?</h2>
            <p className="text-emerald-100 mb-8">Únete hoy y conecta con comunidades que necesitan tu apoyo.</p>
            <button
              onClick={() => setShowAuth(true)}
              className="bg-white text-emerald-600 font-bold px-8 py-3 rounded-full hover:bg-emerald-50 transition-colors"
            >
              Registrarme gratis
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-8 px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <Heart className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="font-bold text-gray-900">Donekta</span>
          </div>
          <p className="text-xs text-gray-400">Conectando corazones con comunidades</p>
        </footer>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
