import Head from 'next/head'
import { useState } from 'react'
import AuthModal from '../components/AuthModal'

// Inline SVGs de marca
const LogoOscuro = () => (
  <span dangerouslySetInnerHTML={{ __html: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 440 96\" width=\"440\" height=\"96\">\n  <rect x=\"8\" y=\"14\" width=\"68\" height=\"68\" rx=\"21\" fill=\"#55B584\"/>\n  <g transform=\"translate(21.6 27.6) scale(1.75)\"><path d=\"M12 21s-7.5-4.9-10-9.5C0.5 8 2 4.6 5.5 4.6c2 0 3.4 1.1 4.5 2.7 1.1-1.6 2.5-2.7 4.5-2.7C22 4.6 23.5 8 22 11.5 19.5 16.1 12 21 12 21z\" fill=\"#FFFFFF\"/></g>\n  <text x=\"92\" y=\"60\" font-family=\"'Poppins','Nunito Sans','DejaVu Sans',sans-serif\" font-weight=\"800\" font-size=\"48\" fill=\"#121826\">Donekta</text>\n</svg>" }} style={{ display: 'inline-flex', alignItems: 'center' }} />
)
const LogoClaro = () => (
  <span dangerouslySetInnerHTML={{ __html: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 440 96\" width=\"440\" height=\"96\">\n  <rect x=\"8\" y=\"14\" width=\"68\" height=\"68\" rx=\"21\" fill=\"#55B584\"/>\n  <g transform=\"translate(21.6 27.6) scale(1.75)\"><path d=\"M12 21s-7.5-4.9-10-9.5C0.5 8 2 4.6 5.5 4.6c2 0 3.4 1.1 4.5 2.7 1.1-1.6 2.5-2.7 4.5-2.7C22 4.6 23.5 8 22 11.5 19.5 16.1 12 21 12 21z\" fill=\"#FFFFFF\"/></g>\n  <text x=\"92\" y=\"60\" font-family=\"'Poppins','Nunito Sans','DejaVu Sans',sans-serif\" font-weight=\"800\" font-size=\"48\" fill=\"#FFFFFF\">Donekta</text>\n</svg>" }} style={{ display: 'inline-flex', alignItems: 'center' }} />
)
const Paso1 = () => (
  <span dangerouslySetInnerHTML={{ __html: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 96 96\" width=\"96\" height=\"96\" fill=\"none\" stroke=\"#55B584\" stroke-width=\"4.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n  <circle cx=\"40\" cy=\"34\" r=\"14\"/><path d=\"M16 80c0-14 11-24 24-24s24 10 24 24\"/>\n  <line x1=\"74\" y1=\"26\" x2=\"74\" y2=\"46\"/><line x1=\"64\" y1=\"36\" x2=\"84\" y2=\"36\"/></svg>" }} />
)
const Paso2 = () => (
  <span dangerouslySetInnerHTML={{ __html: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 96 96\" width=\"96\" height=\"96\" fill=\"none\" stroke=\"#55B584\" stroke-width=\"4.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n  <path d=\"M30 44a10 10 0 1 1 14 14l-8 8a10 10 0 0 1-14-14l4-4\"/>\n  <path d=\"M66 52a10 10 0 1 0-14-14l8-8a10 10 0 0 1 14 14l-4 4\"/><line x1=\"40\" y1=\"56\" x2=\"56\" y2=\"40\"/></svg>" }} />
)
const Paso3 = () => (
  <span dangerouslySetInnerHTML={{ __html: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 96 96\" width=\"96\" height=\"96\" fill=\"none\" stroke=\"#55B584\" stroke-width=\"4.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n  <path d=\"M48 74S24 58 24 41a13 13 0 0 1 24-7 13 13 0 0 1 24 7c0 17-24 33-24 33z\" fill=\"#55B584\" stroke=\"#55B584\"/>\n  <path d=\"M14 30c4-5 9-8 14-9M82 30c-4-5-9-8-14-9\" stroke=\"#9BD9BA\"/></svg>" }} />
)

export default function Home() {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'donor' | 'community'>('donor')

  const openDonor = () => { setAuthMode('donor'); setShowAuth(true) }
  const openCommunity = () => { setAuthMode('community'); setShowAuth(true) }

  return (
    <>
      <Head>
        <title>Donekta — Dona con propósito</title>
        <meta name="description" content="Conectamos donadores con comunidades reales de México. Cada aportación llega directo a quienes más lo necesitan." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/marca/logo-marca-corazon.svg" />
        <meta property="og:title" content="Donekta — Dona con propósito" />
        <meta property="og:description" content="Conectamos donadores con comunidades reales de México." />
        <meta property="og:image" content="/marca/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:image" content="/marca/og-image.png" />
      </Head>

      {/* NAV */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #F0F4F8', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', height: 40 }}>
            <LogoOscuro />
          </span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={openCommunity} style={{ fontSize: 14, color: '#6F737D', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 8 }}>
              Soy comunidad
            </button>
            <button onClick={openDonor} style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: '#55B584', border: 'none', cursor: 'pointer', padding: '10px 22px', borderRadius: 100 }}>
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
              <button onClick={openDonor} style={{ fontSize: 15, fontWeight: 700, color: '#fff', background: '#55B584', border: 'none', cursor: 'pointer', padding: '14px 32px', borderRadius: 100 }}>
                Quiero donar →
              </button>
              <button onClick={openCommunity} style={{ fontSize: 15, fontWeight: 600, color: '#121826', background: '#fff', border: '1.5px solid #D1F5E3', cursor: 'pointer', padding: '14px 32px', borderRadius: 100 }}>
                Represento una comunidad
              </button>
            </div>
          </div>
          <div style={{ borderRadius: 20, overflow: 'hidden', height: 400 }}>
            <img src="/marca/hero.png" alt="Personas de comunidades beneficiadas por Donekta" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
              { Icon: Paso1, title: 'Regístrate', desc: 'Crea tu cuenta como donador o representa a tu comunidad en minutos.' },
              { Icon: Paso2, title: 'Conecta', desc: 'Elige la comunidad que quieres apoyar y realiza tu donación de forma segura.' },
              { Icon: Paso3, title: 'Impacta', desc: 'El dinero llega directo. Seguimiento en tiempo real del impacto generado.' },
            ].map(s => (
              <div key={s.title} style={{ textAlign: 'center', padding: 32, background: '#EDFBF4', borderRadius: 20 }}>
                <div style={{ width: 80, height: 80, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.Icon />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#121826', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#6F737D', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMUNIDADES DESTACADAS */}
      <section style={{ padding: '80px 24px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#121826', marginBottom: 12 }}>Comunidades verificadas</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { img: '/marca/comunidad-1.png', name: 'Comunidad Xochimilco', category: 'Alimentación', pct: 85 },
              { img: '/marca/comunidad-2.png', name: 'Escuela Rural Hidalgo', category: 'Educación', pct: 62 },
              { img: '/marca/comunidad-3.png', name: 'Hogar Adultos Mayores', category: 'Salud', pct: 91 },
            ].map(c => (
              <div key={c.name} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #F0F4F8' }}>
                <img src={c.img} alt={`Foto de ${c.name}`} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                <div style={{ padding: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#55B584', background: '#EDFBF4', padding: '3px 10px', borderRadius: 100 }}>{c.category}</span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#121826', margin: '10px 0 12px' }}>{c.name}</h3>
                  <div style={{ height: 6, background: '#F0F4F8', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${c.pct}%`, background: '#55B584', borderRadius: 4 }} />
                  </div>
                  <p style={{ fontSize: 12, color: '#6F737D' }}>{c.pct}% completado</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button onClick={openDonor} style={{ fontSize: 15, fontWeight: 600, color: '#55B584', background: '#EDFBF4', border: 'none', cursor: 'pointer', padding: '12px 28px', borderRadius: 100 }}>
              Ver todas las comunidades →
            </button>
          </div>
        </div>
      </section>

      {/* HISTORIAS */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#121826', marginBottom: 12 }}>Historias de impacto</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {[
              { img: '/marca/historia-1.png', quote: '"Gracias a Donekta pudimos rehabilitar nuestra cocina comunitaria y alimentar a 80 familias cada semana."', name: 'Comunidad Xochimilco' },
              { img: '/marca/historia-2.png', quote: '"Los materiales escolares llegaron justo antes del inicio de clases. 120 niños pudieron estudiar este año."', name: 'Escuela Rural Hidalgo' },
            ].map(h => (
              <div key={h.name} style={{ display: 'flex', gap: 24, background: '#EDFBF4', borderRadius: 20, padding: 28, alignItems: 'center' }}>
                <img src={h.img} alt={`Historia de ${h.name}`} style={{ width: 100, height: 100, borderRadius: 16, objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 15, color: '#121826', lineHeight: 1.6, marginBottom: 12, fontStyle: 'italic' }}>{h.quote}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#55B584' }}>— {h.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section style={{ padding: '80px 24px', background: '#F9FAFB' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#121826', marginBottom: 12 }}>Lo que dicen nuestros donadores</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { avatar: '/marca/avatar-1.png', name: 'María González', text: 'Es increíble saber que mi donación llega directamente a quienes lo necesitan. Totalmente transparente.' },
              { avatar: '/marca/avatar-2.png', name: 'Carlos Ramírez', text: 'La plataforma es muy fácil de usar y el proceso de pago es súper seguro. Lo recomiendo.' },
              { avatar: '/marca/avatar-3.png', name: 'Ana Martínez', text: 'Me encanta poder ver el impacto de mis donaciones en tiempo real. Donekta es extraordinario.' },
            ].map(t => (
              <div key={t.name} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #F0F4F8' }}>
                <p style={{ fontSize: 14, color: '#6F737D', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={t.avatar} alt={`Foto de ${t.name}`} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#121826' }}>{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMISIONES */}
      <section style={{ padding: '80px 24px', background: '#121826' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 16 }}>Transparencia total</h2>
          <p style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 40, lineHeight: 1.7 }}>
            Donekta cobra una comisión del <strong style={{ color: '#55B584' }}>5%</strong> por donación para mantener la plataforma. El resto llega directo a la comunidad.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#55B584', marginBottom: 4 }}>95%</p>
              <p style={{ fontSize: 14, color: '#9CA3AF' }}>Va a la comunidad</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 24 }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 4 }}>5%</p>
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
            <button onClick={openDonor} style={{ fontSize: 15, fontWeight: 700, color: '#55B584', background: '#fff', border: 'none', cursor: 'pointer', padding: '14px 32px', borderRadius: 100 }}>
              Quiero donar
            </button>
            <button onClick={openCommunity} style={{ fontSize: 15, fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.4)', cursor: 'pointer', padding: '14px 32px', borderRadius: 100 }}>
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
              <div style={{ marginBottom: 16 }}>
                <LogoClaro />
              </div>
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

      {/* STICKY MOBILE */}
      <style>{`
        .mobile-donate { display: none; }
        @media (max-width: 768px) {
          .mobile-donate { display: block; position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: #fff; border-top: 1px solid #F0F4F8; z-index: 100; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .comms-grid { grid-template-columns: 1fr !important; }
          .hist-grid { grid-template-columns: 1fr !important; }
          .test-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
      <div className="mobile-donate">
        <button onClick={openDonor} style={{ width: '100%', fontSize: 15, fontWeight: 700, color: '#fff', background: '#55B584', border: 'none', cursor: 'pointer', padding: 14, borderRadius: 12 }}>
          Donar ahora
        </button>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
