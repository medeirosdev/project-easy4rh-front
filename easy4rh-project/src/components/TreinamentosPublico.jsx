export default function TreinamentosPublico() {
  const steps = [
    {
      icon: '👥',
      desc: 'Profissionais que querem se preparar para cargos de liderança',
    },
    {
      icon: '▶️',
      desc: 'Pessoas que querem desenvolver habilidades específicas de liderança',
    },
    {
      icon: '📋',
      desc: 'Líderes em início de jornada',
    },
    {
      icon: '🔍',
      desc: 'Líderes que buscam mais segurança, clareza e autoconhecimento',
    },
    {
      icon: '💻',
      desc: 'Gestores que desejam amadurecer sua forma de liderar',
    },
  ]

  return (
    <div style={{
      background: '#f4f7fb',
      padding: '72px 20px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Title */}
        <h2 style={{
          textAlign: 'center',
          fontSize: 'clamp(22px, 2.8vw, 36px)',
          fontWeight: 800,
          color: '#1e3a6e',
          marginBottom: 56,
        }}>
          Para quem são os treinamentos individuais?
        </h2>

        {/* Steps row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 0,
        }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>

              {/* Card */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 160,
              }}>
                {/* Icon box */}
                <div style={{
                  width: 100,
                  height: 100,
                  borderRadius: 18,
                  background: i % 2 === 0
                    ? 'white'
                    : 'linear-gradient(135deg, #d0e4f4, #b0cce8)',
                  border: '2px solid #c8dcea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 38,
                  boxShadow: '0 4px 16px rgba(30,74,138,0.08)',
                  marginBottom: 16,
                  flexShrink: 0,
                }}>
                  {step.icon}
                </div>

                {/* Description */}
                <p style={{
                  fontSize: 13,
                  color: '#445566',
                  lineHeight: 1.6,
                  textAlign: 'center',
                  maxWidth: 140,
                }}>
                  {step.desc}
                </p>
              </div>

              {/* Arrow between cards */}
              {i < steps.length - 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingTop: 36,
                  margin: '0 4px',
                  color: '#7aaed4',
                  fontSize: 22,
                  fontWeight: 300,
                  flexShrink: 0,
                }}>
                  ›
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
