import { useState, useEffect } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'

const segments = [
  { label: 'PESSOAS',     color: '#7ab3c8', startAngle: 0   },
  { label: 'PROCESSOS',   color: '#5a9abf', startAngle: 90  },
  { label: 'PREVENÇÃO',   color: '#4a7aaa', startAngle: 180 },
  { label: 'PERFORMANCE', color: '#2a4a6e', startAngle: 270 },
]

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle - 0.5)
  const end   = polarToCartesian(cx, cy, r, startAngle + 0.5)
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 0 0 ${end.x} ${end.y} Z`
}

export default function SolucaoSection({ navigate }) {
  const [rotation, setRotation] = useState(0)
  const [hovered, setHovered]   = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const { isMobile } = useBreakpoint()

  const services = [
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'RECRUTAMENTO\nE SELEÇÃO',
      desc: 'Conectamos empresas aos profissionais certos, com processos estruturados, ágeis e alinhados à cultura e aos objetivos do negócio.',
      gradient: 'linear-gradient(145deg, #C3CAD9 0%, #5590B2 60%, #5590B2 100%)',
      shadow: 'rgba(26,79,138,0.3)',
      action: () => navigate('vagas'),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      ),
      title: 'CONSULTORIA',
      desc: 'Analisamos, estruturamos e otimizamos processos de pessoas para transformar o RH em uma área estratégica e orientada a resultados.',
      gradient: 'linear-gradient(145deg, #C3CAD9 0%, #5590B2 60%, #5590B2 100%)',
      shadow: 'rgba(26,106,58,0.3)',
      action: () => document.getElementById('assessoria-section')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
          <line x1="2" y1="20" x2="22" y2="20"/>
        </svg>
      ),
      title: 'TREINAMENTOS\nINDIVIDUAIS',
      desc: 'Desenvolvimento personalizado para profissionais e líderes, focado em performance, tomada de decisão e crescimento profissional.',
      gradient: 'linear-gradient(145deg, #C3CAD9 0%, #5590B2 60%, #5590B2 100%)',
      shadow: 'rgba(106,26,138,0.3)',
      action: () => document.getElementById('lideranca-section')?.scrollIntoView({ behavior: 'smooth' }),
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => setRotation(prev => (prev + 0.3) % 360), 16)
    return () => clearInterval(interval)
  }, [])

  const cx = 160, cy = 160, r = 130, rInner = 48

  return (
    <div style={{ background: 'linear-gradient(160deg, #e8f0f8 0%, #f0f5fa 50%, #e0eaf4 100%)', padding: '48px 20px 60px', position: 'relative' }}>

      {/* Fade baixo */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 80,
        background: 'linear-gradient(to top, #e8f0f8, transparent)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Top section */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 24, alignItems: 'center', marginBottom: 40 }}>
          {/* Circle */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', order: isMobile ? 2 : 1 }}>
            <svg width="380" height="380" viewBox="0 0 320 320" style={{ transform: `rotate(${rotation}deg)` }}>
              {segments.map((seg, i) => {
                const path   = describeArc(cx, cy, r, seg.startAngle, seg.startAngle + 88)
                const rText  = r * 0.75
                const startA = seg.startAngle + 10
                const endA   = seg.startAngle + 78
                const arcStart = polarToCartesian(cx, cy, rText, startA)
                const arcEnd   = polarToCartesian(cx, cy, rText, endA)
                const arcPath  = `M ${arcStart.x} ${arcStart.y} A ${rText} ${rText} 0 0 1 ${arcEnd.x} ${arcEnd.y}`
                const arcId    = `arc-text-${i}`
                return (
                  <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
                    <path d={path} fill={seg.color} stroke="white" strokeWidth="1.5" opacity={hovered === i ? 1 : 0.88} style={{ transition: 'opacity 0.2s' }} />
                    <defs>
                      <path id={arcId} d={arcPath} />
                      <linearGradient id={`textGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
                        <stop offset="100%" stopColor="white" />
                      </linearGradient>
                    </defs>
                    <text fill={`url(#textGrad-${i})`} fontSize="11" fontWeight="800" letterSpacing="2" style={{ userSelect: 'none' }}>
                      <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">{seg.label}</textPath>
                    </text>
                  </g>
                )
              })}
              <circle cx={cx} cy={cy} r={rInner} fill="white" stroke="#e0eaf4" strokeWidth="2" />
            </svg>
          </div>

          {/* Text */}
          <div style={{ order: isMobile ? 1 : 2, textAlign: isMobile ? 'center' : 'left' }}>
            <h2 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: '#1e3a6e', lineHeight: 1.2, marginBottom: 20 }}>
              Soluções Integradas para um RH de{' '}
              <span style={{ color: '#2a7ec8' }}>Alta Performance</span>
            </h2>
            <p style={{ color: '#445566', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
              Atuar em pontos isolados gera apenas resultados superficiais. Nossa metodologia conecta o desenvolvimento de equipes aos objetivos do negócio, entregando soluções práticas que fortalecem líderes e garantem uma organização sustentável a longo prazo.
            </p>
            <button onClick={() => navigate('sobre')} style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 10, padding: '14px 32px', cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(26,79,138,0.3)' }}>
              Saiba Mais
            </button>
          </div>
        </div>

        {/* Services grid */}
        <div style={{ textAlign: 'left', marginBottom: 48 }}>
          <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.2 }}>Nossos</div>
          <div style={{ fontSize: isMobile ? 34 : 46, fontWeight: 900, color: '#345678', lineHeight: 1.1 }}>Serviços</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          {services.map((s, i) => (
            <div key={i}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: s.gradient,
                borderRadius: 24,
                padding: '40px 28px 36px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                boxShadow: hoveredCard === i ? `0 20px 48px ${s.shadow}` : `0 8px 28px ${s.shadow}`,
                transform: hoveredCard === i ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: '2px solid rgba(255,255,255,0.35)', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                {s.icon}
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1e3a6e', letterSpacing: 1.5, marginBottom: 16, whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                {s.title}
              </h3>

              <div style={{ width: 40, height: 2, background: 'rgba(255,255,255,0.4)', borderRadius: 2, marginBottom: 16 }} />

              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.9)', lineHeight: 1.75, marginBottom: 32, flex: 1 }}>
                {s.desc}
              </p>

              <button
                onClick={() => s.action()}
                style={{
                  background: 'linear-gradient(135deg, #1a3a6a, #2a5a9a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 32, padding: '12px 32px',
                  cursor: 'pointer', fontWeight: 700, fontSize: 14,
                  width: '100%',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, #0f2a50, #1a4a8a)'}
                onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, #1a3a6a, #2a5a9a)'}
              >
                Saiba Mais
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
