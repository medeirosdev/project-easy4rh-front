// ============================================================
// FormacaoSection — Responsive
// ============================================================
import groupTeam from '../assets/group-team.png'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function FormacaoSection({ navigate }) {
  const { isMobile } = useBreakpoint()

  return (
    <div style={{ background: 'linear-gradient(135deg, #4a7fc1 0%, #5a90d0 50%, #6aa0d8 100%)', overflow: 'hidden', position: 'relative', minHeight: isMobile ? 'auto' : 380 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', alignItems: 'stretch', minHeight: isMobile ? 'auto' : 380 }}>

        {/* Image — hidden on mobile or shown as header image */}
        <div style={{ position: 'relative', overflow: 'hidden', maxHeight: isMobile ? 220 : 'none' }}>
          <img src={groupTeam} alt="Equipe" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: isMobile ? 'linear-gradient(to bottom, transparent 50%, #5a90d0 100%)' : 'linear-gradient(to right, transparent 60%, #5a90d0 100%)' }} />
        </div>

        {/* Text */}
        <div style={{ padding: isMobile ? '32px 24px 40px' : '52px 48px 52px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', marginBottom: 10 }}>Desenvolvimento Pessoal</p>
          <h2 style={{ fontSize: isMobile ? 28 : 'clamp(28px, 3vw, 44px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
            Formação de <span style={{ color: '#c8e8f8' }}>Liderança</span>
          </h2>
          <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.88)', lineHeight: 1.8, marginBottom: 18, maxWidth: 400 }}>
            Desenvolvimento que começa na pessoa e se reflete nos resultados. Nem todo desenvolvimento acontece dentro de uma empresa — e nós sabemos disso.
          </p>
          <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.88)', lineHeight: 1.8, marginBottom: 36, maxWidth: 400 }}>
            Aqui, o foco é você como líder. Seu comportamento, suas decisões, sua comunicação e a forma como você impacta pessoas e resultados.
          </p>
          <div>
            <button onClick={() => navigate('treinamentos')} style={{ background: 'rgba(30,50,90,0.6)', color: 'white', border: 'none', borderRadius: 10, padding: '14px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 15, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,50,90,0.85)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(30,50,90,0.6)'}
            >Quero me desenvolver</button>
          </div>
        </div>
      </div>
    </div>
  )
}