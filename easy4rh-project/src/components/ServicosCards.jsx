import { useBreakpoint } from '../hooks/useBreakpoint'

const IconEmpresa = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="12"/>
    <path d="M2 12h20"/>
  </svg>
)

const IconPessoa = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const scrollToFaleConosco = () =>
  document.getElementById('fale-conosco')?.scrollIntoView({ behavior: 'smooth' })

export default function ServicosCards({ navigate }) {
  const { isMobile } = useBreakpoint()

  const cards = [
    {
      icon: <IconEmpresa />,
      title: 'Consultoria para Empresas',
      subtitle: 'Transforme o RH do seu negócio.',
      desc: 'Consultoria completa para PMEs que desejam estruturar e profissionalizar a gestão de pessoas com foco em resultados',
      items: ['Acesso à plataforma de videoaulas exclusivas', 'Mentoria em grupo com especialistas', 'Diagnóstico organizacional completo', "Implementação dos 4 P's", 'Suporte contínuo via plataforma', 'Materiais e templates prontos', 'Reuniões quinzenais de acompanhamento'],
      cta: 'Solicitar Proposta',
    },
    {
      icon: <IconPessoa />,
      title: 'Desenvolvimento Pessoal',
      subtitle: 'Formação de Liderança',
      desc: 'Programa de desenvolvimento individual para quem quer se tornar um líder de impacto, com metodologia prática e personalizada.',
      items: ['Acesso vitalício à plataforma de videoaulas', 'Mentoria individual personalizada', 'Trilha de autoconhecimento e liderança', 'Ferramentas práticas de gestão', 'Certificado de conclusão', 'Comunidade exclusiva de líderes', 'Bônus: Workshops ao vivo mensais'],
      cta: 'Começar agora',
    },
  ]

  return (
    <div id="assessoria-section" style={{ background: '#eef2f8', padding: '72px 20px', position: 'relative' }}>

      {/* Fade topo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, #e8f0f8, transparent)', pointerEvents: 'none', zIndex: 1 }} />
      {/* Fade baixo */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, #e8f0f8, transparent)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 28, position: 'relative', zIndex: 2 }}>
        {cards.map((card, i) => (
          <div key={i} style={{ background: '#eef2f8', borderRadius: 24, padding: 8, boxShadow: '0 8px 32px rgba(30,74,138,0.12)' }}>
            <div style={{ background: 'linear-gradient(160deg, #7a9ec0 0%, #5a80a8 40%, #3a6090 100%)', borderRadius: 18, padding: '32px 32px 36px', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(30,58,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {card.icon}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1.2 }}>{card.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>{card.subtitle}</div>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.95)', lineHeight: 1.7, fontWeight: 600, marginBottom: 20 }}>{card.desc}</p>
              <div style={{ flex: 1, marginBottom: 28 }}>
                {card.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 1, flexShrink: 0 }}>•</span>
                    <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.88)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={scrollToFaleConosco}
                style={{ background: 'linear-gradient(135deg, #1a3a6a, #2a5a9a)', color: 'white', border: 'none', borderRadius: 12, padding: '15px', cursor: 'pointer', fontWeight: 700, fontSize: 15, width: '100%', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, #0f2a50, #1a4a8a)'}
                onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, #1a3a6a, #2a5a9a)'}
              >{card.cta}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
