import { useBreakpoint } from '../hooks/useBreakpoint'

const IconProfissionais = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="#5a8fd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="20" r="8"/>
    <path d="M8 48c0-8.8 7.2-16 16-16h4"/>
    <rect x="34" y="30" width="22" height="18" rx="3"/>
    <path d="M34 38h22M42 38v10"/>
    <circle cx="48" cy="24" r="5"/>
    <path d="M53 30h4a3 3 0 0 1 3 3v5"/>
  </svg>
)

const IconVideo = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="#5a8fd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="12" width="44" height="32" rx="4"/>
    <polygon points="60,16 48,24 48,36 60,44" />
    <path d="M14 52h28"/>
    <path d="M28 44v8"/>
    <polygon points="20,22 36,28 20,34" fill="#5a8fd0" opacity="0.3" stroke="#5a8fd0"/>
  </svg>
)

const IconLider = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="#5a8fd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="10" width="52" height="36" rx="3"/>
    <line x1="6" y1="22" x2="58" y2="22"/>
    <circle cx="24" cy="34" r="6"/>
    <path d="M14 46v-2a10 10 0 0 1 20 0v2"/>
    <line x1="38" y1="28" x2="52" y2="28"/>
    <line x1="38" y1="34" x2="52" y2="34"/>
    <line x1="38" y1="40" x2="48" y2="40"/>
  </svg>
)

const IconSeguranca = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="#5a8fd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="12" y="8" width="36" height="48" rx="3"/>
    <line x1="20" y1="20" x2="40" y2="20"/>
    <line x1="20" y1="28" x2="40" y2="28"/>
    <line x1="20" y1="36" x2="32" y2="36"/>
    <circle cx="38" cy="42" r="8" stroke="#5a8fd0"/>
    <path d="M34 42l2.5 2.5 4-4"/>
  </svg>
)

const IconGestor = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="#5a8fd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="14" width="40" height="28" rx="3"/>
    <path d="M20 42v6M36 42v6M14 48h28"/>
    <rect x="16" y="22" width="10" height="8" rx="1"/>
    <line x1="30" y1="24" x2="42" y2="24"/>
    <line x1="30" y1="30" x2="38" y2="30"/>
    <circle cx="50" cy="46" r="8"/>
    <path d="M47 46l2 2 4-4"/>
  </svg>
)

const icons = [<IconProfissionais />, <IconVideo />, <IconLider />, <IconSeguranca />, <IconGestor />]

export default function TreinamentosPublico() {
  const { isMobile } = useBreakpoint()

  const steps = [
    { desc: 'Profissionais que querem se preparar para cargos de liderança' },
    { desc: 'Pessoas que querem desenvolver habilidades específicas de liderança' },
    { desc: 'Líderes em início de jornada' },
    { desc: 'Líderes que buscam mais segurança, clareza e autoconhecimento' },
    { desc: 'Gestores que desejam amadurecer sua forma de liderar' },
  ]

  return (
    <div style={{ background: '#f0f4f9', padding: '72px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 2.8vw, 36px)', fontWeight: 800, color: '#1e3a6e', marginBottom: 48 }}>
          Para quem são os treinamentos individuais?
        </h2>

        {isMobile ? (
          /* Mobile: vertical list */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'white', borderRadius: 16, padding: '16px 20px', boxShadow: '0 4px 16px rgba(30,74,138,0.08)' }}>
                <div style={{ width: 72, height: 72, borderRadius: 16, background: 'white', border: '2px solid #1e3a6e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(30,74,138,0.08)' }}>
                  {icons[i]}
                </div>
                <p style={{ fontSize: 13.5, color: '#445566', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop: horizontal flow */
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 185 }}>
                  <div style={{
                    width: 120, height: 120, borderRadius: 22,
                    background: 'white',
                    border: '2.5px solid #1e3a6e',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(30,74,138,0.08)',
                    marginBottom: 16,
                    marginTop: i % 2 === 0 ? 0 : 40,
                  }}>
                    {icons[i]}
                  </div>
                  <p style={{ fontSize: 13.5, color: '#445566', lineHeight: 1.6, textAlign: 'center', maxWidth: 160 }}>
                    {step.desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', paddingTop: 40, margin: '0 2px', color: '#7aaed4', fontSize: 26, fontWeight: 300, flexShrink: 0 }}>›</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
