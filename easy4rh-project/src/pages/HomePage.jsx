import HeroSearch from '../components/HeroSearch'
import QuickLinks from '../components/QuickLinks'
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

export default function HomePage({ navigate }) {
  const { jobs } = useJobs()

  const stats = [
    { icon: '💼', v: '500+', l: 'Vagas Ativas' },
    { icon: '🏢', v: '120+', l: 'Empresas Parceiras' },
    { icon: '👥', v: '15.000+', l: 'Candidatos Registrados' },
    { icon: '✅', v: '3.200+', l: 'Contratações Realizadas' },
  ]

  return (
    <div className="fade-in">
      <HeroSearch navigate={navigate} />
      <SolucaoSection navigate={navigate} />

      {/* CTA Card */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 80px 60px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          borderRadius: 24,
          overflow: 'hidden',
          position: 'relative',
          maxWidth: 1000,
          width: '100%',
        }}>
          {/* Background image */}
          <img
            src={ctaWoman}
            alt=""
            style={{
              width: '100%',
              display: 'block',
              objectFit: 'cover',
            }}
          />

          {/* Button overlay — positioned over the button in the image */}
          <button
            onClick={() => navigate('login')}
            style={{
              position: 'absolute',
              bottom: '8%',
              left: '54%',
              transform: 'translateX(-50%)',
              background: 'white',
              color: '#1e3a6e',
              border: 'none',
              borderRadius: 10,
              padding: '17px 0',
              width: '38%',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          >
            Solicite sua proposta
          </button>
        </div>
      </div>

      <MetodologiaSection />

      {/* Featured Jobs */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e3a6e', margin: 0 }}>Vagas em Destaque</h2>
            <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>As oportunidades mais recentes do varejo</p>
          </div>
          <button onClick={() => navigate('vagas')} style={{ background: 'none', border: '2px solid #1e4a8a', color: '#1e4a8a', borderRadius: 10, padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            Ver todas →
          </button>
        </div>
        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 18 }}>
          {jobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} navigate={navigate} />
          ))}
        </div>
      </div>

      {/* Por que 4 P's */}
      <div style={{
        background: 'linear-gradient(135deg, #3a6ab0 0%, #5a8fd0 60%, #7aaee0 100%)',
        position: 'relative',
        overflow: 'visible',
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          minHeight: 320,
        }}>
          {/* Text */}
          <div style={{
            maxWidth: 460,
            paddingBottom: 52,
            paddingTop: 52,
          }}>
            <h2 style={{
              fontSize: 'clamp(24px, 2.8vw, 38px)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.2,
              marginBottom: 20,
            }}>
              Por que trabalhamos<br />com os 4 P's?
            </h2>
            <p style={{
              fontSize: 14.5,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.8,
              maxWidth: 400,
            }}>
              Na <strong style={{ color: 'white' }}>EASY4RH</strong>, estruturamos nosso trabalho em
              4 Ps estratégicos, porque acreditamos que resultado sustentável só acontece quando{' '}
              <strong style={{ color: 'white' }}>
                pessoas, processos, performance e prevenção
              </strong>{' '}
              caminham juntos.
            </p>
          </div>

          {/* Woman + rectangle */}
          <div style={{
            position: 'relative',
            width: 500,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            marginBottom: '-4px',
          }}>
            {/* Rectangle decoration */}
            <div style={{
              position: 'absolute',
              right: 20,
              top: '8%',
              width: 75,
              height: '78%',
              background: 'rgba(255,255,255,0.18)',
              borderRadius: 10,
              zIndex: 1,
            }} />
            <img
              src={womanBlue}
              alt=""
              style={{
                height: 500,
                objectFit: 'contain',
                objectPosition: 'bottom',
                position: 'relative',
                zIndex: 2,
                display: 'block',
                marginTop: '-500px',
              }}
            />
          </div>
        </div>
      </div>

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
