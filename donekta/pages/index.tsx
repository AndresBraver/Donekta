import Head from 'next/head'
import { useState, useEffect } from 'react'
import AuthModal from '../components/AuthModal'
import { supabase } from '../lib/supabase'

// Testimonios fijos — Andres los agrega/edita manualmente aquí
const testimonials: { comment: string; donor_name: string; community?: string }[] = [
  // Ejemplo: { comment: 'Donar aquí fue muy fácil y rápido.', donor_name: 'María G.', community: 'Comedor Esperanza' },
]

export default function Home() {
  const [showAuth, setShowAuth] = useState(false)
  const [stats, setStats] = useState({ donors: 0, communities: 0, raised: 0 })

  useEffect(() => {
    // Load real stats
    Promise.all([
      supabase.from('donations').select('donor_email', { count: 'exact' }),
      supabase.from('communities').select('id', { count: 'exact' }).eq('status', 'approved'),
      supabase.from('donations').select('amount'),
    ]).then(([donors, communities, amounts]) => {
      const totalRaised = (amounts.data || []).reduce((sum, d) => sum + d.amount, 0)
      setStats({
        donors: donors.count || 0,
        communities: communities.count || 0,
        raised: totalRaised,
      })
    })
  }, [])

  const formatStats = (n: number) => n >= 1000000 ? `$${(n/1000000).toFixed(1)}M` : n >= 1000 ? `${(n/1000).toFixed(0)}K` : n.toString()

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
            <button onClick={() => setShowAuth(true)} style={{ fontSize: 14, color: '#6F737D', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px' }}>
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

          {/* COMENTARIOS EN HERO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {testimonials.length > 0 ? testimonials.map((c, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 20, border: '1px solid #D1F5E3', boxShadow: '0 2px 8px rgba(85,181,132,0.08)' }}>
                <p style={{ fontSize: 14, color: '#6F737D', lineHeight: 1.6, marginBottom: 12, fontStyle: 'italic' }}>"{c.comment}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EDFBF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#55B584', flexShrink: 0 }}>
                    {(c.donor_name || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#121826' }}>{c.donor_name || 'Anónimo'}</p>
                    {c.community && <p style={{ fontSize: 11, color: '#6F737D' }}>Donó a {c.community}</p>}
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #D1F5E3', textAlign: 'center' }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>💚</p>
                <p style={{ fontSize: 16, color: '#55B584', fontWeight: 700, marginBottom: 8 }}>Sé el primero en donar</p>
                <p style={{ fontSize: 13, color: '#6F737D', lineHeight: 1.6 }}>Aquí aparecerán los comentarios de donadores que ya apoyaron comunidades reales en México.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STATS REALES */}
      <section style={{ background: '#121826', padding: '48px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: 36, fontWeight: 900, color: '#55B584', marginBottom: 4 }}>{stats.donors > 0 ? `${stats.donors}+` : '...'}</p>
            <p style={{ fontSize: 14, color: '#9CA3AF' }}>Donadores activos</p>
          </div>
          <div>
            <p style={{ fontSize: 36, fontWeight: 900, color: '#55B584', marginBottom: 4 }}>{stats.communities > 0 ? `${stats.communities}+` : '...'}</p>
            <p style={{ fontSize: 14, color: '#9CA3AF' }}>Comunidades verificadas</p>
          </div>
          <div>
            <p style={{ fontSize: 36, fontWeight: 900, color: '#55B584', marginBottom: 4 }}>{stats.raised > 0 ? `$${formatStats(stats.raised)}` : '...'}</p>
            <p style={{ fontSize: 14, color: '#9CA3AF' }}>MXN donados</p>
          </div>
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

      {/* COMISIONES */}
      <section style={{ padding: '80px 24px', background: '#121826' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 16 }}>Transparencia total</h2>
          <p style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 8, lineHeight: 1.7 }}>
            Donekta cobra una comisión del <strong style={{ color: '#55B584' }}>2%</strong> por donación para mantener activa la plataforma. El resto llega directo a la comunidad.
          </p>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 40, lineHeight: 1.6 }}>
            Gracias a esta pequeña comisión podemos seguir conectando donadores con comunidades reales en todo México, garantizando pagos seguros y transparentes.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#55B584', marginBottom: 4 }}>98%</p>
              <p style={{ fontSize: 14, color: '#9CA3AF' }}>Va a la comunidad</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 4 }}>2%</p>
              <p style={{ fontSize: 14, color: '#9CA3AF' }}>Mantiene la plataforma activa</p>
            </div>
          </div>

          {/* LOGOS DE PAGO */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🔒</span>
              <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>SSL Seguro</span>
            </div>
            <span style={{ color: '#374151' }}>·</span>
            <div style={{ background: '#635BFF', borderRadius: 6, padding: '4px 12px' }}>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>stripe</span>
            </div>
            <span style={{ color: '#374151' }}>·</span>
            <div style={{ background: '#1A1F71', borderRadius: 6, padding: '4px 12px' }}>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>VISA</span>
            </div>
            <span style={{ color: '#374151' }}>·</span>
            <div style={{ background: '#EB001B', borderRadius: 6, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#EB001B', border: '2px solid #fff' }} />
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#F79E1B', marginLeft: -8 }} />
              <span style={{ fontSize: 11, color: '#fff', fontWeight: 700, marginLeft: 4 }}>MC</span>
            </div>
            <span style={{ color: '#374151' }}>·</span>
            <div style={{ background: '#016FD0', borderRadius: 6, padding: '4px 12px' }}>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>AMEX</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: '#55B584' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 16 }}>¿Listo para hacer la diferencia?</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 36, lineHeight: 1.7 }}>
            Únete a la comunidad de donadores que ya están cambiando vidas en México.
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
          <div style={{ borderTop: '1px solid #1F2937', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 13, color: '#6B7280' }}>© 2025 Donekta. Todos los derechos reservados.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: '#6B7280' }}>🔒 Pagos seguros</span>
              <div style={{ background: '#635BFF', borderRadius: 4, padding: '2px 8px' }}>
                <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>stripe</span>
              </div>
            </div>
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
