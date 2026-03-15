import HeroSearch from '../components/HeroSearch'
import JobCard from '../components/JobCard'
import { useJobs } from '../context/JobsContext'
import SolucaoSection from '../components/SolucaoSection'
import ctaWoman from '../assets/cta-woman.png'
import MetodologiaSection from '../components/MetodologiaSection'
import womanBlue from '../assets/woman-blue.png'
import CaminhoSection from '../components/CaminhoSection'
import ServicosCards from '../components/ServicosCards'
import FormacaoSection from '../components/FormacaoSection'
import TreinamentosPublico from '../components/TreinamentosPublico'
import TemasDesenvolvimento from '../components/TemasDesenvolvimento'
import FormacaoLiderancaSection from '../components/FormacaoLiderancaSection'
import FaleConoscoSection from '../components/FaleConoscoSection'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function HomePage({ navigate }) {
  const { jobs } = useJobs()
  const { isMobile } = useBreakpoint()

  return (
    <div className="fade-in">
      <HeroSearch navigate={navigate} />
      <SolucaoSection navigate={navigate} />

      {/* CTA Card */}
      <div style={{ background: 'linear-gradient(160deg, #e8f0f8 0%, #f0f5fa 50%, #e0eaf4 100%)', padding: isMobile ? '20px 16px' : '0 0 20px 0' }}>
        {isMobile ? (
          /* Mobile: stacked layout */
          <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', maxWidth: 450, width: '100%', margin: '0 auto', background: 'white', boxShadow: '0 4px 20px rgba(30,74,138,0.1)' }}>
            <img src={ctaWoman} alt="" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            <div style={{ padding: '18px' }}>
              <button
                onClick={() => document.getElementById('fale-conosco')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ width: '100%', background: 'linear-gradient(135deg, #1e3a6e, #2a5298)', color: 'white', border: 'none', borderRadius: 10, padding: '14px', cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
              >
                Solicite sua proposta
              </button>
            </div>
          </div>
        ) : (
          /* Desktop: original layout */
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 0 0 120px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', maxWidth: 1060, width: '100%' }}>
              <img src={ctaWoman} alt="" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
              <button
                onClick={() => document.getElementById('fale-conosco')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ position: 'absolute', bottom: '8%', left: '54%', transform: 'translateX(-50%)', background: 'white', color: '#1e3a6e', border: 'none', borderRadius: 10, padding: '17px 0', width: '38%', cursor: 'pointer', fontWeight: 700, fontSize: 15, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
              >
                Solicite sua proposta
              </button>
            </div>
          </div>
        )}
      </div>

      <MetodologiaSection />

      {/* Featured Jobs */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '32px 16px' : '48px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: '#1e3a6e', margin: 0 }}>Vagas em Destaque</h2>
            <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>As oportunidades mais recentes do varejo</p>
          </div>
          <button onClick={() => navigate('vagas')} style={{ background: 'none', border: '2px solid #1e4a8a', color: '#1e4a8a', borderRadius: 10, padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            Ver todas →
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {jobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} navigate={navigate} />
          ))}
        </div>
      </div>

      {/* Por que 4 P's */}
      {!isMobile ? (
        <div style={{ background: 'linear-gradient(135deg, #5590B2 0%, #8AAEC2 60%, #7aaee0 100%)', position: 'relative', overflow: 'visible' }}>
          <div style={{ maxWidth: 1050, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minHeight: 420, position: 'relative', gap: 40 }}>
            <div style={{ maxWidth: 460, paddingBottom: 75, paddingTop: 45 }}>
              <h2 style={{ fontSize: 'clamp(24px, 2.5vw, 38px)', fontWeight: 300, color: 'white', lineHeight: 1.2, marginBottom: 20, textShadow: '2px 4px 12px rgba(0,0,0,0.35)' }}>
                Por que trabalhamos<br />
                <span style={{ fontWeight: 900 }}>com os 4 P's?</span>
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', lineHeight: 1.9, maxWidth: 400 }}>
                Na <strong style={{ color: 'white' }}>EASY4RH</strong>, estruturamos nosso trabalho em 4 Ps estratégicos, porque acreditamos que resultado sustentável só acontece quando{' '}
                <strong style={{ color: 'white' }}>pessoas, processos, performance e prevenção</strong>{' '}caminham juntos.
              </p>
            </div>
            <div style={{ position: 'absolute', right: 70, top: '8%', width: 220, height: '80%', background: 'rgba(255,255,255,0.2)', borderRadius: 16, zIndex: 1, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', width: 500, flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '-4px', zIndex: 2 }}>
              <img src={womanBlue} alt="" style={{ height: 580, objectFit: 'contain', objectPosition: 'bottom', position: 'relative', zIndex: 2, display: 'block', marginTop: '-580px' }} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: 'linear-gradient(135deg, #5590B2 0%, #8AAEC2 60%, #7aaee0 100%)', padding: '40px 24px' }}>
          <h2 style={{ fontSize: 26, fontWeight: 300, color: 'white', lineHeight: 1.3, marginBottom: 16, textShadow: '2px 4px 12px rgba(0,0,0,0.25)' }}>
            Por que trabalhamos<br />
            <span style={{ fontWeight: 900 }}>com os 4 P's?</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}>
            Na <strong style={{ color: 'white' }}>EASY4RH</strong>, estruturamos nosso trabalho em 4 Ps estratégicos, porque acreditamos que resultado sustentável só acontece quando{' '}
            <strong style={{ color: 'white' }}>pessoas, processos, performance e prevenção</strong>{' '}caminham juntos.
          </p>
        </div>
      )}

      <CaminhoSection navigate={navigate} />
      <ServicosCards navigate={navigate} />
      <FormacaoSection navigate={navigate} />
      <TreinamentosPublico />
      <TemasDesenvolvimento />
      <FormacaoLiderancaSection navigate={navigate} />
      <FaleConoscoSection />
    </div>
  )
}
