// ============================================================
// CaminhoSection — Responsive
// ============================================================
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
          <h2 style={{ fontSize: isMobile ? 24 : 'clamp(24px, 3vw, 40px)', fontWeight: 800, color: '#1e3a6e', marginBottom: 12, lineHeight: 1.2 }}>
            Quando os 4 P's atuam de forma integrada,
          </h2>
          <p style={{ fontSize: 16, color: '#445566', lineHeight: 1.7 }}>
            o RH deixa de ser operacional e passa a ser estratégico,<br />
            humano e orientado a resultado.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', gap: isMobile ? 40 : 64, alignItems: 'center' }}>
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <h3 style={{ fontSize: isMobile ? 26 : 'clamp(22px, 2.5vw, 34px)', fontWeight: 800, color: '#1e3a6e', lineHeight: 1.2, marginBottom: 20 }}>
              Escolha o{' '}
              <span style={{ color: '#4a9edd', display: 'block' }}>Caminho ideal</span>
              <span style={{ color: '#4a9edd' }}>para você.</span>
            </h3>
            <p style={{ fontSize: 14.5, color: '#556677', lineHeight: 1.8, maxWidth: 320, margin: isMobile ? '0 auto' : '0' }}>
              Nossa consultoria é 100% online, com acesso a uma plataforma exclusiva de videoaulas e mentoria.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {items.map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: isMobile ? 90 : 110, height: isMobile ? 90 : 110, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #b0d0e8, #5a90b8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 6px 20px rgba(30,74,138,0.18)', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ fontSize: isMobile ? 22 : 26, marginBottom: 4 }}>{item.icon}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 800, color: 'white', letterSpacing: 0.8, textAlign: 'center', padding: '0 10px', lineHeight: 1.3 }}>{item.label}</span>
                </div>
                <p style={{ fontSize: 13, color: '#445566', lineHeight: 1.6, maxWidth: 160, margin: '0 auto' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
