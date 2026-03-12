import { useState } from 'react'
import manTablet from '../assets/man-tablet.png'
import { useBreakpoint } from '../hooks/useBreakpoint'

const modulos = [
  { icon: '🎓', label: 'LIDERANÇA DE\nIMPACTO' },
  { icon: '🤝', label: 'LIDERANÇA QUE\nCONECTA' },
  { icon: '🏅', label: 'IDENTIDADE DE LIDERANÇA', wide: true },
]

export default function FormacaoLiderancaSection({ navigate }) {
  const { isMobile } = useBreakpoint()
  const [active, setActive] = useState(null)

  return (
    <div style={{
      background: '#f0f3f8',
      padding: '72px 20px',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 40 : 64,
        alignItems: 'center',
      }}>

        {/* Left — text + cards */}
        <div>
          <p style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 2.5,
            color: '#1e4a8a',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            Formação de Liderança
          </p>

          <p style={{
            fontSize: 15,
            color: '#445566',
            lineHeight: 1.8,
            marginBottom: 36,
            maxWidth: 480,
          }}>
            Parte dos nossos treinamentos individuais é baseada no modelo de
            aprendizagem de John Maxwell, uma das maiores referências globais em
            liderança, sempre adaptado à prática e à realidade do dia a dia.
          </p>

          {/* Cards grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
          }}>
            {modulos.map((m, i) => (
              <div
                key={i}
                onClick={() => setActive(active === i ? null : i)}
                style={{
                  gridColumn: m.wide ? '1 / -1' : 'auto',
                  background: active === i ? 'linear-gradient(135deg, #e8f0fc, #d4e4f8)' : 'white',
                  borderRadius: 14,
                  padding: m.wide ? '18px 24px' : '24px 20px',
                  display: 'flex',
                  flexDirection: m.wide ? 'row' : 'column',
                  alignItems: m.wide ? 'center' : 'flex-start',
                  gap: m.wide ? 16 : 12,
                  cursor: 'pointer',
                  border: active === i ? '1.5px solid #4a9edd' : '1.5px solid transparent',
                  boxShadow: active === i
                    ? '0 4px 20px rgba(74,158,221,0.15)'
                    : '0 2px 12px rgba(30,74,138,0.07)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (active !== i) e.currentTarget.style.boxShadow = '0 6px 20px rgba(30,74,138,0.12)' }}
                onMouseLeave={e => { if (active !== i) e.currentTarget.style.boxShadow = '0 2px 12px rgba(30,74,138,0.07)' }}
              >
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: '#e8f0fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}>
                  {m.icon}
                </div>
                <span style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: '#1e3a6e',
                  letterSpacing: 0.5,
                  lineHeight: 1.4,
                  whiteSpace: 'pre-line',
                }}>
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('treinamentos')}
            style={{
              marginTop: 28,
              background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              padding: '13px 28px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 14.5,
              boxShadow: '0 4px 16px rgba(26,79,138,0.25)',
            }}
          >
            Quero me desenvolver →
          </button>
        </div>

        {/* Right — circle + man image */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          order: isMobile ? -1 : 1,
        }}>
          {/* Circle background */}
          <div style={{
            width: isMobile ? 260 : 380,
            height: isMobile ? 260 : 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #b8d4e8, #7aaed4)',
            position: 'absolute',
            zIndex: 1,
          }} />

          {/* Man image */}
          <img
            src={manTablet}
            alt="Liderança"
            style={{
              height: isMobile ? 280 : 440,
              objectFit: 'contain',
              objectPosition: 'bottom',
              position: 'relative',
              zIndex: 2,
              filter: 'drop-shadow(0 8px 24px rgba(30,74,138,0.15))',
            }}
          />
        </div>

      </div>
    </div>
  )
}
