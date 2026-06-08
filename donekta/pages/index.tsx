import Head from 'next/head'
import { useState, useEffect } from 'react'
import AuthModal from '../components/AuthModal'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [showAuth, setShowAuth] = useState(false)
  const [comments, setComments] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('donations')
      .select('comment, donor_name, communities(name), created_at')
      .eq('public_comment', true)
      .not('comment', 'is', null)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setComments(data || []))
  }, [])

  return (
    <>
      <Head>
        <title>Donekta — Dona con propósito</title>
        <meta name="description" content="Conectamos donadores con comunidades reales de México." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo-marca-corazon.svg" />
        <meta property="og:title" content="Donekta — Dona con propósito" />
        <meta property="og:description" content="Conectamos donadores con comunidades reales de México." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content="/og-image.png" />
      </Head>

      {/* NAV */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #F0F4F8', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src="/logo-donekta-oscuro.svg" alt="Donekta" style={{ height: 36 }} />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={() => setShowAuth(true)} style={{ fontSize: 14, color: '#6F737D', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 8 }}>
              Soy comunidad
            </button>
            <button onClick={() => setShowAuth(true)} style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: '#55B584', border: 'none', cursor: 'pointer', padding: '10px 22px', borderRadius: 100 }}>
              Quiero donar
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: '#EDFBF4', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #D1F5E3', borderRadius: 100, padding: '6px 16px', marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, background: '#55B584', borderRadius: '50%', display: 'inline-block' }} />
              <span style={{ fontSize: 13, color: '#55B584', fontWeight: 600 }}>Conectando comunidades con donadores</span>
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 900, color: '#121826', lineHeight: 1.15, marginBottom: 20 }}>
              Dona con<br /><span style={{ color: '#55B584' }}>propósito</span>
            </h1>
            <p style={{ fontSize: 18, color: '#6F737D', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Conectamos donadores con comunidades reales de México. Cada aportación llega directo a quienes más lo necesitan.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => setShowAuth(true)} style={{ fontSize: 15, fontWeight: 700, color: '#fff', background: '#55B584', border: 'none', cursor: 'pointer', padding: '14px 32px', borderRadius: 100 }}>
                Quiero donar →
              </button>
              <button onClick={() => setShowAuth(true)} style={{ fontSize: 15, fontWeight: 600, color: '#121826', background: '#fff', border: '1.5px solid #D1F5E3', cursor: 'pointer', padding: '14px 32px', borderRadius: 100 }}>
                Represento una comunidad
              </button>
            </div>
          </div>
          <div style={{ borderRadius: 20, overflow: 'hidden', height: 400 }}>
            <img src="/hero.png" alt="Personas de comunidades beneficiadas por Donekta" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#121826', padding: '48px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, textAlign: 'center' }}>
          {[
            { value: '1,200+', label: 'Donadores activos' },
            { value: '340+', label: 'Comunidades verificadas' },
            { value: '$2.4M', label: 'MXN donados' },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontSize: 36, fontWeight: 900, color: '#55B584', marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 14, color: '#9CA3AF' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#121826', marginBottom: 12 }}>¿Cómo funciona?</h2>
            <p style={{ fontSize: 16, color: '#6F737D' }}>Tres pasos para hacer la diferencia</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { img: '/paso-1-registrate.svg', title: 'Regístrate', desc: 'Crea tu cuenta como donador o representa a tu comunidad en minutos.' },
              { img: '/paso-2-conecta.svg', title: 'Conecta', desc: 'Elige la comunidad que quieres apoyar y realiza tu donación de forma segura.' },
              { img: '/paso-3-impacta.svg', title: 'Impacta', desc: 'El dinero llega directo. Seguimiento en tiempo real del impacto generado.' },
            ].map(s => (
              <div key={s.title} style={{ textAlign: 'center', padding: 32, background: '#EDFBF4', borderRadius: 20 }}>
                <div style={{ width: 80, height: 80, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={s.img} alt={s.title} style={{ width: 64, height: 64 }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#121826', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#6F737D', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMENTARIOS REALES */}
      {comments.length > 0 && (
        <section style={{ padding: '80px 24px', background: '#F9FAFB' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontSize: 36, fontWeight: 900, color: '#121826', marginBottom: 12 }}>Lo que dicen nuestros donadores</h2>
              <p style={{ fontSize: 16, color: '#6F737D' }}>Comentarios reales de personas que ya donaron</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {comments.map((c, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #F0F4F8' }}>
                  <p style={{ fontSize: 14, color: '#6F737D', lineHeight: 1.7, marginBottom: 20 }}>"{c.comment}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EDFBF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#55B584', flexShrink: 0 }}>
                      {(c.donor_name || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#121826' }}>{c.donor_name || 'Anónimo'}</p>
                      {c.communities?.name && <p style={{ fontSize: 11, color: '#6F737D' }}>Donó a {c.communities.name}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COMISIONES */}
      <section style={{ padding: '80px 24px', background: '#121826' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 16 }}>Transparencia total</h2>
          <p style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 40, lineHeight: 1.7 }}>
            Donekta cobra una comisión del <strong style={{ color: '#55B584' }}>2%</strong> por donación. El resto llega directo a la comunidad.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#55B584', marginBottom: 4 }}>98%</p>
              <p style={{ fontSize: 14, color: '#9CA3AF' }}>Va a la comunidad</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 4 }}>2%</p>
              <p style={{ fontSize: 14, color: '#9CA3AF' }}>Mantiene la plataforma</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>🔒 Pagos seguros con Stripe · SSL · Visa · Mastercard · Amex</p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: '#55B584' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 16 }}>¿Listo para hacer la diferencia?</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 36, lineHeight: 1.7 }}>
            Únete a más de 1,200 donadores que ya están cambiando vidas en México.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setShowAuth(true)} style={{ fontSize: 15, fontWeight: 700, color: '#55B584', background: '#fff', border: 'none', cursor: 'pointer', padding: '14px 32px', borderRadius: 100 }}>
              Quiero donar
            </button>
            <button onClick={() => setShowAuth(true)} style={{ fontSize: 15, fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)', cursor: 'pointer', padding: '14px 32px', borderRadius: 100 }}>
              Registrar mi comunidad
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0D1117', padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <img src="/logo-donekta-claro.svg" alt="Donekta" style={{ height: 32, marginBottom: 16 }} />
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, maxWidth: 280 }}>
                Dona con propósito · Conectamos donadores con comunidades reales.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Plataforma</p>
              {['Comunidades', 'Cómo funciona', 'Comisiones'].map(l => (
                <p key={l} style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Legal</p>
              {['Términos', 'Privacidad', 'Reembolsos'].map(l => (
                <p key={l} style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>{l}</p>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Contacto</p>
              <p style={{ fontSize: 14, color: '#6B7280' }}>andresbraver@gmail.com</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1F2937', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: 13, color: '#6B7280' }}>© 2024 Donekta. Todos los derechos reservados.</p>
            <p style={{ fontSize: 13, color: '#6B7280' }}>🔒 Pagos seguros con Stripe</p>
          </div>
        </div>
      </footer>

      <style>{`
        .mobile-donate { display: none; }
        @media (max-width: 768px) {
          .mobile-donate { display: block; position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: #fff; border-top: 1px solid #F0F4F8; z-index: 100; }
        }
      `}</style>
      <div className="mobile-donate">
        <button onClick={() => setShowAuth(true)} style={{ width: '100%', fontSize: 15, fontWeight: 700, color: '#fff', background: '#55B584', border: 'none', cursor: 'pointer', padding: 14, borderRadius: 12 }}>
          Donar ahora
        </button>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
