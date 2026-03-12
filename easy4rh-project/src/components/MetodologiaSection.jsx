import { useState } from 'react'
import notebookImg from '../assets/notebook.png'
import logoImg from '../assets/logo.png'

export default function MetodologiaSection() {
  const [active, setActive] = useState(null)
  const toggle = (id) => setActive(prev => prev === id ? null : id)

  const W = 900, H = 580
  const cx = W / 2, cy = H / 2 - 10

  const bubbles = {
    pessoas:     { x: 185, y: 118 },
    performance: { x: 715, y: 118 },
    processos:   { x: 185, y: 430 },
    prevencao:   { x: 715, y: 430 },
  }

  const cards = [
    {
      id: 'pessoas',
      label: 'RECRUTAMENTO E SELEÇÃO',
      icon: '👥',
      items: ['Desenvolvimento & Performance', 'Liderança que funciona', 'Cultura Organizacional'],
      style: { left: 14, top: 195 },
    },
    {
      id: 'performance',
      label: 'PERFORMANCE',
      icon: '🛡️',
      items: ['Engajamento & Retenção', 'Gestão Preventiva'],
      style: { right: 14, top: 195 },
    },
    {
      id: 'processos',
      label: 'PROCESSOS',
      icon: '💬',
      items: ['RH Estratégico', 'Comunicação Interna'],
      style: { left: 14, top: 370 },
    },
    {
      id: 'prevencao',
      label: 'PREVENÇÃO',
      icon: '🗄️',
      items: ['KPIs de Pessoas', 'Gestão orientada por dados'],
      style: { right: 14, top: 370 },
    },
  ]

  return (
    <div style={{
      background: 'linear-gradient(160deg, #e8f0f8 0%, #f4f8fc 50%, #e0eaf4 100%)',
      padding: '72px 20px 80px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#4a9edd', textTransform: 'uppercase', marginBottom: 12 }}>
          Metodologia
        </p>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800, color: '#1e3a6e', marginBottom: 14, lineHeight: 1.15 }}>
          Os 4 pilares juntos fazem a diferença.
        </h2>
        <p style={{ color: '#556677', fontSize: 15, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          Quando eles atuam de forma integrada, o RH deixa de ser operacional e passa a ser
          estratégico, humano e orientado a resultado.
        </p>
      </div>

      {/* Mind map */}
      <div style={{ maxWidth: W, margin: '0 auto', position: 'relative', height: H }}>

        {/* SVG lines */}
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}
          style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          {Object.values(bubbles).map((b, i) => (
            <line key={i} x1={cx} y1={cy} x2={b.x} y2={b.y}
              stroke="#90b8d4" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.75" />
          ))}
          <polyline points={`${bubbles.pessoas.x},${bubbles.pessoas.y + 52} ${bubbles.pessoas.x},215 185,215`}
            fill="none" stroke="#90b8d4" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.6" />
          <polyline points={`${bubbles.performance.x},${bubbles.performance.y + 52} ${bubbles.performance.x},215 715,215`}
            fill="none" stroke="#90b8d4" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.6" />
          <polyline points={`${bubbles.processos.x},${bubbles.processos.y - 52} ${bubbles.processos.x},390 185,390`}
            fill="none" stroke="#90b8d4" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.6" />
          <polyline points={`${bubbles.prevencao.x},${bubbles.prevencao.y - 52} ${bubbles.prevencao.x},390 715,390`}
            fill="none" stroke="#90b8d4" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.6" />
        </svg>

        {/* Info Cards */}
        {cards.map((card) => (
          <div key={card.id} onClick={() => toggle(card.id)} style={{
            position: 'absolute',
            ...card.style,
            background: active === card.id ? 'white' : 'rgba(255,255,255,0.88)',
            borderRadius: 12, padding: '12px 14px',
            boxShadow: active === card.id ? '0 6px 28px rgba(30,74,138,0.18)' : '0 2px 10px rgba(30,74,138,0.08)',
            border: `1px solid ${active === card.id ? '#bcd4ec' : '#dde8f4'}`,
            width: 190, zIndex: 4, cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: '#1e3a6e', marginBottom: 8, letterSpacing: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{card.label}</span>
              <span style={{ fontSize: 15 }}>{card.icon}</span>
            </div>
            {card.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 4 }}>
                <span style={{ color: '#4a9edd', fontSize: 11, marginTop: 2 }}>•</span>
                <span style={{ fontSize: 12, color: '#445566', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        ))}

        {/* Bubbles */}
        {Object.entries(bubbles).map(([id, b]) => {
          const labels = { pessoas: 'PESSOAS', performance: 'PERFORMANCE', processos: 'PROCESSOS', prevencao: 'PREVENÇÃO' }
          const isActive = active === id
          return (
            <div key={id} onClick={() => toggle(id)} style={{
              position: 'absolute',
              left: b.x - 52, top: b.y - 52,
              width: 104, height: 104, borderRadius: '50%',
              background: isActive
                ? 'radial-gradient(circle at 30% 25%, #8dd0e8, #1a5a8a)'
                : 'radial-gradient(circle at 30% 25%, #c8e4f4 0%, #7ab8d8 35%, #3a7aaa 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: isActive
                ? '0 12px 40px rgba(30,74,138,0.45), 0 4px 12px rgba(30,74,138,0.3), inset 0 1px 2px rgba(255,255,255,0.3)'
                : '0 8px 28px rgba(30,74,138,0.28), 0 2px 8px rgba(30,74,138,0.15), inset 0 1px 2px rgba(255,255,255,0.4)',
              transform: isActive ? 'scale(1.12)' : 'scale(1)',
              transition: 'all 0.25s', zIndex: 3,
              border: '1px solid rgba(255,255,255,0.5)',
              position: 'absolute',
            }}>
              {/* Gloss highlight */}
              <div style={{
                position: 'absolute', top: 10, left: 18,
                width: 38, height: 22, borderRadius: '50%',
                background: 'rgba(255,255,255,0.35)',
                filter: 'blur(3px)', pointerEvents: 'none',
              }} />
              <span style={{
                fontSize: 10.5, fontWeight: 800, color: 'white',
                letterSpacing: 1, textAlign: 'center', padding: '0 10px',
                userSelect: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.2)',
                position: 'relative', zIndex: 1,
              }}>
                {labels[id]}
              </span>
            </div>
          )
        })}

        {/* Center: Globe + Notebook + Logo */}
        <div style={{
          position: 'absolute',
          left: cx - 155, top: cy - 150,
          width: 240, height: 280,
          zIndex: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Globe */}
          <div style={{
            position: 'absolute',
            width: 210, height: 210,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 32% 28%, #b8ddf0 0%, #5a9dc8 45%, #2a6090 100%)',
            top: 0, left: 15,
            boxShadow: '0 12px 48px rgba(30,74,138,0.3), 0 4px 16px rgba(30,74,138,0.2), inset 0 2px 4px rgba(255,255,255,0.3)',
            zIndex: 1,
            border: '1px solid rgba(255,255,255,0.4)',
          }}>
            <div style={{
              position: 'absolute', top: 18, left: 32,
              width: 70, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)', filter: 'blur(6px)',
            }} />
          </div>

          {/* Notebook */}
          <img src={notebookImg} alt="Easy4RH" style={{
            width: 240, objectFit: 'contain',
            position: 'relative', zIndex: 2,
            filter: 'drop-shadow(0 10px 24px rgba(30,74,138,0.25))',
            marginTop: -60,
          }} />

       {/* Logo on screen */}
          <div style={{
            position: 'absolute',
            top: 68, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            display: 'flex', alignItems: 'center', gap: 5,
            pointerEvents: 'none',
          }}>
            <img src={logoImg} alt="logo" style={{ width: 70, height: 60, objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#1e4a8a', lineHeight: 1 }}>
                EASY<span style={{ color: '#4a9edd' }}>4</span>RH
              </div>
              <div style={{ fontSize: 9, color: '#888', letterSpacing: 0.8 }}>CONSULTORIA EM RH</div>
            </div>
          </div>
        </div>

      </div>

      <p style={{ textAlign: 'center', fontSize: 12.5, color: '#8899aa', marginTop: 16 }}>
        💡 Clique em cada pilar ou card para destacar
      </p>
    </div>
  )
}
