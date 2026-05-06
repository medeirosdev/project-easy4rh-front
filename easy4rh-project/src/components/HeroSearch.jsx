import { useState, useEffect } from 'react'
import heroImage from '../assets/hero-image.png'
import ellipseImg from '../assets/ellipse.png'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { Users, ArrowRight, Settings, BarChart2, Shield } from '../utils/icons.jsx'

const megaMenu = {
  Pessoas: {
    icon: <Users size={18} />,
    page: 'pessoas',
    desc: 'Desenvolvimento humano estratégico.',
    items: [
      'Mapeamento de perfil', 'DISC', 'Avaliação de experiência e desempenho',
      '9 Box', 'Feedback', 'PDI (Plano de Desenvolvimento Individual)',
      'Gestão de talentos', 'Trilha de carreira', 'Treinamentos técnicos',
      'Treinamentos comportamentais', 'Treinamentos de liderança',
      'Endomarketing', 'Gincanas e dinâmicas',
    ],
  },
  Processos: {
    icon: <Settings size={18} />,
    page: 'processos',
    desc: 'Fluxos otimizados para resultados.',
    items: [
      'Política de R&S (Recrutamento e Seleção)', 'Descritivo de cargos e manuais operacionais',
      'Admissão / Demissão', 'Onboarding / Offboarding', 'Folha de pagamento',
      'Política de remuneração e benefícios', 'Gestão de ponto / jornada / escala',
      'SST (Saúde e Segurança do Trabalho)', 'Gestão de documentos',
      'Construção e revisão da cultura',
    ],
  },
  Performance: {
    icon: <BarChart2 size={18} />,
    page: 'performance',
    desc: 'Maximize o desempenho da equipe.',
    items: [
      'Gestão de KPIS', 'Headcount: quadro orçado vs. quadro ativo',
      'Taxa de promoções internas', 'Índice de diversidade e inclusão',
      'Custo total da FOPA / % da FOPA sobre o FAT',
      'Custo de benefício por colaborador', 'Custo de horas extras',
    ],
  },
  Prevenção: {
    icon: <Shield size={18} />,
    page: 'prevencao',
    desc: 'Gestão de riscos e bem-estar.',
    items: [
      'Pesquisa de clima', 'Código de ética e conduta', 'Ouvidoria',
      'Entrevista de desligamento', 'Política de prevenção ao assédio e à discriminação',
      'Política de advertências e medidas disciplinares',
      'Dossiês e laudos extrajudiciais para gestão de conflitos internos',
      'Política de segurança do trabalho', 'NR 01',
    ],
  },
}

const orbitConfigs = [
  { cx: 70, cy: 48, rx: 20, ry: 7, speed: 18, offset: 0   },
  { cx: 70, cy: 48, rx: 20, ry: 7, speed: 18, offset: 90  },
  { cx: 70, cy: 48, rx: 20, ry: 7, speed: 18, offset: 180 },
  { cx: 70, cy: 48, rx: 20, ry: 7, speed: 18, offset: 270 },
]

const pillars = Object.keys(megaMenu)

export default function HeroSearch({ navigate }) {
  const [angle, setAngle] = useState(0)
  const [hoveredP, setHoveredP] = useState(null)
  const [pausedOrbit, setPausedOrbit] = useState(false)
  const { isMobile, isTablet } = useBreakpoint()
  const [openBar, setOpenBar] = useState(null)

  useEffect(() => {
    if (pausedOrbit) return
    let raf
    let last = null
    const tick = (ts) => {
      if (last !== null) setAngle(a => a + (ts - last) * 0.02)
      last = ts
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pausedOrbit])

  const floatPositions = [
    { left: '58%', top: '18%' },
    { left: '51%', top: '55%' },
    { left: '64%', top: '71%' },
    { left: '85%', top: '65%' },
  ]

  const getPos = (cfg, i) => ({
    left: floatPositions[i].left,
    top: `calc(${floatPositions[i].top} + ${Math.sin((angle + i * 80) * 0.015) * 12}px)`,
  })

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: isMobile ? 'auto' : '620px',
      overflow: 'hidden', // ← fix: hidden em vez de visible
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 30%, #51AADD 70%, #457395 85%, #1a4f8a 100%)',
    }}>

      {!isMobile && (
        <div style={{ position: 'absolute', right: 0, top: '80px', width: isTablet ? '55%' : '62%', height: '100%', zIndex: 1 }}>
          <img src={heroImage} alt="Hero" style={{ width: '85%', height: '85%', objectFit: 'contain', objectPosition: 'right bottom', display: 'block' }} />
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: isMobile ? 'none' : 'radial-gradient(ellipse at 65% 50%, transparent 0%, transparent 25%, rgba(168,200,232,0.3) 50%, #b8d4ea 75%, #a8c8e8 100%)' }} />

      {!isMobile && (
        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', width: '520px', height: '520px', zIndex: 0 }}>
          <img src={ellipseImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.6 }} />
        </div>
      )}

      {/* ── Orbital P's — desktop only ── */}
      {!isMobile && pillars.map((key, i) => {
        const pos = getPos(orbitConfigs[i], i)
        const isHovered = hoveredP === key
        return (
          <div
            key={key}
            style={{ position: 'absolute', ...pos, zIndex: isHovered ? 20 : 5, transform: 'translate(-50%, -50%)', cursor: 'pointer' }}
            onMouseEnter={() => { setHoveredP(key); setPausedOrbit(true) }}
            onMouseLeave={() => { setHoveredP(null); setPausedOrbit(false) }}
            onClick={() => navigate(megaMenu[key].page)}
          >
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 60, height: 60, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
            <div style={{
              width: isHovered ? 38 : 32, height: isHovered ? 38 : 32, borderRadius: '50%',
              background: isHovered
                ? 'radial-gradient(circle at 32% 28%, #6ab0e8, #1a4f8a 70%, #0d2a4e)'
                : 'radial-gradient(circle at 32% 28%, #a8d4f0 0%, #4a8ec8 45%, #1a4a8a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: isHovered ? 15 : 13,
              boxShadow: isHovered
                ? '0 10px 32px rgba(20,60,120,0.6), inset 0 1px 2px rgba(255,255,255,0.4)'
                : '0 6px 20px rgba(20,60,120,0.4), inset 0 1px 2px rgba(255,255,255,0.35)',
              border: '1.5px solid rgba(255,255,255,0.5)',
              transition: 'all 0.25s ease',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 5, left: 9, width: '40%', height: '30%', borderRadius: '50%', background: 'rgba(255,255,255,0.35)', filter: 'blur(2px)', pointerEvents: 'none' }} />
              <span style={{ position: 'relative', zIndex: 1, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>P</span>
            </div>
            <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', letterSpacing: 0.5 }}>
              {key}
            </div>
          </div>
        )
      })}

      {/* ── Main content ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1200, width: '100%', margin: '0 auto',
        padding: isMobile ? '48px 24px 32px' : '50px 40px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        minHeight: isMobile ? 'auto' : '520px',
      }}>
        <div style={{ maxWidth: isMobile ? '100%' : 520 }}>
          <p style={{
            fontSize: 12, fontWeight: 700, letterSpacing: 2,
            marginLeft: isMobile ? 0 : '-90px',
            textTransform: 'uppercase', color: '#1e3a6e', marginBottom: 16,
          }}>
            Consultoria em RH
          </p>
          <h1 style={{
            fontWeight: 800, lineHeight: 1.15, marginBottom: 20,
            marginLeft: isMobile ? 0 : '-90px',
            color: '#0d2a4e',
            fontSize: isMobile ? '28px' : 'clamp(36px, 4vw, 58px)',
          }}>
            <span style={{ display: 'block' }}>O RH que transforma</span>
            <span style={{ display: 'block' }}>
              o <span style={{ color: '#1a5fa8' }}>varejo</span>{' '}
              <span style={{ color: '#0d2a4e' }}>de forma</span>
            </span>
            <span style={{ display: 'block', color: '#1a5fa8' }}>simples e prática.</span>
          </h1>
          <p style={{
            fontSize: isMobile ? 14 : 16, color: '#2a4a6e',
            marginLeft: isMobile ? 0 : '-90px',
            lineHeight: 1.7, marginBottom: 28, maxWidth: 420,
          }}>
            Do diagnóstico à prática: estruturamos processos e desenvolvemos pessoas com inteligência em RH.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12, marginLeft: isMobile ? 0 : '-90px' }}>
            <button onClick={() => navigate('pessoas')} style={{ background: 'linear-gradient(135deg, #1e4a8a, #4a9edd)', color: 'white', border: 'none', borderRadius: 32, padding: isMobile ? '11px 18px' : '14px 28px', cursor: 'pointer', fontWeight: 700, fontSize: isMobile ? 13 : 15, boxShadow: '0 4px 16px rgba(26,79,138,0.35)' }}>
              Nossos serviços
            </button>
            <button onClick={() => navigate('treinamentos')} style={{ background: 'transparent', color: '#1a3a6e', border: '2px solid #1a3a6e', borderRadius: 32, padding: isMobile ? '11px 18px' : '14px 28px', cursor: 'pointer', fontWeight: 700, fontSize: isMobile ? 13 : 15 }}>
              Formação de liderança
            </button>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40, marginLeft: isMobile ? 0 : '-90px' }}>
            <button onClick={() => navigate('vagas')} style={{ background: 'transparent', color: '#1a3a6e', border: '2px solid #1a3a6e', borderRadius: 32, padding: isMobile ? '11px 18px' : '14px 28px', cursor: 'pointer', fontWeight: 700, fontSize: isMobile ? 13 : 14 }}>
              Buscar vagas
            </button>
            <button onClick={() => navigate('login')} style={{ background: 'transparent', color: '#1a3a6e', border: '2px solid #1a3a6e', borderRadius: 32, padding: isMobile ? '11px 18px' : '14px 28px', cursor: 'pointer', fontWeight: 700, fontSize: isMobile ? 13 : 14 }}>
              Anuncie vagas
            </button>
          </div>
        </div>
      </div>

      {/* ── Floating bottom bar — desktop only ── */}
      {!isMobile && (
        <div style={{ position: 'relative', zIndex: 10, width: '100%', paddingBottom: 24 }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 20, padding: '18px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'center', boxShadow: '0 8px 32px rgba(30,74,138,0.12)', border: '1px solid rgba(255,255,255,0.6)' }}>
            {pillars.map((key) => {
              const p = megaMenu[key]
              const isHov = openBar === key
              return (
                <div key={key} style={{ position: 'relative' }} onClick={() => setOpenBar(openBar === key ? null : key)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 12, cursor: 'pointer', background: isHov ? 'rgba(74,158,221,0.1)' : 'transparent', transition: 'background 0.2s' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: isHov ? '#e8f2fc' : '#f0f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, transition: 'background 0.2s' }}>
                      {p.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isHov ? '#1a4f8a' : '#1e3a6e', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {key}
                        <span style={{ fontSize: 8, color: '#4a9edd', transform: isHov ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#778899', marginTop: 1 }}>{p.desc}</div>
                    </div>
                  </div>
                  {isHov && (
                    <div style={{ position: 'absolute', bottom: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)', background: 'white', borderRadius: 16, padding: '20px 22px', boxShadow: '0 16px 48px rgba(30,74,138,0.18)', border: '1px solid #e0eaf4', minWidth: 240, zIndex: 100, animation: 'dropUp 0.2s ease' }}>
                      <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 16, height: 8, overflow: 'hidden' }}>
                        <div style={{ width: 12, height: 12, background: 'white', border: '1px solid #e0eaf4', transform: 'rotate(45deg)', margin: '-6px auto 0' }} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid #f0f4f8' }}>
                        <span style={{ fontSize: 18 }}>{p.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#1e3a6e' }}>{key}</span>
                        <span onClick={() => navigate(p.page)} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#4a9edd', fontWeight: 600, cursor: 'pointer' }}>Ver página <ArrowRight size={11} /></span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {p.items.map((item, j) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <span style={{ color: '#4a9edd', fontSize: 12, marginTop: 4, flexShrink: 0 }}>•</span>
                            <span style={{ fontSize: 12.5, color: '#445566', lineHeight: 1.5 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            <button onClick={() => document.getElementById('MetodologiaSection')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'linear-gradient(135deg, #1e4a8a, #4a9edd)', color: 'white', border: 'none', borderRadius: 12, padding: '12px 22px', cursor: 'pointer', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>
              Saiba mais
            </button>
          </div>
        </div>
      )}

      {/* ── Mobile pills ── */}
      {isMobile && (
        <div style={{ padding: '0 24px 32px', zIndex: 4 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {pillars.map((key) => (
              <div key={key}
                onClick={() => navigate(megaMenu[key].page)}
                style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              >
                <span style={{ fontSize: 18 }}>{megaMenu[key].icon}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1e3a6e' }}>{key}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropUp {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
