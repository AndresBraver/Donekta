import Head from 'next/head'
import { Clock, Mail, Heart } from 'lucide-react'

export default function CommunityPending() {
  return (
    <>
      <Head><title>Solicitud enviada — Donekta</title></Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Donekta</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>

            <h1 className="text-2xl font-black text-gray-900 mb-3">Solicitud enviada</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Tu solicitud de registro como comunidad ha sido enviada. Nuestro equipo la revisará y recibirás una respuesta por correo electrónico.
            </p>

            <div className="bg-gray-50 rounded-xl p-5 text-left mb-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-2">¿Qué sigue?</p>
                  <ul className="text-sm text-gray-500 space-y-1.5">
                    <li>• Nuestro equipo revisará tu solicitud</li>
                    <li>• Te contactaremos en 1–3 días hábiles</li>
                    <li>• Si es aprobada, recibirás un link para completar tu perfil de comunidad</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              ¿Preguntas? Escríbenos a{' '}
              <a href="mailto:andresbraver@gmail.com" className="text-emerald-600 font-medium">
                andresbraver@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
