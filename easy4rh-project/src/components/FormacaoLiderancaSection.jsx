import { useState } from 'react'
import manTablet from '../assets/man-tablet.png'
import { useBreakpoint } from '../hooks/useBreakpoint'

const IconImpacto = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="#5a8fd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4C10 4 6 8 6 13c0 4 2.5 7 6 8.5V24h8v-2.5c3.5-1.5 6-4.5 6-8.5 0-5-4-9-10-9z"/>
    <line x1="12" y1="28" x2="20" y2="28"/>
    <line x1="14" y1="24" x2="14" y2="28"/>
    <line x1="18" y1="24" x2="18" y2="28"/>
  </svg>
)

const IconConecta = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="#5a8fd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="16" r="4"/>
    <circle cx="24" cy="8" r="4"/>
    <circle cx="24" cy="24" r="4"/>
    <line x1="12" y1="14" x2="20" y2="10"/>
    <line x1="12" y1="18" x2="20" y2="22"/>
  </svg>
)

const IconIdentidade = () => (
  <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="#5a8fd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="16" cy="10" r="5"/>
    <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10"/>
    <path d="M13 18l3 4 3-4"/>
  </svg>
)

const modulos = [
  { icon: <IconImpacto />, label: 'LIDERANÇA DE\nIMPACTO' },
  { icon: <IconConecta />, label: 'LIDERANÇA QUE\nCONECTA' },
  { icon: <IconIdentidade />, label: 'IDENTIDADE DE LIDERANÇA', wide: true },
]

export default function FormacaoLiderancaSection({ navigate }) {
  const { isMobile } = useBreakpoint()
  const [active, setActive] = useState(null)

  return (
    <div id="lideranca-section" style={{ background: '#e8edf4', padding: '72px 20px' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 40 : 64,
        alignItems: 'center',
      }}>

        {/* Left */}
        <div>
          <p style={{
            fontSize: 20, fontWeight: 800, letterSpacing: 2.5,
            color: '#1e4a8a', textTransform: 'uppercase', marginBottom: 20,
          }}>
            Formação de Liderança
          </p>

          <p style={{ fontSize: 15, color: '#445566', lineHeight: 1.8, marginBottom: 36, maxWidth: 480 }}>
            Parte dos nossos treinamentos individuais é baseada no modelo de
            aprendizagem de John Maxwell, uma das maiores referências globais em
            liderança, sempre adaptado à prática e à realidade do dia a dia.
          </p>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {modulos.map((m, i) => (
              <div key={i}
                onClick={() => setActive(active === i ? null : i)}
                style={{
                  gridColumn: m.wide ? '1 / -1' : 'auto',
                  background: active === i ? 'linear-gradient(135deg, #e8f0fc, #d4e4f8)' : 'white',
                  borderRadius: 14,
                  padding: m.wide ? '20px 24px' : '24px 20px',
                  display: 'flex',
                  flexDirection: m.wide ? 'row' : 'column',
                  alignItems: m.wide ? 'center' : 'flex-start',
                  gap: m.wide ? 16 : 14,
                  cursor: 'pointer',
                  border: active === i ? '1.5px solid #4a9edd' : '1.5px solid transparent',
                  boxShadow: active === i ? '0 4px 20px rgba(74,158,221,0.15)' : '0 2px 12px rgba(30,74,138,0.07)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (active !== i) e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,74,138,0.12)' }}
                onMouseLeave={e => { if (active !== i) e.currentTarget.style.boxShadow = '0 2px 12px rgba(30,74,138,0.07)' }}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: '#deeaf8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {m.icon}
                </div>
                <span style={{
                  fontSize: 15, fontWeight: 800, color: '#1e3a6e',
                  letterSpacing: 0.5, lineHeight: 1.4, whiteSpace: 'pre-line',
                }}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => document.getElementById('fale-conosco')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              marginTop: 28,
              background: 'linear-gradient(170deg, #3E658C, #8AAEC2)',
              color: 'white', border: 'none', borderRadius: 10,
              padding: '13px 28px', cursor: 'pointer',
              fontWeight: 700, fontSize: 14.5,
              boxShadow: '0 4px 16px rgba(26,79,138,0.25)',
            }}>
            Quero me desenvolver →
          </button>
        </div>

        {/* Right */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', order: isMobile ? -1 : 1,
        }}>
          <div style={{
            width: isMobile ? 260 : 400, height: isMobile ? 260 : 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #c8dff0, #8AAEC2)',
            position: 'absolute', zIndex: 1,
          }} />
          <img src={manTablet} alt="Liderança" style={{
            height: isMobile ? 280 : 460,
            objectFit: 'contain', objectPosition: 'bottom',
            position: 'relative', zIndex: 2,
            filter: 'drop-shadow(0 8px 24px rgba(30,74,138,0.15))',
          }} />
        </div>

      </div>
    </div>
  )
}
