import { useState } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { Scale, ScrollText, Lock, FileText, Handshake, Heart, ClipboardList, GraduationCap, Shield } from '../utils/icons.jsx'

const services = [
  { icon: <Scale size={22} />, title: 'Compliance trabalhista', desc: 'Adequação às normas trabalhistas para evitar passivos e autuações.' },
  { icon: <ScrollText size={22} />, title: 'Políticas internas e código de conduta', desc: 'Documentos que definem as regras do jogo e protegem empresa e colaboradores.' },
  { icon: <Lock size={22} />, title: 'LGPD aplicada ao RH', desc: 'Adequação dos processos de RH à Lei Geral de Proteção de Dados.' },
  { icon: <FileText size={22} />, title: 'Gestão de advertências e medidas disciplinares', desc: 'Processos corretos para aplicação de medidas disciplinares sem risco jurídico.' },
  { icon: <Handshake size={22} />, title: 'Prevenção de assédio e conflitos', desc: 'Políticas e treinamentos para criar um ambiente de trabalho saudável e seguro.' },
  { icon: <Heart size={22} />, title: 'Gestão de afastamentos e saúde mental', desc: 'Protocolos para lidar com afastamentos de forma humanizada e legalmente correta.' },
  { icon: <ClipboardList size={22} />, title: 'Auditoria de processos de RH', desc: 'Revisão completa dos processos para identificar riscos antes que virem problemas.' },
  { icon: <GraduationCap size={22} />, title: 'Treinamento de gestores em legislação', desc: 'Capacitação das lideranças nos pontos críticos da CLT e normas internas.' },
  { icon: <Shield size={22} />, title: 'Gestão de riscos trabalhistas', desc: 'Mapeamento e mitigação dos principais riscos jurídicos da operação de RH.' },
]

const w2h = [
  { tag: 'O QUÊ',      color: '#5590B2', title: 'Proteção jurídica e compliance de RH', desc: 'Estruturamos políticas, processos e treinamentos para blindar sua empresa de riscos trabalhistas, conflitos internos e passivos que podem custar caro.' },
  { tag: 'POR QUÊ',    color: '#5590B2', title: 'Prevenir é muito mais barato que remediar', desc: 'Uma ação trabalhista pode custar dezenas de vezes mais do que a estruturação preventiva. Empresas sem políticas claras estão sempre vulneráveis.' },
  { tag: 'PARA QUEM',  color: '#5590B2', title: 'Varejistas que querem segurança jurídica', desc: 'Empresas que cresceram rápido e nunca formalizaram processos, ou que já sofreram com passivos trabalhistas e querem evitar que isso se repita.' },
  { tag: 'COMO',       color: '#5590B2', title: 'Auditoria → Políticas → Treinamento', desc: 'Auditamos os processos atuais, identificamos vulnerabilidades, criamos políticas e documentos adequados e treinamos gestores nos pontos críticos.' },
  { tag: 'QUANDO',     color: '#5590B2', title: 'Proteção básica em 30 dias', desc: 'As políticas e documentos essenciais ficam prontos no primeiro mês. O compliance completo é implementado ao longo de 60 a 90 dias.' },
  { tag: 'QUANTO',     color: '#5590B2', title: 'Investimento que se paga sozinho', desc: 'O custo de uma única ação trabalhista supera em muito o investimento em prevenção. Solicite uma conversa e veja o quanto você pode estar em risco.' },
]

export default function PrevencaoPage({ navigate }) {
  const { isMobile } = useBreakpoint()
  const [activeService, setActiveService] = useState(null)

  return (
    <div className="fade-in">

      {/* ── Hero ── */}
      <div style={{ background: '#5590B2', padding: isMobile ? '52px 24px 48px' : '72px 40px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span onClick={() => navigate('home')} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Home</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Serviços</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
            <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>Prevenção</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}><Shield size={28} /></div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>Metodologia 4 P's</p>
              <h1 style={{ fontSize: isMobile ? 32 : 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Prevenção</h1>
            </div>
          </div>
          <p style={{ fontSize: isMobile ? 15 : 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, maxWidth: 600, marginBottom: 36 }}>
            Compliance, políticas e proteção jurídica para que sua empresa cresça sem tropeçar em riscos evitáveis.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('home')} style={{ background: 'white', color: '#5590B2', border: 'none', borderRadius: 32, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>Solicitar proposta</button>
            <button onClick={() => document.getElementById('servicos-lista')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 32, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>Ver serviços ↓</button>
          </div>
        </div>
      </div>

      {/* ── 5W2H ── */}
      <div style={{ background: '#f4f7fb', padding: isMobile ? '48px 20px' : '64px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#5590B2', textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>Entenda o serviço</p>
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: '#1e3a6e', textAlign: 'center', marginBottom: 40 }}>Tudo que você precisa saber antes de contratar</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
            {w2h.map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 18, padding: '28px 24px', boxShadow: '0 4px 20px rgba(30,74,138,0.07)', borderTop: `4px solid ${item.color}`, transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(85,144,178,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(30,74,138,0.07)' }}
              >
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: item.color, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>{item.tag}</span>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e3a6e', marginBottom: 12, lineHeight: 1.3 }}>{item.title}</h3>
                <p style={{ fontSize: 13.5, color: '#556677', lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Services list ── */}
      <div id="servicos-lista" style={{ background: 'white', padding: isMobile ? '48px 20px' : '64px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#5590B2', textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>O que está incluído</p>
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: '#1e3a6e', textAlign: 'center', marginBottom: 40 }}>Serviços do Pilar <span style={{ color: '#5590B2' }}>Prevenção</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
            {services.map((s, i) => (
              <div key={i} onClick={() => setActiveService(activeService === i ? null : i)}
                style={{ background: activeService === i ? 'linear-gradient(135deg, #e8f2f8, #d4e8f4)' : '#f8fafc', borderRadius: 14, padding: '20px', border: activeService === i ? '1.5px solid #5590B2' : '1.5px solid #e8edf4', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (activeService !== i) e.currentTarget.style.borderColor = '#8AAEC2' }}
                onMouseLeave={e => { if (activeService !== i) e.currentTarget.style.borderColor = '#e8edf4' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: activeService === i ? 12 : 0 }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e', lineHeight: 1.3 }}>{s.title}</span>
                </div>
                {activeService === i && <p style={{ fontSize: 13, color: '#445566', lineHeight: 1.7, margin: 0, paddingLeft: 34 }}>{s.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: '#5590B2', padding: isMobile ? '48px 24px' : '64px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: 'white', marginBottom: 16 }}>Sua empresa está protegida?</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>Fale com nossos especialistas e descubra os riscos que você pode estar correndo agora.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('home')} style={{ background: 'white', color: '#5590B2', border: 'none', borderRadius: 32, padding: '14px 32px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>Solicitar diagnóstico gratuito</button>
          <button onClick={() => navigate('sobre')} style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 32, padding: '14px 32px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>Conhecer a Easy4RH</button>
        </div>
      </div>

    </div>
  )
}
