import { useState } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'
import { Target, BarChart2, Trophy, TrendingUp, RefreshCw, LineChart, ShoppingCart, Megaphone, Search } from '../utils/icons.jsx'

const services = [
  { icon: <Target size={22} />, title: 'OKR e metas', desc: 'Estruturação de objetivos e resultados-chave alinhados à estratégia do negócio.' },
  { icon: <BarChart2 size={22} />, title: 'KPIs de RH e vendas', desc: 'Definição dos indicadores certos para medir o desempenho humano e comercial.' },
  { icon: <Trophy size={22} />, title: 'Programa de incentivo e reconhecimento', desc: 'Campanhas que motivam equipes a baterem metas com consistência.' },
  { icon: <TrendingUp size={22} />, title: 'Remuneração variável', desc: 'Estrutura de comissões e bônus que conecta salário ao resultado.' },
  { icon: <RefreshCw size={22} />, title: 'Avaliação de desempenho por resultados', desc: 'Ciclos de avaliação focados em entregas reais, não apenas comportamento.' },
  { icon: <LineChart size={22} />, title: 'Dashboard de pessoas', desc: 'Painel visual com os principais indicadores de RH para decisão rápida.' },
  { icon: <ShoppingCart size={22} />, title: 'Treinamento de vendas no varejo', desc: 'Capacitação prática da equipe comercial com foco em conversão e ticket médio.' },
  { icon: <Megaphone size={22} />, title: 'Comunicação de resultados', desc: 'Rituais de gestão que mantêm a equipe informada, focada e engajada.' },
  { icon: <Search size={22} />, title: 'Diagnóstico de clima organizacional', desc: 'Pesquisas que revelam o nível real de engajamento e os pontos de melhoria.' },
]

const w2h = [
  { tag: 'O QUÊ',     color: '#5590B2', title: 'Gestão orientada a resultados', desc: 'Estruturamos metas, indicadores e programas de incentivo para que toda a equipe saiba exatamente o que precisa entregar e seja reconhecida por isso.' },
  { tag: 'POR QUÊ',   color: '#5590B2', title: 'O que não é medido não é gerenciado', desc: 'Sem metas claras e KPIs bem definidos, a equipe trabalha sem direção. Performance sem gestão é sorte — não estratégia.' },
  { tag: 'PARA QUEM', color: '#5590B2', title: 'Varejistas que querem crescer com consistência', desc: 'Empresas que já têm uma equipe estruturada e querem extrair o máximo de cada colaborador com dados, metas e reconhecimento.' },
  { tag: 'COMO',      color: '#5590B2', title: 'Diagnóstico → Metas → Acompanhamento', desc: 'Analisamos os resultados atuais, definimos OKRs e KPIs realistas, criamos rituais de gestão e implementamos dashboards para decisão ágil.' },
  { tag: 'QUANDO',    color: '#5590B2', title: 'Primeiros resultados em 45 dias', desc: 'As metas e indicadores ficam prontos nas primeiras 2 semanas. O programa de incentivo é lançado no mês 1, com primeiros resultados medidos em 45 dias.' },
  { tag: 'QUANTO',    color: '#5590B2', title: 'Proposta personalizada', desc: 'O investimento varia conforme o tamanho da equipe e os módulos contratados. Agende uma conversa gratuita e veja o que faz sentido para o seu negócio.' },
]

const scrollToForm = (navigate) => {
  navigate('home')
  setTimeout(() => document.getElementById('fale-conosco')?.scrollIntoView({ behavior: 'smooth' }), 150)
}

export default function PerformancePage({ navigate }) {
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
            <span style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>Performance</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}><TrendingUp size={28} /></div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 4 }}>Metodologia 4 P's</p>
              <h1 style={{ fontSize: isMobile ? 32 : 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Performance</h1>
            </div>
          </div>
          <p style={{ fontSize: isMobile ? 15 : 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, maxWidth: 600, marginBottom: 36 }}>
            Metas claras, indicadores precisos e reconhecimento real. Performance não é acidente — é construção.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => scrollToForm(navigate)}
              style={{ background: 'white', color: '#5590B2', border: 'none', borderRadius: 32, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
            >
              Solicitar proposta
            </button>
            <button
              onClick={() => document.getElementById('servicos-lista')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)', borderRadius: 32, padding: '13px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}
            >
              Ver serviços ↓
            </button>
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
              <div key={i}
                style={{ background: 'white', borderRadius: 18, padding: '28px 24px', boxShadow: '0 4px 20px rgba(30,74,138,0.07)', borderTop: `4px solid ${item.color}`, transition: 'transform 0.2s, box-shadow 0.2s' }}
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
          <h2 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: '#1e3a6e', textAlign: 'center', marginBottom: 40 }}>Serviços do Pilar <span style={{ color: '#5590B2' }}>Performance</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
            {services.map((s, i) => (
              <div key={i}
                onClick={() => setActiveService(activeService === i ? null : i)}
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
        <h2 style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: 'white', marginBottom: 16 }}>Pronto para elevar a performance do seu time?</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', maxWidth: 500, margin: '0 auto 32px' }}>Fale com nossos especialistas e receba uma proposta personalizada.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => scrollToForm(navigate)}
            style={{ background: 'white', color: '#5590B2', border: 'none', borderRadius: 32, padding: '14px 32px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}
          >
            Solicitar proposta
          </button>
        </div>
      </div>

    </div>
  )
}
