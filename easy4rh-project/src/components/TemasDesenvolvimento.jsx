import { useState, useEffect } from 'react'

const temas = [
  {
    title: 'Autoconhecimento',
    emoji: '🧠',
    color: ['#5a8fd0', '#3a6090'],
    items: ['Identidade e estilo de liderança', 'Valores, crenças e comportamento', 'Pontos fortes e oportunidades'],
  },
  {
    title: 'Inteligência Emocional',
    emoji: '❤️',
    color: ['#6a9fd8', '#4a70a8'],
    items: ['Gestão das emoções no dia a dia', 'Autocontrole em pressão', 'Tomada de decisão inteligente'],
  },
  {
    title: 'Comunicação e Feedback',
    emoji: '💬',
    color: ['#4a80c0', '#2a5080'],
    items: ['Comunicação clara e assertiva', 'Feedbacks construtivos', 'Conversas difíceis com segurança'],
  },
  {
    title: 'Poder da Delegação',
    emoji: '🎯',
    color: ['#3a70b0', '#1a4070'],
    items: ['Delegar com estratégia', 'Desenvolvimento de autonomia', 'Foco no que realmente importa'],
  },
  {
    title: 'Formação de Equipes',
    emoji: '👥',
    color: ['#5090c8', '#3060a0'],
    items: ['Times de alta performance', 'Engajamento e colaboração', 'Liderança pelo exemplo'],
  },
]

function Card({ tema, entering, exiting, direction }) {
  let animation = 'none'
  if (entering) animation = direction === 'next' ? 'cardEnterRight 0.45s ease forwards' : 'cardEnterLeft 0.45s ease forwards'
  if (exiting)  animation = direction === 'next' ? 'cardExitLeft 0.45s ease forwards'  : 'cardExitRight 0.45s ease forwards'

  return (
    <div style={{
      background: `linear-gradient(135deg, ${tema.color[0]}, ${tema.color[1]})`,
      borderRadius: 20,
      padding: '28px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
      animation,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12,
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
        }}>
          {tema.emoji}
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.2 }}>
          {tema.title}
        </h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tema.items.map((item, j) => (
          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.55)', flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.88)', lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TemasDesenvolvimento() {
  const [current, setCurrent] = useState(0)
  const [prev2, setPrev2] = useState(null)
  const [direction, setDirection] = useState('next')
  const [autoplay, setAutoplay] = useState(true)

  const maxIndex = temas.length - 2

  useEffect(() => {
    if (!autoplay) return
    const timer = setInterval(() => go(current + 1, 'next'), 4500)
    return () => clearInterval(timer)
  }, [current, autoplay])

  const go = (index, dir) => {
    const next = Math.max(0, Math.min(index, maxIndex))
    if (next === current) return
    setDirection(dir || (index > current ? 'next' : 'prev'))
    setPrev2(current)
    setCurrent(next)
    setTimeout(() => setPrev2(null), 460)
  }

  const goNext = () => { setAutoplay(false); go(current + 1, 'next') }
  const goPrev = () => { setAutoplay(false); go(current - 1, 'prev') }

  return (
    <div style={{
      background: 'linear-gradient(160deg, #1a2a40 0%, #2a3a55 50%, #1e3060 100%)',
      padding: '72px 20px',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>

          {/* Left title */}
          <div style={{ minWidth: 160, flexShrink: 0 }}>
            <h2 style={{ fontSize: 'clamp(20px, 2.2vw, 30px)', fontWeight: 800, color: 'white', lineHeight: 1.25 }}>
              Temas de{' '}
              <span style={{ color: '#7ac0e8', display: 'block' }}>Desenvolvimento</span>
            </h2>
          </div>

          {/* Cards + controls */}
          <div style={{ flex: 1 }}>

            {/* 2-card grid with individual card transitions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, overflow: 'hidden' }}>

              {/* Left card slot */}
              <div style={{ position: 'relative', minHeight: 200 }}>
                {/* Exiting card (left slot) */}
                {prev2 !== null && (
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <Card tema={temas[prev2]} exiting direction={direction} />
                  </div>
                )}
                {/* Entering card (left slot) */}
                <Card tema={temas[current]} entering={prev2 !== null} direction={direction} />
              </div>

              {/* Right card slot */}
              <div style={{ position: 'relative', minHeight: 200 }}>
                {/* Exiting card (right slot) */}
                {prev2 !== null && temas[prev2 + 1] && (
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <Card tema={temas[prev2 + 1]} exiting direction={direction} />
                  </div>
                )}
                {/* Entering card (right slot) */}
                {temas[current + 1] && (
                  <Card tema={temas[current + 1]} entering={prev2 !== null} direction={direction} />
                )}
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 28, zIndex: 2, position: 'relative' }}>
              <button onClick={goPrev} disabled={current === 0} style={{
                width: 40, height: 40, borderRadius: '50%',
                background: current === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: current === 0 ? 'rgba(255,255,255,0.3)' : 'white',
                fontSize: 20, cursor: current === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              }}>‹</button>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <div key={i}
                    onClick={() => { setAutoplay(false); go(i) }}
                    style={{
                      width: i === current ? 24 : 8, height: 8, borderRadius: 4,
                      background: i === current ? '#4a9edd' : 'rgba(255,255,255,0.25)',
                      cursor: 'pointer', transition: 'all 0.35s ease',
                    }}
                  />
                ))}
              </div>

              <button onClick={goNext} disabled={current >= maxIndex} style={{
                width: 40, height: 40, borderRadius: '50%',
                background: current >= maxIndex ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: current >= maxIndex ? 'rgba(255,255,255,0.3)' : 'white',
                fontSize: 20, cursor: current >= maxIndex ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              }}>›</button>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes cardEnterRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cardEnterLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cardExitLeft {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-40px); }
        }
        @keyframes cardExitRight {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(40px); }
        }
      `}</style>
    </div>
  )
}
