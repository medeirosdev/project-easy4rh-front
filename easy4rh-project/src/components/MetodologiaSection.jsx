import { useState } from 'react'
import notebookImg from '../assets/notebook.png'
import { useBreakpoint } from '../hooks/useBreakpoint'

const cards = [
  {
    id: 'pessoas',
    label: 'RECRUTAMENTO E SELEÇÃO',
    icon: '👥',
    items: ['Desenvolvimento & Performance', 'Liderança que funciona', 'Cultura Organizacional'],
  },
  {
    id: 'performance',
    label: 'PERFORMANCE',
    icon: '🛡️',
    items: ['Engajamento & Retenção', 'Gestão Preventiva'],
  },
  {
    id: 'processos',
    label: 'PROCESSOS',
    icon: '💬',
    items: ['RH Estratégico', 'Comunicação Interna'],
  },
  {
    id: 'prevencao',
    label: 'PREVENÇÃO',
    icon: '🗄️',
    items: ['KPIs de Pessoas', 'Gestão orientada por dados'],
  },
]

export default function MetodologiaSection() {
  const [active, setActive] = useState(null)
  const { isMobile } = useBreakpoint()
  const toggle = (id) => setActive(prev => prev === id ? null : id)

  const W = 900, H = 580
  const cx = W / 2, cy = H / 2 - 10

  const bubbles = {
    pessoas:     { x: 60,  y: 130 },
    performance: { x: 800, y: 150 },
    processos:   { x: 60,  y: 470 },
    prevencao:   { x: 800, y: 450 },
  }

  const desktopCards = [
    { id: 'pessoas',     label: 'RECRUTAMENTO E SELEÇÃO', icon: '👥', items: ['Desenvolvimento & Performance', 'Liderança que funciona', 'Cultura Organizacional'], style: { left: -60, top: 220 }, width: 270 },
    { id: 'performance', label: 'PERFORMANCE',             icon: '🛡️', items: ['Engajamento & Retenção', 'Gestão Preventiva'],                                       style: { right: -90, top: 220 }, width: 270 },
    { id: 'processos',   label: 'PROCESSOS',               icon: '💬', items: ['RH Estratégico', 'Comunicação Interna'],                                             style: { left: 180, top: 470 }, width: 170 },
    { id: 'prevencao',   label: 'PREVENÇÃO',               icon: '🗄️', items: ['KPIs de Pessoas', 'Gestão orientada por dados'],                                     style: { right: 180, top: 430 }, width: 250 },
  ]

  
  return (
  <div id="MetodologiaSection" style={{
    background: 'linear-gradient(160deg, #e8f0f8 0%, #f4f8fc 50%, #e0eaf4 100%)',
    padding: isMobile ? '48px 16px' : '72px 20px 80px',
    position: 'relative',
  }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : -30 }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#4a9edd', textTransform: 'uppercase', marginBottom: 12 }}>
          Metodologia
        </p>
        <h2 style={{ fontSize: isMobile ? 26 : 'clamp(30px, 3.5vw, 44px)', fontWeight: 800, color: '#1e3a6e', marginBottom: 14, lineHeight: 1.15 }}>
          Os 4 pilares juntos fazem a diferença.
        </h2>
        <p style={{ color: '#556677', fontSize: isMobile ? 14 : 16, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          Quando eles atuam de forma integrada, o RH deixa de ser operacional e passa a ser
          estratégico, humano e orientado a resultado.
        </p>
      </div>

      {/* Fade topo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, #e8f0f8, transparent)', pointerEvents: 'none', zIndex: 1 }} />
      {/* Fade baixo */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, #e8f0f8, transparent)', pointerEvents: 'none', zIndex: 1 }} />

      {isMobile ? (
        /* ── Mobile: simple card grid ── */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8, position: 'relative', zIndex: 2 }}>
          {cards.map((card) => (
            <div key={card.id} onClick={() => toggle(card.id)} style={{
              background: active === card.id ? 'rgba(255,255,255,0.95)' : 'rgba(220,232,242,0.75)',
              borderRadius: 12, padding: '14px',
              border: `1px solid ${active === card.id ? '#bcd4ec' : 'rgba(138,174,194,0.3)'}`,
              cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: active === card.id ? '0 4px 20px rgba(30,74,138,0.15)' : '0 1px 6px rgba(30,74,138,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: active === card.id ? 10 : 0 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#1e3a6e', letterSpacing: 0.5, lineHeight: 1.3 }}>{card.label}</span>
                <span style={{ fontSize: 16, opacity: 0.7, flexShrink: 0, marginLeft: 6 }}>{card.icon}</span>
              </div>
              {active === card.id && card.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 3 }}>
                  <span style={{ color: '#8AAEC2', fontSize: 10, marginTop: 3 }}>•</span>
                  <span style={{ fontSize: 11.5, color: '#445566', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
          {/* Notebook image centered below */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <img src={notebookImg} alt="Easy4RH" style={{ width: '70%', maxWidth: 280, objectFit: 'contain', filter: 'drop-shadow(0 8px 20px rgba(30,74,138,0.2))' }} />
          </div>
        </div>
      ) : (
        /* ── Desktop: original mind map ── */
        <div style={{ maxWidth: W, margin: '0 auto', position: 'relative', height: H }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
            <line x1={cx} y1={cy} x2={bubbles.pessoas.x}     y2={bubbles.pessoas.y}     stroke="#8AAEC2" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
            <line x1={cx} y1={cy} x2={bubbles.performance.x} y2={bubbles.performance.y} stroke="#8AAEC2" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
            <line x1={cx} y1={cy} x2={bubbles.processos.x}   y2={bubbles.processos.y}   stroke="#8AAEC2" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
            <line x1={cx} y1={cy} x2={bubbles.prevencao.x}   y2={bubbles.prevencao.y}   stroke="#8AAEC2" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.8" />
            <polyline points={`${bubbles.pessoas.x},${bubbles.pessoas.y} ${bubbles.pessoas.x},245 150,245`}         fill="none" stroke="#8AAEC2" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.7" />
            <polyline points={`${bubbles.performance.x},${bubbles.performance.y} ${bubbles.performance.x},245 750,245`} fill="none" stroke="#8AAEC2" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.7" />
            <polyline points={`${bubbles.processos.x},${bubbles.processos.y} ${bubbles.processos.x},505 180,505`}   fill="none" stroke="#8AAEC2" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.7" />
            <polyline points={`${bubbles.prevencao.x},${bubbles.prevencao.y} ${bubbles.prevencao.x},490 720,490`}   fill="none" stroke="#8AAEC2" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.7" />
          </svg>

          {desktopCards.map((card) => (
            <div key={card.id} onClick={() => toggle(card.id)} style={{
              position: 'absolute', ...card.style,
              background: active === card.id ? 'rgba(255,255,255,0.95)' : 'rgba(220,232,242,0.75)',
              borderRadius: 12, padding: '13px 16px',
              boxShadow: active === card.id ? '0 4px 20px rgba(30,74,138,0.15)' : '0 1px 6px rgba(30,74,138,0.06)',
              border: `1px solid ${active === card.id ? '#bcd4ec' : 'rgba(138,174,194,0.3)'}`,
              width: card.width, zIndex: 4, cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(4px)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#1e3a6e', marginBottom: 8, letterSpacing: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{card.label}</span>
                <span style={{ fontSize: 16, opacity: 0.7 }}>{card.icon}</span>
              </div>
              {card.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                  <span style={{ color: '#8AAEC2', fontSize: 11, marginTop: 3 }}>•</span>
                  <span style={{ fontSize: 12.5, color: '#445566', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}

          {Object.entries(bubbles).map(([id, b]) => {
            const labels = { pessoas: 'PESSOAS', performance: 'PERFORMANCE', processos: 'PROCESSOS', prevencao: 'PREVENÇÃO' }
            const isActive = active === id
            return (
              <div key={id} onClick={() => toggle(id)} style={{
                position: 'absolute', left: b.x - 40, top: b.y - 40,
                width: 100, height: 100, borderRadius: '50%',
                background: isActive ? 'radial-gradient(circle at 30% 25%, #a8cfe0, #4a7a9a)' : 'radial-gradient(circle at 30% 25%, #c8e4f4 0%, #8AAEC2 35%, #5a8aa2 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isActive ? '0 12px 40px rgba(30,74,138,0.45), 0 4px 12px rgba(30,74,138,0.3), inset 0 1px 2px rgba(255,255,255,0.3)' : '0 8px 28px rgba(30,74,138,0.28), 0 2px 8px rgba(30,74,138,0.15), inset 0 1px 2px rgba(255,255,255,0.4)',
                transform: isActive ? 'scale(1.12)' : 'scale(1)',
                transition: 'all 0.25s', zIndex: 3,
                border: '1px solid rgba(255,255,255,0.5)',
              }}>
                <div style={{ position: 'absolute', top: 10, left: 18, width: 38, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', filter: 'blur(3px)', pointerEvents: 'none' }} />
                <span style={{ fontSize: 10.5, fontWeight: 800, color: 'white', letterSpacing: 1, textAlign: 'center', padding: '0 10px', userSelect: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.2)', position: 'relative', zIndex: 1 }}>
                  {labels[id]}
                </span>
              </div>
            )
          })}

          <div style={{ position: 'absolute', left: cx - 155, top: cy - 150, width: 280, height: 300, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle at 32% 28%, #c8e4f4 0%, #8AAEC2 45%, #4a7a9a 100%)', top: 0, left: 15, boxShadow: '0 12px 48px rgba(30,74,138,0.3), 0 4px 16px rgba(30,74,138,0.2), inset 0 2px 4px rgba(255,255,255,0.3)', zIndex: 1, border: '1px solid rgba(255,255,255,0.4)' }}>
              <div style={{ position: 'absolute', top: 18, left: 32, width: 70, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', filter: 'blur(6px)' }} />
            </div>
            <img src={notebookImg} alt="Easy4RH" style={{ width: 250, objectFit: 'contain', position: 'relative', zIndex: 2, filter: 'drop-shadow(0 10px 24px rgba(30,74,138,0.25))', marginTop: -60 }} />
          </div>
        </div>
      )}
    </div>
  )
}
