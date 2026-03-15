import { useState } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'

const services = [
  { icon: '📋', title: 'Política de R&S (Recrutamento e Seleção)', desc: 'Estruturação completa do processo seletivo com critérios claros e alinhados à cultura.' },
  { icon: '📄', title: 'Descritivo de cargos e manuais operacionais', desc: 'Documentação clara de funções, responsabilidades e procedimentos operacionais.' },
  { icon: '🚪', title: 'Admissão / Demissão', desc: 'Processos estruturados de entrada e saída que protegem a empresa e respeitam o colaborador.' },
  { icon: '🎉', title: 'Onboarding / Offboarding', desc: 'Integração eficaz de novos colaboradores e saída organizada de quem parte.' },
  { icon: '💰', title: 'Folha de pagamento', desc: 'Gestão precisa e organizada da folha, evitando erros e passivos trabalhistas.' },
  { icon: '🎁', title: 'Política de remuneração e benefícios', desc: 'Estrutura de salários e benefícios competitiva e alinhada ao mercado.' },
  { icon: '⏱️', title: 'Gestão de ponto / jornada / escala', desc: 'Controle eficiente de jornada, escalas e banco de horas.' },
  { icon: '🦺', title: 'SST (Saúde e Segurança do Trabalho)', desc: 'Conformidade com normas de saúde e segurança para proteger colaboradores e a empresa.' },
  { icon: '📁', title: 'Gestão de documentos', desc: 'Organização e controle de toda a documentação trabalhista e operacional.' },
  { icon: '🏛️', title: 'Construção e revisão da cultura', desc: 'Definição e fortalecimento dos valores, missão e comportamentos esperados na equipe.' },
]

const w2h = [
  { tag: 'O QUÊ', color: '#1e4a8a', title: 'Processos de RH estruturados', desc: 'Organizamos todos os fluxos operacionais de RH do seu varejo — da admissão à cultura organizacional — para que sua empresa funcione com clareza e segurança jurídica.' },
  { tag: 'POR QUÊ', color: '#2a6cb0', title: 'Processos ruins custam caro', desc: 'Falhas em admissão, folha ou documentação geram passivos trabalhistas e custos ocultos. Processos bem definidos protegem a empresa e liberam energia para crescer.' },
  { tag: 'PARA QUEM', color: '#3a7ec8', title: 'Varejistas que querem segurança', desc: 'Empresas que ainda operam no improviso e precisam profissionalizar a gestão operacional de pessoas sem contratar um RH interno grande.' },
  { tag: 'COMO', color: '#4a90d8', title: 'Mapeamento → Estruturação → Implantação', desc: 'Mapeamos os processos atuais, identificamos gaps, estruturamos novos fluxos com documentação e acompanhamos a implantação junto com a equipe.' },
  { tag: 'QUANDO', color: '#5aa0e0', title: 'Processos prontos em até 60 dias', desc: 'A maioria dos processos core ficam prontos no primeiro mês. A implantação completa acontece em até 60 dias, com suporte contínuo.' },
  { tag: 'QUANTO', color: '#2a7ec8', title: 'Investimento sob medida', desc: 'O valor varia conforme o número de processos e tamanho da equipe. Agende uma conversa gratuita para receber uma proposta personalizada.' },
]

export default function ProcessosPage({ navigate }) {
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
            <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>Processos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>⚙️</div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>Metodologia 4 P's</p>
              <h1 style={{ fontSize: isMobile ? 32 : 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Processos</h1>
            </div>
          </div>
          <p style={{ fontSize: isMobile ? 15 : 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, maxWidth: 600, marginBottom: 36 }}>
            Fluxos operacionais claros e seguros são a espinha dorsal de um RH que funciona. Sem processo, não há escala.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('home')} style={{ background: 'white', color: '#1a4a2e', border: 'none', borderRadius: 32, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>Solicitar proposta</button>
            <button onClick={() => document.getElementById('servicos-lista')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 32, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>Ver serviços ↓</button>
          </div>
        </div>
      </div>

      {/* ── 5W2H ── */}
      <div style={{ background: '#f4f7fb', padding: isMobile ? '48px 20px' : '64px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#3a9a6e', textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>Entenda o serviço</p>
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: '#1e3a6e', textAlign: 'center', marginBottom: 40 }}>Tudo que você precisa saber antes de contratar</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
            {w2h.map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 18, padding: '28px 24px', boxShadow: '0 4px 20px rgba(30,74,138,0.07)', borderTop: `4px solid ${item.color}`, transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(30,74,138,0.12)' }}
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
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#3a9a6e', textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>O que está incluído</p>
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: '#1e3a6e', textAlign: 'center', marginBottom: 40 }}>Serviços do Pilar <span style={{ color: '#3a9a6e' }}>Processos</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
            {services.map((s, i) => (
              <div key={i} onClick={() => setActiveService(activeService === i ? null : i)}
                style={{ background: activeService === i ? 'linear-gradient(135deg, #e8f8f0, #d4f0e0)' : '#f8fafc', borderRadius: 14, padding: '20px', border: activeService === i ? '1.5px solid #3a9a6e' : '1.5px solid #e8edf4', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (activeService !== i) e.currentTarget.style.borderColor = '#90d0b0' }}
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
      <div style={{ background: 'linear-gradient(135deg, #1a4a2e, #2a7a4e)', padding: isMobile ? '48px 24px' : '64px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: 'white', marginBottom: 16 }}>Pronto para estruturar seus processos?</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>Fale com nossos especialistas e receba uma proposta personalizada.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('home')} style={{ background: 'white', color: '#1a4a2e', border: 'none', borderRadius: 32, padding: '14px 32px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>Solicitar proposta gratuita</button>
          <button onClick={() => navigate('sobre')} style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 32, padding: '14px 32px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>Conhecer a Easy4RH</button>
        </div>
      </div>

    </div>
  )
}
