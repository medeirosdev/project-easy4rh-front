import { useBreakpoint } from '../hooks/useBreakpoint'

export default function CaminhoSection({ navigate }) {
  const { isMobile } = useBreakpoint()

  const items = [
    { icon: '▶️', label: 'VIDEOAULAS', desc: 'Conteúdo gravado por especialistas' },
    { icon: '👥', label: 'MENTORIA', desc: 'Acompanhamento direto para tirar dúvidas' },
    { icon: '💬', label: 'COMUNIDADE', desc: 'Rede de apoio com outros profissionais em desenvolvimento' },
    { icon: '📖', label: 'CONTEÚDO EXCLUSIVO', desc: 'Templates e ferramentas prontas para usar' },
  ]

  return (
    <div style={{ background: '#f4f7fb', padding: '72px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: isMobile ? 24 : 'clamp(26px, 3vw, 42px)', fontWeight: 800, color: '#1e3a6e', marginBottom: 12, lineHeight: 1.2 }}>
            Quando os 4 P's atuam de forma integrada,
          </h2>
          <p style={{ fontSize: isMobile ? 15 : 18, color: '#445566', lineHeight: 1.7 }}>
            o RH deixa de ser operacional e passa a ser estratégico,{!isMobile && <br />}
            humano e orientado a resultado.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 64, alignItems: 'center' }}>
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <h3 style={{ fontSize: isMobile ? 28 : 'clamp(34px, 3vw, 46px)', fontWeight: 700, color: '#345678', lineHeight: 1.2, marginBottom: 20 }}>
              Escolha o{' '}
              <span style={{ color: '#5590B2', display: 'block', fontWeight: 900 }}>Caminho ideal</span>
              <span style={{ color: '#5590B2', fontWeight: 900 }}>para você.</span>
            </h3>
            <p style={{ fontSize: 15, color: '#556677', lineHeight: 1.8, maxWidth: 320, margin: isMobile ? '0 auto' : '0' }}>
              Nossa consultoria é online e presencial, com acesso a uma plataforma exclusiva de videoaulas e mentoria.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? 12 : 15, justifyItems: 'center' }}>
            {items.map((item, i) => (
              <div key={i} style={{ textAlign: 'center', width: '100%' }}>
                <div style={{
                  width: isMobile ? 90 : 125,
                  height: isMobile ? 90 : 125,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 32% 28%, #c8e4f4 0%, #8AAEC2 40%, #4a7a9a 100%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                  boxShadow: '0 8px 28px rgba(30,74,138,0.28), 0 2px 8px rgba(30,74,138,0.15), inset 0 1px 2px rgba(255,255,255,0.4)',
                  cursor: 'pointer', transition: 'transform 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{ position: 'absolute', top: 8, left: 16, width: 36, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.35)', filter: 'blur(3px)', pointerEvents: 'none' }} />
                  <span style={{ fontSize: isMobile ? 22 : 26, marginBottom: 4, position: 'relative', zIndex: 1 }}>{item.icon}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: 'white', letterSpacing: 0.8, textAlign: 'center', padding: '0 10px', lineHeight: 1.3, position: 'relative', zIndex: 1 }}>{item.label}</span>
                </div>
                <p style={{ fontSize: isMobile ? 12 : 13, color: '#445566', lineHeight: 1.6, maxWidth: 160, margin: '0 auto' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
