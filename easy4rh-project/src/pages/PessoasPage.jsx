import { useState } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { Map, Puzzle, BarChart2, Grid, MessageSquare, ClipboardList, Star, Route, Wrench, Handshake, Crown, Megaphone, Target, Users } from '../utils/icons.jsx'

const services = [
  { icon: <Map size={22} />, title: 'Mapeamento de perfil', desc: 'Identificamos o perfil comportamental e técnico de cada colaborador para alocação estratégica.' },
  { icon: <Puzzle size={22} />, title: 'DISC', desc: 'Aplicação da metodologia DISC para entender estilos de comportamento e melhorar a comunicação interna.' },
  { icon: <BarChart2 size={22} />, title: 'Avaliação de experiência e desempenho', desc: 'Avaliações estruturadas que mensuram resultados e potencial de crescimento.' },
  { icon: <Grid size={22} />, title: '9 Box', desc: 'Matriz de talentos para identificar quem são seus líderes do futuro.' },
  { icon: <MessageSquare size={22} />, title: 'Feedback', desc: 'Cultura de feedback contínuo, estruturado e orientado ao desenvolvimento.' },
  { icon: <ClipboardList size={22} />, title: 'PDI', desc: 'Plano de Desenvolvimento Individual alinhado aos objetivos do negócio.' },
  { icon: <Star size={22} />, title: 'Gestão de talentos', desc: 'Estratégias para reter, engajar e desenvolver seus melhores profissionais.' },
  { icon: <Route size={22} />, title: 'Trilha de carreira', desc: 'Estruturação de planos de carreira claros e motivadores para toda a equipe.' },
  { icon: <Wrench size={22} />, title: 'Treinamentos técnicos', desc: 'Capacitação focada nas habilidades técnicas exigidas pelo cargo.' },
  { icon: <Handshake size={22} />, title: 'Treinamentos comportamentais', desc: 'Desenvolvimento de soft skills essenciais para a performance no varejo.' },
  { icon: <Crown size={22} />, title: 'Treinamentos de liderança', desc: 'Formação de líderes que inspiram, engajam e entregam resultados.' },
  { icon: <Megaphone size={22} />, title: 'Endomarketing', desc: 'Ações internas que fortalecem a cultura, o engajamento e o senso de pertencimento.' },
  { icon: <Target size={22} />, title: 'Gincanas e dinâmicas', desc: 'Atividades práticas que desenvolvem equipes de forma leve e eficaz.' },
]

const w2h = [
  {
    tag: 'O QUÊ',
    color: '#1e4a8a',
    title: 'Desenvolvimento humano estratégico',
    desc: 'Estruturamos toda a gestão de pessoas do seu varejo — do mapeamento de perfis à formação de líderes — com metodologias comprovadas e adaptadas à realidade do dia a dia.',
  },
  {
    tag: 'POR QUÊ',
    color: '#2a6cb0',
    title: 'Pessoas engajadas vendem mais',
    desc: 'Equipes bem geridas têm menor turnover, maior produtividade e entregam uma experiência de cliente superior. O P de Pessoas é a base de tudo.',
  },
  {
    tag: 'PARA QUEM',
    color: '#3a7ec8',
    title: 'PMEs do varejo que querem crescer',
    desc: 'Pequenos e médios varejistas que reconhecem que o diferencial competitivo está nas pessoas — e querem estruturar isso de forma profissional e acessível.',
  },
  {
    tag: 'COMO',
    color: '#4a90d8',
    title: 'Diagnóstico → Plano → Execução',
    desc: 'Começamos com um diagnóstico completo do seu time, definimos um plano de ação personalizado e acompanhamos a execução com reuniões periódicas e suporte contínuo.',
  },
  {
    tag: 'QUANDO',
    color: '#5aa0e0',
    title: 'Resultados a partir de 30 dias',
    desc: 'O diagnóstico inicial é entregue em até 2 semanas. As primeiras ações começam no mês 1, com impactos mensuráveis a partir do segundo mês de implementação.',
  },
  {
    tag: 'QUANTO',
    color: '#2a7ec8',
    title: 'Planos sob medida',
    desc: 'Cada proposta é personalizada de acordo com o tamanho da equipe e escopo do projeto. Solicite uma conversa gratuita e receba uma proposta sem compromisso.',
  },
]

export default function PessoasPage({ navigate }) {
  const { isMobile } = useBreakpoint()
  const [activeService, setActiveService] = useState(null)

  return (
    <div className="fade-in">

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #5590B2)',
        padding: isMobile ? '52px 24px 48px' : '72px 40px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <span onClick={() => navigate('home')} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Home</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>›</span>
            <span onClick={() => navigate('servicos')} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Serviços</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>›</span>
            <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>Pessoas</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}>
              <Users size={28} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>
                Metodologia 4 P's
              </p>
              <h1 style={{ fontSize: isMobile ? 32 : 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
                Pessoas
              </h1>
            </div>
          </div>

          <p style={{ fontSize: isMobile ? 15 : 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, maxWidth: 600, marginBottom: 36 }}>
            O desenvolvimento humano é a base de qualquer resultado sustentável no varejo. Sem pessoas bem geridas, nenhuma estratégia se sustenta.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('home')} style={{ background: 'white', color: '#1e4a8a', border: 'none', borderRadius: 32, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              Solicitar proposta
            </button>
            <button onClick={() => document.getElementById('servicos-lista')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 32, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
              Ver serviços ↓
            </button>
          </div>
        </div>
      </div>

      {/* ── 5W2H Cards ── */}
      <div style={{ background: '#f4f7fb', padding: isMobile ? '48px 20px' : '64px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#4a9edd', textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>
            Entenda o serviço
          </p>
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: '#1e3a6e', textAlign: 'center', marginBottom: 40 }}>
            Tudo que você precisa saber antes de contratar
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
            {w2h.map((item, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: 18, padding: '28px 24px',
                boxShadow: '0 4px 20px rgba(30,74,138,0.07)',
                borderTop: `4px solid ${item.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(30,74,138,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(30,74,138,0.07)' }}
              >
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: item.color, textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
                  {item.tag}
                </span>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e3a6e', marginBottom: 12, lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 13.5, color: '#556677', lineHeight: 1.75 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Services list ── */}
      <div id="servicos-lista" style={{ background: 'white', padding: isMobile ? '48px 20px' : '64px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#4a9edd', textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>
            O que está incluído
          </p>
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: '#1e3a6e', textAlign: 'center', marginBottom: 40 }}>
            Serviços do Pilar <span style={{ color: '#4a9edd' }}>Pessoas</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
            {services.map((s, i) => (
              <div
                key={i}
                onClick={() => setActiveService(activeService === i ? null : i)}
                style={{
                  background: activeService === i ? 'linear-gradient(135deg, #e8f2fc, #d4e8f8)' : '#f8fafc',
                  borderRadius: 14, padding: '20px',
                  border: activeService === i ? '1.5px solid #4a9edd' : '1.5px solid #e8edf4',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (activeService !== i) e.currentTarget.style.borderColor = '#b0d0ec' }}
                onMouseLeave={e => { if (activeService !== i) e.currentTarget.style.borderColor = '#e8edf4' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: activeService === i ? 12 : 0 }}>
                  <span style={{ fontSize: 22 }}>{s.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1e3a6e', lineHeight: 1.3 }}>{s.title}</span>
                </div>
                {activeService === i && (
                  <p style={{ fontSize: 13, color: '#445566', lineHeight: 1.7, margin: 0, paddingLeft: 34 }}>
                    {s.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background: 'linear-gradient(135deg, #1a3a6e, #2a6cb0)', padding: isMobile ? '48px 24px' : '64px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: 'white', marginBottom: 16 }}>
          Pronto para transformar a gestão de pessoas?
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
          Fale com nossos especialistas e receba uma proposta personalizada para o seu varejo.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('home')} style={{ background: 'white', color: '#1e4a8a', border: 'none', borderRadius: 32, padding: '14px 32px', cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
            Solicitar proposta gratuita
          </button>
          <button onClick={() => navigate('sobre')} style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 32, padding: '14px 32px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
            Conhecer a Easy4RH
          </button>
        </div>
      </div>

    </div>
  )
}
