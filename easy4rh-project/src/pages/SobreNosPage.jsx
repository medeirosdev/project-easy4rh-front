import sobreHero from '../assets/sobre-hero.png'
import sobreParceira from '../assets/sobre-parceira.png'
import iconMissao from '../assets/icon-missao.png'
import iconVisao from '../assets/icon-visao.png'
import { useBreakpoint } from '../hooks/useBreakpoint'

const team = [
  { id: 1, name: 'Nome', role: 'Cargo' },
  { id: 2, name: 'Nome', role: 'Cargo' },
  { id: 3, name: 'Nome', role: 'Cargo' },
  { id: 4, name: 'Nome', role: 'Cargo' },
  { id: 5, name: 'Nome', role: 'Cargo' },
]

export default function SobreNosPage({ navigate }) {
  const { isMobile } = useBreakpoint()

  return (
    <div className="fade-in">

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e8eef6 100%)', minHeight: isMobile ? 'auto' : 640, display: 'flex', alignItems: 'center', overflow: isMobile ? 'hidden' : 'visible' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '52px 24px 40px' : '64px 40px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 64, alignItems: 'center', width: '100%' }}>
          <div style={{ order: isMobile ? 2 : 1 }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 3, color: '#1e4a8a', textTransform: 'uppercase', marginBottom: 20 }}>Sobre Nós</p>
            <h1 style={{ fontSize: isMobile ? 32 : 'clamp(38px, 4.2vw, 58px)', fontWeight: 800, color: '#0d2a4e', lineHeight: 1.15, marginBottom: 24 }}>
              Especialistas em<br />
              desenvolver<br />
              líderes e fortalecer<br />
              o varejo.
            </h1>
            <p style={{ fontSize: isMobile ? 15 : 17, color: '#445566', lineHeight: 1.8, maxWidth: 420, marginBottom: 36 }}>
              Transformando a forma como o varejo desenvolve, engaja e potencializa seus talentos.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('treinamentos')} style={{ background: 'linear-gradient(135deg, #1a4f8a, #2a7ec8)', color: 'white', border: 'none', borderRadius: 32, padding: '14px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(26,79,138,0.3)' }}>
                Nossos treinamentos
              </button>
              <button onClick={() => navigate('faq')} style={{ background: 'transparent', color: '#1a3a6e', border: '2px solid #1a3a6e', borderRadius: 32, padding: '14px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}>
                Fale conosco
              </button>
            </div>
          </div>
          <div style={{ order: isMobile ? 1 : 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', position: 'relative', minHeight: isMobile ? 300 : 640 }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: isMobile ? 260 : 500, height: isMobile ? 260 : 500, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #c8daea, #8ab4d0)' }} />
            <img src={sobreHero} alt="Sobre nós" style={{ height: isMobile ? 300 : 550, objectFit: 'contain', objectPosition: 'bottom', position: 'relative', zIndex: 2, filter: 'drop-shadow(0 8px 24px rgba(30,74,138,0.12))' }} />
          </div>
        </div>
      </div>

      {/* ── Parceira estratégica ── */}
      <div style={{ background: '#f2f4f7', padding: isMobile ? '56px 24px' : '80px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center' }}>
          <div style={{ order: isMobile ? 2 : 1 }}>
           <img src={sobreParceira} alt="Parceira estratégica" style={{ width: '100%', borderRadius: 16, objectFit: 'cover', display: 'block', maxHeight: 340 }} />
          </div>
          <div style={{ order: isMobile ? 1 : 2 }}>
            <h2 style={{ fontSize: isMobile ? 28 : 'clamp(26px, 3vw, 40px)', fontWeight: 800, color: '#0d2a4e', lineHeight: 1.2, marginBottom: 28 }}>
              Sua parceira estratégica na evolução de pessoas e processos.
            </h2>
            <p style={{ fontSize: 15, color: '#445566', lineHeight: 1.85, marginBottom: 20 }}>
              Somos uma consultoria especializada em pequenos e médios varejistas, transformando o RH em uma alavanca real de resultados, e não em um centro de custo.
            </p>
            <p style={{ fontSize: 15, color: '#445566', lineHeight: 1.85 }}>
              Atuamos com processos claros, práticas modernas e decisões estratégicas, sempre focados no que mais importa:{' '}
              <strong style={{ color: '#1e4a8a' }}>Pessoas, Processos, Performance e Prevenção.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ── Missão e Visão ── */}
      <div style={{ background: 'linear-gradient(135deg, #5a8ab8 0%, #6a9ec8 50%, #7aaed8 100%)', padding: isMobile ? '56px 24px' : '80px 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 48 : 64, position: 'relative' }}>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={iconMissao} alt="Missão" style={{ width: isMobile ? 100 : 130, height: isMobile ? 100 : 130, objectFit: 'contain', marginBottom: 28, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }} />
            <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: 'white', marginBottom: 24 }}>
              Nossa <span style={{ color: '#c8e4f8' }}>Missão</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', lineHeight: 1.85, maxWidth: 360 }}>
              Simplificar a gestão de pessoas para pequenos e médios varejistas, entregando processos claros, práticas modernas e resultados consistentes, conectados diretamente ao negócio.
            </p>
          </div>
          {!isMobile && (
            <div style={{ position: 'absolute', left: '50%', top: '10%', height: '80%', width: 1, background: 'rgba(255,255,255,0.25)', transform: 'translateX(-50%)' }} />
          )}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={iconVisao} alt="Visão" style={{ width: isMobile ? 100 : 130, height: isMobile ? 100 : 130, objectFit: 'contain', marginBottom: 28, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }} />
            <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: 'white', marginBottom: 24 }}>
              Nossa <span style={{ color: '#c8e4f8' }}>Visão</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360 }}>
              {[
                { word: 'Clareza', desc: 'comunicação simples, direta e visual.' },
                { word: 'Praticidade', desc: 'processos enxutos e objetivos.' },
                { word: 'Humanização', desc: 'foco real em pessoas.' },
                { word: 'Resultado', desc: 'tudo conectado ao impacto no negócio.' },
              ].map((item) => (
                <p key={item.word} style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: 'white' }}>{item.word}</strong> — {item.desc}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Nosso Time ── */}
      <div style={{ background: '#f0f2f5', padding: isMobile ? '56px 24px' : '80px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Top phrase */}
          <p style={{ textAlign: 'center', fontSize: isMobile ? 24 : 48, color: '#334', lineHeight: 1.5, marginBottom: 96 }}>
            Pessoas bem geridas,{' '}
            <strong style={{ color: '#4390BC' }}>varejo mais forte</strong>
            {' '}e{' '}
            <strong style={{ color: '#4390BC' }}>resultados sustentáveis.</strong>
          </p>

          <h2 style={{ textAlign: 'center', fontSize: isMobile ? 28 : 38, fontWeight: 800, color: '#0d2a4e', marginBottom: 56 }}>
            Nosso <span style={{ color: '#2a7ec8', fontWeight: 400 }}>Time</span>
          </h2>

          {/* Team grid — row 1: 3 circles, row 2: 2 circles centered */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? 24 : 32 }}>

            {/* Row 1 */}
            <div style={{ display: 'flex', gap: isMobile ? 20 : 40, justifyContent: 'center', flexWrap: 'wrap' }}>
              {team.slice(0, 3).map((member, i) => (
                <div key={member.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: isMobile ? 100 : 160,
                    height: isMobile ? 100 : 160,
                    borderRadius: '50%',
                    background: '#a8c0d8',
                    border: i === 2 ? '3px solid #4a9edd' : 'none',
                    boxShadow: '0 4px 16px rgba(30,74,138,0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {/* Placeholder — troque por <img> quando tiver a foto */}
                    <span style={{ fontSize: isMobile ? 32 : 48, color: 'rgba(255,255,255,0.5)' }}>👤</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1e3a6e' }}>{member.name}</div>
                    <div style={{ fontSize: 12, color: '#778899', marginTop: 2 }}>{member.role}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2 */}
            <div style={{ display: 'flex', gap: isMobile ? 20 : 40, justifyContent: 'center', flexWrap: 'wrap' }}>
              {team.slice(3, 5).map((member) => (
                <div key={member.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: isMobile ? 100 : 160,
                    height: isMobile ? 100 : 160,
                    borderRadius: '50%',
                    background: '#a8c0d8',
                    boxShadow: '0 4px 16px rgba(30,74,138,0.1)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: isMobile ? 32 : 48, color: 'rgba(255,255,255,0.5)' }}>👤</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1e3a6e' }}>{member.name}</div>
                    <div style={{ fontSize: 12, color: '#778899', marginTop: 2 }}>{member.role}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
