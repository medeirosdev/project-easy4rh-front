import { useBreakpoint } from '../hooks/useBreakpoint'

export default function ServicosCards({ navigate }) {
  const { isMobile } = useBreakpoint()

  const cards = [
    {
      icon: '🏢', title: 'Consultoria para Empresas', subtitle: 'Transforme o RH do seu negócio.',
      desc: 'Consultoria completa para PMEs que desejam estruturar e profissionalizar a gestão de pessoas com foco em resultados',
      items: ['Acesso à plataforma de videoaulas exclusivas', 'Mentoria em grupo com especialistas', 'Diagnóstico organizacional completo', 'Implementação dos 4 P\'s', 'Suporte contínuo via plataforma', 'Materiais e templates prontos', 'Reuniões quinzenais de acompanhamento'],
      cta: 'Solicitar Proposta', action: 'login',
    },
    {
      icon: '👤', title: 'Desenvolvimento Pessoal', subtitle: 'Formação de Liderança',
      desc: 'Programa de desenvolvimento individual para quem quer se tornar um líder de impacto, com metodologia prática e personalizada.',
      items: ['Acesso vitalício à plataforma de videoaulas', 'Mentoria individual personalizada', 'Trilha de autoconhecimento e liderança', 'Ferramentas práticas de gestão', 'Certificado de conclusão', 'Comunidade exclusiva de líderes', 'Bônus: Workshops ao vivo mensais'],
      cta: 'Começar agora', action: 'treinamentos',
    },
  ]

  return (
    <div style={{ background: '#eef2f8', padding: '72px 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 28 }}>
        {cards.map((card, i) => (
          <div key={i} style={{ background: 'linear-gradient(160deg, #7a9ec0 0%, #5a80a8 40%, #3a6090 100%)', borderRadius: 20, padding: '32px 32px 36px', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(30,74,138,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{card.icon}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'white', lineHeight: 1.2 }}>{card.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{card.subtitle}</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, fontWeight: 600, marginBottom: 20 }}>{card.desc}</p>
            <div style={{ flex: 1, marginBottom: 28 }}>
              {card.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 1, flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.88)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate(card.action)} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.4)', borderRadius: 12, padding: '14px', cursor: 'pointer', fontWeight: 700, fontSize: 15, width: '100%', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >{card.cta}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
