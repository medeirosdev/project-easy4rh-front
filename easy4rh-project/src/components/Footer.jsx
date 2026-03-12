import { useState } from 'react'
import logoImg from '../assets/logo.png'
import { useBreakpoint } from '../hooks/useBreakpoint'

const services = {
  PESSOAS: [
    'Mapeamento de perfil', 'DISC', 'Avaliação de experiência e desempenho',
    '9 Box', 'Feedback', 'PDI (Plano de Desenvolvimento Individual)',
    'Gestão de talentos', 'Trilha de carreira', 'Treinamentos técnicos',
    'Treinamentos comportamentais', 'Treinamentos de liderança',
    'Endomarketing', 'Gincanas e dinâmicas',
  ],
  PROCESSOS: [
    'Política de R&S (Recrutamento e Seleção)', 'Descritivo de cargos e manuais operacionais',
    'Admissão / Demissão', 'Onboarding / Offboarding', 'Folha de pagamento',
    'Política de remuneração e benefícios', 'Gestão de ponto / jornada / escala',
    'SST (Saúde e Segurança do Trabalho)', 'Gestão de documentos',
    'Construção e revisão da cultura',
  ],
  PERFORMANCE: [
    'Gestão de KPIS', 'Headcount: quadro orçado vs. quadro ativo',
    'Taxa de promoções internas', 'Índice de diversidade e inclusão',
    'Custo total da FOPA / % da FOPA sobre o FAT',
    'Custo de benefício por colaborador', 'Custo de horas extras',
  ],
  PREVENÇÃO: [
    'Pesquisa de clima', 'Código de ética e conduta', 'Ouvidoria',
    'Entrevista de desligamento', 'Política de prevenção ao assédio e à discriminação',
    'Política de advertências e medidas disciplinares',
    'Dossiês e laudos extrajudiciais para gestão de conflitos internos',
    'Política de segurança do trabalho', 'NR 01',
  ],
}

const navLinks = ['Home', 'Sobre Nós', 'Vagas', 'Treinamentos', 'FAQ']

const socialIcons = [
  { label: 'f', title: 'Facebook' },
  { label: 'in', title: 'LinkedIn' },
  { label: '▦', title: 'Instagram' },
  { label: '▶', title: 'YouTube' },
]

export default function Footer({ navigate }) {
  const { isMobile, isTablet } = useBreakpoint()
  const [expanded, setExpanded] = useState(null)

  const toggleP = (p) => setExpanded(expanded === p ? null : p)

  return (
    <footer style={{ background: '#0f1e36', color: 'white' }}>

      {/* ── Faixa única principal ── */}
      <div style={{ padding: '56px 20px 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {/* Desktop: 6 colunas | Tablet: 3 colunas | Mobile: acordeão */}
          {isMobile ? (

            /* ── Mobile: logo + accordion ── */
            <div>
              {/* Brand */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <img src={logoImg} alt="Easy4RH" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>EASY<span style={{ color: '#4a9edd' }}>4</span>RH</div>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Consultoria em RH</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: 16 }}>
                  Fácil para você, estratégico para o seu negócio. Transformamos a gestão de pessoas em resultados reais.
                </p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {socialIcons.map((s) => (
                    <div key={s.title} title={s.title}
                      style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                      {s.label}
                    </div>
                  ))}
                </div>
                {/* Matriz mobile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 14, marginTop: 2 }}>📍</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>Av. Paulista, 1234 — Sala 56{'\n'}Bela Vista, São Paulo — SP{'\n'}CEP 01310-100</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 14 }}>✉️</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>contato@easy4rh.com.br</span>
                  </div>
                </div>
              </div>

              {/* Accordion for 4 P's */}
              {Object.entries(services).map(([pillar, items]) => (
                <div key={pillar} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
                  <div onClick={() => toggleP(pillar)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', cursor: 'pointer' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#4a9edd', letterSpacing: 1 }}>{pillar}</span>
                    <span style={{ color: '#4a9edd', fontSize: 12, transform: expanded === pillar ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▼</span>
                  </div>
                  {expanded === pillar && (
                    <div style={{ padding: '0 18px 16px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <span style={{ color: '#4a9edd', fontSize: 10, marginTop: 4, flexShrink: 0 }}>•</span>
                          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

          ) : (

            /* ── Desktop/Tablet: 6 colunas ── */
            <div style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? '1fr 1fr 1fr' : '1.4fr 1fr 1fr 1fr 1fr 1fr',
              gap: isTablet ? 32 : 24,
              alignItems: 'flex-start',
            }}>

              {/* Col 1: Brand + Matriz */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={logoImg} alt="Easy4RH" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>EASY<span style={{ color: '#4a9edd' }}>4</span>RH</div>
                    <div style={{ fontSize: 8, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Consultoria em RH</div>
                  </div>
                </div>
                <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: 18 }}>
                  Fácil para você, estratégico para o seu negócio. Transformamos a gestão de pessoas em resultados reais.
                </p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                  {socialIcons.map((s) => (
                    <div key={s.title} title={s.title}
                      style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#4a9edd'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >{s.label}</div>
                  ))}
                </div>
              </div>

              {/* Col 2: Matriz */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ height: 2, width: 16, background: '#4a9edd', borderRadius: 2 }} />
                  <h4 style={{ fontSize: 11, fontWeight: 800, color: '#4a9edd', letterSpacing: 1.5, textTransform: 'uppercase', margin: 0 }}>Matriz</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 13, marginTop: 2, flexShrink: 0 }}>📍</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{'Av. Paulista, 1234 — Sala 56\nBela Vista, São Paulo — SP\nCEP 01310-100'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, flexShrink: 0 }}>✉️</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>contato@easy4rh.com.br</span>
                  </div>
                </div>
              </div>

              {/* Cols 3-6: 4 P's */}
              {Object.entries(services).map(([pillar, items]) => (
                <div key={pillar}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ height: 2, width: 16, background: '#4a9edd', borderRadius: 2 }} />
                    <h4 style={{ fontSize: 11, fontWeight: 800, color: '#4a9edd', letterSpacing: 1.5, textTransform: 'uppercase', margin: 0 }}>{pillar}</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                        <span style={{ color: '#4a9edd', fontSize: 9, marginTop: 5, flexShrink: 0 }}>•</span>
                        <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>

      {/* ── Links + Bottom ── */}
      <div style={{ padding: '28px 20px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {navLinks.map((link) => (
              <span key={link}
                onClick={() => navigate && navigate(link.toLowerCase().replace(' ', '-'))}
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >{link}</span>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            © 2025 Easy4RH — Todos os direitos reservados.
          </p>
        </div>
      </div>

    </footer>
  )
}
